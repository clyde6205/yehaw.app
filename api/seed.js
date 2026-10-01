// Yehaw API — seed content: the Filipino + OFW directory, recipes and default config.
// This is the INITIAL data only; after first boot everything is managed from the
// Founders Control Panel and the automated update jobs.

const SERVICES = [
  // Money & wallets
  { slug: "gcash", name: "GCash", icon: "G", color: "#007dff", url: "https://www.gcash.com/", category: "money", description: "Mobile wallet — bills, send, savings" },
  { slug: "maya", name: "Maya", icon: "M", color: "#00d26a", url: "https://www.maya.ph/", category: "money", description: "Wallet, bank and crypto in one app" },
  // Remittance — the OFW lifeline
  { slug: "palawan", name: "Palawan Pawnshop", icon: "P", color: "#0066b3", url: "https://www.palawanexpress.com/", category: "remittance", description: "Padala pickup nationwide" },
  { slug: "lbc", name: "LBC", icon: "L", color: "#ed1c24", url: "https://www.lbcexpress.com/", category: "remittance", description: "Remittance + balikbayan boxes" },
  { slug: "western-union", name: "Western Union", icon: "WU", color: "#ffdd00", url: "https://www.westernunion.com/ph/", category: "remittance", description: "Global money transfer" },
  { slug: "moneygram", name: "MoneyGram", icon: "MG", color: "#e31837", url: "https://www.moneygram.com/", category: "remittance", description: "Global money transfer" },
  { slug: "remitly", name: "Remitly", icon: "R", color: "#3d1c82", url: "https://www.remitly.com/", category: "remittance", description: "Send money to the Philippines" },
  { slug: "worldremit", name: "WorldRemit", icon: "WR", color: "#00b2a9", url: "https://www.worldremit.com/", category: "remittance", description: "Send money home from abroad" },
  { slug: "xoom", name: "Xoom (PayPal)", icon: "X", color: "#142c8e", url: "https://www.xoom.com/", category: "remittance", description: "PayPal-powered remittance" },
  { slug: "cebuana", name: "Cebuana Lhuillier", icon: "C", color: "#c8102e", url: "https://www.cebuanalhuillier.com/", category: "remittance", description: "Pawning, remittance, insurance" },
  { slug: "mlhuillier", name: "M Lhuillier", icon: "ML", color: "#003366", url: "https://www.mlhuillier.com/", category: "remittance", description: "Kwarta padala nationwide" },
  // Banks
  { slug: "bdo", name: "BDO", icon: "B", color: "#0033a0", url: "https://www.bdo.com.ph/", category: "bank", description: "Banco de Oro online banking" },
  { slug: "bpi", name: "BPI", icon: "B", color: "#d01c1f", url: "https://www.bpi.com.ph/", category: "bank", description: "Bank of the Philippine Islands" },
  { slug: "unionbank", name: "UnionBank", icon: "U", color: "#ff6600", url: "https://www.unionbankph.com/", category: "bank", description: "Digital-first Philippine bank" },
  { slug: "metrobank", name: "Metrobank", icon: "M", color: "#003366", url: "https://www.metrobank.com.ph/", category: "bank", description: "Metrobank online" },
  // Government — OFW essentials
  { slug: "dmw", name: "DMW", icon: "🛫", color: "#0a3d91", url: "https://dmw.gov.ph/", category: "gov", description: "Dept. of Migrant Workers — OEC, contracts, overseas permits" },
  { slug: "owwa", name: "OWWA", icon: "🧧", color: "#b3121f", url: "https://owwa.gov.ph/", category: "gov", description: "OFW welfare, membership and benefits" },
  { slug: "sss", name: "SSS", icon: "🏛️", color: "#0a5c36", url: "https://www.sss.gov.ph/", category: "gov", description: "Social Security — contributions and loans" },
  { slug: "philhealth", name: "PhilHealth", icon: "🩺", color: "#0e7490", url: "https://www.philhealth.gov.ph/", category: "gov", description: "National health insurance" },
  { slug: "pagibig", name: "Pag-IBIG", icon: "🏠", color: "#0066cc", url: "https://www.pagibigfundservices.com/", category: "gov", description: "Housing fund, savings and loans" },
  { slug: "bir", name: "BIR", icon: "🧾", color: "#7c2d12", url: "https://www.bir.gov.ph/", category: "gov", description: "Tax filing and TIN services" },
  // Everyday life
  { slug: "grab", name: "Grab", icon: "G", color: "#00b14f", url: "https://www.grab.com/ph/", category: "transport", description: "Ride, food and delivery" },
  { slug: "foodpanda", name: "foodpanda", icon: "🐼", color: "#d70f64", url: "https://www.foodpanda.ph/", category: "food", description: "Food delivery" },
  { slug: "jollibee", name: "Jollibee", icon: "🐝", color: "#e4002b", url: "https://www.jollibee.com.ph/", category: "food", description: "Bida ang saya" },
  { slug: "mcdonalds", name: "McDonald's PH", icon: "M", color: "#ffc72c", url: "https://www.mcdonalds.com.ph/", category: "food", description: "McDo delivery and deals" },
  { slug: "shopee", name: "Shopee", icon: "S", color: "#ee4d2d", url: "https://shopee.ph/", category: "shopping", description: "Online shopping + ShopeePay" },
  { slug: "lazada", name: "Lazada", icon: "L", color: "#0f146d", url: "https://www.lazada.com.ph/", category: "shopping", description: "Online shopping + LazWallet" }
];

