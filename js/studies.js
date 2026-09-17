/**
 * Studies — single source of truth for everything OUTSIDE an article.
 *
 * This manifest drives three places automatically:
 *   1. The studies page grid            (studies.html)
 *   2. The homepage mosaic              (4 most recent)
 *   3. "Related studies" on articles    (same category first)
 *
 * The written content of a study lives in its own page under /studies/.
 *
 * TO PUBLISH A NEW STUDY
 *   1. Copy studies/_template.html and rename it to studies/<your-slug>.html
 *   2. Put its images in assets/images/studies/<your-slug>/
 *   3. Write the content inside the template's marked sections
 *   4. Add an entry below, newest first
 *
 * FIELDS
 *   id        unique slug — must match the filename
 *   title     formal study title (shown on the card and in the page title)
 *   category  exposure | response | recovery — drives the filter tabs
 *   service   service line that delivered it
 *   year      shown on the card, EBP-style
 *   date      YYYY-MM-DD — controls ordering only
 *   caption   short label for the homepage mosaic
 *   excerpt   one short sentence — listing card and article hero (copy into study-lead)
 *   image     cover image { src, alt } — path relative to the site root
 *   url       path to the article. OMIT IT and the card shows as
 *             "In preparation" and is not clickable.
 */
window.PS_STUDIES = [
  {
    id: "infrastructure-dependency",
    title: "Infrastructure dependency in urban systems",
    category: "exposure",
    service: "Territorial Exposure Assessment",
    year: 2026,
    date: "2026-03-01",
    caption: "Infrastructure dependency",
    excerpt: "How interconnected urban infrastructure creates hidden territorial exposure for businesses and public operators.",
    image: {
      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=700&q=80",
      alt: "City skyline at dusk",
    },
  },
  {
    id: "flood-exposure",
    title: "Flood exposure beyond the hazard map",
    category: "exposure",
    service: "Territorial Exposure Assessment",
    year: 2026,
    date: "2026-02-12",
    caption: "Flood exposure",
    excerpt: "Why standard flood layers often fail to reveal operational consequences for facilities and supply chains.",
    image: {
      src: "assets/images/territorial-disruption.jpg",
      alt: "Settlement and river valley severely affected by a destructive debris flow",
    },
    url: "studies/flood-exposure.html",
  },
  {
    id: "territorial-recovery",
    title: "Territorial recovery after large-scale disruption",
    category: "recovery",
    service: "Strategic Territorial Recovery",
    year: 2026,
    date: "2026-01-20",
    caption: "Territorial recovery",
    excerpt: "Prioritising regional recovery when multiple systems, places and economic activities fail at once.",
    image: {
      src: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=700&q=80",
      alt: "Container ship in port",
    },
  },
  {
    id: "economic-disruption",
    title: "Economic disruption across critical corridors",
    category: "exposure",
    service: "Territorial Exposure Assessment",
    year: 2025,
    date: "2025-12-08",
    caption: "Economic disruption",
    excerpt: "Assessing how transport and logistics corridors translate territorial hazards into business continuity risk.",
    image: {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80",
      alt: "Winding coastal road above cloud layer",
    },
  },
  {
    id: "facility-relocation",
    title: "When relocation becomes the rational response",
    category: "response",
    service: "Operational Disruption Response",
    year: 2025,
    date: "2025-11-15",
    caption: "Facility relocation",
    excerpt: "Decision criteria for abandoning, rebuilding or relocating assets after territorial disruption.",
    image: {
      src: "assets/images/Territorial%20reconstruction.jpeg",
      alt: "Damaged rail corridor under repair after a landslide, with heavy machinery on site",
    },
  },
  {
    id: "recovery-phasing",
    title: "Recovery phasing for regional stakeholders",
    category: "recovery",
    service: "Strategic Territorial Recovery",
    year: 2025,
    date: "2025-10-22",
    caption: "Recovery phasing",
    excerpt: "Sequencing territorial recovery when constraints, dependencies and political urgency all compete.",
    image: {
      src: "assets/images/Analytical%20Team%20on%20the%20ground.jpg",
      alt: "Analytical team assessing conditions on the ground after disruption",
    },
  },
];
