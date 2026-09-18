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
    slug: "colombia-earthquake-operational-disruption",
    articleType: "insight",
    category: "natural-hazards",
    title: "How the Colombia earthquake blocked the Pacific corridor",
    deck: "The 7.4 shock of 10 August closed 521 roads, more than a hundred bridges and the land approach to Buenaventura. Firms stopped because cargo could not move.",
    excerpt: "Western Colombia did not only lose buildings. It lost the corridors that feed the Coffee Axis and the Pacific port — and with them the operations that sit inland.",
    date: "2026-09-18",
    updated: "2026-09-18",
    readingTime: 5,
    author: { name: "Terranova Strategy", role: "Territorial strategy" },
    heroImage: {
      src: "assets/images/Colombia%20earthquake%20Pereira%202026.jpg",
      alt: "Collapsed building on a Pereira street, with rescue crews and residents on the rubble",
      caption: "The collapse is what the camera records. The operational failure is the corridor that no longer reaches the port.",
    },
    countries: ["CO"],
    regions: ["Latin America"],
    topics: ["Natural Hazards", "Infrastructure", "Operational Resilience", "Supply-chain disruption", "Territorial Exposure"],
    global: false,
    globalRelevance: 0.71,
    editorialRelevance: 0.94,
    featured: true,
    intro: "On 10 August 2026 a magnitude 7.4 earthquake struck western Colombia, in Chocó — the strongest shock in the country since 1979. Hundreds of people died. For operations, the territorial fact is blunter: the roads that feed the Coffee Axis and Buenaventura closed. Inland plants, exporters and terminals did not fail only because a wall fell. They failed because the corridor, the bridge and the port sat in the same shock.",
    sections: [
      {
        title: "Roads, kilometres and the points that matter",
        layout: "text-image",
        text: [
          "Authorities count roads and points. UNGRD’s September balance listed 521 affected roads and about 120 bridges — 107 vehicle and 13 pedestrian. Invías counted 113 points on the primary network. Those points are not a scatter. They sit on the corridors that already concentrate Pacific trade.",
          "The Buga–Buenaventura corridor is about 120 kilometres of mountain road — the land approach to the Pacific port that handles around 40% of Colombia’s international trade. After 10 August it was not a route. Landslides closed stretches such as La Yolomba, a tunnel on the Cali side left 15 vehicles stranded, and night closures turned a working corridor into a controlled trickle.",
          "The same shock closed the inland roads of the Coffee Axis — Calarcá–Ibagué, Manizales–Fresno, the approaches to Pereira and Armenia — and buried access into San José del Palmar, at the epicentre. Tunnels and long bridges were taken out of ordinary use while they were inspected. One blocked point on a mountain road is enough. It closes the whole corridor.",
        ],
        image: {
          src: "assets/graphics/colombia-earthquake-pereira-blocked-roads.jpg",
          alt: "Copernicus damage map of Pereira showing destroyed and damaged buildings and blocked roads",
          caption: "Pereira a day after the shock: buildings marked destroyed or damaged, and roads already marked as blocked.",
        },
      },
      {
        title: "Facilities that stopped being usable",
        layout: "text",
        text: [
          "Five airports were damaged. Pereira’s airport partly collapsed. At Buenaventura, terminals were evacuated and inspected; containers shifted in the yard. Depots in Cali and at the port could not run as depots.",
          "UNGRD also counted 397 health centres, 4,316 schools, 6,118 community centres and 141 aqueducts. In Cali, hospitals were damaged and one of the main ones had to move hundreds of patients into the open. About 759 buildings collapsed. Some 36,300 homes were destroyed and about 202,000 damaged. Those numbers are the territory that cannot host a workforce, a clinic or a warehouse — not a separate humanitarian layer.",
        ],
      },
      {
        title: "How companies actually stopped",
        layout: "text",
        text: [
          "Maersk suspended terminal operations in Buenaventura while facilities were assessed. Ships in port could not finish cargo work; others omitted the call. Road closures between the port and the interior delayed cargo. Facilities on the Caribbean side stayed open — the Pacific side did not.",
          "The larger stop was inland. Coffee exporters said shipments through Buenaventura were paralysed: the road was not available for foreign-trade vehicles, trucks were short, terminals were restricted. More than 60% of Colombia’s coffee exports normally pass that port. Exporters looked at the Caribbean coast as a substitute — a longer haul to a different sea.",
        ],
      },
      {
        layout: "key-thought",
        quote: "The building is a site. The blockade is a territory. Western Colombia failed as a corridor.",
      },
      {
        title: "Restoring the corridor",
        layout: "text",
        text: "From 12 August, MinTransporte, Invías, ANI and the Unión Vial Camino del Pacífico concession put cargo back onto Buga–Buenaventura under pare-y-siga. Crews worked around the clock. Of Invías’ 113 primary points, 51 were fully opened and 62 kept to one lane — about 86% of points attended, later reported as 96% transitability. That percentage is not finished works. Invías was explicit: being able to pass is not the same as the slope having been rebuilt. Into September the Pacific corridor still ran with a three-metre barrier and geotechnical watch at PR 69 in Dagua: two-way by day, one-lane pare-y-siga at night. DIAN extended customs deadlines so cargo that could not physically move was not also late on paper. Transitability is the first recovery. The operating condition that remains is a mountain corridor that can close again before the works are finished.",
      },
    ],
    conclusion: {
      text: "The 10 August earthquake was a corridor event. The assessment that matters is which roads, terminals and inland plants fail together when a mountain crossing is blocked — and whether the organisation already has another way out if the Pacific approach is the one that goes.",
    },
    relatedService: {
      id: "response",
      note: "Operational Disruption Response treats a closed mountain corridor, a suspended terminal and an inland plant as one event — so the substitute route is named before the next shock.",
    },
    relatedArticles: ["danube-rhine-low-water-cost-central-europe", "geography-of-global-supply-chains"],
  },
  {
    slug: "danube-rhine-low-water-cost-central-europe",
    articleType: "insight",
    category: "territorial-risk",
    title: "The lower levels of the Danube and the Rhine have cost €5 billion to Central Europe",
    deck: "Low water is a closed corridor: barges at a fraction of load, reactors that cannot cool, plants that cannot be fed.",
    excerpt: "A severe low-water season on the Rhine and the Danube has a valued industrial bill of about €5 billion. In 2026 that bill is being paid again — in freight, energy and the factories that sit on both rivers.",
    date: "2026-09-18",
    updated: "2026-09-18",
    readingTime: 5,
    author: { name: "Terranova Strategy", role: "Territorial strategy" },
    heroImage: {
      src: "assets/images/Danube%20Cernavoda%20power%20plant.jpg",
      alt: "Cernavodă nuclear power plant on its cooling canal, with exposed banks along the water",
      caption: "The plant sits on the water it needs to run. When the Danube falls, generation falls with it.",
    },
    countries: ["DE", "AT", "HU", "RO", "NL", "SK", "CH", "BG"],
    regions: ["Europe"],
    topics: ["Climate Risk", "Territorial Exposure", "Infrastructure", "Operational Resilience", "Supply-chain disruption"],
    global: false,
    globalRelevance: 0.72,
    editorialRelevance: 0.93,
    featured: true,
    intro: "When the Rhine and the Danube run low, Central Europe does not lose a landscape. It loses a working corridor. Barges cannot carry a full load. Power plants cannot cool. Grain cannot leave the farm by river. The number that has been valued for a season of this kind is about €5 billion — almost €5 billion of German industrial output lost when the Rhine ran low in 2018. That is the scale. In 2026 the Kiel Institute already puts the German third-quarter hit on the Rhine at €1–2 billion, with water at Kaub below the 2018 record. The Danube is in the same season: Paks curtailed, Cernavodă cut, barges running at 30–40% of load. The two rivers are one territorial system.",
    sections: [
      {
        title: "What low water actually closes",
        layout: "text",
        text: [
          "Draft is the first constraint. On the Rhine, Kaub at 78 centimetres is the operational mark: below it, barges still move, but they move light. In July 2026 some stretches were operating at as little as 20% of normal capacity. On the Danube, restrictions from early July forced vessels to 30–40% of load; surcharges could double the freight rate. The same cargo then needs more ships, more days, more fuel.",
          "Cooling water is the second. Hungary’s only nuclear plant, Paks, uses the Danube. In 2026 the river fell so far that suction intakes could not reach it; reactors were cut, and for a time the country ran close to a full nuclear stop. Cernavodă in Romania disconnected a unit and warned that a second could follow. Kozloduy in Bulgaria was watched at an exceptionally low gauge. Serbian hydropower and coal cooling at Kostolac were squeezed in the same weeks. Fuel imports by barge ran at about a quarter of the planned volume.",
          "The factory that does not sit on the bank still stops. Inland waterways move a small share of total German freight — about 6% — but a large share of what sits at the start of the chain: around 30% of coal, crude and gas volumes, about 20% of coking and petroleum products. Chemicals, steel and fuels arrive by river into Ludwigshafen, the Ruhr and the upper Rhine. In 2018 that interruption cost BASF about €250 million at a single site.",
          "Agriculture is hit twice: irrigation that is restricted, and harvests that cannot move. Romania cut farm access to Danube water while holding reservoirs for Cernavodă. Grain barges stood idle on exposed sand. Cruise ships failed to reach Budapest. The backup corridor failed with the river: Hungary restricted evening rail cargo to save electricity, so the substitute for the barge was itself curtailed.",
        ],
      },
      {
        title: "€5 billion, by the sectors that pay it",
        layout: "text",
        text: "The €5 billion is the 2018 German industrial-output loss on the Rhine — the only fully valued low-water season. It is the number Central Europe should plan against. 2022 was expected to exceed it. 2026 is already booking €1–2 billion in Germany in the third quarter, plus Hungary’s Paks curtailment of about 0.1% of GDP (in the order of €200 million over a few weeks) and about HUF 50 billion in extra power imports. The chart allocates that €5 billion scale across the sectors that actually pay a two-river year.",
        image: {
          src: "assets/graphics/danube-rhine-low-water-losses.png",
          alt: "Bar chart allocating a €5 billion Central European low-water season across industry, energy, freight and agriculture",
          caption: "€5 billion by sector. Industry takes the largest share because the river feeds the plant. Energy and freight are how the same low water arrives on the Danube.",
        },
      },
      {
        title: "Energy, freight, industry, farms",
        layout: "text-image",
        text: [
          "Energy is the Danube’s distinctive 2026 bill. Paks covers about a third of Hungarian electricity. A few weeks of curtailment took about 0.1% off GDP. Romania held canal water for Cernavodă while farmers went short. Hydropower in Serbia lost head; coal plants lost cooling and lost fuel that should have come by barge. On the Rhine the same physics hits thermal plants and the coal and oil that feed them.",
          "Freight is the mechanism. The Rhine carries about 80% of Germany’s inland-waterway traffic — some 285 million tonnes in a normal year. In August 2022, a previous low-water month, inland volumes were 26.8% below the year before. In 2018 traditional Rhine transport fell 11%. Direct shipping losses are real. The larger invoice is the factory that cannot be supplied.",
          "Industry pays most of the €5 billion. Kiel’s work on the Rhine is blunt: a month of low water cuts inland shipping by about 25% and industrial production by about 1%. The second half of 2018 had a peak industrial-production hit of 1.5%, or close to 0.4% of German GDP — booked as almost €5 billion of industrial output. Chemicals, mineral oils and containers were the cargoes that fell hardest.",
          "Agriculture is the smaller share of the euro total and a large share of the territory: irrigation bans, idle grain, a harvest that misses the export window. The operational question is the same as for a plant: which farm, mill and port sit on a river that cannot take the load.",
        ],
        image: {
          src: "assets/images/Danube%20freight%20barge.jpg",
          alt: "Tug and freight barge on the Danube at Brăila, Romania",
          caption: "The barge is the corridor. When draft falls, the same cargo needs more ships — or it does not move.",
        },
      },
      {
        layout: "key-thought",
        quote: "Low water is a corridor failure. The plant, the barge and the farm fail together because they use the same river.",
      },
      {
        title: "What this becomes over time",
        layout: "text",
        text: "2018, 2022 and 2026 are a series, not a shock. Rhine summer flow is fed by Alpine snow and ice that are in long retreat; low-water windows lengthen. Firms have already changed the operating model: custom low-draft barges, Sunday road haulage, deeper inventories. Hungary is sinking barges and building a riverbed sill to keep Paks on the grid — a permanent structure to hold a river that no longer holds itself. Rail cannot take the tonnage, and in 2026 it was itself restricted to save power. The long-term cost is not one summer’s €5 billion. It is a climate surcharge on every tonne that used to assume the river would be there: more ships, more stock, more weirs, and power plants whose heat sink is no longer a given. The next factory and the next generating unit have to be sited against a summer river that planning still treats as the 20th-century Danube and Rhine.",
      },
    ],
    conclusion: {
      text: "The €5 billion is not a 2018 curiosity. It is the operating cost of a Central European summer in which the Rhine and the Danube cannot carry the territory they were built to serve. Maps of gauges are a starting layer. The assessment that matters places the river, the plant, the barge and the factory in the same picture — and asks which of those links the organisation cannot afford to lose twice in a decade.",
    },
    relatedService: {
      id: "exposure",
      note: "Territorial Exposure Assessment places river gauges, energy cooling, inland freight and the plants they feed in the same territorial picture.",
    },
    relatedArticles: ["rising-temperatures-economic-impact-alpine-business", "wildfire-risk-southern-europe"],
  },
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
    updated: "2026-09-18",
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
    intro: "Permafrost in the Alps is frozen ground high on the mountain — mostly invisible, and larger than the remaining glaciers. For territorial strategy it is not a summit curiosity. It is a condition of the high slopes that drain into the valleys where roads, plants, crossings and settlements actually sit. When that ground loosens, the event does not stay on the peak.",
    sections: [
      {
        title: "What permafrost is — and how much of it there is",
        layout: "text",
        text: "Permafrost is ground that stays frozen year-round. In the Alps you rarely see it. It sits inside rock faces, scree and old ice-and-rubble tongues, generally on the high ground. The ice in that ground works like a binder. It holds slopes together. When summers get hotter, the binder weakens, water moves into the cracks, and rock, debris and meltwater can travel down the torrent to the valley floor. The frozen area is larger than most organisations assume. Across the Alpine arc it covers roughly 6,200 km² — about three times the remaining glacier area. Switzerland holds the largest share, about 2,160 km², or 3–5% of the country. Italy follows with about 1,790 km², Austria 1,560 km² and France 700 km², with only a few square kilometres in Bavaria. The useful comparison is not glacier versus permafrost. It is how much high ground drains into a working valley.",
      },
      {
        title: "Heat loosens the high ground",
        layout: "text",
        text: "The Alps have been warming fastest at elevation. Recent summers have been among the hottest on the Swiss record, and rockfall from high faces has followed the heat. Ground that looked stable because it was frozen is the same ground that now sheds rock, debris and water into the catchments below. For an operation, that is not a climate footnote. It is a change in the territory it uses.",
      },
      {
        title: "Thaw becomes a disruption trigger",
        layout: "text-image",
        text: "The failure rarely stays on the peak. A loosening slope can pick up ice and debris, become a debris flow or a flash flood, and follow the torrent to the road, the rail and the settlement. That sequence is no longer theoretical: Piz Cengalo into Bondo in 2017; Fluchthorn in 2023; Piz Scerscen in 2024; the collapse above Blatten in 2025, prepared by rockfall from thawing high ground. What matters is not the volume on the face. It is the corridor the material uses, how long that corridor stays closed, and which sites cannot run without it.",
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
          "Exposure follows the frozen ground — and the valleys it feeds. Switzerland holds the largest Alpine permafrost area. Valais is the centre of gravity: Zermatt and Saas-Fee, the Lötschental, the Rhône corridor through Visp and Brig, and torrents such as Ritigraben above Grächen. Graubünden follows: the Engadin around St. Moritz, the Bregaglia, and the ridges above Davos. The Bernese Alps expose Grindelwald, Kandersteg and the Lötschberg axis; Uri and Glarus sit under the Tödi group. Ticino has a smaller high-Alpine footprint but about 9.4% of its territory in modelled permafrost.",
          "In France: Haute-Savoie (Mont Blanc, Chamonix), Savoie (Vanoise), and the Écrins–Oisans in Isère and Hautes-Alpes. In Italy: Valle d'Aosta around Courmayeur, then South Tyrol — nearly 2,800 mapped rock glaciers, about 500 still active — with Trentino and the Lombard high valleys behind. In Austria, Tyrol (Ötztal, Stubai, Innsbruck), Vorarlberg and the Hohe Tauern in Salzburg and Carinthia hold most of the country's ~1,560 km². Bavaria’s frozen ground is small and concentrated around the Zugspitze. The strategic places are the nodes that cannot reroute: Chamonix and Courmayeur; Zermatt, Visp and Brig; St. Moritz; Innsbruck; Bolzano and Aosta. A closed crossing, a buried torrent fan or a cut access road is how the risk shows up in an operating year.",
        ],
      },
    ],
    conclusion: {
      text: "Permafrost exposure risk is the chance that a change on the high ground closes a valley. Maps of frozen area are a starting layer. The assessment that matters places the slope, the torrent, the road, the rail and the settlement in the same picture — and asks which of those links the organisation cannot afford to lose.",
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
    title: "What does wildfire exposure mean for southern Europe?",
    deck: "The 2026 season closed farms, timber, motorways and industrial belts. Fire is no longer only a Mediterranean rural event.",
    excerpt: "Wildfire in southern Europe is a territorial operating condition. The 2026 season showed which land, corridors and cities sit inside the fire — not only how many hectares burned.",
    date: "2026-09-18",
    updated: "2026-09-18",
    readingTime: 5,
    author: { name: "Terranova Strategy", role: "Territorial strategy" },
    heroImage: {
      src: "assets/images/Wildfires%20France_2026.jpg",
      alt: "Firefighters and engines in a Gironde settlement under smoke, with pine forest behind",
      caption: "The fire is fought in the pines. The exposure sits in the settlement at the forest edge.",
    },
    countries: ["ES", "IT", "FR", "PT", "GR", "GB", "DE", "BE"],
    regions: ["Europe"],
    topics: ["Climate Risk", "Natural Hazards", "Territorial Exposure", "Infrastructure", "Operational Resilience"],
    global: false,
    globalRelevance: 0.64,
    editorialRelevance: 0.92,
    featured: true,
    intro: "The 2026 wildfire season in southern Europe was a territorial event, not only a civil-protection one. Fire took land that farms, timber, plants and logistics actually use — and it closed the approaches to cities that planning still treats as safe hinterland. Spain, Italy and Greece carried the Mediterranean load. The fire that showed how close the season now sits to a working metropolis ran through the pines of Gironde and almost reached Bordeaux.",
    sections: [
      {
        title: "What burned — and what that surface is",
        layout: "text",
        text: [
          "By mid-September, European satellite mapping had recorded about 669,000 hectares burned in the EU: nearly twice the twenty-year average, though still below the record year of 2025. Hectares are not an ecological footnote. They are the fields that miss a harvest, the forest that will not yield for a generation, and the belt of access that closes around the perimeter.",
          "Spain took the largest share. National figures put forest area affected at about 255,000 hectares by mid-August; satellite mapping was closer to 300,000. One blaze near Niebla, in Huelva, exceeded 33,000 hectares. Insured farmland already exceeded 15,800 hectares across 41 provinces, mainly cereal — the second-worst agricultural fire year of the decade after 2025.",
          "Italy burned grassland and farms as much as forest. By late August the mapped area had passed 95,000 hectares, about twice the long-term average. Sicily, Calabria and Puglia held about three-quarters of the national total. Sicily was the centre of gravity: a mid-August regional estimate put damage at about €629 million — some €159 million of it on farms, €50 million on buildings, businesses and infrastructure — later projected toward €700 million. Greece burned on the order of 30,000 hectares. A fire that started in Viotia at the end of July ran toward Megara, on Athens’ western approach — another closed corridor on the capital’s edge.",
        ],
      },
      {
        title: "Farms, plants and the corridor",
        layout: "text",
        text: "Agriculture is hit twice: the crop that burns, and the harvest that cannot proceed while machinery is stopped and people are evacuated. Spain’s agricultural insurers expect a little over €2 million in fire compensation — the insured slice of field damage, not the full territorial cost. Sicily’s farm bill is two orders of magnitude larger. Forestry is slower: burned pine must be salvaged quickly or it is lost, and a massif-scale fire produces more wood than the local chain can take. Production and logistics fail around the fire, not only inside it. A site that does not burn still stops if the workforce is evacuated, the motorway is closed, or the rail is cut. Smoke cancels the tourist week and the cellar-door days that many wine estates now depend on. The operational question is which farms, mills, plants and crossings sit in the same fire domain and fail together.",
      },
      {
        layout: "key-thought",
        quote: "Wildfire exposure is not the burnt patch. It is the territory that cannot be used while the fire holds — the farm, the plant, the motorway and the city at the edge of the pines.",
      },
      {
        title: "The fires that almost reached Bordeaux",
        layout: "text",
        text: [
          "The season’s clearest territorial event was in Nouvelle-Aquitaine. From 22 July a fire that started at Saumos ran through the Landes de Gascogne pine forest: about 42,000 hectares in Gironde, the largest French wildfire since 1949. A second fire around Biscarrosse evacuated more than 30,000 people in the Landes. Together they produced the largest wildfire evacuation in modern France — about 220,000 people in Gironde, including communes on the outer ring of Bordeaux: Saint-Médard-en-Jalles, Le Haillan, Martignas-sur-Jalle, Saint-Jean-d'Illac, and the parts of Mérignac and Eysines beyond the ring road.",
          "The fire did not take the city. It took the working belt west of it. The A63 toward Spain was closed for some 60 to 70 kilometres. Trains south of Bordeaux — Arcachon, Dax, Hendaye, Pau — were stopped until the start of August. Cap Ferret was emptied by road and by sea. At the peak of the holiday season, the state asked people not to come. That belt is also one of France’s densest aerospace and defence clusters: ArianeGroup, Dassault, Safran, Thales and Roxel, around Mérignac airport and Saint-Médard-en-Jalles. Sites were evacuated or ringed with firebreaks. The plants mostly did not burn. They still ceased to be ordinary places of work.",
          "The valued bill is already on the table. The Bordeaux-Gironde Chamber of Commerce estimates about 40,000 businesses touched, 15,000 evacuated, some 200,000 jobs concerned, and about €200 million in losses. Insurers put claims from the Gironde, Landes and Var fires at nearly €500 million across some 25,000 files — including about €30 million of business interruption, mostly without a burnt building. The comparable insured total in summer 2022 was about €80 million. Forestry faces a salvage glut of 42,000 hectares of maritime pine. Vineyards were largely spared the flames; wine tourism was not.",
        ],
      },
      {
        title: "Where the threat sits next",
        layout: "text",
        text: "The 2026 map is no longer only Mediterranean. By late July the United Kingdom was running at about two and a half times its twenty-year burned-area average; Germany at more than twice. England and Wales logged more than a thousand vegetation fires, with notable burns in the New Forest, the Peak District and the Cairngorms. In the German Eifel, the Hürtgenwald fire became the largest in North Rhine-Westphalia in decades and forced thousands to leave; Belgium burned on the same border. The Netherlands, Poland and Norway also ran well above their usual activity. These are not Gironde-scale events yet. They are the same condition arriving in territories that still plan as if fire were a southern problem.",
      },
    ],
    conclusion: {
      text: "Wildfire exposure is the chance that a dry season closes a territory: the farm, the timber, the motorway, the plant and the city at the forest edge. 2026 showed that this is already an operating condition in Spain, Italy, Greece and, most sharply, on the western approaches to Bordeaux. The assessment that matters is which Central European and British landscapes now sit in the same picture.",
    },
    relatedService: {
      id: "exposure",
      note: "Territorial Exposure Assessment places fire, farmland, access and industrial belts in the same territorial picture — so a closed corridor is visible before the next season.",
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
    relatedArticles: ["danube-rhine-low-water-cost-central-europe", "wildfire-risk-southern-europe"],
  },
];
