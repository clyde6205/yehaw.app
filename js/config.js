// Yehaw config — edit here or via Admin Console (localStorage override)
window.YEHAW_CONFIG = {
  version: "1.1.0",
  siteName: "Yehaw",
  tagline: "Full Filipino Directory + Fast Tools",
  // Approximate rates (update periodically via admin). Base = PHP
  rates: {
    USD: 58.40,
    EUR: 63.20,
    JPY: 0.39,
    GBP: 76.50,
    AUD: 38.80,
    SGD: 44.10,
    CAD: 42.30,
    CNY: 8.15,
    KRW: 0.043,
    HKD: 7.50
  },
  tools: [
    { id: "recipes", name: "Recipes", icon: "🍳", type: "recipes" },
    { id: "calc", name: "Calculator", icon: "🧮", type: "calc" },
    { id: "currency", name: "PHP Rates", icon: "💱", type: "currency" },
    { id: "tip", name: "Tip Calc", icon: "💸", type: "tip" },
    { id: "bmi", name: "BMI", icon: "⚖️", type: "bmi" },
    { id: "loan", name: "Loan Est.", icon: "🏦", type: "loan" },
    { id: "unit", name: "Unit Conv", icon: "📏", type: "unit" },
    { id: "pct", name: "% Calc", icon: "%", type: "pct" },
    { id: "age", name: "Age / Days", icon: "📅", type: "age" },
    { id: "pass", name: "Password", icon: "🔐", type: "pass" },
    { id: "text", name: "Text Tools", icon: "✏️", type: "text" }
  ],
  // Popular Filipino recipe sites (high traffic, good for engagement + ads)
  recipeSites: [
    { name: "Panlasang Pinoy", url: "https://panlasangpinoy.com/", note: "Classic home recipes" },
    { name: "Kawaling Pinoy", url: "https://www.kawalingpinoy.com/", note: "Easy everyday dishes" },
    { name: "Foxy Folksy", url: "https://www.foxyfolksy.com/", note: "Modern + traditional" },
    { name: "Ang Sarap", url: "https://www.angsarap.net/", note: "Authentic flavors" },
    { name: "Yummy.ph", url: "https://www.yummy.ph/", note: "Popular PH food media" }
  ],
  // Static offline recipes — keeps users on-site longer (better for AdSense)
  recipes: [
    {
      id: "adobo",
      name: "Chicken Adobo",
      time: "45 min",
      servings: "4",
      ingredients: ["1 kg chicken pieces", "1/2 cup soy sauce", "1/2 cup vinegar", "1 head garlic, crushed", "2 bay leaves", "1 tsp black peppercorns", "1 tbsp oil", "1/2 cup water (optional)"],
      steps: ["Marinate chicken in soy sauce, vinegar, garlic, bay leaves and peppercorns for 30 min (or overnight).", "Heat oil in a pot. Brown the chicken pieces.", "Pour in the marinade. Bring to a boil, then simmer 25–35 min until tender.", "Optional: add a little water if you want more sauce. Reduce until slightly thick.", "Serve with hot rice."]
    },
    {
      id: "sinigang",
      name: "Sinigang na Baboy",
      time: "1 hr",
      servings: "6",
      ingredients: ["1 kg pork ribs or belly", "1 pack sinigang mix (or tamarind)", "1 onion, quartered", "2 tomatoes, quartered", "1 radish, sliced", "1 bunch kangkong or spinach", "2 long green chilies", "Fish sauce or salt to taste", "8 cups water"],
      steps: ["Boil pork in water with onion until tender (about 40–50 min).", "Add tomatoes and radish. Cook 5–8 min.", "Add sinigang mix (or tamarind extract). Season with fish sauce.", "Add chilies and leafy greens last. Cook 2–3 min only.", "Serve hot with rice and fish sauce + calamansi on the side."]
    },
    {
      id: "tinola",
      name: "Chicken Tinola",
      time: "40 min",
      servings: "4–5",
      ingredients: ["1 kg chicken, cut up", "1 thumb ginger, sliced", "1 onion, sliced", "2 green papaya or chayote, sliced", "1 bunch malunggay or spinach", "4–5 cups water or broth", "Fish sauce or salt", "Pepper"],
      steps: ["Sauté ginger and onion until fragrant.", "Add chicken and cook until lightly browned.", "Pour water/broth. Simmer until chicken is almost done.", "Add papaya/chayote. Cook until soft.", "Season. Add malunggay leaves last. Serve hot."]
    },
    {
      id: "tocino",
      name: "Pork Tocino",
      time: "Overnight + 20 min",
      servings: "4",
      ingredients: ["1 kg pork shoulder, sliced thin", "1/2 cup brown sugar", "2 tbsp soy sauce", "1 tbsp garlic powder or 4 cloves minced", "1 tsp salt", "1/2 tsp ground pepper", "1/4 cup pineapple juice or anisado wine (optional)", "Red food color (optional)"],
      steps: ["Mix all marinade ingredients. Coat pork well.", "Marinate overnight in the fridge (or at least 4 hours).", "Pan-fry over medium heat with a little water first so it cooks through, then let the liquid reduce and caramelize.", "Serve with garlic rice and egg."]
    },
    {
      id: "pancit",
      name: "Pancit Bihon",
      time: "30 min",
      servings: "6",
      ingredients: ["500 g bihon (rice noodles)", "200 g pork or chicken, sliced", "1 cup shrimp (optional)", "2 cups cabbage, shredded", "1 carrot, julienned", "1 onion + 3 garlic cloves", "3–4 tbsp soy sauce", "2 cups broth", "Calamansi or lemon"],
      steps: ["Soak bihon in water until soft. Drain.", "Sauté garlic and onion. Add meat and cook until done. Add shrimp if using.", "Pour broth and soy sauce. Bring to simmer.", "Add vegetables, then the noodles. Toss until liquid is absorbed.", "Serve with calamansi."]
    },
    {
      id: "karekare",
      name: "Kare-Kare",
      time: "1.5–2 hrs",
      servings: "6",
      ingredients: ["1 kg oxtail or beef, cut up", "1/2 cup peanut butter", "1/4 cup ground toasted rice or rice flour", "1 onion, 4 garlic cloves", "1 eggplant, 1 banana heart or pechay, sitaw", "Annatto (atsuete) water for color", "Bagoong on the side", "Salt"],
      steps: ["Boil meat until very tender (pressure cooker helps).", "Sauté garlic and onion. Add annatto water.", "Add the broth from the meat. Stir in peanut butter and ground rice until thick.", "Add the tender meat and vegetables. Cook until veggies are done.", "Serve with bagoong and rice."]
    }
  ],
  services: [
    { id: "gcash", name: "GCash", icon: "G", color: "#007dff", url: "https://www.gcash.com/" },
    { id: "maya", name: "Maya", icon: "M", color: "#00d26a", url: "https://www.maya.ph/" },
    { id: "grab", name: "Grab", icon: "G", color: "#00b14f", url: "https://www.grab.com/ph/" },
    { id: "foodpanda", name: "foodpanda", icon: "🐼", color: "#d70f64", url: "https://www.foodpanda.ph/" },
    { id: "jollibee", name: "Jollibee", icon: "🐝", color: "#e4002b", url: "https://www.jollibee.com.ph/" },
    { id: "mcdo", name: "McDonald's", icon: "M", color: "#ffc72c", url: "https://www.mcdonalds.com.ph/" },
    { id: "shopee", name: "Shopee", icon: "S", color: "#ee4d2d", url: "https://shopee.ph/" },
    { id: "lazada", name: "Lazada", icon: "L", color: "#0f146d", url: "https://www.lazada.com.ph/" },
    { id: "palawan", name: "Palawan", icon: "P", color: "#0066b3", url: "https://www.palawanexpress.com/" },
    { id: "lbc", name: "LBC", icon: "L", color: "#ed1c24", url: "https://www.lbcexpress.com/" },
    { id: "westernunion", name: "Western Union", icon: "WU", color: "#ffdd00", url: "https://www.westernunion.com/ph/" },
    { id: "moneygram", name: "MoneyGram", icon: "MG", color: "#e31837", url: "https://www.moneygram.com/" },
    { id: "remitly", name: "Remitly", icon: "R", color: "#3d1c82", url: "https://www.remitly.com/" },
    { id: "worldremit", name: "WorldRemit", icon: "WR", color: "#00b2a9", url: "https://www.worldremit.com/" },
    { id: "xoom", name: "Xoom", icon: "X", color: "#142c8e", url: "https://www.xoom.com/" },
    { id: "cebuana", name: "Cebuana", icon: "C", color: "#c8102e", url: "https://www.cebuanalhuillier.com/" },
    { id: "mlhuillier", name: "M Lhuillier", icon: "ML", color: "#003366", url: "https://www.mlhuillier.com/" },
    { id: "bdo", name: "BDO", icon: "B", color: "#0033a0", url: "https://www.bdo.com.ph/" },
    { id: "bpi", name: "BPI", icon: "B", color: "#d01c1f", url: "https://www.bpi.com.ph/" },
    { id: "unionbank", name: "UnionBank", icon: "U", color: "#ff6600", url: "https://www.unionbankph.com/" },
    { id: "metrobank", name: "Metrobank", icon: "M", color: "#003366", url: "https://www.metrobank.com.ph/" },
    { id: "pagibig", name: "Pag-IBIG", icon: "🏠", color: "#0066cc", url: "https://www.pagibigfundservices.com/" }
  ],
  adsense: {
    client: "ca-pub-XXXXXXXXXXXXXXXX",
    slots: {
      top: "1234567890",
      mid: "0987654321"
    }
  },
  admin: {
    // Change this password immediately after first login
    passwordHash: "yehaw2026admin" // simple string for MVP; replace with real hash later
  }
};

// Load overrides from localStorage (set by admin)
(function() {
  try {
    const saved = localStorage.getItem("yehaw_config_override");
    if (saved) {
      const o = JSON.parse(saved);
      if (o.rates) window.YEHAW_CONFIG.rates = { ...window.YEHAW_CONFIG.rates, ...o.rates };
      if (o.services) window.YEHAW_CONFIG.services = o.services;
      if (o.tools) window.YEHAW_CONFIG.tools = o.tools;
      if (o.adsense) window.YEHAW_CONFIG.adsense = o.adsense;
    }
  } catch (e) {}
})();
