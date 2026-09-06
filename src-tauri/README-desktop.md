# CCNA60D 桌面版

把 `gnu4cn/ccna60d` 的 mdBook 内容打包成 Windows 与 Linux 桌面应用。
源码和配置完全共用，只有构建环节需要分别在两个平台上跑。

## 放进仓库的位置

这些文件直接加到现有的 `ccna60d` 仓库根目录，不需要单开一个仓库：

```
ccna60d/
├── book.toml              ← 追加 additional-js / additional-css 两行
├── src/                   ← 原有的 Markdown 源，不动
├── theme/
│   ├── desktop.js         ← 新增
│   └── desktop.css        ← 新增
├── src-tauri/             ← 新增，整个目录
│   ├── Cargo.toml
│   ├── build.rs
│   ├── tauri.conf.json
│   ├── capabilities/default.json
│   ├── icons/             ← 用 `cargo tauri icon` 生成
│   └── src/main.rs
└── .github/workflows/release.yml
```

`book/` 是 mdBook 的构建产物，记得在 `.gitignore` 里；Tauri 的 `src-tauri/target/`
和 `src-tauri/gen/` 也一样。

## book.toml 需要的改动

在 `[output.html]` 段落下加两行：

```toml
[output.html]
additional-js = ["theme/desktop.js"]
additional-css = ["theme/desktop.css"]
```

这两个文件在浏览器里会自行判断环境后整段跳过，所以**网站和桌面版可以共用同一次
`mdbook build` 的产物**，不用维护两套构建。

如果 `book.toml` 里设了 `site-url`，确认它是 `/` 或者干脆去掉——非根路径的
`site-url` 会让 404 页和部分资源在本地协议下取不到。

## 一次性准备

**两个平台都要：**

- Rust 工具链（`rustup`，1.77 以上）
- mdBook：`cargo install mdbook`
- Tauri CLI：`cargo install tauri-cli --version "^2"`
- 图标：准备一张 1024×1024 的 PNG，然后 `cargo tauri icon path/to/logo.png`，
  它会一次生成 `.ico`、`.icns` 和各尺寸 PNG 放进 `src-tauri/icons/`

**Windows 额外要：**

- Microsoft C++ 生成工具（MSVC）+ Windows SDK
- WebView2 Runtime——Win11 和绝大多数 Win10 已经预装，NSIS 安装器默认也会在
  缺失时自动下载

**Linux 额外要：**

```bash
sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev librsvg2-dev \
                 libappindicator3-dev libxdo-dev libssl-dev \
                 patchelf build-essential file wget
```

注意是 `webkit2gtk-4.1`，不是 Tauri 1 时代的 `4.0`。

## 本地构建

```bash
# 开发：改 Markdown 后重跑，热加载没有（mdBook 不走 dev server）
cargo tauri dev

# 出包，产物类型由当前平台决定
cargo tauri build

# 只出某一种
cargo tauri build --bundles nsis          # Windows
cargo tauri build --bundles appimage      # Linux
```

产物位置：

- Windows：`src-tauri/target/release/bundle/nsis/*.exe`、`.../msi/*.msi`
- Linux：`src-tauri/target/release/bundle/appimage/*.AppImage`

## 交叉编译的话

不行。Tauri 不支持跨平台编译——Windows 包必须在 Windows 上打，AppImage 必须在
Linux 上打。仓库里的 `.github/workflows/release.yml` 就是为此准备的：推一个
`v*` 标签，CI 用 `windows-latest` 和 `ubuntu-22.04` 两个 runner 并行出包，
自动传到一个草稿 Release。

AppImage 特意选 Ubuntu 22.04 而不是 latest：AppImage 只向前兼容，在新系统上编
的包到旧发行版会报 `GLIBC_2.xx not found`。

## 关于 CSP

`tauri.conf.json` 里 `app.security.csp` 设成了 `null`，即关闭。对一个只加载本
地打包内容、不发任何网络请求的离线阅读器，这是可接受的。

但如果以后加了联网功能（比如在线检查更新、拉取内容包），务必换成显式白名单，
例如：

```json
"csp": "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://ccna60d.xfoss.com"
```

mdBook 的主题脚本用了内联 `<script>`，所以 `script-src` 必须带 `'unsafe-inline'`。

## 桌面版加了什么

- 阅读进度：滚到底自动标记已读，侧栏读过的条目变淡，工具栏显示 `已读 / 总数`
- 书签：`Ctrl+D` 或工具栏 ☆ 收藏，🔖 查看列表
- 断点续读：记住每页滚动位置，首页顶部给出「继续上次阅读」
- 快捷键：`Ctrl+K` / `Ctrl+F` 全文搜索，`Ctrl+B` 开合侧栏
- 窗口位置与大小退出时自动记住

数据都存在 WebView 的 localStorage 里，跟着应用走，卸载即清除。要做跨设备同步
或者导出备份，再引入 `tauri-plugin-store` 写到磁盘文件。

## 分发

未签名的 `.exe` 会被 Windows SmartScreen 拦。要么买代码签名证书（OV 现在强制硬
件令牌，一年两三百美元），要么上 Microsoft Store（个人开发者账号一次性 19 美元，
签名和更新由商店托管）。

AppImage 那边没有这个问题，用户 `chmod +x` 就能跑。
