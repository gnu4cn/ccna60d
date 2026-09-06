/*
 * CCNA60D 桌面版增强层
 *
 * 通过 book.toml 的 [output.html] additional-js 注入到每一页。
 * 在 Tauri 窗口内才激活；用同一份 book/ 部署到网站时整段静默跳过，
 * 所以网站和桌面版可以共用一次 mdbook build 的产物。
 */
(function () {
  "use strict";

  // Tauri 2 总会注入 __TAURI_INTERNALS__；浏览器里没有。
  if (!window.__TAURI_INTERNALS__) return;

  var NS = "ccna60d:";
  var KEY_LAST = NS + "last";
  var KEY_READ = NS + "read";
  var KEY_MARKS = NS + "marks";
  var KEY_SCROLL = NS + "scroll:";

  // 页面在书里的唯一标识。用 pathname 而非完整 URL，
  // 这样 tauri://localhost 和 http://tauri.localhost 两种协议下 key 一致。
  var pageId = decodeURIComponent(location.pathname).replace(/^\/+/, "") || "index.html";

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* 配额满或存储被禁用时静默降级，不影响阅读 */
    }
  }

  /* ---------- 阅读进度 ---------- */

  var read = load(KEY_READ, {});
  var marks = load(KEY_MARKS, {});

  function sidebarLinks() {
    return Array.prototype.slice.call(
      document.querySelectorAll("#sidebar .chapter li.chapter-item > a[href]")
    );
  }

  function totalChapters() {
    return sidebarLinks().length;
  }

  function readCount() {
    return Object.keys(read).length;
  }

  function markRead() {
    if (read[pageId]) return;
    read[pageId] = Date.now();
    save(KEY_READ, read);
    paintSidebar();
    paintProgress();
  }

  // 滚动到底部附近即视为读完；短页面（不产生滚动条）进入 3 秒后计入。
  function watchReadState() {
    var content = document.querySelector("#content") || document.body;

    function check() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable < 120) return; // 页面太短，交给下面的定时器
      if (doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 80) markRead();
    }

    window.addEventListener("scroll", throttle(check, 400), { passive: true });
    check();

    var doc = document.documentElement;
    if (doc.scrollHeight - doc.clientHeight < 120) {
      setTimeout(markRead, 3000);
    }

    if (content) content.setAttribute("data-ccna-watched", "1");
  }

  /* ---------- 滚动位置与断点续读 ---------- */

  function restoreScroll() {
    // 带锚点跳转时让 mdBook 自己定位，不要抢
    if (location.hash) return;
    var y = load(KEY_SCROLL + pageId, 0);
    if (typeof y === "number" && y > 0) {
      window.scrollTo(0, y);
    }
  }

  function rememberScroll() {
    save(KEY_SCROLL + pageId, window.scrollY || 0);
    save(KEY_LAST, { page: pageId, y: window.scrollY || 0, at: Date.now() });
  }

  /* ---------- 书签 ---------- */

  function pageTitle() {
    var active = document.querySelector("#sidebar .chapter li.chapter-item > a.active");
    if (active) return active.textContent.trim();
    var h1 = document.querySelector("#content h1");
    return h1 ? h1.textContent.trim() : document.title;
  }

  function isMarked() {
    return Object.prototype.hasOwnProperty.call(marks, pageId);
  }

  function toggleMark() {
    if (isMarked()) {
      delete marks[pageId];
    } else {
      marks[pageId] = { title: pageTitle(), at: Date.now() };
    }
    save(KEY_MARKS, marks);
    paintMarkButton();
    paintSidebar();
  }

  /* ---------- 界面 ---------- */

  function makeButton(id, label, title, onClick) {
    var b = document.createElement("button");
    b.id = id;
    b.className = "icon-button ccna-btn";
    b.type = "button";
    b.title = title;
    b.setAttribute("aria-label", title);
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  }

  var markBtn, progressEl;

  function paintMarkButton() {
    if (!markBtn) return;
    var on = isMarked();
    markBtn.textContent = on ? "★" : "☆";
    markBtn.classList.toggle("is-marked", on);
    markBtn.title = on ? "取消书签" : "加入书签";
  }

  function paintProgress() {
    if (!progressEl) return;
    var total = totalChapters();
    var done = readCount();
    progressEl.textContent = total ? done + " / " + total : "";
    progressEl.title = "已读章节";
  }

  function paintSidebar() {
    sidebarLinks().forEach(function (a) {
      var id = decodeURIComponent(new URL(a.href).pathname).replace(/^\/+/, "");
      a.classList.toggle("ccna-read", !!read[id]);
      a.classList.toggle("ccna-marked", Object.prototype.hasOwnProperty.call(marks, id));
    });
  }

  function buildToolbar() {
    var right = document.querySelector(".menu-bar .right-buttons");
    if (!right) return;

    markBtn = makeButton("ccna-mark", "☆", "加入书签", toggleMark);
    right.insertBefore(markBtn, right.firstChild);

    var listBtn = makeButton("ccna-marks", "🔖", "书签列表", openMarkList);
    right.insertBefore(listBtn, markBtn.nextSibling);

    progressEl = document.createElement("span");
    progressEl.id = "ccna-progress";
    progressEl.className = "ccna-progress";
    right.appendChild(progressEl);

    paintMarkButton();
    paintProgress();
  }

  function openMarkList() {
    var old = document.getElementById("ccna-marklist");
    if (old) {
      old.remove();
      return;
    }

    var panel = document.createElement("div");
    panel.id = "ccna-marklist";
    panel.className = "ccna-panel";

    var entries = Object.keys(marks).sort(function (a, b) {
      return marks[b].at - marks[a].at;
    });

    if (!entries.length) {
      var empty = document.createElement("p");
      empty.className = "ccna-empty";
      empty.textContent = "还没有书签。点工具栏的 ☆ 收藏当前小节。";
      panel.appendChild(empty);
    } else {
      var root = (typeof path_to_root === "string" && path_to_root) || "";
      var ul = document.createElement("ul");
      entries.forEach(function (id) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = root + id;
        a.textContent = marks[id].title || id;
        li.appendChild(a);
        ul.appendChild(li);
      });
      panel.appendChild(ul);
    }

    document.body.appendChild(panel);

    setTimeout(function () {
      document.addEventListener("click", function close(e) {
        if (!panel.contains(e.target) && e.target.id !== "ccna-marks") {
          panel.remove();
          document.removeEventListener("click", close);
        }
      });
    }, 0);
  }

  // 首页顶部插入“继续上次阅读”
  function buildResume() {
    var last = load(KEY_LAST, null);
    if (!last || !last.page || last.page === pageId) return;
    if (!/(^|\/)index\.html$/.test(pageId)) return;

    var content = document.querySelector("#content main");
    if (!content) return;

    var root = (typeof path_to_root === "string" && path_to_root) || "";
    var box = document.createElement("div");
    box.className = "ccna-resume";

    var a = document.createElement("a");
    a.href = root + last.page;
    a.textContent = "继续上次阅读：" + (marks[last.page] && marks[last.page].title || last.page);
    box.appendChild(a);

    content.insertBefore(box, content.firstChild);
  }

  /* ---------- 快捷键 ---------- */

  function bindKeys() {
    document.addEventListener("keydown", function (e) {
      var mod = e.ctrlKey || e.metaKey;

      // Ctrl/Cmd+K 或 Ctrl/Cmd+F 唤起 mdBook 自带的全文搜索
      if (mod && (e.key === "k" || e.key === "f")) {
        e.preventDefault();
        var toggle = document.getElementById("search-toggle");
        var bar = document.getElementById("searchbar");
        if (bar && getComputedStyle(bar).display === "none" && toggle) toggle.click();
        if (bar) {
          bar.focus();
          bar.select();
        }
        return;
      }

      // Ctrl/Cmd+D 收藏当前小节
      if (mod && e.key === "d") {
        e.preventDefault();
        toggleMark();
        return;
      }

      // Ctrl/Cmd+B 开合侧栏
      if (mod && e.key === "b") {
        e.preventDefault();
        var sidebarToggle = document.getElementById("sidebar-toggle");
        if (sidebarToggle) sidebarToggle.click();
      }
    });
  }

  /* ---------- 工具 ---------- */

  function throttle(fn, wait) {
    var last = 0;
    var timer = null;
    return function () {
      var now = Date.now();
      var rest = wait - (now - last);
      if (rest <= 0) {
        last = now;
        fn();
      } else if (!timer) {
        timer = setTimeout(function () {
          timer = null;
          last = Date.now();
          fn();
        }, rest);
      }
    };
  }

  /* ---------- 启动 ---------- */

  function init() {
    document.documentElement.classList.add("ccna-desktop");
    buildToolbar();
    buildResume();
    paintSidebar();
    watchReadState();
    restoreScroll();
    bindKeys();

    window.addEventListener("scroll", throttle(rememberScroll, 800), { passive: true });
    window.addEventListener("beforeunload", rememberScroll);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
