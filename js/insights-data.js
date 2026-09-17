/**
 * Terranova editorial catalog — the only place to add or edit articles.
 *
 * TO PUBLISH
 *   1. Choose articleType: "insight" | "case" | "perspective"
 *   2. Fill title, deck, category, date, heroImage
 *   3. Add a short intro and a few sections (layout controls rhythm)
 *   4. Add a brief conclusion, relatedService, optional relatedArticles
 *   5. Save this file. Do not edit HTML or CSS for a single article.
 *
 * LAYOUTS
 *   text | text-image | image-text | full-image | two-images |
 *   before-after | quote | key-thought
 *
 * Keep pieces short: a few hundred words, one hero image, only the
 * information the reader needs.
 */
window.PS_SERVICES = {
  exposure: {
    id: "exposure",
    title: "Territorial Exposure Assessment",
    url: "exposure-assessment.html",
  },
  response: {
    id: "response",
    title: "Operational Disruption Response",
    url: "disruption-response.html",
  },
  recovery: {
    id: "recovery",
    title: "Strategic Territorial Recovery",
    url: "territorial-recovery.html",
  },
};

window.PS_INSIGHTS = [
  {
    slug: "rising-temperatures-economic-impact-alpine-business",
    articleType: "insight",
    category: "territorial-risk",
    title: "How rising temperatures are economically impacting business in the Alps",
    deck: "Heat arrives as insured loss, closed lifts and red zones. The operating year is already being repriced.",
    excerpt: "Alpine warming is no longer only a hazard story. It is showing up in destroyed villages, suspended ascents, ski-lift repairs and towns that cannot rebuild.",
    date: "2026-09-17",
    updated: "2026-09-17",
    readingTime: 5,
    author: { name: "Terranova Strategy", role: "Territorial strategy" },
    heroImage: {
      src: "assets/images/Swiss%20Manufcaturing%20Exposure%201.jpg",
      alt: "Manufacturing plant, railway and settlement in an Alpine valley with high peaks beyond",
      caption: "The slope fails at elevation. The bill is paid on the valley floor, where the operation actually sits.",
    },
    countries: ["CH", "AT", "IT", "FR", "DE"],
    regions: ["Europe"],
    topics: ["Climate Risk", "Territorial Exposure", "Infrastructure", "Operational Resilience"],
    global: false,
    globalRelevance: 0.58,
    editorialRelevance: 0.93,
    featured: true,
    intro: "Rising temperatures in the European Alps are no longer a background climate trend. They are being booked as reconstruction, business interruption, stranded beds and seasons that cannot be sold. The physics is thawing permafrost, rockfall and debris flow. The P&L is buildings, lifts, guides and hotels.",
    sections: [
      {
        title: "The losses already on the books",
        layout: "text-image",
        text: [
          "When a high slope fails, the invoice is issued in the valley. The 2025 Birch glacier collapse above Blatten in Valais produced about CHF 255 million in insured loss, of which about CHF 210 million was buildings. An earlier estimate put business interruption and vehicles at a further tens of millions. The village was largely destroyed. That is a territorial event with a corporate and municipal balance sheet.",
          "The 2017 Piz Cengalo–Bondo cascade in Graubünden damaged 99 buildings, a third of them destroyed, at about CHF 41 million. Eight people died. The municipality of Bregaglia faced around CHF 20 million in infrastructure and emergency costs before reconstruction was finished. Fluchthorn in Tyrol in 2023 and Piz Scerscen in 2024 have not yet produced comparable published loss totals. They show the same process chain moving east along the arc.",
          "Kandersteg has not had a Blatten. It is already paying. Canton and commune have spent about CHF 11 million on dams, nets and monitoring below the Spitze Stei. A building ban covers much of the village. Five applications worth about CHF 3.5 million were rejected in a single round. If the temporary red zone becomes the hazard map, the commune estimates that 60% of hotel beds would sit inside it. The mayor’s phrase was economic collapse of a tourism destination — without the mountain having fallen.",
        ],
        image: {
          src: "assets/images/territorial-disruption.jpg",
          alt: "Settlement and river valley severely affected by a destructive debris flow",
          caption: "A high-elevation failure is paid for as buildings, interruption and a valley that cannot be used as before.",
        },
      },
      {
        title: "Mont Blanc, summer 2026",
        layout: "text",
        text: [
          "Chamonix and Courmayeur sell access to the highest ground in the Alps. In summer 2026 that access was interrupted by heat. Around 450 significant rockfalls were expected in the Mont Blanc massif. On 12 August a collapse of about 15,000 m³ came off the north face of the Aiguille du Midi, close to the cable-car alignment. The Compagnie du Mont-Blanc ordered a geotechnical inspection. The ice tunnel used by mountaineers to reach the ridge had already been closed. The mayor of Saint-Gervais shut the Goûter and Tête Rousse refuges on the normal route. Guides on the Chamonix–Saint-Gervais side, and on the Courmayeur side, suspended ascents.",
          "A published loss total for the 2026 season is not yet available. The scale of the corridor is. The Aiguille du Midi takes on the order of 500,000 visitors a year. The Compagnie du Mont-Blanc turns over about €156 million, with summer sites a growing share of that figure. French Alpine ski resorts support about 105,000 jobs. The cancelled product is not only a summit. It is guiding days, refuge nights, lift tickets and the hotels that sit under a massif that no longer behaves as the brochure assumed.",
        ],
      },
      {
        title: "The slow bill on the high ground",
        layout: "text",
        text: [
          "Most Alpine businesses will not be buried. They will be repaired, rerouted or restricted. French inventories place about 1,000 infrastructure elements on modelled permafrost, and 1,769 in permafrost or glacier-retreat terrain. Three-quarters are ski lifts. About 10% already carry a high destabilisation score. Recorded damage cases doubled between 2010 and 2018 relative to the previous decade. The concentration is in the Vanoise, Écrins–Oisans and Mont Blanc — Val Thorens, Tignes, Val d’Isère, La Plagne, Les Arcs, Les Deux Alpes, Alpe d’Huez, La Grave and Chamonix.",
          "In Switzerland, about 15% of mountain-railway installations — 288 of 1,894 in the last national count — are anchored in permafrost. More than a third of the Swiss Alpine Club’s 152 huts are judged endangered by thaw; another 42 sit under landslide runout from permafrost slopes. Climate-related hut works are estimated at CHF 5–7 million a year through 2040, more than CHF 100 million in total. A replacement hut now costs CHF 4–5 million. That is not catastrophe insurance. It is capex that used to be optional.",
        ],
      },
      {
        layout: "key-thought",
        quote: "Heat arrives in the accounts as closed lifts, red zones and cancelled seasons — long before it appears as a climate line in the annual report.",
      },
      {
        title: "What the forecasts say about places not yet hit",
        layout: "text",
        text: [
          "There is no Alps-wide forecast of permafrost-related business loss. The local ones describe valleys that are still open. In the Dorfbach torrent in Valais, warming and thaw alone are projected to raise modelled risk costs by 238%. Nine in ten French high-mountain installations have not yet been scored as high risk — and even the high-risk tenth has mostly not failed. Kandersteg’s 60% of hotel beds sit in a zone that could close the destination without the mountain falling. The next invoice is waiting in catchments and resorts that still look open.",
        ],
      },
    ],
    conclusion: {
      text: "The economic impact of rising Alpine temperatures is already visible in two ledgers: the catastrophic one, paid after Blatten and Bondo, and the operating one, paid in inspections, red zones and seasons that cannot be delivered. Exposure assessment that stops at the last event will miss the second ledger — which is where most Alpine businesses actually sit.",
    },
    relatedService: {
      id: "exposure",
      note: "Territorial Exposure Assessment places slope, torrent and access hazards with the operations, assets and seasons they can take off the books.",
    },
    relatedArticles: ["permafrost-exposure-risk-alpine-regions", "geography-of-global-supply-chains"],
  },
  {
    slug: "permafrost-exposure-risk-alpine-regions",
    articleType: "insight",
    category: "natural-hazards",
    title: "What does Permafrost exposure risk mean for alpine regions?",
    deck: "Thawing ground in the high Alps does not stay on the summit. It arrives in the valley as rockfall, debris flow and closed corridors.",
    excerpt: "Alpine permafrost is mostly invisible, and it is warming. The operational question is not the temperature of the peak. It is which valleys, crossings and settlements sit in the path of the cascade.",
    date: "2026-09-17",
    updated: "2026-09-17",
    readingTime: 3,
    author: { name: "Terranova Strategy", role: "Territorial strategy" },
    heroImage: {
      src: "assets/images/Blatten%202.avif",
      alt: "The village of Blatten in the Lötschental after the 2025 rock-ice avalanche",
      caption: "The failure started on the high ground. The exposure sat in the village.",
    },
    countries: ["CH", "AT", "IT", "FR", "DE"],
    regions: ["Europe"],
    topics: ["Climate Risk", "Natural Hazards", "Territorial Exposure", "Infrastructure", "Operational Resilience"],
    global: false,
    globalRelevance: 0.62,
    editorialRelevance: 0.94,
    featured: true,
    intro: "In the European Alps, permafrost is a thermal condition of the high ground: rock, scree and debris at or below 0 °C for at least two consecutive years. It underlies roughly 6,200 km² of the Alpine arc — about three times the remaining glacier area — and is almost never visible from the valley floor. What is becoming visible is its warming: slopes that lose cohesion, rock faces that fail in heatwaves, and process chains that travel kilometres downstream.",
    sections: [
      {
        title: "Ground that stays frozen — until it does not",
        layout: "text",
        text: "Permafrost is defined thermally, not by ice you can see. In the Alps it is mostly sporadic or discontinuous, typically above 2,500–2,600 m, in bedrock walls, talus, moraines and rock glaciers. Ice in fractures acts as a binder: as it warms toward 0 °C it loses shear strength, and meltwater raises hydrostatic pressure in the same discontinuities. The Alpine Permafrost Index Map estimates about 2,160 km² of likely permafrost in Switzerland, 1,790 km² in Italy, 1,560 km² in Austria and 700 km² in France, with only a few square kilometres in Bavaria. Later Swiss mapping puts the actual frozen area at 3–5% of the country, still larger than the glacier cover. The hazard scales with steepness, ice content and what sits in the valley below.",
      },
      {
        title: "Heat is already inside the ground",
        layout: "text",
        text: "Alpine air temperatures have risen fastest at elevation. The 2022–2024 summers sit among the warmest on the Swiss record, and the ground has followed. Mean warming at 10 m depth reached about 0.36 °C per decade in the Alps during 2013–2022; cold, ice-poor bedrock warms at rates comparable to the air — in places above 1 °C per decade. Ice-rich ground near 0 °C looks quieter only because latent heat is consumed melting ice. PERMOS recorded the warmest permafrost in 25 years of Swiss monitoring in hydrological 2024, with 10 m temperatures up by more than 0.8 °C over 2014–2025. Swiss Alpine permafrost lost about 15% of its ice between 2015 and 2022. At Aiguille du Midi, PermaFrance measured about 1.1 °C of warming and an active-layer thickening of up to 2.1 m. Heatwaves in 2003, 2015 and 2022 were followed by spikes in high-elevation rockfall.",
      },
      {
        title: "Thaw becomes a disruption trigger",
        layout: "text-image",
        text: [
          "The failure rarely stays on the peak. Rockfall can entrain glacier ice, saturate debris and become a debris flow or flash flood on the valley floor. In the eastern Alps, 76% of inventoried rockfalls occurred where mean annual ground-surface temperature is below 0 °C — only 22% of the potential rockfall area. Rock glaciers have accelerated as ground ice warms. The sequence is documented: Piz Cengalo–Bondo in 2017, around 3 million m³ of rock into Bondo; Fluchthorn in 2023; Piz Scerscen in 2024; and the 2025 Birch glacier collapse above Blatten, prepared by permafrost-related rockfall on Kleines Nesthorn.",
          "Mont Blanc models project about 1 °C of warming at 35 m by 2050, and roughly 3 ± 1.3 °C by 2100 under high emissions, with thaw from most Alpine rock walls except shaded faces above 4,000 m. Narrow peaks below about 3,850 m may lose permafrost entirely. Debris-flow magnitude can still rise as the active layer thickens. The thermal signal already in the upper metres will keep propagating downward for decades.",
        ],
        image: {
          src: "assets/images/territorial-disruption.jpg",
          alt: "Settlement and river valley severely affected by a destructive debris flow",
          caption: "The cascade does not stop at the scarp. Rock, ice and water follow the torrent to the places the operation actually uses.",
        },
      },
      {
        layout: "key-thought",
        quote: "Permafrost exposure is not a summit condition. It is a valley condition: which corridors, plants and settlements sit in the path of a slope that is losing its binder.",
      },
      {
        title: "Where the Alps are most exposed",
        layout: "text",
        text: [
          "Switzerland holds the largest Alpine permafrost area. Valais is the centre of gravity: Zermatt and Saas-Fee, the Lötschental, the Rhône corridor through Visp and Brig, and torrents such as Ritigraben above Grächen. Graubünden follows: the Engadin around St. Moritz, the Bregaglia, and the ridges above Davos. The Bernese Alps expose Grindelwald, Kandersteg and the Lötschberg axis; Uri and Glarus sit under the Tödi group. Ticino has a smaller high-Alpine footprint but about 9.4% of its territory in modelled permafrost.",
          "In France: Haute-Savoie (Mont Blanc, Chamonix), Savoie (Vanoise), and the Écrins–Oisans in Isère and Hautes-Alpes. In Italy: Valle d'Aosta around Courmayeur, then South Tyrol — nearly 2,800 mapped rock glaciers, about 500 still active — with Trentino and the Lombard high valleys behind. In Austria, Tyrol (Ötztal, Stubai, Innsbruck), Vorarlberg and the Hohe Tauern in Salzburg and Carinthia hold most of the country's ~1,560 km². Bavaria’s frozen ground is small and concentrated around the Zugspitze. The strategic places are the nodes that cannot reroute: Chamonix and Courmayeur; Zermatt, Visp and Brig; St. Moritz; Innsbruck; Bolzano and Aosta. A closed crossing, a buried torrent fan or a cut access road is how the risk shows up in an operating year.",
        ],
      },
    ],
    conclusion: {
      text: "Permafrost exposure risk is the chance that a thermal change in high, frozen ground becomes a mass movement that closes a valley. The assessment that matters places slope, torrent, road, rail and settlement in the same picture — and asks which of those links cannot be lost.",
    },
    relatedService: {
      id: "exposure",
      note: "Territorial Exposure Assessment places permafrost-related slope and torrent hazards with the access, energy and settlement dependencies they can close.",
    },
    relatedArticles: ["rising-temperatures-economic-impact-alpine-business", "wildfire-risk-southern-europe"],
  },
  {
    slug: "wildfire-risk-southern-europe",
    articleType: "insight",
    category: "natural-hazards",
    title: "Wildfire risk across Southern Europe",
    deck: "Fire seasons now reach infrastructure, logistics and inhabited land that planning still treats as background landscape.",
    excerpt: "Southern European wildfire is no longer a seasonal rural event. It is becoming a recurring territorial condition that reaches energy assets, transport corridors and operational continuity.",
    date: "2026-08-21",
    readingTime: 3,
    heroImage: {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
      alt: "Sunlit mountain terrain under a high, dry sky",
      caption: "The operational question is not only ignition. It is which corridors close when fire weather holds.",
    },
    countries: ["ES", "IT", "FR", "PT", "GR"],
    regions: ["Europe"],
    topics: ["Climate Risk", "Natural Hazards", "Infrastructure", "Operational Resilience"],
    globalRelevance: 0.55,
    editorialRelevance: 0.78,
    intro: "Wildfire in Southern Europe is still often framed as a civil-protection problem: hectares burned, villages evacuated, a season that ends with the rains. For operators of energy, transport and logistics, fire is becoming a territorial operating condition — recurring, spatially uneven, and capable of interrupting systems never designed around it.",
    sections: [
      {
        title: "Continuity fails around the fire, not only in it",
        layout: "text",
        text: "Ignition and burnt area dominate public reporting. Continuity fails through secondary effects: road closures, smoke on flight paths, grid switching, staff unable to reach sites, and suppliers in the same corridor going offline together. A facility that does not burn can still lose a week because the territory around it is closed.",
      },
      {
        title: "Look for coincident disruption",
        layout: "text",
        text: "The useful analysis is territorial rather than site-centric. Which assets share a single access spine. Which backup sites sit in the same fire-weather domain. Which counterparties fail together. That picture of coincident disruption is what single-site fire plans are not built to show.",
      },
      {
        layout: "key-thought",
        quote: "Fire risk becomes strategic when it can close a corridor, not only when it can consume a building.",
      },
    ],
    conclusion: {
      text: "Adaptation here is not a generic climate policy. It is a set of siting, access, redundancy and seasonal operating decisions made against a hazard that is already inside the working year.",
    },
    relatedService: {
      id: "exposure",
      note: "Territorial Exposure Assessment places fire, access and energy dependencies in the same territorial picture.",
    },
    relatedArticles: ["rising-temperatures-economic-impact-alpine-business", "permafrost-exposure-risk-alpine-regions"],
  },
  {
    slug: "geography-of-global-supply-chains",
    articleType: "perspective",
    category: "geopolitics",
    title: "The changing geography of global supply chains",
    deck: "Supply-chain risk is being re-territorialised: chokepoints, climate corridors and political geography now set the shape of lead times.",
    excerpt: "Global supply chains are not abstract networks. They run through territories that flood, congest, close and get politicised — and those territories are moving.",
    date: "2026-06-03",
    updated: "2026-06-18",
    readingTime: 4,
    author: { name: "Terranova Strategy", role: "Territorial strategy" },
    heroImage: {
      src: "assets/images/Territorial%20strategy%20Japan.jpg",
      alt: "Aerial view of a coastal harbour, settlement and transport corridors",
      caption: "A supply chain is a sequence of territories. The route is now as strategic as the factory.",
    },
    countries: [],
    regions: [],
    topics: ["Geopolitical Risk", "Supply-chain disruption", "Infrastructure", "Territorial Dependencies"],
    global: true,
    globalRelevance: 0.95,
    editorialRelevance: 0.88,
    featured: true,
    intro: "For two decades, supply-chain design treated geography as a cost surface: labour, freight, tariffs. Territory itself — the physical and political conditions of the corridor — was assumed to be stable enough to ignore. That assumption is no longer available.",
    sections: [
      {
        title: "The route is the risk",
        layout: "text",
        text: "Chokepoints, climate-exposed corridors and industrial policy have made the route as strategic as the factory. Suez, Panama, the Red Sea, the Rhine, Alpine transits and a handful of ports do not appear as suppliers in most risk registers. They appear as delays. Dual-sourcing that still funnels through one canal, one mountain crossing or one political jurisdiction is a spreadsheet distinction, not diversification.",
      },
      {
        title: "Name the corridors",
        layout: "text",
        text: "The practical shift is to map critical flows onto corridors and jurisdictions, then test those corridors against a short list of plausible disruptions. The result is not a prediction of the next crisis. It is a ranking of which geographies the operating model cannot afford to misunderstand.",
      },
      {
        layout: "key-thought",
        quote: "A supply chain is a sequence of territories. If those territories fail together, the bill of materials did not diversify anything.",
      },
    ],
    conclusion: {
      text: "Geopolitical and climate disruption arrive as closed straits, low rivers and politicised borders. Lead time is now a territorial variable — and inventory, sourcing and the next factory decision have to be made against named corridors.",
    },
    relatedService: {
      id: "exposure",
      note: "Territorial Exposure Assessment traces critical flows onto the corridors and jurisdictions they actually use, so concentration is visible even when supplier names differ.",
    },
    relatedArticles: ["permafrost-exposure-risk-alpine-regions", "wildfire-risk-southern-europe"],
  },
];
