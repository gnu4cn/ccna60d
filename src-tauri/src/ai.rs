// src-tauri/src/ai.rs
use futures_util::StreamExt;
use tauri::ipc::Channel;

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum StreamEvent {
    Delta(String),
    Done,
}

const SYSTEM: &str = "你是《CCNA 60 天》教程的助教。只依据用户给出的教材片段作答，\
片段中没有的内容要明确说明。回答用简体中文，网络术语保留英文原词。涉及 Cisco IOS \
命令时给出完整命令行和模式提示符。";

#[tauri::command]
pub async fn ask_llm(
    question: String,
    context: String,
    on_event: Channel<StreamEvent>,
) -> Result<(), String> {
    let key = load_api_key()?;

    let body = serde_json::json!({
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 1500,
        "stream": true,
        "system": SYSTEM,
        "messages": [{
            "role": "user",
            "content": format!("<教材片段>\n{context}\n</教材片段>\n\n问题：{question}")
        }]
    });

    let resp = reqwest::Client::new()
        .post("https://api.anthropic.com/v1/messages")
        .header("x-api-key", key)
        .header("anthropic-version", "2023-06-01")
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !resp.status().is_success() {
        return Err(resp.text().await.unwrap_or_default());
    }

    let mut stream = resp.bytes_stream();
    let mut buf = String::new();

    while let Some(chunk) = stream.next().await {
        buf.push_str(&String::from_utf8_lossy(&chunk.map_err(|e| e.to_string())?));
        // SSE 按行解析，注意 chunk 边界可能切断一行
        while let Some(pos) = buf.find('\n') {
            let line: String = buf.drain(..=pos).collect();
            let Some(data) = line.trim_end().strip_prefix("data: ") else { continue };
            let Ok(v) = serde_json::from_str::<serde_json::Value>(data) else { continue };
            if v["type"] == "content_block_delta" {
                if let Some(t) = v["delta"]["text"].as_str() {
                    let _ = on_event.send(StreamEvent::Delta(t.to_string()));
                }
            }
        }
    }
    let _ = on_event.send(StreamEvent::Done);
    Ok(())
}
