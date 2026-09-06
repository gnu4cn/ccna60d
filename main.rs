// 阻止 Windows release 构建时弹出额外的控制台窗口
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        // 记住窗口位置与大小，退出时自动保存、启动时自动恢复。
        // 纯 Rust 侧工作，不需要前端调用，也不需要额外的 capability。
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("启动 CCNA60D 失败");
}
