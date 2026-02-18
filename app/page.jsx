'use client'
import { useState } from "react";

const c = {
  cream: "#F5F0E8", parchment: "#EDE7D9", sand: "#D9CEBC", stone: "#B8A98C",
  tan: "#9E8660", bark: "#6B5740", ink: "#1E1C18", charcoal: "#3A3630",
  mid: "#6B6357", warm: "#C8B89A", deep: "#2A2620",
};

// ALL DESTINATIONS
const allDestinations = {
  douro: {
    city: "The Douro Valley", country: "Portugal", region: "Southern Europe", vibe: "Wine · Slow · Boutique",
    why: "You're not going to Lisbon — everyone goes to Lisbon. The Douro Valley is where Portugal actually lives. Terraced vineyards, family quintas that pour their best wine at lunch, and a pace that genuinely resets you.",
    tags: ["Wine Country", "Slow Travel", "Under the Radar", "Boutique Stays"],
    insider: "Skip the famous quinta tours. Book a working harvest lunch at a family-run estate in October — you're a guest, not a visitor, and the experience is completely different.",
    photos: {
      hero: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=85",
      grid: [
        { url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=600&q=80", label: "Local Wine" },
        { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80", label: "Quinta Stay" },
        { url: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80", label: "River Views" },
      ]
    }
  },
  alentejo: {
    city: "Alentejo", country: "Portugal", region: "Southern Europe", vibe: "Quiet · Wine · History",
    why: "Portugal's best-kept interior secret. Wide open plains, cork oak forests, medieval hilltop villages, and some of the country's most interesting wines without any of the crowds.",
    tags: ["Off the Beaten Path", "Wine", "History", "Peaceful"],
    insider: "Stay in a converted herdade — the agricultural estate stays here are exceptional value. Some owners will cook you dinner if you ask. Ask.",
    photos: {
      hero: "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=1200&q=85",
      grid: [
        { url: "https://images.unsplash.com/photo-1504279577054-acfeccf8fd52?w=600&q=80", label: "Rolling Plains" },
        { url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=600&q=80", label: "Alentejo Wine" },
        { url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=80", label: "Hill Villages" },
      ]
    }
  },
  highlands: {
    city: "The Highlands", country: "Iceland", region: "North Atlantic", vibe: "Wild · Remote · Raw",
    why: "Forget the Ring Road — the Highlands are what Iceland looks like before roads existed. Volcanic desert, glacial rivers, and a silence that resets something in you.",
    tags: ["Remote", "Wild", "Zero Crowds", "Transformative"],
    insider: "The F-roads to Landmannalaugar open late June. Rent a proper 4x4, pack extra food, and go when everyone else is stuck on the south coast.",
    photos: {
      hero: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1200&q=85",
      grid: [
        { url: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=600&q=80", label: "Volcanic Terrain" },
        { url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80", label: "Northern Lights" },
        { url: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=600&q=80", label: "Glacial Rivers" },
      ]
    }
  },
  puglia: {
    city: "Puglia", country: "Italy", region: "Southern Europe", vibe: "Food · Architecture · Slow",
    why: "The heel of the boot and Italy's most underrated region. Trulli houses, the baroque city of Lecce, orecchiette made by hand on the street, and olive oil that changes your reference point entirely.",
    tags: ["Food-Forward", "Architecture", "Slow Living", "Real Italy"],
    insider: "Skip central Alberobello and stay in a masseria outside Ostuni. The trulli are everywhere if you know where to look — without the crowds.",
    photos: {
      hero: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=85",
      grid: [
        { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", label: "Local Pasta" },
        { url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80", label: "Trulli Houses" },
        { url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80", label: "Olive Oil" },
      ]
    }
  },
  basque: {
    city: "The Basque Country", country: "Spain", region: "Northern Spain", vibe: "Food · Coast · Culture",
    why: "San Sebastián has the highest concentration of Michelin stars per capita in the world — but the pintxos bars in the Old Town will outdo most of them for a fraction of the price.",
    tags: ["Food Destination", "Wine & Cider", "Coastal", "Culinary Depth"],
    insider: "Bar Nestor's tortilla at 1pm on a weekday is one of the best things you can eat in Spain. They make two a day. Get there early.",
    photos: {
      hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",
      grid: [
        { url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80", label: "Pintxos Culture" },
        { url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80", label: "Basque Wine" },
        { url: "https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?w=600&q=80", label: "Coastline" },
      ]
    }
  },
  atacama: {
    city: "The Atacama Desert", country: "Chile", region: "South America", vibe: "Otherworldly · Luxury · Epic",
    why: "The driest non-polar desert on earth. Salt flats, geysers at sunrise, flamingo lagoons, and a night sky so clear it hosts the world's major telescopes.",
    tags: ["Luxury Adventure", "Otherworldly", "Stargazing", "Once in a Lifetime"],
    insider: "Explora Atacama is expensive but all excursions are included and the guides are exceptional. Book the salt flat sunrise and the astronomy session on the same day.",
    photos: {
      hero: "https://images.unsplash.com/photo-1531761535209-83234ac3f25b?w=1200&q=85",
      grid: [
        { url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80", label: "Night Sky" },
        { url: "https://images.unsplash.com/photo-1548625149-720f89ea5a3b?w=600&q=80", label: "Salt Flats" },
        { url: "https://images.unsplash.com/photo-1518709779341-56cf4535e94a?w=600&q=80", label: "Desert Sunrise" },
      ]
    }
  },
  patagonia: {
    city: "Patagonia", country: "Chile", region: "South America", vibe: "Epic · Wildlife · Remote",
    why: "The end of the world, and it looks exactly like it should. Torres del Paine in autumn color is one of the genuinely life-altering sights on the planet.",
    tags: ["Epic Landscape", "Wildlife", "Remote Lodges", "Once in a Lifetime"],
    insider: "The W Trek is crowded. Consider Awasi Patagonia — private excursions and expert guides. You'll see things the trekkers on the main trail simply never do.",
    photos: {
      hero: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85",
      grid: [
        { url: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80", label: "Torres del Paine" },
        { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", label: "Glaciers" },
        { url: "https://images.unsplash.com/photo-1515205244153-fce4e5d8e861?w=600&q=80", label: "Wildlife" },
      ]
    }
  },
  kyoto: {
    city: "Kyoto & Osaka", country: "Japan", region: "East Asia", vibe: "Culture · Food · Timeless",
    why: "Everyone goes to Tokyo. The people who actually know Japan go to Kyoto and Osaka. Ancient temples empty at 7am, the world's greatest street food in Dotonbori.",
    tags: ["Culture", "World-Class Food", "History", "Sensory"],
    insider: "Book a solo seat at the counter of a tiny ramen or omakase spot in Osaka's Namba backstreets. No English menu — point at what others are having. Best meal of your trip, guaranteed.",
    photos: {
      hero: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=85",
      grid: [
        { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", label: "Street Food" },
        { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80", label: "Sake & Drinks" },
        { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", label: "Ancient Temples" },
      ]
    }
  },
  japan_rural: {
    city: "The Japanese Countryside", country: "Japan", region: "East Asia", vibe: "Remote · Zen · Authentic",
    why: "Ryokan towns, the Nakasendo trail, hot spring baths, paper doors, and meals eaten on the floor. Nothing like anything you've experienced.",
    tags: ["Ryokan", "Hot Springs", "Off-Grid", "Authentic Japan"],
    insider: "Stay in Kinosaki Onsen on a Tuesday in November — seven public bathhouses you walk between in a yukata. Almost no foreigners. Completely magical.",
    photos: {
      hero: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85",
      grid: [
        { url: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80", label: "Ryokan Stay" },
        { url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=80", label: "Hot Springs" },
        { url: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80", label: "Countryside" },
      ]
    }
  },
  tasmania: {
    city: "Tasmania", country: "Australia", region: "South Pacific", vibe: "Wild · Food · Remote",
    why: "The part of Australia almost no one visits. Ancient wilderness, a food and wine scene that punches above its weight, MONA — one of the strangest museums in the world.",
    tags: ["Wild Nature", "Food & Wine", "Art", "Under the Radar"],
    insider: "MONA outside Hobart is unmissable. Arrive by ferry from the Hobart waterfront, stay the whole day, and book the on-site restaurant Faro for dinner.",
    photos: {
      hero: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=85",
      grid: [
        { url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80", label: "Wild Coast" },
        { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", label: "Local Dining" },
        { url: "https://images.unsplash.com/photo-1504284568423-825c5aa06d41?w=600&q=80", label: "Wilderness" },
      ]
    }
  },
  margaret_river: {
    city: "Margaret River", country: "Australia", region: "South Pacific", vibe: "Wine · Coast · Relaxed",
    why: "Western Australia's wine region is one of the best-kept secrets in the Southern Hemisphere. World-class Cabernet and Chardonnay, ancient caves, a surf coast.",
    tags: ["Wine Country", "Surf Coast", "Relaxed Luxury", "Under the Radar"],
    insider: "Skip the big-name wineries and book a tasting at a smaller family producer like Cullen or Vasse Felix. The difference in experience is enormous.",
    photos: {
      hero: "https://images.unsplash.com/photo-1474721891556-fd8c3f843a60?w=1200&q=85",
      grid: [
        { url: "https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?w=600&q=80", label: "Wine Country" },
        { url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80", label: "Surf Coast" },
        { url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80", label: "Local Cellar" },
      ]
    }
  }
};

const DEST_SUMMARY = Object.entries(allDestinations).map(([key, d]) => `${key}: ${d.city}, ${d.country} — ${d.vibe} — Tags: ${d.tags.join(", ")}`).join("\n");

// QUIZ QUESTIONS
const questions = [
  { q: "What's pulling you toward a trip right now?", sub: "Pick what resonates most, or tell us in your own words", label: "Motivation",
    opts: [
      { val: "escape", text: "I need to fully disconnect from everything" },
      { val: "culture", text: "I want to learn something real about a place" },
      { val: "food", text: "I'm chasing incredible food and wine" },
      { val: "adventure", text: "I want to feel genuinely alive" },
      { val: "romance", text: "I want a romantic, memorable experience" },
      { val: "explore", text: "I just want to explore somewhere totally new" },
    ]
  },
  { q: "Who's coming with you?", sub: "This shapes everything about what we recommend", label: "Party",
    opts: [
      { val: "solo", text: "Just me — solo trip" },
      { val: "partner", text: "My partner or spouse" },
      { val: "friends_small", text: "A small group of close friends (2–4)" },
      { val: "friends_big", text: "A bigger group (5+)" },
      { val: "family_kids", text: "Family with young kids" },
      { val: "family_adult", text: "Family with older kids or adults" },
    ]
  },
  { q: "What kind of pace are you looking for?", sub: "How you want the days to actually feel", label: "Pace",
    opts: [
      { val: "slow", text: "Slow and unhurried — I want to linger" },
      { val: "active", text: "Active but not exhausting — a good balance" },
      { val: "packed", text: "I want to see and do as much as possible" },
      { val: "spontaneous", text: "No plan — I'll figure it out when I get there" },
      { val: "luxury", text: "Relaxed and looked after — minimal effort" },
      { val: "mixed", text: "Mix it up depending on the day" },
    ]
  },
  { q: "What matters most when you travel?", sub: "Pick the one that gets you most excited", label: "Priority",
    opts: [
      { val: "food_wine", text: "Finding exceptional food and drink" },
      { val: "nature", text: "Being in wild, beautiful landscapes" },
      { val: "history", text: "History, art, and deep culture" },
      { val: "people", text: "Meeting locals and real connection" },
      { val: "photo", text: "Capturing places that look unreal" },
      { val: "rest", text: "Genuinely switching off and recharging" },
    ]
  },
  { q: "How long are you actually going for?", sub: "Realistic, not aspirational", label: "Duration",
    opts: [
      { val: "weekend", text: "Long weekend (3–4 days)" },
      { val: "week", text: "One week" },
      { val: "ten", text: "10 days" },
      { val: "twoweeks", text: "Two weeks" },
      { val: "threeplus", text: "Three weeks or more" },
      { val: "open", text: "Completely flexible" },
    ]
  },
  { q: "What's your honest budget range per person?", sub: "No judgment — it just changes what we recommend", label: "Budget",
    opts: [
      { val: "budget", text: "Under $100/day — I travel smart" },
      { val: "mid", text: "$100–200/day — comfortable but considered" },
      { val: "upper", text: "$200–350/day — I'll splurge on the right things" },
      { val: "luxury", text: "$350–600/day — quality is the priority" },
      { val: "ultra", text: "$600+/day — money is not the constraint" },
      { val: "varies", text: "It depends — I mix budget and splurge" },
    ]
  },
  { q: "How far outside your comfort zone do you want to go?", sub: "This is where we decide how bold your match gets", label: "Boldness",
    opts: [
      { val: "safe", text: "Familiar enough — I want comfort and ease" },
      { val: "slight", text: "Slightly unfamiliar — push me gently" },
      { val: "stretch", text: "Somewhere I'd have to research to explain" },
      { val: "bold", text: "Make me the first in my friend group to go" },
      { val: "wild", text: "I want to feel like I discovered it myself" },
      { val: "anywhere", text: "Anywhere — just make it extraordinary" },
    ]
  },
];

function buildMatchPrompt(answers, customAnswers) {
  const summary = questions.map((q, i) => {
    const sel = answers[i];
    const opt = q.opts.find(o => o.val === sel);
    const custom = customAnswers[i];
    return `Q${i + 1}: ${q.q}\nA: ${custom ? `[Custom] "${custom}"` : (opt ? opt.text : "Not answered")}`;
  }).join("\n\n");

  return `You are Deriva, a curated travel brand. Based on the following quiz answers, match the user to exactly ONE destination from the list below. Return ONLY a JSON object with the key "match" set to the destination key. Nothing else.

DESTINATIONS:
${DEST_SUMMARY}

USER ANSWERS:
${summary}

Return format: {"match": "destination_key"}`;
}

function getFallbackMatch(answers) {
  const bold = answers[6] || "stretch";
  const priority = answers[3] || "food_wine";
  if (priority === "nature") return bold === "wild" ? allDestinations.highlands : allDestinations.patagonia;
  if (priority === "food_wine") return bold === "bold" || bold === "wild" ? allDestinations.kyoto : allDestinations.basque;
  if (priority === "rest") return allDestinations.alentejo;
  if (priority === "history") return allDestinations.puglia;
  return allDestinations.douro;
}

const destList = [
  { region: "Southern Europe", name: "Portugal", tag: "Wine · Coast · Quiet" },
  { region: "North Atlantic", name: "Iceland", tag: "Wild · Remote · Raw" },
  { region: "Southern Europe", name: "Italy", tag: "Depth · Food · Niche" },
  { region: "Southern Europe", name: "Spain", tag: "Culinary · Local · Vivid" },
  { region: "South America", name: "Chile", tag: "Epic · Untouched · Bold" },
  { region: "East Asia", name: "Japan", tag: "Culture · Zen · Food" },
  { region: "South Pacific", name: "Australia", tag: "Wild · Wine · Coast" },
];

// PORTUGAL PAGE DATA
const portugalRegions = [
  { name: "Lisbon", tag: "City · Food · Neighborhoods", 
    intro: "Everyone lands in Lisbon and thinks they know it after two days. They don't. Lisbon rewards the people who stay long enough to get past the Alfama viewpoints and the pastéis de nata queues. The city is actually a collection of very different neighborhoods — each with its own personality, its own bars, its own rhythm. You could spend two weeks here and still find new streets.",
    highlights: [
      { label: "Alfama", text: "The oldest neighborhood, a labyrinth of narrow streets where fado spills from open windows at night. Go to Ponto Final for sunset drinks by the Tagus, eat at Páteo 13 for petiscos, and get lost on purpose." },
      { label: "Mouraria", text: "Grittier than Alfama, more authentic, less touristed. Fado here feels different — rawer. Restaurants have no menus, they bring you what they cooked. Try Tasca do Chico on a Thursday night." },
      { label: "Bairro Alto", text: "The nightlife district. Dead during the day, alive after 10pm. Tiny bars shoulder to shoulder, locals spilling into the streets with Super Bocks. Start at Pavilhão Chinês for cocktails in the most eccentric bar in Lisbon." },
      { label: "Príncipe Real", text: "Where Lisbon's food scene is actually happening. Slower, more considered, better wine lists. Walk the main drag and look for handwritten menus. Eat at Cervejaria Ramiro for seafood, Taberna da Rua das Flores for petiscos." },
      { label: "LX Factory", text: "A repurposed industrial complex in Alcântara. Independent restaurants, bookstores, design shops. Go on Sunday when the market is running. Dinner at Rio Maravilha on the rooftop." },
      { label: "Cais do Sodré", text: "The riverfront neighborhood that cleaned up without losing its edge. Time Out Market for lunch (tourist trap but done well), Pensão Amor for late drinks in a former brothel turned bar." },
      { label: "Belém", text: "Yes, go for the pastéis de nata at Pastéis de Belém. But stay for Jerónimos Monastery at 8am before the groups arrive — it's one of the most extraordinary buildings in Europe. Walk the waterfront to the Monument to the Discoveries." },
      { label: "Campo de Ourique", text: "Residential, local, excellent for an afternoon wander. The market (Mercado de Campo de Ourique) has food stalls inside — lunch here feels like a secret. Dinner at Tasca da Esquina." },
      { label: "Graça & São Vicente", text: "Hilltop neighborhoods with the best views in Lisbon. Miradouro da Graça at sunset with a beer from the kiosk. Feira da Ladra flea market on Tuesdays and Saturdays." },
      { label: "Santos", text: "Design district turning into the new Príncipe Real. Smaller, quieter, better wine bars. Prado for modern Portuguese cooking, Quimera Brewpub if you want craft beer." }
    ], 
    img: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&q=80" 
  },
  { name: "Porto", tag: "Wine · River · Character", 
    intro: "Porto is what Lisbon used to be before everyone found it. Rougher around the edges, cheaper, more working class, and with a food and wine culture that runs deeper. The port wine lodges in Vila Nova de Gaia across the river are worth an afternoon. The Ribeira waterfront at sunset with a cold Super Bock is worth the whole trip. This is a city that reveals itself slowly — and rewards the people who stay longer than two nights.",
    highlights: [
      { label: "Ribeira", text: "The old waterfront district. Touristy but unavoidable — and genuinely beautiful. Go early morning (7am, the light is extraordinary) or late evening when most visitors have left. Dinner at Taberna dos Mercadores." },
      { label: "Bolhão & Baixa", text: "The commercial heart of Porto. Mercado do Bolhão reopened after years of renovation — go for lunch at one of the upstairs restaurants. Café Majestic on Rua de Santa Catarina for coffee in the most beautiful café in Portugal." },
      { label: "Cedofeita", text: "The design and vintage shopping district. Small independent shops, younger crowd, better coffee. Lunch at Café Candelabro, dinner at Essência." },
      { label: "Foz do Douro", text: "Where the river meets the Atlantic. A completely different side of Porto — residential, breezy, excellent seafood. Walk the coastal path west from here. Dinner at Cafeína for fresh fish." },
      { label: "Vila Nova de Gaia", text: "Technically across the river, but essential. Walk the Dom Luís bridge on the upper deck, come down to the port wine lodges. Taylor's or Graham's for the views, Ramos Pinto for a quieter experience." },
      { label: "Miragaia", text: "Between Ribeira and the center, Miragaia is where locals actually live. Narrow streets, small tascas, no tour groups. Taberna Santo António for traditional food, Casa Guedes for the city's best pork sandwich." },
      { label: "Massarelos", text: "The neighborhood between the center and Foz. Quieter, more residential, excellent wine bars. Prova for natural wine, Aduela for petiscos and port." },
      { label: "Rua Miguel Bombarda", text: "The gallery district. First Friday of every month the galleries stay open late with wine. Even if you're not there for gallery night, this street has some of Porto's best new restaurants." }
    ], 
    img: "https://images.unsplash.com/photo-1564594985645-4c2b674c4b8e?w=900&q=80" 
  },
  { name: "The Douro Valley", tag: "Wine · Slow · Quintas", intro: "Two hours east of Porto and a completely different world. The Douro is one of the most dramatic wine landscapes on earth — terraced vineyards dropping hundreds of feet to a wide green river.", highlights: [
    { label: "Pinhão", text: "The center of the upper Douro. Small, beautiful, and a perfect base." },
    { label: "Quinta da Crasto", text: "One of the best quintas in the valley with exceptional tastings and views that don't feel real." },
    { label: "The Douro train line", text: "The train from Porto to Pinhão follows the river the whole way. One of the great train journeys in Europe." }
  ], img: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=900&q=80" },
  { name: "Sintra", tag: "Palaces · Forest", intro: "Thirty minutes from Lisbon by train. Sintra is full of palaces, each more eccentric than the last, built into a forested hillside above the Atlantic.", highlights: [
    { label: "Palácio da Pena", text: "A Romanticist palace painted in yellow and red sitting above the clouds. Completely over the top in the best way." },
    { label: "Quinta da Regaleira", text: "An estate with hidden tunnels, an inverted tower you descend into, and gardens full of esoteric symbolism." }
  ], img: "https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=900&q=80" },
  { name: "The Algarve", tag: "Coast · Cliffs", intro: "Portugal's southern coast is the most visited part of the country for a reason — the coastline is genuinely extraordinary, the weather is the best in Europe.", highlights: [
    { label: "Lagos", text: "The best base in the western Algarve — a proper town with history, good restaurants, and access to dramatic rock formations." },
    { label: "Sagres", text: "At the southwestern tip of Europe, Sagres is where the Atlantic feels genuinely untamed." }
  ], img: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=80" },
];

const portugalEatDrink = [
  { type: "Wine Bars", range: "Any budget", recs: [
    "By the Wine (Lisbon) — the best introduction to Portuguese wine in a single sitting, 50+ wines by the glass",
    "Garrafeira Nacional (Lisbon) — a legendary wine shop with a tasting bar in the back, bottles you won't find anywhere else",
    "Espaço Porto Cruz (Porto) — rooftop views over the Douro and a serious port wine list",
    "Prova (Porto) — natural wine bar in Massarelos, small producers, knowledgeable staff",
    "Aduela Taberna (Porto) — petiscos and port in equal measure, locals only",
    "Enoteca de Belém (Lisbon) — Portuguese wines only, exceptional by-the-glass selection"
  ]},
  { type: "Casual Eats", range: "Under €20pp", recs: [
    "A Cevicheria (Lisbon) — the octopus rice is one of the best dishes in the city, book ahead",
    "Taberna da Rua das Flores (Lisbon) — tiny, no reservations, traditional petiscos done perfectly",
    "Cantinho do Avillez (Porto) — José Avillez's more casual Porto spot, excellent value",
    "Mercado do Bolhão (Porto) — the newly restored market, best lunch in the city",
    "Casa Guedes (Porto) — the city's best pork sandwich (pernil), locals queue for it",
    "Páteo 13 (Lisbon) — Alfama tasca, whatever they're cooking that day",
    "Taberna Santo António (Porto) — Miragaia neighborhood spot, traditional Porto cooking",
    "Cervejaria Ramiro (Lisbon) — seafood institution, go for the garlic prawns and steak sandwich",
    "O Velho Eurico (Lisbon) — grilled fish in Alcântara, simple and perfect"
  ]},
  { type: "Dinner Worth Splurging", range: "€60–120pp", recs: [
    "Belcanto (Lisbon) — two Michelin stars, José Avillez at his best, book 2-3 months ahead",
    "The Yeatman (Porto) — the most serious wine list in Portugal paired with outstanding food and views over the Douro",
    "Feitoria (Lisbon) — understated, precise, and often overlooked for the bigger names. One Michelin star.",
    "DOP (Porto) — Rui Paula's flagship, the best tasting menu in the north of the country",
    "Prado (Lisbon) — modern Portuguese in Santos, ingredient-focused, excellent natural wine list",
    "Pedro Lemos (Porto) — one Michelin star, chef's table available, exceptional value for this level",
    "100 Maneiras (Lisbon) — creative tasting menu in Bairro Alto, theatrical but never gimmicky"
  ]},
  { type: "Coffee & Pastries", range: "Under €5", recs: [
    "Pastéis de Belém (Lisbon) — the original pastel de nata, non-negotiable, queue is worth it",
    "Manteigaria (Lisbon) — best pastel de nata outside Belém, watch them made through the window",
    "Café Majestic (Porto) — order the coffee, stay for the room, one of the most beautiful cafés in the world",
    "Confeitaria do Bolhão (Porto) — a 150-year-old bakery that still feels exactly like it should",
    "Fabrica Coffee Roasters (Lisbon) — specialty coffee, multiple locations",
    "Zenith Brunch & Cocktails (Porto) — weekend brunch done properly"
  ]},
  { type: "Portuguese Specialties You Must Try", range: "Dishes to seek out", recs: [
    "Bacalhau à Brás — shredded salt cod with eggs and matchstick potatoes, the national dish done a hundred ways",
    "Francesinha (Porto only) — a meat sandwich covered in melted cheese and beer sauce, uniquely Porto",
    "Arroz de marisco — seafood rice, similar to paella but Portuguese. Order at any coastal restaurant.",
    "Polvo à lagareiro — octopus roasted with olive oil and potatoes, simple and perfect",
    "Ameijoas à Bulhão Pato — clams in white wine, garlic, and coriander, order with bread to soak up the sauce",
    "Cozido à Portuguesa — Portuguese stew with meats, sausages, and vegetables, winter comfort food"
  ]},
  { type: "Portuguese Wines to Know", range: "What to drink", recs: [
    "Vinho Verde — light, slightly sparkling white from the Minho region. Don't drink the cheap stuff. Try Soalheiro or Aphros.",
    "Douro reds — Touriga Nacional, powerful and age-worthy. Quinta do Crasto, Niepoort, Quinta do Vale Meão.",
    "Alentejo reds — rounder, more approachable than Douro. Herdade do Esporão, João Portugal Ramos.",
    "Dão whites — mineral, structured. Quinta dos Roques, Quinta de Cabriz.",
    "Port wine — Taylor's, Graham's, Ramos Pinto. Tawny for elegance, Vintage for power.",
    "Vinho regional — don't overlook the table wines. Some of the best value in Europe."
  ]}
];

const portugalStay = [
  { tier: "Under €120/night", label: "Smart & Considered", recs: ["Lisbon Story Guesthouse — boutique guesthouse in Alfama, best value in central Lisbon", "Gallery Hostel (Porto) — the hostel that changed what a hostel can be, private rooms available", "Casa das Pedras (Douro) — simple, family-run quinta stay in the valley, breakfast included"] },
  { tier: "€120–280/night", label: "Well-Chosen Middle", recs: ["Bairro Alto Hotel (Lisbon) — best rooftop bar in the city, great rooms, excellent service", "The Yeatman (Porto) — the wine hotel above the Douro, worth every euro for one night", "Quinta de la Rosa (Douro) — a working quinta with rooms above the river, exceptional wine"] },
  { tier: "€280+/night", label: "Genuinely Exceptional", recs: ["Bela Vista (Algarve) — a converted Belle Époque mansion in Portimão, the most beautiful hotel on the southern coast", "Six Senses Douro Valley — the benchmark for luxury in the valley, extraordinary spa", "Verride Palácio Santa Catarina (Lisbon) — a 17th century palace converted with real taste"] },
];

const portugalLogistics = [
  { q: "When to go", a: "September and October are the best months — harvest season in the Douro, warm but not brutal heat in the south, and shoulder-season prices everywhere. May and June are also excellent." },
  { q: "Getting around", a: "Lisbon and Porto are both walkable and well served by metro, tram, and Uber. Between cities, the train is the best option — fast, cheap, and scenic. For the Alentejo, Algarve, and Douro Valley you'll want a car." },
  { q: "How long you need", a: "Ten days is the sweet spot for a proper Portugal trip — three nights Lisbon, two nights Sintra/Cascais, two nights Porto, three nights Douro. Two weeks lets you add Alentejo or Algarve." },
  { q: "Language", a: "Portuguese is not Spanish. English is widely spoken in Lisbon and Porto. Outside the cities, a few words of Portuguese goes a long way — obrigado (thank you), por favor (please)." },
  { q: "What it costs", a: "Portugal is still genuinely good value. Expect €15–25 for a good meal with wine at a tasca, €40–60 at a mid-range restaurant. A realistic daily budget for two people doing it well — €200–350 per day." },
];

// MAIN APP
export default function Deriva() {
  const [view, setView] = useState("home");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [customAnswers, setCustomAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [customText, setCustomText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Finding your match...");

  function startQuiz() {
    setView("quiz"); setStep(0); setAnswers({});
    setCustomAnswers({}); setSelected(null); setCustomText(""); setResult(null);
  }
  function reset() {
    setView("home"); setStep(0); setAnswers({});
    setCustomAnswers({}); setSelected(null); setCustomText(""); setResult(null);
  }
  function goToPortugal() {
    setView("portugal");
  }

  function pickOption(val) {
    setSelected(val);
    setCustomText("");
  }

  function handleCustomChange(val) {
    setCustomText(val);
    if (val.trim().length > 2) setSelected("__custom__");
    else if (selected === "__custom__") setSelected(null);
  }

  async function goNext() {
    const newAnswers = { ...answers, [step]: selected };
    const newCustom = { ...customAnswers };
    if (selected === "__custom__" && customText.trim()) newCustom[step] = customText.trim();
    setAnswers(newAnswers);
    setCustomAnswers(newCustom);

    if (step < questions.length - 1) {
      setStep(step + 1);
      const nextSel = newAnswers[step + 1] || null;
      setSelected(nextSel);
      setCustomText(newCustom[step + 1] || "");
    } else {
      setLoading(true);
      setView("loading");
      const msgs = [
        "Reading your travel personality...",
        "Scanning 11 destinations...",
        "Finding your perfect match...",
      ];
      let mi = 0;
      const ticker = setInterval(() => { mi++; if (msgs[mi]) setLoadingMsg(msgs[mi]); }, 1400);

      try {
        const prompt = buildMatchPrompt(newAnswers, newCustom);
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 100,
            messages: [{ role: "user", content: prompt }]
          })
        });
        const data = await res.json();
        const text = data.content?.map(b => b.text || "").join("") || "";
        const cleaned = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        const key = parsed.match;
        setResult(allDestinations[key] || allDestinations.basque);
      } catch (e) {
        setResult(getFallbackMatch(newAnswers));
      } finally {
        clearInterval(ticker);
        setLoading(false);
        setView("result");
      }
    }
  }

  function goBack() {
    if (step > 0) {
      setStep(step - 1);
      setSelected(answers[step - 1] || null);
      setCustomText(customAnswers[step - 1] || "");
    } else reset();
  }

  return (
    <div style={{ fontFamily: "Georgia, serif", background: c.cream, color: c.ink, minHeight: "100vh" }}>
      <Nav startQuiz={startQuiz} reset={reset} currentView={view} />
      {view === "home" && <Home startQuiz={startQuiz} />}
      {view === "quiz" && (
        <Quiz step={step} selected={selected} pickOption={pickOption}
          customText={customText} handleCustomChange={handleCustomChange}
          goNext={goNext} goBack={goBack} answers={answers} />
      )}
      {view === "loading" && <LoadingScreen msg={loadingMsg} />}
      {view === "result" && result && <Result result={result} reset={reset} startQuiz={startQuiz} goToPortugal={goToPortugal} />}
      {view === "portugal" && <PortugalPage reset={reset} startQuiz={startQuiz} />}
    </div>
  );
}

function Nav({ startQuiz, reset, currentView }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2.5rem", background: c.deep, position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${c.bark}` }}>
      <div onClick={reset} style={{ fontFamily: "Georgia, serif", fontSize: "1rem", fontWeight: "bold", letterSpacing: "0.28em", textTransform: "uppercase", color: c.cream, cursor: "pointer" }}>Deriva</div>
      <div style={{ display: "flex", gap: "2rem" }}>
        {["Discover", "Our Way", "Updates"].map(l => (
          <span key={l} style={{ fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: c.stone, cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>{l}</span>
        ))}
      </div>
      {currentView !== "portugal" && (
        <button onClick={startQuiz} style={{ fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: c.cream, background: c.bark, border: "none", padding: "0.6rem 1.25rem", cursor: "pointer", fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>
          Find my destination
        </button>
      )}
      {currentView === "portugal" && (
        <button onClick={reset} style={{ fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: c.cream, background: c.bark, border: "none", padding: "0.6rem 1.25rem", cursor: "pointer", fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>
          ← Back to quiz
        </button>
      )}
    </div>
  );
}

function Home({ startQuiz }) {
  const [hovDest, setHovDest] = useState(null);
  const [hovPick, setHovPick] = useState(null);

  return (
    <div>
      <div style={{ background: c.deep, padding: "5rem 2.5rem 4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: c.stone, marginBottom: "2rem", fontFamily: "system-ui, sans-serif" }}>
            <div style={{ width: 24, height: 1, background: c.tan }} />Travel with intent
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2.4rem, 4vw, 4rem)", fontWeight: "normal", lineHeight: 1.1, color: c.cream, marginBottom: "1.5rem" }}>
            Be the first<br />one in your<br /><em style={{ color: c.warm }}>friend group</em><br />to go
          </h1>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: c.stone, maxWidth: 380, marginBottom: "2.5rem", fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>
            Deriva surfaces destinations that look impossible to plan, makes them feel doable, and gives you the inside knowledge to actually do them right.
          </p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button onClick={startQuiz} style={{ background: c.tan, color: c.cream, padding: "0.85rem 1.75rem", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>
              Find your destination
            </button>
            <span style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: c.stone, fontFamily: "system-ui, sans-serif" }}>How it works →</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: c.bark }}>
          {[["7", "Countries"], ["11+", "Curated Matches"], ["0", "Generic Itineraries"], ["1", "Rule: Go with intent"]].map(([n, l], i) => (
            <div key={i} style={{ background: i % 2 === 0 ? c.charcoal : "#332E28", padding: "2rem 1.5rem" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "2.4rem", color: c.warm, lineHeight: 1, marginBottom: "0.5rem" }}>{n}</div>
              <div style={{ fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: c.stone, fontFamily: "system-ui, sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: c.parchment, borderTop: `3px solid ${c.tan}`, borderBottom: `1px solid ${c.sand}` }}>
        <div style={{ padding: "1rem 2.5rem 0.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 16, height: 1, background: c.tan}} />
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: c.mid, fontFamily: "system-ui, sans-serif" }}>Where Deriva goes</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {destList.map((d, i) => (
            <div key={i} onMouseEnter={() => setHovDest(i)} onMouseLeave={() => setHovDest(null)}
              style={{ padding: "1.25rem 1rem", borderRight: i < 6 ? `1px solid ${c.sand}` : "none", background: hovDest === i ? "white" : "transparent", cursor: "pointer", transition: "background 0.2s", borderBottom: hovDest === i ? `2px solid ${c.tan}` : "2px solid transparent" }}>
              <div style={{ fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: c.stone, marginBottom: "0.35rem", fontFamily: "system-ui, sans-serif" }}>{d.region}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: c.ink, marginBottom: "0.2rem" }}>{d.name}</div>
              <div style={{ fontSize: "0.58rem", color: c.mid, fontFamily: "system-ui, sans-serif" }}>{d.tag}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: c.sand, padding: "4rem 2.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", borderBottom: `1px solid ${c.stone}` }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: c.bark, marginBottom: "1.25rem", fontFamily: "system-ui, sans-serif" }}>
            <div style={{ width: 16, height: 1, background: c.bark }} />Destination finder
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "2.4rem", fontWeight: "normal", lineHeight: 1.15, color: c.ink, marginBottom: "1.25rem" }}>
            Where should you<br />actually <em>go?</em>
          </h2>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: c.charcoal, fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>
            Seven questions. One real answer. Not the destination the algorithm keeps showing you — the one that actually fits how you travel, matched to every answer you give.
          </p>
        </div>
        <div style={{ background: c.parchment, padding: "2rem", borderLeft: `3px solid ${c.tan}` }}>
          <div style={{ fontSize: "0.78rem", lineHeight: 1.8, color: c.mid, fontFamily: "system-ui, sans-serif", fontStyle: "italic", marginBottom: "1.5rem" }}>
            "Tell us exactly how you want to feel on this trip — in your own words if you want — and we'll find the destination that fits."
          </div>
          <button onClick={startQuiz} style={{ background: c.ink, color: c.cream, padding: "0.85rem 1.75rem", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "system-ui, sans-serif", width: "100%" }}>
            Start the quiz →
          </button>
        </div>
      </div>

      <div style={{ background: c.charcoal, padding: "4rem 2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
          <div style={{ width: 16, height: 1, background: c.tan }} />
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: c.stone, fontFamily: "system-ui, sans-serif" }}>The Deriva approach</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: c.bark }}>
          {[
            { n: "01", title: "We only go where we'd go", text: "Every destination on Deriva has been lived in, not just researched. If we wouldn't book it ourselves, we don't recommend it." },
            { n: "02", title: "We skip the obvious", text: "Anyone can tell you to see the Colosseum. We tell you which street in Trastevere to walk at 10pm and where to get the wine after." },
            { n: "03", title: "Budget doesn't define taste", text: "We cover the full range — from the best-value stay in the Alentejo to a luxury lodge in Patagonia. Taste is the only filter." },
          ].map((p, i) => (
            <div key={i} style={{ background: i === 1 ? "#302C27" : c.charcoal, padding: "2.5rem 2rem" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "2.8rem", color: "rgba(200,184,154,0.12)", lineHeight: 1, marginBottom: "1.5rem" }}>{p.n}</div>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: c.warm, marginBottom: "0.75rem", fontFamily: "system-ui, sans-serif" }}>{p.title}</div>
              <div style={{ fontSize: "0.82rem", lineHeight: 1.8, color: c.stone, fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>{p.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: c.parchment, padding: "4rem 2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 16, height: 1, background: c.tan }} />
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: c.mid, fontFamily: "system-ui, sans-serif" }}>Deriva picks right now</span>
          </div>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: c.tan, cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>View all →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: c.sand }}>
          {[
            { dest: "Kyoto & Osaka", country: "Japan", season: "Best: March · Nov", desc: "Ancient temples empty at 7am. The world's greatest street food. A sense of ritual in everything.", img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=700&q=80" },
            { dest: "The Douro Valley", country: "Portugal", season: "Best: Sept · Oct", desc: "Terraced vineyards, family quintas, and a pace that genuinely resets you.", img: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=700&q=80" },
            { dest: "Patagonia", country: "Chile", season: "Best: Nov · Mar", desc: "Torres del Paine in autumn. A scale that makes everything else feel small for months after.", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=80" },
          ].map((pick, i) => (
            <div key={i} onMouseEnter={() => setHovPick(i)} onMouseLeave={() => setHovPick(null)} style={{ background: c.parchment, cursor: "pointer" }}>
              <div style={{ height: 180, overflow: "hidden" }}>
                <img src={pick.img} alt={pick.dest} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hovPick === i ? "scale(1.04)" : "scale(1)" }} />
              </div>
              <div style={{ padding: "1.25rem 1.5rem", background: hovPick === i ? "white" : c.parchment, transition: "background 0.2s" }}>
                <div style={{ fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: c.stone, marginBottom: "0.35rem", fontFamily: "system-ui, sans-serif" }}>{pick.country} · {pick.season}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "1.15rem", color: c.ink, marginBottom: "0.5rem" }}>{pick.dest}</div>
                <div style={{ fontSize: "0.75rem", lineHeight: 1.6, color: c.mid, fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>{pick.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: c.bark, padding: "4rem 2.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "2.2rem", fontWeight: "normal", lineHeight: 1.15, color: c.cream, marginBottom: "1rem" }}>Get the <em>inside line</em></h2>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.8, color: "rgba(245,240,232,0.65)", fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>
            Occasional drops. New destinations, hidden spots, and the kind of intel you only get from someone who actually went.
          </p>
        </div>
        <div>
          <div style={{ display: "flex", marginBottom: "0.75rem" }}>
            <input type="email" placeholder="your@email.com" style={{ flex: 1, padding: "0.9rem 1.25rem", border: `1px solid rgba(245,240,232,0.25)`, borderRight: "none", background: "rgba(245,240,232,0.1)", fontFamily: "system-ui, sans-serif", fontSize: "0.85rem", color: c.cream, outline: "none" }} />
            <button style={{ padding: "0.9rem 1.5rem", background: c.cream, color: c.ink, border: "none", fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>I'm in</button>
          </div>
          <p style={{ fontSize: "0.68rem", color: "rgba(245,240,232,0.4)", fontFamily: "system-ui, sans-serif" }}>No spam. No algorithm. Just good trips, occasionally.</p>
        </div>
      </div>

      <div style={{ background: c.deep, padding: "2rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${c.bark}` }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontWeight: "bold", letterSpacing: "0.25em", textTransform: "uppercase", fontSize: "0.9rem", color: c.cream }}>Deriva</div>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", color: c.stone, fontFamily: "system-ui, sans-serif", marginTop: "0.2rem" }}>Travel with intent</div>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Instagram", "About", "Contact"].map(l => (
            <span key={l} style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: c.stone, cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Quiz({ step, selected, pickOption, customText, handleCustomChange, goNext, goBack, answers }) {
  const [hov, setHov] = useState(null);
  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;
  const canContinue = selected && (selected !== "__custom__" || customText.trim().length > 2);

  return (
    <div style={{ background: c.parchment, minHeight: "calc(100vh - 60px)", padding: "3rem 2.5rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: c.mid, fontFamily: "system-ui, sans-serif", whiteSpace: "nowrap" }}>Your match</span>
          <div style={{ flex: 1, height: 2, background: c.sand }}>
            <div style={{ height: "100%", width: `${progress}%`, background: c.tan, transition: "width 0.4s" }} />
          </div>
          <span style={{ fontSize: "0.6rem", color: c.stone, fontFamily: "system-ui, sans-serif", whiteSpace: "nowrap" }}>{step + 1} of {questions.length}</span>
        </div>

        <div style={{ background: "white", border: `1px solid ${c.sand}` }}>
          <div style={{ padding: "1.25rem 2rem", background: c.parchment, borderBottom: `1px solid ${c.sand}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: c.mid, fontFamily: "system-ui, sans-serif" }}>Destination finder</span>
            <span style={{ fontSize: "0.6rem", color: c.stone, fontFamily: "system-ui, sans-serif" }}>Step {step + 1} of {questions.length}</span>
          </div>

          <div style={{ padding: "2rem 2rem 1.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: c.tan, marginBottom: "0.6rem", fontFamily: "system-ui, sans-serif" }}>
              <div style={{ width: 12, height: 1, background: c.tan }} />{q.label}
            </div>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.45rem", fontWeight: "normal", color: c.ink, marginBottom: "0.4rem", lineHeight: 1.25 }}>{q.q}</h3>
            <p style={{ fontSize: "0.72rem", color: c.stone, marginBottom: "1.75rem", fontFamily: "system-ui, sans-serif" }}>{q.sub}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
              {q.opts.map((opt) => {
                const isSel = selected === opt.val;
                const isHov = hov === opt.val && !isSel;
                return (
                  <button key={opt.val} onClick={() => pickOption(opt.val)}
                    onMouseEnter={() => setHov(opt.val)} onMouseLeave={() => setHov(null)}
                    style={{ padding: "0.9rem 1.1rem", border: isSel ? `1px solid ${c.ink}` : `1px solid ${c.sand}`, background: isSel ? c.ink : isHov ? c.parchment : "white", color: isSel ? c.cream : c.charcoal, textAlign: "left", cursor: "pointer", fontFamily: "system-ui, sans-serif", fontSize: "0.8rem", fontWeight: 300, lineHeight: 1.35, transition: "all 0.18s" }}>
                    {opt.text}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              <div style={{ fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: c.stone, marginBottom: "0.5rem", fontFamily: "system-ui, sans-serif" }}>
                Or describe it in your own words
              </div>
              <textarea
                value={customText}
                onChange={e => handleCustomChange(e.target.value)}
                placeholder="Type anything — 'I want to feel like I'm in a movie', 'somewhere with incredible wine and no tourists'..."
                style={{
                  width: "100%", padding: "0.85rem 1rem", border: selected === "__custom__" ? `1px solid ${c.tan}` : `1px solid ${c.sand}`,
                  background: selected === "__custom__" ? "#FFFDF9" : "white", fontFamily: "system-ui, sans-serif", fontSize: "0.8rem",
                  color: c.charcoal, lineHeight: 1.5, resize: "none", outline: "none", height: 72,
                  transition: "border-color 0.2s", boxSizing: "border-box"
                }}
              />
              {selected === "__custom__" && customText.trim().length > 2 && (
                <div style={{ fontSize: "0.6rem", color: c.tan, marginTop: "0.3rem", fontFamily: "system-ui, sans-serif", fontStyle: "italic" }}>
                  We'll use your own words to find your match
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: "1.25rem 2rem", background: c.parchment, borderTop: `1px solid ${c.sand}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={goBack} style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: c.mid, background: "none", border: "none", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>
              ← {step === 0 ? "Home" : "Back"}
            </button>
            <button onClick={goNext} disabled={!canContinue}
              style={{ padding: "0.75rem 1.75rem", background: canContinue ? c.ink : c.sand, color: c.cream, border: "none", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: canContinue ? "pointer" : "not-allowed", fontFamily: "system-ui, sans-serif", transition: "background 0.2s" }}>
              {step === questions.length - 1 ? "Find my match →" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen({ msg }) {
  return (
    <div style={{ background: c.deep, minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ width: 48, height: 48, border: `2px solid ${c.bark}`, borderTop: `2px solid ${c.tan}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", color: c.cream, marginBottom: "0.75rem", fontWeight: "normal" }}>Finding your match</div>
      <div style={{ fontSize: "0.75rem", color: c.stone, fontFamily: "system-ui, sans-serif", letterSpacing: "0.08em", transition: "opacity 0.4s" }}>{msg}</div>
      <div style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.tan, opacity: 0.4 }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.tan, opacity: 0.7 }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.tan }} />
      </div>
    </div>
  );
}

function Result({ result, reset, startQuiz, goToPortugal }) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const isPortugal = result.country === "Portugal";

  return (
    <div style={{ background: c.parchment, minHeight: "calc(100vh - 60px)" }}>
      <div style={{ position: "relative", height: 420, overflow: "hidden", background: c.charcoal }}>
        <img src={result.photos.hero} alt={result.city} onLoad={() => setHeroLoaded(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: heroLoaded ? 1 : 0, transition: "opacity 0.8s" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,20,14,0.82) 0%, rgba(26,20,14,0.2) 55%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2.5rem 3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: c.warm, marginBottom: "0.6rem", fontFamily: "system-ui, sans-serif" }}>
            <div style={{ width: 16, height: 1, background: c.tan }} />Your Deriva match · {result.country}
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "3rem", fontWeight: "normal", color: "white", lineHeight: 1.05, marginBottom: "0.3rem" }}>{result.city}</h2>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: c.warm, fontFamily: "system-ui, sans-serif" }}>{result.vibe}</div>
        </div>
      </div>

      <div style={{ padding: "3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "3rem", alignItems: "start" }}>
          <div>
            <div style={{ width: 32, height: 1, background: c.tan, marginBottom: "1.5rem" }} />
            <p style={{ fontSize: "0.9rem", lineHeight: 1.85, color: c.charcoal, marginBottom: "1.5rem", fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>{result.why}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "2rem" }}>
              {result.tags.map(t => (
                <span key={t} style={{ fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: c.mid, border: `1px solid ${c.sand}`, padding: "0.3rem 0.7rem", fontFamily: "system-ui, sans-serif" }}>{t}</span>
              ))}
            </div>
            <div style={{ padding: "1.25rem 1.5rem", background: c.deep, borderLeft: `3px solid ${c.tan}`, marginBottom: "2rem" }}>
              <div style={{ fontSize: "0.56rem", letterSpacing: "0.25em", textTransform: "uppercase", color: c.tan, marginBottom: "0.5rem", fontFamily: "system-ui, sans-serif" }}>Deriva insider tip</div>
              <div style={{ fontSize: "0.82rem", lineHeight: 1.75, color: c.stone, fontStyle: "italic", fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>{result.insider}</div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {isPortugal ? (
                <button onClick={goToPortugal} style={{ flex: 1, padding: "0.9rem", background: c.ink, color: c.cream, fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, border: "none", cursor: "pointer" }}>
                  Plan this trip →
                </button>
              ) : (
                <button style={{ flex: 1, padding: "0.9rem", background: c.sand, color: c.mid, fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, border: "none", cursor: "not-allowed" }}>
                  Full guide coming soon
                </button>
              )}
              <button onClick={startQuiz} style={{ padding: "0.9rem 1.25rem", background: "transparent", color: c.mid, fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", border: `1px solid ${c.sand}`, cursor: "pointer" }}>
                Try again
              </button>
              <button onClick={reset} style={{ padding: "0.9rem 1.25rem", background: "transparent", color: c.mid, fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", border: `1px solid ${c.sand}`, cursor: "pointer" }}>
                Home
              </button>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ width: 16, height: 1, background: c.tan }} />
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: c.mid, fontFamily: "system-ui, sans-serif" }}>A taste of {result.city}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {result.photos.grid.map((photo, i) => (
                <div key={i} style={{ position: "relative", overflow: "hidden", paddingBottom: "100%", background: c.sand }}>
                  <img src={photo.url} alt={photo.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.4rem 0.5rem", background: "linear-gradient(to top, rgba(26,20,14,0.8), transparent)" }}>
                    <div style={{ fontSize: "0.5rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,240,232,0.9)", fontFamily: "system-ui, sans-serif" }}>{photo.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1rem", padding: "1.25rem", background: c.charcoal }}>
              <div style={{ fontSize: "0.56rem", letterSpacing: "0.22em", textTransform: "uppercase", color: c.stone, marginBottom: "0.75rem", fontFamily: "system-ui, sans-serif" }}>
                {isPortugal ? "Full Portugal guide ready" : "Full guide — coming soon"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {["Where to eat & drink", "Where to stay", "How to get there", "Neighbourhood guide"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: c.tan, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.62rem", color: c.stone, fontFamily: "system-ui, sans-serif" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortugalPage({ reset, startQuiz }) {
  const [activeSection, setActiveSection] = useState("regions");
  const [activeRegion, setActiveRegion] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: c.cream }}>
      <div style={{ position: "relative", height: 500, overflow: "hidden", background: c.charcoal }}>
        <img src="https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1400&q=85" alt="Portugal"
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,20,14,0.88) 0%, rgba(26,20,14,0.3) 50%, rgba(26,20,14,0.1) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: c.warm, marginBottom: "0.75rem", fontFamily: "system-ui, sans-serif" }}>
            <div style={{ width: 20, height: 1, background: c.tan }} />Southern Europe · Deriva Destination Guide
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: "normal", color: "white", lineHeight: 1, marginBottom: "1rem" }}>Portugal</h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(245,240,232,0.75)", maxWidth: 560, lineHeight: 1.75, fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>
            The country everyone says changed their life, and then can't fully explain why. Something in the light. Something in the wine.
          </p>
        </div>
      </div>

      <div style={{ background: c.deep, padding: "4rem 3rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
            <div style={{ width: 20, height: 1, background: c.tan }} />
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: c.stone, fontFamily: "system-ui, sans-serif" }}>The Deriva take</span>
          </div>
          <p style={{ fontSize: "1rem", lineHeight: 1.9, color: "rgba(245,240,232,0.75)", marginBottom: "1.5rem", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
            "Portugal is one of those rare places where the further you get from the obvious, the better it gets. Lisbon is the entry point — beautiful, worth your time. But the country reveals itself slowly, in the back streets of Porto, in a quinta dining room in the Douro, in a village in the Alentejo where lunch runs until five and nobody seems bothered."
          </p>
        </div>
      </div>

      <div style={{ background: c.parchment, borderBottom: `1px solid ${c.sand}`, position: "sticky", top: 60, zIndex: 40 }}>
        <div style={{ display: "flex", padding: "0 3rem" }}>
          {["regions", "eat & drink", "where to stay", "logistics"].map(s => (
            <button key={s} onClick={() => setActiveSection(s)}
              style={{ padding: "1.1rem 1.5rem", background: "transparent", border: "none", borderBottom: activeSection === s ? `2px solid ${c.tan}` : "2px solid transparent", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: activeSection === s ? c.ink : c.mid, cursor: "pointer", fontFamily: "system-ui, sans-serif", fontWeight: activeSection === s ? 500 : 400, transition: "all 0.2s", marginBottom: -1 }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* REGIONS */}
      {activeSection === "regions" && (
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>
          <div style={{ background: c.parchment, borderRight: `1px solid ${c.sand}`, padding: "2rem 0", position: "sticky", top: 120, height: "calc(100vh - 120px)", overflowY: "auto" }}>
            {portugalRegions.map((r, i) => (
              <button key={i} onClick={() => setActiveRegion(i)}
                style={{ display: "block", width: "100%", padding: "1rem 1.5rem", background: activeRegion === i ? "white" : "transparent", border: "none", borderLeft: activeRegion === i ? `3px solid ${c.tan}` : "3px solid transparent", textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem", color: activeRegion === i ? c.ink : c.mid, marginBottom: "0.2rem" }}>{r.name}</div>
                <div style={{ fontSize: "0.56rem", letterSpacing: "0.1em", color: c.stone, fontFamily: "system-ui, sans-serif" }}>{r.tag}</div>
              </button>
            ))}
          </div>

          <div style={{ background: "white" }}>
            <div style={{ height: 280, overflow: "hidden", position: "relative" }}>
              <img src={portugalRegions[activeRegion].img} alt={portugalRegions[activeRegion].name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,20,14,0.6) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, padding: "1.5rem 2rem" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "2.2rem", fontWeight: "normal", color: "white", lineHeight: 1 }}>{portugalRegions[activeRegion].name}</h2>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: c.warm, fontFamily: "system-ui, sans-serif", marginTop: "0.3rem" }}>{portugalRegions[activeRegion].tag}</div>
              </div>
            </div>

            <div style={{ padding: "2.5rem 2.5rem 2rem" }}>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.85, color: c.charcoal, marginBottom: "2.5rem", fontFamily: "system-ui, sans-serif", fontWeight: 300, borderLeft: `3px solid ${c.tan}`, paddingLeft: "1.25rem" }}>
                {portugalRegions[activeRegion].intro}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 16, height: 1, background: c.tan }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: c.mid, fontFamily: "system-ui, sans-serif" }}>What to know</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: portugalRegions[activeRegion].highlights.length > 2 ? "1fr 1fr" : "1fr", gap: "1px", background: c.sand }}>
                {portugalRegions[activeRegion].highlights.map((h, i) => (
                  <div key={i} style={{ background: "white", padding: "1.5rem" }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: c.tan, marginBottom: "0.5rem", fontFamily: "system-ui, sans-serif" }}>{h.label}</div>
                    <div style={{ fontSize: "0.82rem", lineHeight: 1.75, color: c.mid, fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>{h.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EAT & DRINK */}
      {activeSection === "eat & drink" && (
        <div style={{ padding: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
            <div style={{ width: 20, height: 1, background: c.tan }} />
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: c.mid, fontFamily: "system-ui, sans-serif" }}>Where to eat & drink</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: c.sand, marginBottom: "3rem" }}>
            {portugalEatDrink.map((cat, i) => (
              <div key={i} style={{ background: i % 2 === 0 ? c.parchment : "white", padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                  <div>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", color: c.ink, marginBottom: "0.3rem" }}>{cat.type}</div>
                    <div style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: c.tan, fontFamily: "system-ui, sans-serif" }}>{cat.range}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {cat.recs.map((r, j) => (
                    <div key={j} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: c.tan, flexShrink: 0, marginTop: "0.5rem" }} />
                      <div style={{ fontSize: "0.82rem", lineHeight: 1.65, color: c.charcoal, fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>{r}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: c.deep, padding: "2.5rem 3rem", borderLeft: `3px solid ${c.tan}`, maxWidth: 680 }}>
            <div style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: c.tan, marginBottom: "0.75rem", fontFamily: "system-ui, sans-serif" }}>Deriva on Portuguese wine</div>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: c.stone, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
              "Portuguese wine is one of the great undervalued stories in the wine world. The country has dozens of indigenous grape varieties found nowhere else, and producers making genuinely world-class wine at prices that would embarrass their French and Italian equivalents."
            </p>
          </div>
        </div>
      )}

      {/* WHERE TO STAY */}
      {activeSection === "where to stay" && (
        <div style={{ padding: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
            <div style={{ width: 20, height: 1, background: c.tan }} />
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: c.mid, fontFamily: "system-ui, sans-serif" }}>Where to stay</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: c.sand }}>
            {portugalStay.map((tier, i) => (
              <div key={i} style={{ background: i === 1 ? c.parchment : "white", padding: "2rem" }}>
                <div style={{ fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: c.tan, marginBottom: "0.5rem", fontFamily: "system-ui, sans-serif" }}>{tier.tier}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", color: c.ink, marginBottom: "1.5rem" }}>{tier.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {tier.recs.map((r, j) => {
                    const [name, ...rest] = r.split(" — ");
                    return (
                      <div key={j} style={{ paddingBottom: "1rem", borderBottom: j < tier.recs.length - 1 ? `1px solid ${c.sand}` : "none" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: c.charcoal, marginBottom: "0.3rem", fontFamily: "system-ui, sans-serif" }}>{name}</div>
                        <div style={{ fontSize: "0.75rem", lineHeight: 1.6, color: c.mid, fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>{rest.join(" — ")}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOGISTICS */}
      {activeSection === "logistics" && (
        <div style={{ padding: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
            <div style={{ width: 20, height: 1, background: c.tan }} />
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: c.mid, fontFamily: "system-ui, sans-serif" }}>How to do it</span>
          </div>
          <div style={{ maxWidth: 720 }}>
            {portugalLogistics.map((item, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "2rem", padding: "2rem 0", borderBottom: i < portugalLogistics.length - 1 ? `1px solid ${c.sand}` : "none", alignItems: "start" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: c.ink, lineHeight: 1.3 }}>{item.q}</div>
                <div style={{ fontSize: "0.88rem", lineHeight: 1.85, color: c.charcoal, fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: c.bark, padding: "4rem 3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: "normal", color: c.cream, lineHeight: 1.15, marginBottom: "1rem" }}>
            Ready to plan <em>your</em> Portugal trip?
          </div>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.8, color: "rgba(245,240,232,0.65)", fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>
            Explore all regions, find where to eat and stay at every budget level, and get the logistics you actually need.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button onClick={startQuiz} style={{ padding: "1rem 2rem", background: c.cream, color: c.ink, border: "none", fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
            Take the Deriva quiz →
          </button>
          <button style={{ padding: "1rem 2rem", background: "transparent", color: "rgba(245,240,232,0.6)", border: `1px solid rgba(245,240,232,0.25)`, fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>
            Get the Deriva newsletter
          </button>
        </div>
      </div>

      <div style={{ background: c.deep, padding: "2rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${c.bark}` }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontWeight: "bold", letterSpacing: "0.25em", textTransform: "uppercase", fontSize: "0.9rem", color: c.cream }}>Deriva</div>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", color: c.stone, fontFamily: "system-ui, sans-serif", marginTop: "0.2rem" }}>Travel with intent</div>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["All Destinations", "The Quiz", "Instagram", "About"].map(l => (
            <span key={l} style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: c.stone, cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
