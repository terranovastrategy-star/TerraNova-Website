/**
 * Insights engine — ranking, geolocation, listing UI, article hydration.
 *
 * Location is a ranking signal only. Country is never printed as
 * "because you are in…". Session cache holds an ISO country code solely
 * so listing and article pages do not re-fetch on every navigation.
 */
(function () {
  "use strict";

  var RANKING = {
    weights: {
      geographic: 0.4,
      editorial: 0.25,
      recency: 0.2,
      featured: 0.15,
    },
    recencyHorizonDays: 730,
    countryMatch: 1,
    regionMatch: 0.55,
    globalBase: 0.22,
    unmatchedBase: 0.12,
    unknownLocation: 0.5,
  };

  var CATEGORIES = [
    { id: "all", label: "All" },
    { id: "natural-hazards", label: "Natural Hazards" },
    { id: "territorial-risk", label: "Territorial Risk" },
    { id: "geopolitics", label: "Geopolitics" },
    { id: "infrastructure", label: "Infrastructure" },
    { id: "resilience", label: "Resilience" },
    { id: "recovery", label: "Recovery" },
  ];

  var REGION_FILTERS = [
    { id: "all", label: "All regions" },
    { id: "Europe", label: "Europe", type: "region" },
    { id: "CH", label: "Switzerland", type: "country" },
    { id: "DE", label: "Germany", type: "country" },
    { id: "FR", label: "France", type: "country" },
    { id: "IT", label: "Italy", type: "country" },
  ];

  var TOPICS = [
    "Natural Hazards",
    "Climate Risk",
    "Infrastructure",
    "Territorial Exposure",
    "Geopolitical Risk",
    "Operational Resilience",
    "Strategic Recovery",
    "Governance",
  ];

  var COUNTRY_NAMES = {
    AT: "Austria",
    BE: "Belgium",
    CH: "Switzerland",
    DE: "Germany",
    ES: "Spain",
    FR: "France",
    GB: "United Kingdom",
    GR: "Greece",
    IT: "Italy",
    NL: "Netherlands",
    PT: "Portugal",
    US: "United States",
  };

  var REGION_BY_COUNTRY = {
    AT: "Europe",
    BE: "Europe",
    CH: "Europe",
    CZ: "Europe",
    DE: "Europe",
    DK: "Europe",
    ES: "Europe",
    FI: "Europe",
    FR: "Europe",
    GB: "Europe",
    GR: "Europe",
    IE: "Europe",
    IT: "Europe",
    LU: "Europe",
    NL: "Europe",
    NO: "Europe",
    PL: "Europe",
    PT: "Europe",
    SE: "Europe",
    US: "North America",
    CA: "North America",
    MX: "North America",
    JP: "Asia",
    CN: "Asia",
    SG: "Asia",
    AE: "Middle East",
  };

  var TZ_COUNTRY = {
    "Europe/Zurich": "CH",
    "Europe/Vaduz": "CH",
    "Europe/Berlin": "DE",
    "Europe/Paris": "FR",
    "Europe/Rome": "IT",
    "Europe/Vienna": "AT",
    "Europe/Madrid": "ES",
    "Europe/Lisbon": "PT",
    "Europe/Amsterdam": "NL",
    "Europe/Brussels": "BE",
    "Europe/London": "GB",
    "Europe/Dublin": "IE",
    "Europe/Athens": "GR",
    "Europe/Warsaw": "PL",
    "Europe/Prague": "CZ",
    "Europe/Stockholm": "SE",
    "Europe/Oslo": "NO",
    "Europe/Copenhagen": "DK",
    "America/New_York": "US",
    "America/Chicago": "US",
    "America/Denver": "US",
    "America/Los_Angeles": "US",
  };

  var PAGE_SIZE = 9;
  var GEO_KEY = "ps_geo_country";
  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  var ROOT = document.body ? document.body.dataset.root || "" : "";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function withRoot(path) {
    if (!path || /^(https?:|\/|mailto:|tel:|#)/.test(path)) return path;
    return ROOT + path;
  }

  function categoryLabel(id) {
    var found = CATEGORIES.filter(function (item) { return item.id === id; })[0];
    return found ? found.label : id;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    var month = MONTHS[parseInt(parts[1], 10) - 1];
    return parseInt(parts[2], 10) + " " + month + " " + parts[0];
  }

  function geographyLabel(insight) {
    if (!insight) return "";
    var countries = insight.countries || [];
    if (countries.length === 1) return COUNTRY_NAMES[countries[0]] || countries[0];
    if (countries.length > 1 && insight.regions && insight.regions[0]) return insight.regions[0];
    if (insight.regions && insight.regions[0]) return insight.regions[0];
    if (insight.global) return "Global";
    return "";
  }

  function regionForCountry(code) {
    return code ? REGION_BY_COUNTRY[code] || null : null;
  }

  function publishedInsights() {
    var catalog = window.PS_INSIGHTS;
    if (!catalog || !catalog.length) return [];
    return catalog.filter(function (item) { return item && item.slug; });
  }

  function geographicScore(insight, loc) {
    if (!loc || !loc.country) return RANKING.unknownLocation;

    var countries = insight.countries || [];
    var regions = insight.regions || [];

    if (countries.indexOf(loc.country) !== -1) return RANKING.countryMatch;
    if (loc.region && regions.indexOf(loc.region) !== -1) return RANKING.regionMatch;

    var relevance = typeof insight.globalRelevance === "number" ? insight.globalRelevance : 0.5;
    if (insight.global || (!countries.length && !regions.length)) {
      return RANKING.globalBase + 0.28 * relevance;
    }
    return RANKING.unmatchedBase + 0.18 * relevance;
  }

  function editorialScore(insight) {
    return clamp(typeof insight.editorialRelevance === "number" ? insight.editorialRelevance : 0.5, 0, 1);
  }

  function recencyScore(insight, now) {
    var published = Date.parse(insight.date);
    if (isNaN(published)) return 0.5;
    var horizon = RANKING.recencyHorizonDays * 24 * 60 * 60 * 1000;
    var age = Math.max(0, now - published);
    return clamp(1 - age / horizon, 0, 1);
  }

  function featuredScore(insight) {
    return insight.featured ? 1 : 0;
  }

  function rankScore(insight, loc, now) {
    var w = RANKING.weights;
    return (
      w.geographic * geographicScore(insight, loc) +
      w.editorial * editorialScore(insight) +
      w.recency * recencyScore(insight, now) +
      w.featured * featuredScore(insight)
    );
  }

  function sortByRank(items, loc) {
    var now = Date.now();
    return items.slice().sort(function (a, b) {
      var diff = rankScore(b, loc, now) - rankScore(a, loc, now);
      if (Math.abs(diff) > 0.0001) return diff;
      return Date.parse(b.date) - Date.parse(a.date);
    });
  }

  function selectFeatured(items, loc) {
    var published = items.filter(Boolean);
    if (!published.length) return null;
    var flagged = published.filter(function (item) { return item.featured; });
    var pool = flagged.length ? flagged : published;
    return sortByRank(pool, loc)[0];
  }

  function selectRegional(items, loc, featured, count) {
    if (!loc || !loc.country) return [];
    var rest = items.filter(function (item) {
      return featured ? item.slug !== featured.slug : true;
    });
    var local = rest.filter(function (item) {
      return (item.countries || []).indexOf(loc.country) !== -1;
    });
    var regional = rest.filter(function (item) {
      return local.indexOf(item) === -1 && loc.region && (item.regions || []).indexOf(loc.region) !== -1;
    });
    var ranked = sortByRank(local, loc).concat(sortByRank(regional, loc));
    var unique = [];
    ranked.forEach(function (item) {
      if (unique.length >= count) return;
      if (unique.indexOf(item) === -1) unique.push(item);
    });
    return unique;
  }

  function matchesQuery(insight, query) {
    if (!query) return true;
    var haystack = [
      insight.title,
      insight.deck,
      insight.subtitle,
      insight.excerpt,
      articleTypeLabel(insight),
      categoryLabel(insight.category),
      (insight.topics || []).join(" "),
      (insight.countries || []).join(" "),
      (insight.countries || []).map(function (code) { return COUNTRY_NAMES[code] || ""; }).join(" "),
      (insight.regions || []).join(" "),
      insight.global ? "global international" : "",
    ].join(" ").toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function matchesCategory(insight, category) {
    return !category || category === "all" || insight.category === category;
  }

  function matchesRegion(insight, regionId) {
    if (!regionId || regionId === "all") return true;
    var filter = REGION_FILTERS.filter(function (item) { return item.id === regionId; })[0];
    if (!filter || filter.id === "all") return true;
    if (filter.type === "country") return (insight.countries || []).indexOf(filter.id) !== -1;
    return (insight.regions || []).indexOf(filter.id) !== -1;
  }

  function matchesTopic(insight, topic) {
    if (!topic) return true;
    return (insight.topics || []).indexOf(topic) !== -1;
  }

  function coverImage(item) {
    return (item && (item.heroImage || item.image)) || {};
  }

  function articleTypeLabel(item) {
    var type = item && item.articleType;
    if (type === "case") return "Case";
    if (type === "perspective") return "Perspective";
    return "Insight";
  }

  function articleDeck(item) {
    return (item && (item.deck || item.subtitle || item.excerpt)) || "";
  }

  function articleUrl(insight) {
    return withRoot("insights/article.html?slug=" + encodeURIComponent(insight.slug));
  }

  function svgArrow() {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function createCard(insight, variant) {
    var article = document.createElement("article");
    article.className = variant === "featured" ? "insight-featured" : "insight-card";
    if (variant === "regional") article.classList.add("insight-card--regional");

    var link = document.createElement("a");
    link.className = variant === "featured" ? "insight-featured__link" : "insight-card__link";
    link.href = articleUrl(insight);

    var media = document.createElement("div");
    media.className = variant === "featured" ? "insight-featured__media" : "insight-card__media";

    var img = document.createElement("img");
    var cover = coverImage(insight);
    img.src = withRoot(cover.src);
    img.alt = cover.alt || "";
    img.decoding = "async";
    img.loading = variant === "featured" ? "eager" : "lazy";
    if (variant === "featured") img.setAttribute("fetchpriority", "high");
    img.width = variant === "featured" ? 1400 : 800;
    img.height = variant === "featured" ? 900 : 500;
    media.appendChild(img);

    var body = document.createElement("div");
    body.className = variant === "featured" ? "insight-featured__body" : "insight-card__body";

    var category = document.createElement("p");
    category.className = variant === "featured" ? "insight-featured__category" : "insight-card__category";
    category.textContent = articleTypeLabel(insight) + " · " + categoryLabel(insight.category);

    var title = document.createElement(variant === "featured" ? "h2" : "h3");
    title.textContent = insight.title;

    var excerpt = document.createElement("p");
    excerpt.className = variant === "featured" ? "insight-featured__excerpt" : "insight-card__excerpt";
    excerpt.textContent = insight.excerpt || articleDeck(insight);

    var meta = document.createElement("p");
    meta.className = variant === "featured" ? "insight-featured__meta" : "insight-card__meta";
    var geo = geographyLabel(insight);
    var pieces = [];
    if (geo) pieces.push(geo);
    pieces.push(insight.readingTime + " min read");
    pieces.push(formatDate(insight.date));
    meta.textContent = pieces.join(" · ");

    body.appendChild(category);
    body.appendChild(title);
    body.appendChild(excerpt);
    body.appendChild(meta);

    if (variant === "featured") {
      var cta = document.createElement("span");
      cta.className = "insight-featured__cta";
      cta.innerHTML = "Read the article " + svgArrow();
      body.appendChild(cta);
    } else {
      var arrow = document.createElement("span");
      arrow.className = "insight-card__arrow";
      arrow.innerHTML = svgArrow();
      arrow.setAttribute("aria-hidden", "true");
      body.appendChild(arrow);
    }

    link.appendChild(media);
    link.appendChild(body);
    article.appendChild(link);
    return article;
  }

  function reveal(el, index) {
    el.classList.add("reveal");
    if (index && index % 3) el.classList.add("reveal-delay-" + (index % 3));
    window.requestAnimationFrame(function () {
      el.classList.add("is-visible");
    });
  }

  function parseLocation(payload) {
    var code = payload && (payload.country || payload.country_code || payload.countryCode);
    if (!code || typeof code !== "string") return null;
    code = code.toUpperCase();
    if (code.length !== 2) return null;
    return { country: code, region: regionForCountry(code), source: "ip" };
  }

  function locationFromTimezone() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      var code = TZ_COUNTRY[tz];
      if (!code) return null;
      return { country: code, region: regionForCountry(code), source: "timezone" };
    } catch (err) {
      return null;
    }
  }

  function readCachedLocation() {
    try {
      var code = sessionStorage.getItem(GEO_KEY);
      if (!code) return null;
      return { country: code, region: regionForCountry(code), source: "session" };
    } catch (err) {
      return null;
    }
  }

  function writeCachedLocation(loc) {
    if (!loc || !loc.country) return;
    try {
      sessionStorage.setItem(GEO_KEY, loc.country);
    } catch (err) {}
  }

  function fetchJson(url, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var timer = window.setTimeout(function () {
        reject(new Error("timeout"));
      }, timeoutMs);
      fetch(url, { credentials: "omit" })
        .then(function (response) {
          window.clearTimeout(timer);
          if (!response.ok) throw new Error("http");
          return response.json();
        })
        .then(resolve)
        .catch(function (err) {
          window.clearTimeout(timer);
          reject(err);
        });
    });
  }

  function detectLocation() {
    var cached = readCachedLocation();
    if (cached) return Promise.resolve(cached);

    function fromApi(url) {
      return fetchJson(url, 1800).then(function (data) {
        var loc = parseLocation(data);
        if (!loc) throw new Error("no country");
        return loc;
      });
    }

    var ipLookup = typeof Promise.any === "function"
      ? Promise.any([fromApi("https://api.country.is/"), fromApi("https://ipapi.co/json/")])
      : fromApi("https://api.country.is/");

    return ipLookup
      .catch(function () {
        return null;
      })
      .then(function (loc) {
        loc = loc || locationFromTimezone() || { country: null, region: null, source: "none" };
        if (loc.country) writeCachedLocation(loc);
        return loc;
      });
  }

  function readFiltersFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return {
      category: params.get("category") || "all",
      region: params.get("region") || "all",
      topic: params.get("topic") || "",
      q: params.get("q") || "",
    };
  }

  function writeFiltersToUrl(state, replace) {
    var params = new URLSearchParams();
    if (state.category && state.category !== "all") params.set("category", state.category);
    if (state.region && state.region !== "all") params.set("region", state.region);
    if (state.topic) params.set("topic", state.topic);
    if (state.q) params.set("q", state.q);
    var query = params.toString();
    var next = window.location.pathname + (query ? "?" + query : "") + window.location.hash;
    if (replace) history.replaceState(null, "", next);
    else history.pushState(null, "", next);
  }

  function initListing() {
    var page = document.querySelector("[data-insights-page]");
    if (!page) return;

    var featuredMount = page.querySelector("[data-insights-featured]");
    var regionalMount = page.querySelector("[data-insights-regional]");
    var regionalSection = page.querySelector("[data-insights-regional-section]");
    var gridMount = page.querySelector("[data-insights-grid]");
    var emptyMount = page.querySelector("[data-insights-empty]");
    var moreBtn = page.querySelector("[data-insights-more]");
    var status = page.querySelector("[data-insights-status]");
    var search = page.querySelector("[data-insights-search]");
    var categoryRow = page.querySelector("[data-insights-categories]");
    var regionRow = page.querySelector("[data-insights-regions]");
    var topicRow = page.querySelector("[data-insights-topics]");
    var loading = page.querySelector("[data-insights-loading]");

    var state = readFiltersFromUrl();
    var visibleCount = PAGE_SIZE;
    var location = { country: null, region: null, source: "none" };
    var ranked = [];

    function applyFilters(items) {
      var query = (state.q || "").trim().toLowerCase();
      return items.filter(function (item) {
        return (
          matchesCategory(item, state.category) &&
          matchesRegion(item, state.region) &&
          matchesTopic(item, state.topic) &&
          matchesQuery(item, query)
        );
      });
    }

    function setStatus(count) {
      if (!status) return;
      var label = count === 1 ? "1 insight" : count + " insights";
      if (state.topic) label += " on " + state.topic;
      status.textContent = label;
    }

    function renderCategories() {
      if (!categoryRow) return;
      categoryRow.replaceChildren();
      CATEGORIES.forEach(function (item) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "insights-filter" + (state.category === item.id ? " is-active" : "");
        btn.textContent = item.label;
        btn.setAttribute("aria-pressed", String(state.category === item.id));
        btn.addEventListener("click", function () {
          state.category = item.id;
          state.topic = "";
          visibleCount = PAGE_SIZE;
          writeFiltersToUrl(state, false);
          render();
        });
        categoryRow.appendChild(btn);
      });
    }

    function renderRegions() {
      if (!regionRow) return;
      regionRow.replaceChildren();
      REGION_FILTERS.forEach(function (item) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "insights-filter insights-filter--quiet" + (state.region === item.id ? " is-active" : "");
        btn.textContent = item.label;
        btn.setAttribute("aria-pressed", String(state.region === item.id));
        btn.addEventListener("click", function () {
          state.region = item.id;
          visibleCount = PAGE_SIZE;
          writeFiltersToUrl(state, false);
          render();
        });
        regionRow.appendChild(btn);
      });
    }

    function renderTopics() {
      if (!topicRow) return;
      topicRow.replaceChildren();
      TOPICS.forEach(function (topic) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "insights-topic" + (state.topic === topic ? " is-active" : "");
        btn.textContent = topic;
        btn.addEventListener("click", function () {
          state.topic = state.topic === topic ? "" : topic;
          state.category = "all";
          visibleCount = PAGE_SIZE;
          writeFiltersToUrl(state, false);
          render();
          if (gridMount) {
            var top = gridMount.getBoundingClientRect().top + window.scrollY - 96;
            window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
          }
        });
        topicRow.appendChild(btn);
      });
    }

    function renderFeatured(featured) {
      if (!featuredMount) return;
      featuredMount.replaceChildren();
      var featuredSection = featuredMount.closest(".insights-featured");
      var browsing = state.q || (state.category && state.category !== "all") || (state.region && state.region !== "all") || state.topic;
      if (!featured || browsing) {
        featuredMount.hidden = true;
        if (featuredSection) featuredSection.hidden = true;
        return;
      }
      featuredMount.hidden = false;
      if (featuredSection) featuredSection.hidden = false;
      var card = createCard(featured, "featured");
      reveal(card, 0);
      featuredMount.appendChild(card);
    }

    function renderRegional(items, featured) {
      if (!regionalMount || !regionalSection) return;
      var picks = selectRegional(items, location, featured, 3);
      regionalMount.replaceChildren();
      var browsing = state.q || (state.category && state.category !== "all") || (state.region && state.region !== "all") || state.topic;
      if (browsing || !picks.length) {
        regionalSection.hidden = true;
        return;
      }
      regionalSection.hidden = false;
      picks.forEach(function (item, index) {
        var card = createCard(item, "regional");
        reveal(card, index);
        regionalMount.appendChild(card);
      });
    }

    function renderGrid(items, featured) {
      if (!gridMount) return;
      var excluded = [];
      if (featured && !state.q && state.category === "all" && state.region === "all" && !state.topic) {
        excluded.push(featured.slug);
        selectRegional(ranked, location, featured, 3).forEach(function (item) {
          excluded.push(item.slug);
        });
      }

      var remaining = items.filter(function (item) {
        return excluded.indexOf(item.slug) === -1;
      });

      var pageItems = remaining.slice(0, visibleCount);
      gridMount.replaceChildren();
      pageItems.forEach(function (item, index) {
        var card = createCard(item, "grid");
        reveal(card, index);
        gridMount.appendChild(card);
      });

      if (emptyMount) emptyMount.hidden = items.length > 0;
      if (moreBtn) moreBtn.hidden = remaining.length <= visibleCount;
      setStatus(items.length);
    }

    function render() {
      renderCategories();
      renderRegions();
      renderTopics();
      if (search && search.value !== state.q) search.value = state.q;

      var filtered = applyFilters(ranked);
      var featured = selectFeatured(filtered, location);
      renderFeatured(featured);
      renderRegional(filtered, featured);
      renderGrid(filtered, featured);
    }

    if (search) {
      var searchTimer = null;
      search.addEventListener("input", function () {
        window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(function () {
          state.q = search.value;
          visibleCount = PAGE_SIZE;
          writeFiltersToUrl(state, true);
          render();
        }, 160);
      });
    }

    if (moreBtn) {
      moreBtn.addEventListener("click", function () {
        visibleCount += PAGE_SIZE;
        render();
      });
    }

    window.addEventListener("popstate", function () {
      state = readFiltersFromUrl();
      visibleCount = PAGE_SIZE;
      render();
    });

    ranked = [];
    if (loading) loading.hidden = false;

    detectLocation().then(function (loc) {
      location = loc || location;
      ranked = sortByRank(publishedInsights(), location);
      if (loading) loading.hidden = true;
      page.classList.remove("is-waiting");
      render();
    });
  }

  function asParagraphs(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    return [value];
  }

  function appendParagraphs(parent, value, className) {
    asParagraphs(value).forEach(function (text) {
      var p = document.createElement("p");
      if (className) p.className = className;
      p.textContent = text;
      parent.appendChild(p);
    });
  }

  function createFigure(image, mode) {
    if (!image || !image.src) return null;
    var figure = document.createElement("figure");
    figure.className = "ed-figure ed-figure--" + (mode || image.mode || "contained");
    var img = document.createElement("img");
    img.src = withRoot(image.src);
    img.alt = image.alt || "";
    img.decoding = "async";
    img.loading = "lazy";
    figure.appendChild(img);
    if (image.caption || image.credit) {
      var cap = document.createElement("figcaption");
      cap.className = "ed-caption";
      cap.textContent = image.caption || "";
      if (image.credit) {
        var credit = document.createElement("span");
        credit.className = "ed-caption__credit";
        credit.textContent = image.credit;
        cap.appendChild(document.createTextNode(image.caption ? " " : ""));
        cap.appendChild(credit);
      }
      figure.appendChild(cap);
    }
    return figure;
  }

  function createSectionHead(section) {
    if (!section.title) return null;
    var title = document.createElement("h2");
    title.className = "ed-section__title";
    title.textContent = section.title;
    return title;
  }

  function createProse(section) {
    var prose = document.createElement("div");
    prose.className = "ed-prose";
    var head = createSectionHead(section);
    if (head) prose.appendChild(head);
    appendParagraphs(prose, section.text);
    return prose;
  }

  function createThought(quote) {
    if (!quote) return null;
    var aside = document.createElement("aside");
    aside.className = "ed-thought";
    var label = document.createElement("p");
    label.className = "ed-thought__label";
    label.textContent = "Key thought";
    var block = document.createElement("blockquote");
    block.textContent = quote;
    aside.appendChild(label);
    aside.appendChild(block);
    return aside;
  }

  function createView(block, extraClass) {
    if (!block || (!block.text && !block.title)) return null;
    var section = document.createElement("section");
    section.className = "ed-view" + (extraClass ? " " + extraClass : "");
    if (block.title) {
      var h2 = document.createElement("h2");
      h2.textContent = block.title;
      section.appendChild(h2);
    }
    appendParagraphs(section, block.text);
    return section;
  }

  function renderSection(section) {
    if (!section) return null;
    var layout = section.layout || "text";
    var wrap = document.createElement("section");
    wrap.className = "ed-section ed-section--" + layout;

    if (layout === "key-thought" || layout === "quote") {
      var thought = createThought(section.quote || (asParagraphs(section.text)[0] || ""));
      if (thought) wrap.appendChild(thought);
      return wrap;
    }

    if (layout === "full-image") {
      if (section.title || section.text) wrap.appendChild(createProse(section));
      var full = createFigure(section.image, "contained");
      if (full) wrap.appendChild(full);
      return wrap;
    }

    if (layout === "text-image" || layout === "image-text") {
      wrap.appendChild(createProse(section));
      var support = createFigure(section.image, "contained");
      if (support) wrap.appendChild(support);
      return wrap;
    }

    if (layout === "two-images" || layout === "before-after") {
      if (section.title || section.text) wrap.appendChild(createProse(section));
      var pair = document.createElement("div");
      pair.className = "ed-pair";
      var first = createFigure(section.image, "contained");
      var second = createFigure(section.imageSecondary, "contained");
      if (first) pair.appendChild(first);
      if (second) pair.appendChild(second);
      wrap.appendChild(pair);
      return wrap;
    }

    wrap.appendChild(createProse(section));
    if (section.image) {
      var extra = createFigure(section.image, "contained");
      if (extra) wrap.appendChild(extra);
    }
    return wrap;
  }

  function setSeo(article) {
    var title = article.title + " — Terranova Strategy";
    document.title = title;
    var desc = article.excerpt || articleDeck(article);
    var canonical = "insights/article.html?slug=" + encodeURIComponent(article.slug);
    var cover = coverImage(article);
    function setMeta(selector, attr, value) {
      var el = document.querySelector(selector);
      if (el && value) el.setAttribute(attr, value);
    }
    setMeta('meta[name="description"]', "content", desc);
    setMeta('link[rel="canonical"]', "href", canonical);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", canonical);
    if (cover.src) setMeta('meta[property="og:image"]', "content", cover.src);

    var existing = document.getElementById("article-jsonld");
    if (existing) existing.remove();
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "article-jsonld";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": article.articleType === "case" ? "Article" : "Article",
      headline: article.title,
      description: desc,
      datePublished: article.date,
      dateModified: article.updated || article.date,
      author: { "@type": "Organization", name: (article.author && article.author.name) || "Terranova Strategy" },
      publisher: { "@type": "Organization", name: "Terranova Strategy" },
      image: cover.src ? withRoot(cover.src) : undefined,
      articleSection: articleTypeLabel(article),
      mainEntityOfPage: canonical,
    });
    document.head.appendChild(script);
  }

  function relatedList(article, loc) {
    var catalog = publishedInsights();
    if (article.relatedArticles && article.relatedArticles.length) {
      return article.relatedArticles.map(function (slug) {
        return catalog.filter(function (item) { return item.slug === slug; })[0];
      }).filter(Boolean).slice(0, 3);
    }
    return sortByRank(catalog.filter(function (item) {
      return item.slug !== article.slug;
    }), loc).slice(0, 3);
  }

  function renderArticlePage(article, loc) {
    var root = document.querySelector("[data-article-root]");
    if (!root) return;
    var type = article.articleType || "insight";
    root.className = "ed-article ed-article--" + type;
    root.replaceChildren();

    var frame = document.createElement("div");
    frame.className = "ed-frame";

    var crumb = document.createElement("p");
    crumb.className = "breadcrumb";
    crumb.innerHTML = '<a href="' + withRoot("index.html") + '">Home</a> / <a href="' + withRoot("insights.html") + '">Insights</a>';

    var kicker = document.createElement("p");
    kicker.className = "ed-kicker";
    kicker.textContent = articleTypeLabel(article) + " · " + categoryLabel(article.category);

    var h1 = document.createElement("h1");
    h1.className = "ed-title";
    h1.textContent = article.title;

    var meta = document.createElement("p");
    meta.className = "ed-meta";
    var metaBits = [formatDate(article.date)];
    if (article.readingTime) metaBits.push(article.readingTime + " min read");
    meta.textContent = metaBits.join(" · ");

    frame.appendChild(crumb);
    frame.appendChild(kicker);
    frame.appendChild(h1);
    frame.appendChild(meta);

    var hero = createFigure(coverImage(article), "contained");
    if (hero) {
      hero.classList.add("ed-hero");
      var heroImg = hero.querySelector("img");
      if (heroImg) heroImg.loading = "eager";
      frame.appendChild(hero);
    }

    if (article.intro) {
      var intro = document.createElement("div");
      intro.className = "ed-intro";
      appendParagraphs(intro, article.intro);
      frame.appendChild(intro);
    }

    var body = document.createElement("div");
    body.className = "ed-body";
    (article.sections || []).forEach(function (section) {
      var node = renderSection(section);
      if (node) body.appendChild(node);
    });
    frame.appendChild(body);

    if (article.meaning) {
      var meaning = createView(article.meaning, "ed-view--meaning");
      if (meaning) frame.appendChild(meaning);
    }

    var conclusion = createView(article.conclusion, "ed-view--close");
    if (conclusion) frame.appendChild(conclusion);

    if (type === "perspective" && article.author && article.author.name) {
      var author = document.createElement("aside");
      author.className = "ed-author";
      var authorName = document.createElement("p");
      authorName.className = "ed-author__name";
      authorName.textContent = article.author.name;
      author.appendChild(authorName);
      if (article.author.role) {
        var role = document.createElement("p");
        role.className = "ed-author__role";
        role.textContent = article.author.role;
        author.appendChild(role);
      }
      frame.appendChild(author);
    }

    var serviceId = article.relatedService && article.relatedService.id;
    var service = serviceId && window.PS_SERVICES ? window.PS_SERVICES[serviceId] : null;
    if (service) {
      var serviceBox = document.createElement("section");
      serviceBox.className = "ed-service";
      var brand = document.createElement("p");
      brand.className = "ed-service__brand";
      brand.textContent = "Terranova Strategy";
      var serviceTitle = document.createElement("h2");
      serviceTitle.textContent = service.title;
      serviceBox.appendChild(brand);
      serviceBox.appendChild(serviceTitle);
      appendParagraphs(serviceBox, article.relatedService.note);
      var serviceLink = document.createElement("a");
      serviceLink.className = "ed-text-link";
      serviceLink.href = withRoot(service.url);
      serviceLink.innerHTML = "Explore service " + svgArrow();
      serviceBox.appendChild(serviceLink);
      frame.appendChild(serviceBox);
    }

    var related = relatedList(article, loc);
    if (related.length) {
      var more = document.createElement("section");
      more.className = "ed-more";
      var moreTitle = document.createElement("h2");
      moreTitle.textContent = "More from Terranova";
      more.appendChild(moreTitle);
      related.forEach(function (item) {
        var link = document.createElement("a");
        link.className = "ed-more__item";
        link.href = articleUrl(item);
        var label = document.createElement("span");
        label.textContent = articleTypeLabel(item);
        var name = document.createElement("strong");
        name.textContent = item.title;
        link.appendChild(label);
        link.appendChild(name);
        more.appendChild(link);
      });
      frame.appendChild(more);
    }

    root.appendChild(frame);
  }

  function initArticle() {
    var page = document.querySelector("[data-article-page]");
    if (!page) return;

    var params = new URLSearchParams(window.location.search);
    var slug = params.get("slug") || page.dataset.insightId || "";
    var loading = page.querySelector("[data-article-loading]");
    var missing = page.querySelector("[data-article-missing]");

    var article = publishedInsights().filter(function (item) {
      return item.slug === slug;
    })[0];

    if (!article) {
      if (loading) loading.hidden = true;
      if (missing) missing.hidden = false;
      return;
    }

    setSeo(article);
    if (loading) loading.hidden = true;
    renderArticlePage(article, readCachedLocation() || locationFromTimezone() || { country: null, region: null, source: "none" });
    detectLocation().then(function (loc) {
      if (!loc || !loc.country) return;
      if (article.relatedArticles && article.relatedArticles.length) return;
      renderArticlePage(article, loc);
    });
  }

  function initHomeInsights() {
    var section = document.querySelector("[data-home-insights]");
    if (!section) return;
    var root = section.querySelector("[data-home-insights-root]");
    if (!root) return;

    function paint(loc) {
      var ranked = sortByRank(publishedInsights(), loc);
      if (!ranked.length) {
        section.hidden = true;
        return;
      }
      section.hidden = false;
      root.replaceChildren();

      var lead = ranked[0];
      var more = ranked.slice(1, 4);
      var cover = coverImage(lead);

      var featured = document.createElement("article");
      featured.className = "home-insights__lead";
      var leadLink = document.createElement("a");
      leadLink.className = "home-insights__lead-link";
      leadLink.href = articleUrl(lead);

      if (cover.src) {
        var media = document.createElement("figure");
        media.className = "home-insights__media";
        var img = document.createElement("img");
        img.src = withRoot(cover.src);
        img.alt = cover.alt || "";
        img.decoding = "async";
        img.loading = "lazy";
        img.width = 1400;
        img.height = 875;
        media.appendChild(img);
        leadLink.appendChild(media);
      }

      var copy = document.createElement("div");
      copy.className = "home-insights__lead-copy";
      var type = document.createElement("p");
      type.className = "home-insights__type";
      type.textContent = articleTypeLabel(lead) + " · " + categoryLabel(lead.category);
      var title = document.createElement("h2");
      title.textContent = lead.title;
      copy.appendChild(type);
      copy.appendChild(title);
      var deck = lead.excerpt || articleDeck(lead);
      if (deck) {
        var excerpt = document.createElement("p");
        excerpt.textContent = deck;
        copy.appendChild(excerpt);
      }
      leadLink.appendChild(copy);
      featured.appendChild(leadLink);
      reveal(featured, 0);
      root.appendChild(featured);

      if (more.length) {
        var list = document.createElement("div");
        list.className = "home-insights__list";
        more.forEach(function (item, index) {
          var link = document.createElement("a");
          link.className = "home-insights__item";
          link.href = articleUrl(item);
          var label = document.createElement("span");
          label.textContent = articleTypeLabel(item);
          var name = document.createElement("strong");
          name.textContent = item.title;
          link.appendChild(label);
          link.appendChild(name);
          reveal(link, index + 1);
          list.appendChild(link);
        });
        root.appendChild(list);
      }
    }

    paint(readCachedLocation() || locationFromTimezone() || { country: null, region: null, source: "none" });
    detectLocation().then(paint);
  }

  window.PS_INSIGHTS_RANKING = RANKING;

  initListing();
  initArticle();
  initHomeInsights();
})();
