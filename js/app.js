(function () {
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  const cfg = window.YEHAW_CONFIG;
  let deferredPrompt = null;

  // ---------- Render Home ----------
  function renderTools() {
    const grid = $("#tools-grid");
    if (!grid) return;
    grid.innerHTML = cfg.tools.map(t => `
      <div class="tool-card" data-tool="${t.id}" data-type="${t.type}">
        <div class="tool-icon">${t.icon}</div>
        <div class="tool-name">${t.name}</div>
      </div>`).join("");
    grid.querySelectorAll(".tool-card").forEach(card => {
      card.addEventListener("click", () => openTool(card.dataset.tool, card.dataset.type));
    });
  }

  function renderServices() {
    const grid = $("#launcher-grid");
    if (!grid) return;
    grid.innerHTML = cfg.services.map(s => `
      <a class="service-card" href="${s.url}" data-service="${s.id}" rel="noopener">
        <div class="service-icon" style="background:${s.color || 'var(--bg)'}">${s.icon}</div>
        <div class="service-name">${s.name}</div>
      </a>`).join("");
    // Intercept clicks so we can show return chrome + track
    grid.querySelectorAll(".service-card").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        launchService(a.dataset.service, a.href);
      });
    });
  }

  // ---------- Navigation ----------
  function showView(id) {
    $$(".view").forEach(v => v.classList.remove("active"));
    const v = $(`#view-${id}`);
    if (v) v.classList.add("active");
    // Update bottom nav
    $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === id || (id === "tool" && n.dataset.view === "tools")));
    // Scroll top
    window.scrollTo(0, 0);
  }

  function openTool(id, type) {
    const tool = cfg.tools.find(t => t.id === id);
    $("#tool-title").textContent = tool ? tool.name : "Tool";
    window.YehawTools.render(type || id, $("#tool-body"));
    showView("tool");
  }

  function launchService(id, url) {
    // Strategy for "always pull back to Yehaw":
    // 1. Open in new tab (user can switch back easily on mobile)
    // 2. Show a persistent message + home button on this page
    // 3. Optionally try same-tab with history push so back button returns here
    const service = cfg.services.find(s => s.id === id);
    $("#url-display").textContent = url;
    $("#fallback-link").href = url;
    showView("browser");

    // Prefer new tab so Yehaw stays in history / home screen
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) {
      // Popup blocked — fall back to same tab
      window.location.href = url;
    }
    // Track simple open count for admin later
    try {
      const stats = JSON.parse(localStorage.getItem("yehaw_stats") || "{}");
      stats[id] = (stats[id] || 0) + 1;
      localStorage.setItem("yehaw_stats", JSON.stringify(stats));
    } catch (e) {}
  }

  // ---------- Event wiring ----------
  function init() {
    renderTools();
    renderServices();

    // Home button (top + browser)
    $("#btn-home")?.addEventListener("click", () => showView("home"));
    $("#btn-browser-home")?.addEventListener("click", () => showView("home"));
    $("#btn-browser-close")?.addEventListener("click", () => showView("home"));
    $("#btn-back")?.addEventListener("click", () => showView("home"));

    // Bottom nav
    $$(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const v = btn.dataset.view;
        if (v === "home" || v === "tools" || v === "services") {
          showView("home");
          if (v === "tools") {
            document.querySelector(".tools-grid")?.scrollIntoView({ behavior: "smooth" });
          }
          if (v === "services") {
            document.querySelector(".launcher-grid")?.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });

    // Side menu
    const menu = $("#sidemenu");
    const overlay = $("#overlay");
    $("#btn-menu")?.addEventListener("click", () => {
      menu.classList.add("open");
      overlay.classList.add("show");
    });
    $("#btn-close-menu")?.addEventListener("click", closeMenu);
    overlay?.addEventListener("click", closeMenu);
    function closeMenu() {
      menu.classList.remove("open");
      overlay.classList.remove("show");
    }

    $$("[data-action]").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const act = a.dataset.action;
        closeMenu();
        if (act === "home" || act === "tools" || act === "services") showView("home");
        if (act === "about") alert("Yehaw v" + cfg.version + "\nFast tools + launcher for Filipinos.\nNo accounts. No tracking beyond basic local stats.");
        if (act === "install" && deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
        }
      });
    });

    // PWA install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const btn = $("#btn-install");
      if (btn) btn.style.display = "block";
    });

    // Keyboard / back button soft handling
    window.addEventListener("popstate", () => showView("home"));

    // Make sure we stay "sticky"
    document.addEventListener("visibilitychange", () => {
      // When user returns to the tab, we are already on Yehaw
    });
  }

  // Boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
