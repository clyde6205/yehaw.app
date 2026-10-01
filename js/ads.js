// Yehaw AdSense wiring — fully config-driven.
// Set your real publisher ID + slot IDs in config.js (or via Admin Console → AdSense)
// and ads go live with zero code changes. While the ID is still a placeholder,
// ad slots are hidden cleanly so the layout never shows broken ads.
(function () {
  const cfg = window.YEHAW_CONFIG || {};
  const ads = cfg.adsense || {};
  const client = (ads.client || "").trim();
  const slots = ads.slots || {};

  // Real publisher IDs look like ca-pub-1234567890123456 (digits only)
  const clientOk = /^ca-pub-\d{8,}$/.test(client);
  const slotOk = (id) => /^\d{6,}$/.test(String(id || ""));

  document.querySelectorAll("[data-ad-slot-name]").forEach((el) => {
    const ins = el.querySelector("ins.adsbygoogle");
    const slotId = slots[el.dataset.adSlotName];
    if (!clientOk || !slotOk(slotId) || !ins) {
      el.style.display = "none";
      if (ins) ins.remove();
      return;
    }
    ins.setAttribute("data-ad-client", client);
    ins.setAttribute("data-ad-slot", slotId);
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  });

  // Load the AdSense library only when a real publisher ID is configured
  if (clientOk && document.querySelector("ins.adsbygoogle")) {
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(client);
    document.head.appendChild(s);
  }
})();
