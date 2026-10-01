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
    $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === id || (id === "tool" && n.dataset.view === "tools") || (id === "browser" && n.dataset.view === "browser")));
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
    // Hand off to the Yehaw Fast Browser: every launch becomes a saved tab in
    // one window — no more hunting through home screens or stray browser windows.
    const service = cfg.services.find(s => s.id === id);
    window.YehawBrowser.openTab({
      name: service ? service.name : url,
      url: url,
      icon: service ? service.icon : "🌐",
      color: service ? service.color : "#1e3a5f",
      serviceId: id
    });
    showView("browser");
  }

  // ---------- Most Used (auto-ranked from real launches) ----------
  function renderMostUsed() {
    const section = $("#most-used-section");
    const grid = $("#mostused-grid");
    if (!section || !grid) return;
    let stats = {};
    try { stats = JSON.parse(localStorage.getItem("yehaw_stats") || "{}"); } catch (e) {}
    const ranked = cfg.services
      .map(s => ({ s, n: stats[s.id] || 0 }))
      .filter(x => x.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 4);
    if (!ranked.length) { section.hidden = true; grid.innerHTML = ""; return; }
    section.hidden = false;
    grid.innerHTML = ranked.map(({ s }) => `
      <a class="service-card" href="${s.url}" data-service="${s.id}" rel="noopener">
        <div class="service-icon" style="background:${s.color || 'var(--bg)'}">${s.icon}</div>
        <div class="service-name">${s.name}</div>
      </a>`).join("");
    grid.querySelectorAll(".service-card").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        launchService(a.dataset.service, a.href);
      });
    });
  }

  // ---------- Universal search (tools + services + recipes) ----------
  function wireSearch() {
    const input = $("#global-search");
    const box = $("#search-results");
    if (!input || !box) return;
    const index = [
      ...cfg.tools.map(t => ({ kind: "Tool", name: t.name, icon: t.icon, color: "var(--bg2)", run: () => openTool(t.id, t.type) })),
      ...cfg.services.map(s => ({ kind: "Service", name: s.name, icon: s.icon, color: s.color, run: () => launchService(s.id, s.url) })),
      ...(cfg.recipes || []).map(r => ({ kind: "Recipe", name: r.name, icon: "🍲", color: "var(--bg2)", run: () => openTool("recipes", "recipes") }))
    ];
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const close = () => { box.hidden = true; box.innerHTML = ""; };
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { close(); return; }
      const hits = index.filter(i => i.name.toLowerCase().includes(q)).slice(0, 8);
      if (!hits.length) {
        box.innerHTML = '<div class="search-empty">No matches — try "GCash" or "adobo"</div>';
        box.hidden = false;
        return;
      }
      box.innerHTML = hits.map(h => `
        <button class="search-item" data-i="${index.indexOf(h)}">
          <span class="search-ico" style="background:${h.color}">${h.icon}</span>
          <span>${esc(h.name)}</span>
          <span class="search-kind">${h.kind}</span>
        </button>`).join("");
      box.hidden = false;
      box.querySelectorAll(".search-item").forEach(btn => {
        btn.addEventListener("click", () => { close(); input.blur(); index[+btn.dataset.i].run(); });
      });
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = box.querySelector(".search-item");
        if (first) { close(); input.blur(); index[+first.dataset.i].run(); }
      }
      if (e.key === "Escape") close();
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrap")) close();
    });
  }

  // ---------- Hero actions ----------
  function wireHero() {
    $$("[data-hero]").forEach(b => {
      b.addEventListener("click", () => {
        if (b.dataset.hero === "browser") {
          showView("browser");
          window.YehawBrowser.render();
        } else {
          document.querySelector(".launcher-grid")?.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  // ---------- Deep links: ?q= (SearchAction) and ?view=browser (PWA shortcut) ----------
  function handleParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "browser") {
      showView("browser");
      window.YehawBrowser.render();
    }
    const q = params.get("q");
    if (q) {
      const input = $("#global-search");
      if (input) { input.value = q; input.dispatchEvent(new Event("input")); input.focus(); }
    }
  }

  // ---------- Event wiring ----------
  function init() {
    renderTools();
    renderServices();
    renderMostUsed();
    wireSearch();
    wireHero();
    handleParams();

    // Home button (top + browser)
    $("#btn-home")?.addEventListener("click", () => showView("home"));
    $("#btn-browser-home")?.addEventListener("click", () => showView("home"));
    $("#btn-browser-close")?.addEventListener("click", () => showView("home"));
    $("#btn-back")?.addEventListener("click", () => showView("home"));

    // Bottom nav
    $$(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const v = btn.dataset.view;
        if (v === "browser") {
          showView("browser");
          window.YehawBrowser.render();
          return;
        }
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