const RECIPES = [
  {
    slug: "adobo", name: "Chicken Adobo", time: "45 min", servings: "4",
    ingredients: ["1 kg chicken pieces", "1/2 cup soy sauce", "1/2 cup vinegar", "1 head garlic, crushed", "2 bay leaves", "1 tsp black peppercorns", "1 tbsp oil", "1/2 cup water (optional)"],
    steps: ["Marinate chicken in soy sauce, vinegar, garlic, bay leaves and peppercorns for 30 min (or overnight).", "Heat oil in a pot. Brown the chicken pieces.", "Pour in the marinade. Bring to a boil, then simmer 25–35 min until tender.", "Optional: add a little water if you want more sauce. Reduce until slightly thick.", "Serve with hot rice."]
  },
  {
    slug: "sinigang", name: "Sinigang na Baboy", time: "1 hr", servings: "6",
    ingredients: ["1 kg pork ribs or belly", "1 pack sinigang mix (or tamarind)", "1 onion, quartered", "2 tomatoes, quartered", "1 radish, sliced", "1 bunch kangkong or spinach", "2 long green chilies", "Fish sauce or salt to taste", "8 cups water"],
    steps: ["Boil pork in water with onion until tender (about 40–50 min).", "Add tomatoes and radish. Cook 5–8 min.", "Add sinigang mix (or tamarind extract). Season with fish sauce.", "Add chilies and leafy greens last. Cook 2–3 min only.", "Serve hot with rice and fish sauce + calamansi on the side."]
  },
  {
    slug: "tinola", name: "Chicken Tinola", time: "40 min", servings: "4–5",
    ingredients: ["1 kg chicken, cut up", "1 thumb ginger, sliced", "1 onion, sliced", "2 green papaya or chayote, sliced", "1 bunch malunggay or spinach", "4–5 cups water or broth", "Fish sauce or salt", "Pepper"],
    steps: ["Sauté ginger and onion until fragrant.", "Add chicken and cook until lightly browned.", "Pour water/broth. Simmer until chicken is almost done.", "Add papaya/chayote. Cook until soft.", "Season. Add malunggay leaves last. Serve hot."]
  },
  {
    slug: "tocino", name: "Pork Tocino", time: "Overnight + 20 min", servings: "4",
    ingredients: ["1 kg pork shoulder, sliced thin", "1/2 cup brown sugar", "2 tbsp soy sauce", "1 tbsp garlic powder or 4 cloves minced", "1 tsp salt", "1/2 tsp ground pepper", "1/4 cup pineapple juice or anisado wine (optional)", "Red food color (optional)"],
    steps: ["Mix all marinade ingredients. Coat pork well.", "Marinate overnight in the fridge (or at least 4 hours).", "Pan-fry over medium heat with a little water first so it cooks through, then let the liquid reduce and caramelize.", "Serve with garlic rice and egg."]
  },
  {
    slug: "pancit", name: "Pancit Bihon", time: "30 min", servings: "6",
    ingredients: ["500 g bihon (rice noodles)", "200 g pork or chicken, sliced", "1 cup shrimp (optional)", "2 cups cabbage, shredded", "1 carrot, julienned", "1 onion + 3 garlic cloves", "3–4 tbsp soy sauce", "2 cups broth", "Calamansi or lemon"],
    steps: ["Soak bihon in water until soft. Drain.", "Sauté garlic and onion. Add meat and cook until done. Add shrimp if using.", "Pour broth and soy sauce. Bring to simmer.", "Add vegetables, then the noodles. Toss until liquid is absorbed.", "Serve with calamansi."]
  },
  {
    slug: "karekare", name: "Kare-Kare", time: "1.5–2 hrs", servings: "6",
    ingredients: ["1 kg oxtail or beef, cut up", "1/2 cup peanut butter", "1/4 cup ground toasted rice or rice flour", "1 onion, 4 garlic cloves", "1 eggplant, 1 banana heart or pechay, sitaw", "Annatto (atsuete) water for color", "Bagoong on the side", "Salt"],
    steps: ["Boil meat until very tender (pressure cooker helps).", "Sauté garlic and onion. Add annatto water.", "Add the broth from the meat. Stir in peanut butter and ground rice until thick.", "Add the tender meat and vegetables. Cook until veggies are done.", "Serve with bagoong and rice."]
  }
];

const DEFAULT_CONFIG = {
  // PHP per 1 unit of each currency — auto-refreshed by the update job,
  // includes the top OFW host-country currencies (AED, SAR, QAR, KWD, TWD...).
  rates: {
    USD: 58.4, EUR: 63.2, JPY: 0.39, GBP: 76.5, AUD: 38.8, SGD: 44.1,
    CAD: 42.3, CNY: 8.15, KRW: 0.043, HKD: 7.5,
    AED: 15.9, SAR: 15.55, QAR: 16.0, KWD: 190.0, MYR: 12.4, TWD: 1.82
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
  recipeSites: [
    { name: "Panlasang Pinoy", url: "https://panlasangpinoy.com/", note: "Classic home recipes" },
    { name: "Kawaling Pinoy", url: "https://www.kawalingpinoy.com/", note: "Easy everyday dishes" },
    { name: "Foxy Folksy", url: "https://www.foxyfolksy.com/", note: "Modern + traditional" },
    { name: "Ang Sarap", url: "https://www.angsarap.net/", note: "Authentic flavors" },
    { name: "Yummy.ph", url: "https://www.yummy.ph/", note: "Popular PH food media" }
  ],
  adsense: {
    client: "ca-pub-XXXXXXXXXXXXXXXX",
    slots: { top: "1234567890", mid: "0987654321" }
  },
  broadcast: null,
  flags: {}
};

module.exports = { SERVICES, RECIPES, DEFAULT_CONFIG };
