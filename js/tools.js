// Pure client-side tools — no external APIs
window.YehawTools = {
  render(type, container) {
    container.innerHTML = "";
    const fn = this[type];
    if (fn) fn.call(this, container);
    else container.innerHTML = "<p>Tool not found.</p>";
  },

  calc(el) {
    el.innerHTML = `
      <div class="calc-display" id="calc-disp">0</div>
      <div class="calc-keys">
        <button class="calc-key" data-v="C">C</button>
        <button class="calc-key" data-v="±">±</button>
        <button class="calc-key" data-v="%">%</button>
        <button class="calc-key op" data-v="/">÷</button>
        <button class="calc-key" data-v="7">7</button>
        <button class="calc-key" data-v="8">8</button>
        <button class="calc-key" data-v="9">9</button>
        <button class="calc-key op" data-v="*">×</button>
        <button class="calc-key" data-v="4">4</button>
        <button class="calc-key" data-v="5">5</button>
        <button class="calc-key" data-v="6">6</button>
        <button class="calc-key op" data-v="-">−</button>
        <button class="calc-key" data-v="1">1</button>
        <button class="calc-key" data-v="2">2</button>
        <button class="calc-key" data-v="3">3</button>
        <button class="calc-key op" data-v="+">+</button>
        <button class="calc-key wide" data-v="0">0</button>
        <button class="calc-key" data-v=".">.</button>
        <button class="calc-key eq" data-v="=">=</button>
      </div>`;
    let expr = "";
    const disp = el.querySelector("#calc-disp");
    el.querySelectorAll(".calc-key").forEach(btn => {
      btn.addEventListener("click", () => {
        const v = btn.dataset.v;
        if (v === "C") { expr = ""; disp.textContent = "0"; return; }
        if (v === "±") {
          if (expr) { expr = String(-parseFloat(expr) || 0); disp.textContent = expr; }
          return;
        }
        if (v === "=") {
          try {
            // Safe eval for simple arithmetic only
            const safe = expr.replace(/[^0-9+\-*/.%() ]/g, "");
            const res = Function('"use strict"; return (' + safe + ')')();
            expr = String(Math.round(res * 1e10) / 1e10);
            disp.textContent = expr;
          } catch { disp.textContent = "Error"; expr = ""; }
          return;
        }
        if (v === "%") { expr = String(parseFloat(expr) / 100); disp.textContent = expr; return; }
        expr += v;
        disp.textContent = expr;
      });
    });
  },

  currency(el) {
    const rates = window.YEHAW_CONFIG.rates;
    const opts = Object.keys(rates).map(c => `<option value="${c}">${c}</option>`).join("");
    el.innerHTML = `
      <div class="form-group">
        <label>Amount (PHP)</label>
        <input type="number" id="cur-amt" value="1000" step="any" />
      </div>
      <div class="form-group">
        <label>Convert to</label>
        <select id="cur-to">${opts}</select>
      </div>
      <button class="btn-primary" id="cur-go">Convert</button>
      <div class="result-box" id="cur-res">—</div>
      <p class="rate-note">Rates are approximate static values for offline use. Update via Admin when needed. Not for official transactions.</p>`;
    const go = () => {
      const amt = parseFloat(document.getElementById("cur-amt").value) || 0;
      const to = document.getElementById("cur-to").value;
      const rate = rates[to] || 1;
      const val = amt / rate;
      document.getElementById("cur-res").textContent =
        `${amt.toLocaleString()} PHP ≈ ${val.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to}`;
    };
    el.querySelector("#cur-go").addEventListener("click", go);
    go();
  },

  tip(el) {
    el.innerHTML = `
      <div class="form-group"><label>Bill amount (₱)</label><input type="number" id="tip-bill" value="500" step="any" /></div>
      <div class="form-group"><label>Tip %</label>
        <select id="tip-pct"><option>5</option><option selected>10</option><option>15</option><option>20</option></select>
      </div>
      <div class="form-group"><label>Split between people</label><input type="number" id="tip-split" value="1" min="1" /></div>
      <button class="btn-primary" id="tip-go">Calculate</button>
      <div class="result-box" id="tip-res">—</div>`;
    el.querySelector("#tip-go").addEventListener("click", () => {
      const bill = parseFloat(document.getElementById("tip-bill").value) || 0;
      const pct = parseFloat(document.getElementById("tip-pct").value) || 0;
      const split = Math.max(1, parseInt(document.getElementById("tip-split").value) || 1);
      const tip = bill * (pct / 100);
      const total = bill + tip;
      document.getElementById("tip-res").innerHTML =
        `Tip: ₱${tip.toFixed(2)}<br>Total: ₱${total.toFixed(2)}<br>Per person: ₱${(total / split).toFixed(2)}`;
    });
  },

  bmi(el) {
    el.innerHTML = `
      <div class="form-group"><label>Weight (kg)</label><input type="number" id="bmi-w" value="70" step="any" /></div>
      <div class="form-group"><label>Height (cm)</label><input type="number" id="bmi-h" value="170" step="any" /></div>
      <button class="btn-primary" id="bmi-go">Calculate BMI</button>
      <div class="result-box" id="bmi-res">—</div>`;
    el.querySelector("#bmi-go").addEventListener("click", () => {
      const w = parseFloat(document.getElementById("bmi-w").value) || 0;
      const h = (parseFloat(document.getElementById("bmi-h").value) || 1) / 100;
      const bmi = w / (h * h);
      let cat = "Normal";
      if (bmi < 18.5) cat = "Underweight";
      else if (bmi >= 25 && bmi < 30) cat = "Overweight";
      else if (bmi >= 30) cat = "Obese";
      document.getElementById("bmi-res").textContent = `BMI: ${bmi.toFixed(1)} — ${cat}`;
    });
  },

  loan(el) {
    el.innerHTML = `
      <div class="form-group"><label>Loan amount (₱)</label><input type="number" id="loan-p" value="100000" /></div>
      <div class="form-group"><label>Annual interest %</label><input type="number" id="loan-r" value="12" step="any" /></div>
      <div class="form-group"><label>Term (months)</label><input type="number" id="loan-n" value="12" /></div>
      <button class="btn-primary" id="loan-go">Estimate Monthly</button>
      <div class="result-box" id="loan-res">—</div>
      <p class="rate-note">Simple amortization estimate. Not financial advice.</p>`;
    el.querySelector("#loan-go").addEventListener("click", () => {
      const P = parseFloat(document.getElementById("loan-p").value) || 0;
      const r = (parseFloat(document.getElementById("loan-r").value) || 0) / 100 / 12;
      const n = parseInt(document.getElementById("loan-n").value) || 1;
      let m;
      if (r === 0) m = P / n;
      else m = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      document.getElementById("loan-res").textContent = `≈ ₱${m.toFixed(2)} / month`;
    });
  },

  unit(el) {
    el.innerHTML = `
      <div class="form-group"><label>Value</label><input type="number" id="unit-v" value="1" step="any" /></div>
      <div class="form-group"><label>From → To</label>
        <select id="unit-type">
          <option value="km-mi">km → miles</option>
          <option value="mi-km">miles → km</option>
          <option value="kg-lb">kg → lb</option>
          <option value="lb-kg">lb → kg</option>
          <option value="c-f">°C → °F</option>
          <option value="f-c">°F → °C</option>
          <option value="m-ft">m → ft</option>
          <option value="ft-m">ft → m</option>
        </select>
      </div>
      <button class="btn-primary" id="unit-go">Convert</button>
      <div class="result-box" id="unit-res">—</div>`;
    const map = {
      "km-mi": v => v * 0.621371,
      "mi-km": v => v * 1.60934,
      "kg-lb": v => v * 2.20462,
      "lb-kg": v => v * 0.453592,
      "c-f": v => v * 9/5 + 32,
      "f-c": v => (v - 32) * 5/9,
      "m-ft": v => v * 3.28084,
      "ft-m": v => v * 0.3048
    };
    el.querySelector("#unit-go").addEventListener("click", () => {
      const v = parseFloat(document.getElementById("unit-v").value) || 0;
      const t = document.getElementById("unit-type").value;
      const res = map[t](v);
      document.getElementById("unit-res").textContent = res.toFixed(4);
    });
  },

  pct(el) {
    el.innerHTML = `
      <div class="form-group"><label>What is X% of Y?</label></div>
      <div class="form-group"><label>X (%)</label><input type="number" id="pct-x" value="10" /></div>
      <div class="form-group"><label>Y</label><input type="number" id="pct-y" value="1000" /></div>
      <button class="btn-primary" id="pct-go">Calculate</button>
      <div class="result-box" id="pct-res">—</div>`;
    el.querySelector("#pct-go").addEventListener("click", () => {
      const x = parseFloat(document.getElementById("pct-x").value) || 0;
      const y = parseFloat(document.getElementById("pct-y").value) || 0;
      document.getElementById("pct-res").textContent = `${x}% of ${y} = ${(x / 100 * y).toFixed(2)}`;
    });
  },

  age(el) {
    el.innerHTML = `
      <div class="form-group"><label>Birth date</label><input type="date" id="age-birth" /></div>
      <div class="form-group"><label>Or days between two dates</label>
        <input type="date" id="age-d1" /> → <input type="date" id="age-d2" />
      </div>
      <button class="btn-primary" id="age-go">Calculate</button>
      <div class="result-box" id="age-res">—</div>`;
    el.querySelector("#age-go").addEventListener("click", () => {
      const birth = document.getElementById("age-birth").value;
      const d1 = document.getElementById("age-d1").value;
      const d2 = document.getElementById("age-d2").value;
      if (birth) {
        const b = new Date(birth);
        const now = new Date();
        let years = now.getFullYear() - b.getFullYear();
        const m = now.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < b.getDate())) years--;
        document.getElementById("age-res").textContent = `Age: ${years} years`;
      } else if (d1 && d2) {
        const a = new Date(d1), b = new Date(d2);
        const days = Math.round(Math.abs(b - a) / 86400000);
        document.getElementById("age-res").textContent = `${days} days`;
      } else {
        document.getElementById("age-res").textContent = "Enter a date";
      }
    });
  },

  pass(el) {
    el.innerHTML = `
      <div class="form-group"><label>Length</label><input type="number" id="pass-len" value="16" min="6" max="64" /></div>
      <div class="form-group">
        <label><input type="checkbox" id="pass-num" checked /> Numbers</label>
        <label><input type="checkbox" id="pass-sym" checked /> Symbols</label>
      </div>
      <button class="btn-primary" id="pass-go">Generate</button>
      <div class="result-box" id="pass-res" style="word-break:break-all;user-select:all">—</div>`;
    el.querySelector("#pass-go").addEventListener("click", () => {
      const len = Math.min(64, Math.max(6, parseInt(document.getElementById("pass-len").value) || 16));
      let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (document.getElementById("pass-num").checked) chars += "0123456789";
      if (document.getElementById("pass-sym").checked) chars += "!@#$%^&*-_=+";
      let out = "";
      const arr = new Uint32Array(len);
      crypto.getRandomValues(arr);
      for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length];
      document.getElementById("pass-res").textContent = out;
    });
  },

  text(el) {
    el.innerHTML = `
      <div class="form-group"><label>Text</label><textarea id="text-in" rows="4" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);border:1px solid var(--border);color:var(--text)"></textarea></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        <button class="btn-primary" style="width:auto;flex:1" data-act="upper">UPPER</button>
        <button class="btn-primary" style="width:auto;flex:1" data-act="lower">lower</button>
        <button class="btn-primary" style="width:auto;flex:1" data-act="title">Title Case</button>
        <button class="btn-primary" style="width:auto;flex:1" data-act="count">Count</button>
      </div>
      <div class="result-box" id="text-res">—</div>`;
    el.querySelectorAll("[data-act]").forEach(btn => {
      btn.addEventListener("click", () => {
        const t = document.getElementById("text-in").value;
        const act = btn.dataset.act;
        let res = t;
        if (act === "upper") res = t.toUpperCase();
        if (act === "lower") res = t.toLowerCase();
        if (act === "title") res = t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        if (act === "count") {
          const words = t.trim() ? t.trim().split(/\s+/).length : 0;
          res = `Chars: ${t.length} | Words: ${words} | Lines: ${t.split("\n").length}`;
        }
        document.getElementById("text-res").textContent = res;
        if (act !== "count") document.getElementById("text-in").value = res;
      });
    });
  },

  recipes(el) {
    const list = window.YEHAW_CONFIG.recipes || [];
    const sites = window.YEHAW_CONFIG.recipeSites || [];
    el.innerHTML = `
      <p style="color:var(--muted);font-size:0.9rem;margin-bottom:14px">Classic Filipino recipes you can cook offline. Tap a dish for the full steps.</p>
      <div id="recipe-list" style="display:flex;flex-direction:column;gap:10px"></div>
      <div id="recipe-detail" style="display:none"></div>
      <div style="margin-top:22px;padding-top:16px;border-top:1px solid var(--border)">
        <p style="font-weight:700;margin-bottom:10px">More recipes online</p>
        <div id="recipe-sites" style="display:flex;flex-direction:column;gap:8px"></div>
      </div>`;
    const listEl = el.querySelector("#recipe-list");
    const detailEl = el.querySelector("#recipe-detail");
    const sitesEl = el.querySelector("#recipe-sites");

    list.forEach(r => {
      const card = document.createElement("button");
      card.className = "btn-primary";
      card.style.cssText = "text-align:left;background:var(--bg2);color:var(--text);border:1px solid var(--border)";
      card.innerHTML = "<strong>" + r.name + "</strong> <span style=\"color:var(--muted);font-size:0.8rem\"> · " + r.time + " · " + r.servings + " servings</span>";
      card.addEventListener("click", () => {
        listEl.style.display = "none";
        detailEl.style.display = "block";
        detailEl.innerHTML = "<button class=\"btn-text\" id=\"recipe-back\" style=\"margin-bottom:12px\">← All recipes</button>" +
          "<h3 style=\"margin-bottom:6px\">" + r.name + "</h3>" +
          "<p style=\"color:var(--muted);font-size:0.85rem;margin-bottom:14px\">" + r.time + " · Serves " + r.servings + "</p>" +
          "<p style=\"font-weight:700;margin-bottom:6px\">Ingredients</p>" +
          "<ul style=\"padding-left:18px;margin-bottom:16px;font-size:0.95rem\">" + r.ingredients.map(function(i){return "<li style=\"margin-bottom:4px\">"+i+"</li>";}).join("") + "</ul>" +
          "<p style=\"font-weight:700;margin-bottom:6px\">Steps</p>" +
          "<ol style=\"padding-left:18px;font-size:0.95rem\">" + r.steps.map(function(s){return "<li style=\"margin-bottom:8px\">"+s+"</li>";}).join("") + "</ol>" +
          "<p class=\"rate-note\" style=\"margin-top:16px\">Cook, eat, come back for more. Yehaw keeps the ads light so you can focus on the food.</p>";
        detailEl.querySelector("#recipe-back").addEventListener("click", () => {
          detailEl.style.display = "none";
          listEl.style.display = "flex";
        });
      });
      listEl.appendChild(card);
    });

    sites.forEach(s => {
      const a = document.createElement("a");
      a.href = s.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "service-card";
      a.style.cssText = "flex-direction:row;justify-content:flex-start;gap:12px;padding:12px 14px;min-height:auto;text-decoration:none";
      a.innerHTML = "<div style=\"font-weight:700;color:var(--accent)\">" + s.name + "</div><div style=\"color:var(--muted);font-size:0.8rem\">" + s.note + "</div>";
      a.addEventListener("click", () => {
        try {
          const stats = JSON.parse(localStorage.getItem("yehaw_stats") || "{}");
          stats["recipe_" + s.name] = (stats["recipe_" + s.name] || 0) + 1;
          localStorage.setItem("yehaw_stats", JSON.stringify(stats));
        } catch (err) {}
      });
      sitesEl.appendChild(a);
    });
  }
};
