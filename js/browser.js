// Yehaw Fast Browser — one window, persistent tabs, one tap to every Filipino app.
// Solves "too many windows open at once": every launch is a saved tab here,
// so the user always returns to a single home instead of hunting windows.
(function () {
  const $ = (s, ctx = document) => ctx.querySelector(s);

  // Major services that refuse iframe embedding (X-Frame-Options / CSP frame-ancestors).
  // For these we show an instant launch card instead of a doomed frame.
  const EMBED_BLOCKED = [
    "gcash.com", "maya.ph", "grab.com", "foodpanda.ph", "jollibee.com.ph", "mcdonalds.com.ph",
    "shopee.ph", "lazada.com.ph", "palawanexpress.com", "lbcexpress.com", "westernunion.com",
    "moneygram.com", "remitly.com", "worldremit.com", "xoom.com", "cebuanalhuillier.com",
    "mlhuillier.com", "bdo.com.ph", "bpi.com.ph", "unionbankph.com", "metrobank.com.ph",
    "pagibigfundservices.com", "panlasangpinoy.com", "kawalingpinoy.com", "foxyfolksy.com",
    "angsarap.net", "yummy.ph"
  ];

  const LS_TABS = "yehaw_tabs";
  const LS_ACTIVE = "yehaw_active_tab";
  const EMBED_TIMEOUT = 6000;

  let tabs = [];
  let activeId = null;
  let loadTimer = null;

  function loadState() {
    try { tabs = JSON.parse(localStorage.getItem(LS_TABS) || "[]"); } catch (e) { tabs = []; }
    if (!Array.isArray(tabs)) tabs = [];
    activeId = localStorage.getItem(LS_ACTIVE) || null;
  }
  function saveState() {
    try {
      localStorage.setItem(LS_TABS, JSON.stringify(tabs));
      if (activeId) localStorage.setItem(LS_ACTIVE, activeId);
      else localStorage.removeItem(LS_ACTIVE);
    } catch (e) {}
  }
  function uid() { return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function hostOf(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; } }

  function isEmbedBlocked(url) {
    const u = url.replace(/^https?:\/\//i, "").toLowerCase();
    return EMBED_BLOCKED.some(d => u.startsWith(d) || u.includes(d + "/"));
  }

  function normalizeInput(input) {
    const v = input.trim();
    if (!v) return null;
    if (/^https?:\/\//i.test(v)) return v;
    if (!v.includes(" ") && /^[\w-]+(\.[\w-]+)+(:\d+)?(\/.*)?$/.test(v)) return "https://" + v;
    return "https://www.google.com/search?q=" + encodeURIComponent(v);
  }

  function bumpStats(key) {
    try {
      const stats = JSON.parse(localStorage.getItem("yehaw_stats") || "{}");
      stats[key] = (stats[key] || 0) + 1;
      localStorage.setItem("yehaw_stats", JSON.stringify(stats));
    } catch (e) {}
  }

  // openTab({ name, url, icon, color, serviceId }) — creates or focuses a tab
  function openTab(data) {
    let t = tabs.find(x => x.url === data.url);
    if (!t) {
      t = {
        id: uid(),
        name: data.name || hostOf(data.url),
        url: data.url,
        icon: data.icon || "🌐",
        color: data.color || "#1e3a5f",
        serviceId: data.serviceId || null,
        external: isEmbedBlocked(data.url)
      };
      tabs.unshift(t);
    }
    activeId = t.id;
    saveState();
    render();
    return t;
  }

  function closeTab(id) {
    tabs = tabs.filter(t => t.id !== id);
    if (activeId === id) activeId = tabs.length ? tabs[0].id : null;
    saveState();
    render();
  }

  function activeTab() { return tabs.find(t => t.id === activeId) || null; }

  function openExternally(t) {
    t.external = true;
    bumpStats(t.serviceId || hostOf(t.url));
    saveState();
    render();
    window.open(t.url, "_blank", "noopener,noreferrer");
  }

  function render() {
    renderTabStrip();
    renderContent();
    updateBadge();
  }

  function renderTabStrip() {
    const strip = $("#browser-tabs");
    if (!strip) return;
    const addBtn = $("#btn-tab-add");
    strip.querySelectorAll(".tab").forEach(n => n.remove());
    tabs.forEach(t => {
      const el = document.createElement("button");
      el.className = "tab" + (t.id === activeId ? " active" : "");
      el.dataset.tab = t.id;
      el.title = t.name;
      el.innerHTML = `<span class="tab-ico" style="background:${t.color || "#1e3a5f"}">${t.icon}</span>
        <span class="tab-name">${t.name}</span>
        ${t.external ? '<span class="tab-ext" aria-hidden="true">↗</span>' : ""}
        <span class="tab-x" role="button" aria-label="Close ${t.name} tab">✕</span>`;
      el.addEventListener("click", (e) => {
        if (e.target.closest(".tab-x")) { closeTab(t.id); return; }
        activeId = t.id; saveState(); render();
      });
      strip.insertBefore(el, addBtn);
    });
    if (addBtn) addBtn.style.display = tabs.length ? "flex" : "none";
  }

  function renderContent() {
    const box = $("#browser-content");
    if (!box) return;
    clearTimeout(loadTimer);
    const t = activeTab();

    if (!t) {
      box.innerHTML = `
        <div class="browser-welcome">
          <h3>One window. Every Filipino app.</h3>
          <p>Open your apps as tabs here — no more hunting through home screens or browser windows.</p>
          <div class="welcome-picks">
            ${topPicks().map(s => `
              <button class="pick" data-url="${s.url}" data-name="${s.name}" data-icon="${s.icon}" data-color="${s.color}" data-sid="${s.id}">
                <span class="pick-ico" style="background:${s.color}">${s.icon}</span>${s.name}
              </button>`).join("")}
          </div>
        </div>`;
      box.querySelectorAll(".pick").forEach(b => {
        b.addEventListener("click", () => {
          openTab({ name: b.dataset.name, url: b.dataset.url, icon: b.dataset.icon, color: b.dataset.color, serviceId: b.dataset.sid });
        });
      });
      syncToolbar("");
      return;
    }

    syncToolbar(t.url);
    if (t.external) {
      box.innerHTML = `
        <div class="launch-card">
          <div class="launch-ico" style="background:${t.color || "#1e3a5f"}">${t.icon}</div>
          <h3>${t.name}</h3>
          <p class="launch-url">${t.url}</p>
          <button class="btn-primary launch-go">Launch ${t.name} ↗</button>
          <p class="tiny launch-note">Opens in a new tab — your Yehaw tab stays saved here, one tap away.</p>
        </div>`;
      box.querySelector(".launch-go").addEventListener("click", () => openExternally(t));
      return;
    }

    // Try embedding
    box.innerHTML = `
      <div class="embed-wrap">
        <div class="embed-loading"><span class="spinner"></span> Loading ${t.name}…</div>
        <iframe class="embed-frame" title="${t.name}" src="${t.url}"
          referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
      </div>
      <div class="embed-fallback" hidden>
        <div class="launch-ico" style="background:${t.color || "#1e3a5f"}">${t.icon}</div>
        <h3>${t.name}</h3>
        <p class="tiny">${t.name} does not allow embedding. Launch it directly — your tab stays here.</p>
        <button class="btn-primary launch-go">Launch ${t.name} ↗</button>
      </div>`;
    const frame = box.querySelector(".embed-frame");
    const loading = box.querySelector(".embed-loading");
    const fallback = box.querySelector(".embed-fallback");
    const toFallback = () => {
      if (fallback.hidden) { t.external = true; saveState(); renderTabStrip(); }
      loading.hidden = true;
      fallback.hidden = false;
    };
    frame.addEventListener("load", () => {
      clearTimeout(loadTimer);
      let blocked = false;
      try { if (!frame.contentDocument) blocked = true; } catch (e) { blocked = false; }
      if (blocked) { toFallback(); return; }
      loading.hidden = true;
      frame.style.display = "block";
    });
    loadTimer = setTimeout(toFallback, EMBED_TIMEOUT);
    box.querySelector(".launch-go")?.addEventListener("click", () => openExternally(t));
  }

  function topPicks() {
    const cfg = window.YEHAW_CONFIG || {};
    const want = ["gcash", "grab", "shopee", "foodpanda"];
    return want.map(id => (cfg.services || []).find(s => s.id === id)).filter(Boolean);
  }

  function syncToolbar(url) {
    const input = $("#browser-url");
    if (input) input.value = url && activeTab() ? url : "";
  }

  function updateBadge() {
    const badge = $("#tab-badge");
    if (!badge) return;
    badge.textContent = tabs.length;
    badge.hidden = tabs.length === 0;
  }

  function wireChrome() {
    const form = $("#browser-urlform");
    const input = $("#browser-url");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const url = normalizeInput(input.value);
      if (!url) return;
      openTab({ name: url.includes("google.com/search") ? "Search" : hostOf(url), url });
    });
    $("#btn-tab-add")?.addEventListener("click", () => {
      input?.focus();
    });
    $("#btn-browser-external")?.addEventListener("click", () => {
      const t = activeTab();
      if (t) openExternally(t);
    });
  }

  loadState();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { wireChrome(); render(); });
  } else {
    wireChrome();
    render();
  }

  window.YehawBrowser = { openTab, closeTab, render, updateBadge };
})();
