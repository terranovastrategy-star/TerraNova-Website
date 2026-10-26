/**
 * Point internal links at the same extensionless URLs as sitemap.xml.
 * Run from the site root: node js/link-sitemap-urls.js
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pairs = [
  ["studies/flood-exposure.html", "/studies/flood-exposure"],
  ["../studies/flood-exposure.html", "/studies/flood-exposure"],
  ["../../studies/flood-exposure.html", "/studies/flood-exposure"],
  ["index.html#services", "/#services"],
  ["../index.html#services", "/#services"],
  ["../../index.html#services", "/#services"],
  ["index.html", "/"],
  ["../index.html", "/"],
  ["../../index.html", "/"],
  ["about.html", "/about"],
  ["../about.html", "/about"],
  ["../../about.html", "/about"],
  ["exposure-assessment.html", "/exposure-assessment"],
  ["../exposure-assessment.html", "/exposure-assessment"],
  ["../../exposure-assessment.html", "/exposure-assessment"],
  ["disruption-response.html", "/disruption-response"],
  ["../disruption-response.html", "/disruption-response"],
  ["../../disruption-response.html", "/disruption-response"],
  ["territorial-recovery.html", "/territorial-recovery"],
  ["../territorial-recovery.html", "/territorial-recovery"],
  ["../../territorial-recovery.html", "/territorial-recovery"],
  ["insights.html", "/insights"],
  ["../insights.html", "/insights"],
  ["../../insights.html", "/insights"],
  ["contact.html", "/contact"],
  ["../contact.html", "/contact"],
  ["../../contact.html", "/contact"],
  ["privacy.html", "/privacy"],
  ["../privacy.html", "/privacy"],
  ["../../privacy.html", "/privacy"],
  ["legal.html", "/legal"],
  ["../legal.html", "/legal"],
  ["../../legal.html", "/legal"],
  ["studies.html", "/insights"],
  ["../studies.html", "/insights"],
  ["studies/_template.html", "/insights"],
];

function rewrite(html) {
  let next = html;
  for (const [from, to] of pairs) {
    next = next.split('href="' + from + '"').join('href="' + to + '"');
  }
  return next;
}

function walk(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "documents" || entry.name === "assets" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += walk(full);
    else if (entry.name.endsWith(".html")) {
      const before = fs.readFileSync(full, "utf8");
      const after = rewrite(before);
      if (after !== before) {
        fs.writeFileSync(full, after);
        count += 1;
      }
    }
  }
  return count;
}

const changed = walk(root);
console.log("Updated links in " + changed + " HTML files.");
