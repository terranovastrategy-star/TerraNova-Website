/**
 * Writes crawlable article HTML and listing links from js/insights-data.js.
 * Run from the site root: node js/build-insights-html.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sandbox = { window: {}, console };
vm.runInNewContext(fs.readFileSync(path.join(root, "js", "insights-data.js"), "utf8"), sandbox);
const insights = sandbox.window.PS_INSIGHTS.filter((item) => item && item.slug);
const services = sandbox.window.PS_SERVICES;

const CATEGORIES = {
  "natural-hazards": "Natural Hazards",
  "territorial-risk": "Territorial Risk",
  geopolitics: "Geopolitics",
  infrastructure: "Infrastructure",
  resilience: "Resilience",
  recovery: "Recovery",
};
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function typeLabel(item) {
  if (item.articleType === "case") return "Case";
  if (item.articleType === "perspective") return "Perspective";
  return "Insight";
}

function categoryLabel(id) {
  return CATEGORIES[id] || id || "";
}

function formatDate(iso) {
  const parts = String(iso || "").split("-");
  if (parts.length !== 3) return iso || "";
  return parseInt(parts[2], 10) + " " + MONTHS[parseInt(parts[1], 10) - 1] + " " + parts[0];
}

function paragraphs(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function prefix(rootPrefix, src) {
  if (!src || /^(https?:|\/|mailto:|tel:|#)/.test(src)) return src;
  return rootPrefix + src;
}

function rank(item) {
  const editorial = typeof item.editorialRelevance === "number" ? item.editorialRelevance : 0.5;
  const published = Date.parse(item.date);
  const horizon = 730 * 24 * 60 * 60 * 1000;
  const recency = Number.isNaN(published) ? 0.5 : Math.min(1, Math.max(0, 1 - Math.max(0, Date.now() - published) / horizon));
  const base = 0.4 * 0.5 + 0.25 * editorial + 0.2 * recency + 0.15 * (item.featured ? 1 : 0);
  return item.pinned ? base + 100 : base;
}

function byRank(list) {
  return list.slice().sort((a, b) => {
    const diff = rank(b) - rank(a);
    if (Math.abs(diff) > 0.0001) return diff;
    return Date.parse(b.date) - Date.parse(a.date);
  });
}

function figure(image, rootPrefix, extra) {
  if (!image || !image.src) return "";
  const caption = image.caption ? esc(image.caption) : "";
  const credit = image.credit ? `<span class="ed-caption__credit">${esc(image.credit)}</span>` : "";
  const figcaption = caption || credit
    ? `<figcaption class="ed-caption">${caption}${caption && credit ? " " : ""}${credit}</figcaption>`
    : "";
  const loading = extra === "ed-hero" ? "eager" : "lazy";
  const priority = extra === "ed-hero" ? ' fetchpriority="high"' : "";
  return `<figure class="ed-figure ed-figure--contained${extra ? " " + extra : ""}"><img src="${esc(prefix(rootPrefix, image.src))}" alt="${esc(image.alt || "")}" decoding="async" loading="${loading}"${priority}>${figcaption}</figure>`;
}

function prose(section, rootPrefix) {
  const title = section.title ? `<h2 class="ed-section__title">${esc(section.title)}</h2>` : "";
  const text = paragraphs(section.text).map((p) => `<p>${esc(p)}</p>`).join("");
  let link = "";
  if (section.link && section.link.href) {
    link = `<p class="ed-quiet-link"><a class="ed-text-link" href="${esc(prefix(rootPrefix, section.link.href))}">${esc(section.link.label || "Read more")} ${ARROW}</a></p>`;
  }
  return `<div class="ed-prose">${title}${text}${link}</div>`;
}

function sectionHtml(section, rootPrefix) {
  const layout = section.layout || "text";
  if (layout === "key-thought" || layout === "quote") {
    const quote = section.quote || paragraphs(section.text)[0] || "";
    return `<section class="ed-section ed-section--${layout}"><aside class="ed-thought"><p class="ed-thought__label">Key thought</p><blockquote>${esc(quote)}</blockquote></aside></section>`;
  }
  let inner = prose(section, rootPrefix);
  if (layout === "two-images" || layout === "before-after") {
    inner += `<div class="ed-pair">${figure(section.image, rootPrefix)}${figure(section.imageSecondary, rootPrefix)}</div>`;
  } else if (section.image) {
    inner += figure(section.image, rootPrefix);
  }
  return `<section class="ed-section ed-section--${layout}">${inner}</section>`;
}

function view(block, className) {
  if (!block || (!block.text && !block.title)) return "";
  const title = block.title ? `<h2>${esc(block.title)}</h2>` : "";
  const text = paragraphs(block.text).map((p) => `<p>${esc(p)}</p>`).join("");
  return `<section class="ed-view ${className}">${title}${text}</section>`;
}

function contactForm(rootPrefix) {
  const privacy = esc(prefix(rootPrefix, "privacy.html"));
  return `<section class="home-contact" aria-labelledby="article-contact-heading"><div class="home-contact__card"><form class="contact-form" id="article-contact-form" aria-label="Contact form" novalidate><h2 id="article-contact-heading">Contact us</h2><p class="home-contact__lead">Please complete the form with your details, and we will be in touch shortly.</p><div class="home-contact__fields"><div class="contact-form__row"><div class="contact-form__field"><label for="article-contact-first">First name <span class="contact-form__req" aria-hidden="true">*</span></label><input class="field" type="text" id="article-contact-first" name="first_name" autocomplete="given-name" required></div><div class="contact-form__field"><label for="article-contact-last">Last name <span class="contact-form__req" aria-hidden="true">*</span></label><input class="field" type="text" id="article-contact-last" name="last_name" autocomplete="family-name" required></div></div><div class="contact-form__field"><label for="article-contact-email">Work email <span class="contact-form__req" aria-hidden="true">*</span></label><input class="field" type="email" id="article-contact-email" name="email" autocomplete="email" required></div><div class="contact-form__field"><label for="article-contact-organisation">Organisation <span class="contact-form__req" aria-hidden="true">*</span></label><input class="field" type="text" id="article-contact-organisation" name="organisation" autocomplete="organization" required></div><div class="contact-form__field home-contact__span"><label for="article-contact-topic">Topic <span class="contact-form__req" aria-hidden="true">*</span></label><select class="field" id="article-contact-topic" name="topic" required><option value="">Select…</option><option value="exposure">Territorial Exposure Assessment</option><option value="response">Crisis Management and Business Continuity</option><option value="recovery">Strategic Territorial Recovery</option><option value="general">General enquiry</option></select></div></div><div class="home-contact__actions"><label class="contact-form__consent"><input type="checkbox" id="article-contact-privacy" name="privacy" required><span>I have read the <a href="${privacy}">Privacy Policy</a>. <span class="contact-form__req" aria-hidden="true">*</span></span></label><button type="submit" class="contact-form__submit">Submit</button></div><input class="contact-honey" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="form-note" aria-live="polite"></p></form></div></section>`;
}

function articleBody(article, rootPrefix) {
  const related = (article.relatedArticles || [])
    .map((slug) => insights.find((item) => item.slug === slug))
    .filter(Boolean)
    .slice(0, 3);
  const service = article.relatedService && services[article.relatedService.id];
  const meta = [formatDate(article.date), article.readingTime ? article.readingTime + " min read" : ""].filter(Boolean).join(" · ");
  const intro = paragraphs(article.intro).map((p) => `<p>${esc(p)}</p>`).join("");
  const author = article.articleType === "perspective" && article.author && article.author.name
    ? `<aside class="ed-author"><p class="ed-author__name">${esc(article.author.name)}</p>${article.author.role ? `<p class="ed-author__role">${esc(article.author.role)}</p>` : ""}</aside>`
    : "";
  const serviceBox = service
    ? `<section class="ed-service"><p class="ed-service__brand">Terranova Strategy</p><h2>${esc(service.title)}</h2>${paragraphs(article.relatedService.note).map((p) => `<p>${esc(p)}</p>`).join("")}<a class="ed-text-link" href="${esc(prefix(rootPrefix, service.url))}">Explore service ${ARROW}</a></section>`
    : "";
  const more = related.length
    ? `<section class="ed-more"><h2>More from Terranova</h2>${related.map((item) => `<a class="ed-more__item" href="/insights/${esc(item.slug)}"><span>${esc(typeLabel(item))}</span><strong>${esc(item.title)}</strong></a>`).join("")}</section>`
    : "";
  return `<article class="ed-article ed-article--${esc(article.articleType || "insight")}" data-article-root>
      <div class="ed-frame">
        <p class="breadcrumb"><a href="/">Home</a> / <a href="/insights">Insights</a></p>
        <p class="ed-kicker">${esc(typeLabel(article))} · ${esc(categoryLabel(article.category))}</p>
        <h1 class="ed-title">${esc(article.title)}</h1>
        <p class="ed-meta">${esc(meta)}</p>
        ${figure(article.heroImage || article.image, rootPrefix, "ed-hero")}
        ${intro ? `<div class="ed-intro">${intro}</div>` : ""}
        <div class="ed-body">${(article.sections || []).map((section) => sectionHtml(section, rootPrefix)).join("")}</div>
        ${view(article.meaning, "ed-view--meaning")}
        ${view(article.conclusion, "ed-view--close")}
        ${author}
        ${serviceBox}
        ${more}
        ${article.contactCta ? contactForm(rootPrefix) : ""}
      </div>
    </article>`;
}

function card(item, variant, rootPrefix) {
  const cover = item.heroImage || item.image || {};
  const featured = variant === "featured";
  const titleTag = featured ? "h2" : "h3";
  const geo = (item.regions && item.regions[0]) || (item.global ? "Global" : "");
  const meta = [geo, item.readingTime + " min read", formatDate(item.date)].filter(Boolean).join(" · ");
  const cta = featured
    ? `<span class="insight-featured__cta">Read the article ${ARROW}</span>`
    : `<span class="insight-card__arrow" aria-hidden="true">${ARROW}</span>`;
  return `<article class="${featured ? "insight-featured" : "insight-card"}${variant === "regional" ? " insight-card--regional" : ""}"><a class="${featured ? "insight-featured__link" : "insight-card__link"}" href="/insights/${esc(item.slug)}"><div class="${featured ? "insight-featured__media" : "insight-card__media"}"><img src="${esc(prefix(rootPrefix, cover.src))}" alt="${esc(cover.alt || "")}" decoding="async" loading="${featured ? "eager" : "lazy"}" width="${featured ? 1400 : 800}" height="${featured ? 900 : 500}"></div><div class="${featured ? "insight-featured__body" : "insight-card__body"}"><p class="${featured ? "insight-featured__category" : "insight-card__category"}">${esc(typeLabel(item))} · ${esc(categoryLabel(item.category))}</p><${titleTag}>${esc(item.title)}</${titleTag}><p class="${featured ? "insight-featured__excerpt" : "insight-card__excerpt"}">${esc(item.excerpt || item.deck || "")}</p><p class="${featured ? "insight-featured__meta" : "insight-card__meta"}">${esc(meta)}</p>${cta}</div></a></article>`;
}

function homeBlock(ranked) {
  const lead = ranked[0];
  const more = ranked.slice(1, 4);
  const cover = lead.heroImage || lead.image || {};
  const deck = lead.excerpt || lead.deck || "";
  const list = more.map((item) => `<a class="home-insights__item" href="/insights/${esc(item.slug)}"><span>${esc(typeLabel(item))}</span><strong>${esc(item.title)}</strong></a>`).join("");
  return `<article class="home-insights__lead"><a class="home-insights__lead-link" href="/insights/${esc(lead.slug)}"><figure class="home-insights__media"><img src="${esc(cover.src)}" alt="${esc(cover.alt || "")}" decoding="async" loading="lazy" width="1400" height="875"></figure><div class="home-insights__lead-copy"><p class="home-insights__type">${esc(typeLabel(lead))} · ${esc(categoryLabel(lead.category))}</p><h2>${esc(lead.title)}</h2>${deck ? `<p>${esc(deck)}</p>` : ""}</div></a></article><div class="home-insights__list">${list}</div>`;
}

function replaceBlock(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error("Pattern not found: " + pattern);
  return html.replace(pattern, replacement);
}

const ranked = byRank(insights);
const featured = insights.find((item) => item.listingLead) || ranked.find((item) => item.featured) || ranked[0];
const rest = ranked.filter((item) => item.slug !== featured.slug);

function documentTitle(article) {
  if (article.metaTitle) return article.metaTitle;
  const branded = article.title + " — Terranova Strategy";
  if (branded.length <= 60) return branded;
  return article.title;
}

function documentDescription(article) {
  return article.metaDescription || article.excerpt || article.deck || "";
}

function patchArticleHead(html, article) {
  const title = esc(documentTitle(article));
  const desc = esc(documentDescription(article));
  html = html.replace(/<title>[\s\S]*?<\/title>/, "<title>" + title + "</title>");
  html = html.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + desc + '">');
  html = html.replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + title + '">');
  html = html.replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + desc + '">');
  const image = (article.heroImage || article.image || {}).src;
  if (image && !html.includes('rel="preload" as="image"')) {
    const href = "../" + String(image).replace(/ /g, "%20");
    html = html.replace("</title>", '</title>\n  <link rel="preload" as="image" href="' + href + '">');
  }
  return html;
}

for (const article of insights) {
  const file = path.join(root, "insights", article.slug + ".html");
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(
    /<p class="insights-loading container" data-article-loading(?: hidden)?>Loading<\/p>/,
    '<p class="insights-loading container" data-article-loading hidden>Loading</p>'
  );
  html = replaceBlock(html, /<article\b[^>]*data-article-root[\s\S]*?<\/article>/, articleBody(article, "../"));
  html = patchArticleHead(html, article);
  fs.writeFileSync(file, html);
  const title = documentTitle(article);
  const desc = documentDescription(article);
  if (title.length > 60 || desc.length > 160) {
    console.log("LONG", article.slug, title.length, desc.length);
  }
}

function prefixAttrs(html, prefix) {
  if (!prefix) return html;
  return html.replace(/\b(href|src)="([^"]+)"/g, function (all, attr, url) {
    if (/^(https?:|mailto:|tel:|#|\/)/.test(url)) return all;
    return attr + '="' + prefix + url + '"';
  });
}

function fillMarked(html, marker, content) {
  const start = "<!--" + marker + "-->";
  const end = "<!--/" + marker + "-->";
  const pattern = new RegExp(start + "[\\s\\S]*?" + end);
  if (!pattern.test(html)) throw new Error("Missing marker " + marker);
  return html.replace(pattern, start + "\n" + content + "\n" + end);
}

let index = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!index.includes("<!--home-insights-->")) {
  index = index.replace(
    '<div class="home-insights__body" data-home-insights-root></div>',
    '<div class="home-insights__body" data-home-insights-root><!--home-insights--><!--/home-insights--></div>'
  );
}
index = fillMarked(index, "home-insights", "          " + homeBlock(ranked));
fs.writeFileSync(path.join(root, "index.html"), index);

let listing = fs.readFileSync(path.join(root, "insights.html"), "utf8");
listing = listing.replace('data-insights-page class="is-waiting"', "data-insights-page");
listing = listing.replace(
  /<p class="insights-loading container" data-insights-loading(?: hidden)?>Loading insights<\/p>/,
  '<p class="insights-loading container" data-insights-loading hidden>Loading insights</p>'
);
if (!listing.includes("<!--insights-featured-->")) {
  listing = listing.replace(
    '<div class="container" data-insights-featured></div>',
    '<div class="container" data-insights-featured><!--insights-featured--><!--/insights-featured--></div>'
  );
}
if (!listing.includes("<!--insights-grid-->")) {
  listing = listing.replace(
    '<div class="insights-grid" data-insights-grid></div>',
    '<div class="insights-grid" data-insights-grid><!--insights-grid--><!--/insights-grid--></div>'
  );
}
listing = fillMarked(listing, "insights-featured", "        " + card(featured, "featured", ""));
listing = fillMarked(listing, "insights-grid", "          " + rest.map((item) => card(item, "grid", "")).join("\n          "));
const status = rest.length + 1 === 1 ? "1 insight" : (rest.length + 1) + " insights";
listing = listing.replace(
  /<p class="insights-status" data-insights-status aria-live="polite"><\/p>/,
  `<p class="insights-status" data-insights-status aria-live="polite">${status}</p>`
);

const listItems = ranked.map((item, i) =>
  `          { "@type": "ListItem", "position": ${i + 1}, "name": ${JSON.stringify(item.title)}, "url": "https://terranovastrategy.com/insights/${item.slug}" }`
).join(",\n");
const itemListJson =
  `,\n      {\n        "@type": "ItemList",\n        "name": "Insights",\n        "itemListElement": [\n${listItems}\n        ]\n      }`;
if (listing.includes('"@type": "ItemList"')) {
  listing = listing.replace(/,\s*\{\s*"@type": "ItemList"[\s\S]*?\n      \}/, itemListJson);
} else {
  listing = listing.replace(
    /(\s*)(\]\s*\n\s*\}\s*\n\s*<\/script>)/,
    "$1" + itemListJson + "$1$2"
  );
}

fs.writeFileSync(path.join(root, "insights.html"), listing);
fs.mkdirSync(path.join(root, "insights"), { recursive: true });
fs.writeFileSync(path.join(root, "insights", "index.html"), prefixAttrs(listing, "../"));

for (const article of insights) {
  const file = path.join(root, "insights", article.slug + ".html");
  const prettyDir = path.join(root, "insights", article.slug);
  fs.mkdirSync(prettyDir, { recursive: true });
  fs.writeFileSync(path.join(prettyDir, "index.html"), prefixAttrs(fs.readFileSync(file, "utf8"), "../"));
}

const footerFile = fs.readFileSync(path.join(root, "includes", "footer.html"), "utf8");
const footerInner = footerFile.replace(/^<footer[^>]*>/, "").replace(/<\/footer>\s*$/, "").trim();

function bakeFooter(file) {
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes('data-include="footer"') || html.includes("footer-brand")) return;
  const nested = file.includes(path.sep + "insights" + path.sep) || file.includes(path.sep + "studies" + path.sep);
  const inner = prefixAttrs(footerInner, nested ? "../" : "");
  html = html.replace(
    '<footer class="site-footer" data-include="footer"></footer>',
    '<footer class="site-footer" data-include="footer">\n' + inner + "\n</footer>"
  );
  fs.writeFileSync(file, html);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "assets" || entry.name === "documents" || entry.name === "includes") continue;
      walk(full);
    } else if (entry.name.endsWith(".html")) {
      bakeFooter(full);
    }
  }
}

walk(root);

console.log("Wrote " + insights.length + " articles, homepage links, the insights index, and static footers.");
