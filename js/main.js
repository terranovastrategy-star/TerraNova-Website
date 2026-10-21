(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------
     Service hero images (shared with homepage)
     --------------------------------------------- */

  function applyServiceImages() {
    const config = window.PS_SERVICE_IMAGES;
    if (!config) return;

    const servicePage = document.querySelector("main[data-service]");
    if (servicePage) {
      const data = config[servicePage.dataset.service];
      const heroImg = servicePage.querySelector(".offer-hero__media img, .service-hero__media img");
      if (data && heroImg) {
        heroImg.src = data.src;
        heroImg.alt = data.alt;
        heroImg.decoding = "async";
        heroImg.setAttribute("fetchpriority", "high");
      }
    }

    document.querySelectorAll(".service-card[data-service]").forEach(function (card) {
      const data = config[card.dataset.service];
      const img = card.querySelector(".service-card__image");
      if (data && img) {
        img.src = data.src;
        img.alt = data.alt;
        img.decoding = "async";
        img.loading = "lazy";
      }
    });
  }

  applyServiceImages();

  /* ---------------------------------------------
     Homepage service cards — open one, close to reach the next
     --------------------------------------------- */

  (function initServiceCards() {
    var grid = document.querySelector(".services-grid");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".service-card"));
    var rowQuery = window.matchMedia("(min-width: 901px)");

    function rowLayout() {
      return rowQuery.matches;
    }

    function setOpen(card, focusClose) {
      cards.forEach(function (other) {
        var on = other === card;
        other.classList.toggle("is-open", on);
        var panel = other.querySelector(".service-card__panel");
        if (panel) panel.setAttribute("aria-expanded", on ? "true" : "false");
      });
      if (focusClose && card) {
        var closeBtn = card.querySelector(".service-card__close");
        if (closeBtn) closeBtn.focus();
      }
    }

    function clearOpen(returnFocus) {
      var open = grid.querySelector(".service-card.is-open");
      var panel = open ? open.querySelector(".service-card__panel") : null;
      setOpen(null, false);
      if (returnFocus && panel) panel.focus();
    }

    grid.addEventListener("click", function (event) {
      var closeBtn = event.target.closest(".service-card__close");
      if (closeBtn && grid.contains(closeBtn)) {
        event.preventDefault();
        clearOpen(true);
        return;
      }

      var panel = event.target.closest(".service-card__panel");
      if (!panel || !grid.contains(panel)) return;
      if (!rowLayout()) return;

      var card = panel.closest(".service-card");
      if (card.classList.contains("is-open")) return;

      event.preventDefault();
      setOpen(card, true);
    });

    document.addEventListener("click", function (event) {
      if (!grid.querySelector(".service-card.is-open")) return;
      if (grid.contains(event.target)) return;
      clearOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (!grid.querySelector(".service-card.is-open")) return;
      if (document.querySelector(".contact-popup.is-open")) return;
      event.preventDefault();
      clearOpen(true);
    });

    rowQuery.addEventListener("change", function () {
      if (!rowQuery.matches) clearOpen(false);
    });
  })();

  /* ---------------------------------------------
     Who we work with (js/clients.js)
     --------------------------------------------- */

  function applyClients() {
    const section = document.querySelector("[data-home-clients]");
    if (!section) return;
    const list = section.querySelector("[data-clients-root]");
    const clients = (window.TN_CLIENTS || []).filter(function (client) {
      return client && client.name && client.url && client.logo;
    });

    if (!list || !clients.length) {
      section.hidden = true;
      return;
    }

    clients.forEach(function (client) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = "home-clients__link";
      link.href = client.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", client.name + " (opens in a new tab)");

      const img = document.createElement("img");
      img.src = (document.body.dataset.root || "") + client.logo;
      img.alt = "";
      if (client.width) img.width = client.width;
      if (client.height) img.height = client.height;
      img.loading = "lazy";
      img.decoding = "async";

      link.appendChild(img);
      item.appendChild(link);
      list.appendChild(item);
    });
  }

  applyClients();

  /* ---------------------------------------------
     Studies (shared with homepage preview)
     --------------------------------------------- */

  const CATEGORY_LABELS = {
    exposure: "Exposure",
    response: "Response",
    recovery: "Recovery",
  };

  const STUDIES_PER_PAGE = 9;

  /* Study pages live in /studies/, so they set data-root="../" on <body>.
     Every path stored in the manifest is relative to the site root. */
  const ROOT = document.body.dataset.root || "";

  function withRoot(path) {
    if (!path || /^(https?:|\/|mailto:|tel:|#)/.test(path)) return path;
    return ROOT + path;
  }

  /* Shared footer: edit includes/footer.html — every page mounts it here. */
  function includeFooter() {
    var mount = document.querySelector("[data-include='footer']");
    if (!mount) return;

    fetch(withRoot("includes/footer.html?v=11"))
      .then(function (response) {
        if (!response.ok) throw new Error("Footer include failed");
        return response.text();
      })
      .then(function (html) {
        var wrap = document.createElement("div");
        wrap.innerHTML = html.trim();
        var footer = wrap.querySelector("footer") || wrap.firstElementChild;
        if (!footer) return;

        footer.querySelectorAll("[href]").forEach(function (el) {
          el.setAttribute("href", withRoot(el.getAttribute("href")));
        });
        footer.querySelectorAll("[src]").forEach(function (el) {
          el.setAttribute("src", withRoot(el.getAttribute("src")));
        });

        mount.replaceWith(footer);
      })
      .catch(function () {
        mount.removeAttribute("hidden");
      });
  }

  includeFooter();

  function getSortedStudies() {
    const studies = window.PS_STUDIES;
    if (!studies || !studies.length) return [];

    return studies.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  function formatStudyMeta(study) {
    const label = CATEGORY_LABELS[study.category] || study.category;
    const year = study.year || new Date(study.date).getFullYear();

    return label + " · " + year;
  }

  function createStudyCard(study, index) {
    const article = document.createElement("article");
    const delayClass = index % 3 === 0 ? "" : " reveal-delay-" + (index % 3);
    const published = Boolean(study.url);

    article.className = "study-card reveal" + delayClass + (published ? "" : " is-unpublished");
    article.dataset.category = study.category;

    /* A study without a url has no article yet, so the card is not a link. */
    const body = document.createElement(published ? "a" : "div");
    body.className = "study-card__link";
    if (published) body.href = withRoot(study.url);

    const media = document.createElement("div");
    media.className = "study-card__media";

    const image = document.createElement("img");
    image.className = "study-card__image";
    image.src = withRoot(study.image.src);
    image.alt = study.image.alt;
    image.decoding = "async";
    image.loading = "lazy";
    image.setAttribute("width", "700");
    image.setAttribute("height", "438");

    const meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = formatStudyMeta(study);

    const title = document.createElement("h3");
    title.textContent = study.title;

    const excerpt = document.createElement("p");
    excerpt.textContent = study.excerpt;

    media.appendChild(image);
    body.appendChild(media);
    body.appendChild(meta);
    body.appendChild(title);
    body.appendChild(excerpt);

    if (!published) {
      const tag = document.createElement("span");
      tag.className = "study-card__tag";
      tag.textContent = "In preparation";
      body.appendChild(tag);
    }

    article.appendChild(body);

    return article;
  }

  function renderStudiesList() {
    const list = document.querySelector("[data-studies-list]");
    const studies = getSortedStudies();
    if (!list || !studies.length) return;

    list.replaceChildren();

    studies.forEach(function (study, index) {
      list.appendChild(createStudyCard(study, index));
    });
  }

  function renderStudiesPreview() {
    const container = document.querySelector("[data-studies-preview]");
    const studies = getSortedStudies().slice(0, 4);
    if (!container || !studies.length) return;

    container.replaceChildren();

    studies.forEach(function (study, index) {
      const published = Boolean(study.url);
      const item = document.createElement(published ? "a" : "div");
      item.className = "mosaic-item" + (index === 0 ? " mosaic-item--lead" : "");
      if (published) item.href = withRoot(study.url);

      const image = document.createElement("img");
      image.src = withRoot(study.image.src).replace("w=700", index === 0 ? "w=1400" : "w=700");
      image.alt = study.image.alt;
      image.decoding = "async";
      image.loading = "lazy";
      image.setAttribute("width", index === 0 ? "1400" : "700");
      image.setAttribute("height", index === 0 ? "900" : "450");

      const caption = document.createElement("span");
      caption.className = "mosaic-item__caption";
      caption.textContent = study.caption || study.title;

      item.appendChild(image);
      item.appendChild(caption);
      container.appendChild(item);
    });
  }

  /* Related studies on an article page: same category first, then most
     recent, never the study being read, and only published ones. */
  function renderRelatedStudies() {
    const container = document.querySelector("[data-studies-related]");
    if (!container) return;

    const article = document.querySelector("[data-study-id]");
    const currentId = article ? article.dataset.studyId : null;
    const current = getSortedStudies().find(function (study) {
      return study.id === currentId;
    });

    const candidates = getSortedStudies().filter(function (study) {
      return study.id !== currentId && study.url;
    });

    if (current) {
      candidates.sort(function (a, b) {
        const aMatch = a.category === current.category ? 0 : 1;
        const bMatch = b.category === current.category ? 0 : 1;
        return aMatch - bMatch;
      });
    }

    const related = candidates.slice(0, 3);

    if (!related.length) {
      const section = container.closest(".study-related");
      if (section) section.hidden = true;
      return;
    }

    container.replaceChildren();

    related.forEach(function (study, index) {
      container.appendChild(createStudyCard(study, index));
    });
  }

  /* Highlights the section currently being read in the article index. */
  function initStudyIndex() {
    const index = document.querySelector(".study-index");
    if (!index) return;

    const links = Array.prototype.slice.call(index.querySelectorAll("a[href^='#']"));
    const sections = links
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    if (sections.length !== links.length || !sections.length) return;

    let spyTicking = false;

    function highlight() {
      const marker = window.scrollY + window.innerHeight * 0.35;
      let current = 0;

      sections.forEach(function (section, i) {
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) current = i;
      });

      links.forEach(function (link, i) {
        link.classList.toggle("is-current", i === current);
      });

      spyTicking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!spyTicking) {
          window.requestAnimationFrame(highlight);
          spyTicking = true;
        }
      },
      { passive: true }
    );

    highlight();
  }

  function applyStudies() {
    renderStudiesList();
    renderStudiesPreview();
    renderRelatedStudies();
    initStudyIndex();
  }

  applyStudies();

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const dropdown = document.querySelector(".nav-dropdown");
  const dropdownTrigger = document.querySelector(".nav-dropdown__trigger");

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  const progressBar = document.createElement("span");
  progressBar.className = "scroll-progress__bar";
  progress.appendChild(progressBar);
  document.body.appendChild(progress);

  /* ---------------------------------------------
     Scroll: header state, progress
     --------------------------------------------- */

  let ticking = false;

  function onScroll() {
    const current = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (header) {
      header.classList.toggle("is-scrolled", current > 12);
    }

    progressBar.style.width = docHeight > 0 ? (current / docHeight) * 100 + "%" : "0%";

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  onScroll();

  /* ---------------------------------------------
     Mobile navigation
     --------------------------------------------- */

  if (menuToggle && mobileNav) {
    function setMobileNav(open) {
      menuToggle.classList.toggle("is-open", open);
      mobileNav.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
      if (header) header.classList.toggle("is-nav-open", open);
    }

    menuToggle.addEventListener("click", function () {
      setMobileNav(!mobileNav.classList.contains("is-open"));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMobileNav(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mobileNav.classList.contains("is-open")) {
        setMobileNav(false);
        menuToggle.focus();
      }
    });
  }

  /* ---------------------------------------------
     Services dropdown
     --------------------------------------------- */

  if (dropdown && dropdownTrigger) {
    dropdownTrigger.addEventListener("click", function (event) {
      if (window.matchMedia("(min-width: 901px)").matches) {
        event.preventDefault();
        const open = dropdown.classList.toggle("is-open");
        dropdownTrigger.setAttribute("aria-expanded", String(open));
      }
    });

    document.addEventListener("click", function (event) {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("is-open");
        dropdownTrigger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        dropdown.classList.remove("is-open");
        dropdownTrigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------
     Scroll reveals + counters
     --------------------------------------------- */

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }

    const duration = 950;
    const start = performance.now();

    function step(now) {
      const progressRatio = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      el.textContent = String(Math.round(target * eased));
      if (progressRatio < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  const revealItems = document.querySelectorAll(".reveal, .reveal-clip, .section-feature");

  function showReveal(el) {
    el.classList.add("is-visible");
    el.querySelectorAll("[data-count]").forEach(animateCount);
  }

  if (reduceMotion) {
    revealItems.forEach(showReveal);
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          showReveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealItems.forEach(showReveal);
  }

  /* ---------------------------------------------
     Studies filter
     --------------------------------------------- */

  const filterTabs = document.querySelectorAll(".filter-tab");
  const studiesList = document.querySelector("[data-studies-list]");
  const loadMore = document.querySelector("[data-studies-more]");

  if (studiesList) {
    let activeFilter = "all";
    let visibleCount = STUDIES_PER_PAGE;

    /* A card shows when it matches the filter AND falls within the
       current page. Both controls therefore share one update pass. */
    function updateStudiesView(animate) {
      const cards = studiesList.querySelectorAll(".study-card");
      let matched = 0;

      cards.forEach(function (card) {
        const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
        const withinPage = matchesFilter && matched < visibleCount;

        if (matchesFilter) matched += 1;

        card.classList.remove("is-entering");
        card.classList.toggle("is-hidden", !withinPage);

        if (withinPage && animate) {
          void card.offsetWidth;
          /* A hidden card never intersects, so newly revealed cards would
             stay stuck at opacity 0 waiting for the observer. */
          card.classList.add("is-entering", "is-visible");
        }
      });

      if (loadMore) loadMore.hidden = matched <= visibleCount;
    }

    filterTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activeFilter = tab.dataset.filter;
        visibleCount = STUDIES_PER_PAGE;

        filterTabs.forEach(function (other) {
          other.classList.toggle("is-active", other === tab);
          other.setAttribute("aria-selected", String(other === tab));
        });

        updateStudiesView(true);
      });
    });

    if (loadMore) {
      loadMore.addEventListener("click", function () {
        visibleCount += STUDIES_PER_PAGE;
        updateStudiesView(true);
      });
    }

    updateStudiesView(false);
  }

  /* ---------------------------------------------
     Contact forms → contact@terranovastrategy.com
     --------------------------------------------- */

  var CONTACT_INBOX = "contact@terranovastrategy.com";
  var TOPIC_LABELS = {
    exposure: "Territorial Exposure Assessment",
    response: "Operational Disruption Response",
    recovery: "Strategic Territorial Recovery",
    general: "General enquiry"
  };
  var SECTOR_LABELS = {
    private: "Private business",
    public: "Public organisation"
  };

  function topicLabel(value) {
    return TOPIC_LABELS[value] || value || "Enquiry";
  }

  function sectorLabel(value) {
    return SECTOR_LABELS[value] || value || "";
  }

  function setFormNote(note, message, state) {
    if (!note) return;
    note.textContent = message;
    note.classList.remove("is-error", "is-success");
    if (state) note.classList.add(state);
  }

  function sendContactPayload(payload) {
    var pageUrl = window.location.href;
    var body = {
      _subject: "Terranova Strategy enquiry — " + topicLabel(payload.topic),
      _template: "table",
      _captcha: "false",
      _replyto: payload.email,
      _url: pageUrl,
      name: [payload.first_name, payload.last_name].filter(Boolean).join(" "),
      email: payload.email,
      phone: payload.phone || "",
      role: payload.role || "",
      organisation: payload.organisation || payload.company || "",
      country: payload.country || "",
      sector: sectorLabel(payload.sector),
      topic: topicLabel(payload.topic),
      message: payload.message || payload.comments || "",
      source: payload.source || "Website",
      page: pageUrl
    };

    return fetch("https://formsubmit.co/ajax/" + CONTACT_INBOX, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body)
    }).then(function (response) {
      return response.json().then(function (data) {
        var pendingActivation = data && /activat/i.test(String(data.message || ""));
        if (pendingActivation) return data;
        if (!response.ok || data.success === "false" || data.success === false) {
          throw new Error((data && data.message) || "Send failed");
        }
        return data;
      }, function () {
        if (!response.ok) throw new Error("Send failed");
      });
    });
  }

  function bindContactForm(form, options) {
    if (!form) return;
    var settings = options || {};
    var note = settings.note || form.querySelector(".form-note");
    var submit = settings.submit || form.querySelector('[type="submit"]');
    var idleLabel = submit ? submit.textContent : "Submit";

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var payload = { source: settings.source || "Website" };
      data.forEach(function (value, key) {
        if (key === "privacy" || key === "_honey") return;
        payload[key] = String(value).trim();
      });

      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending…";
      }
      setFormNote(note, "Sending your message…");

      sendContactPayload(payload)
        .then(function () {
          form.reset();
          if (typeof settings.onReset === "function") settings.onReset();
          setFormNote(
            note,
            "Thank you. Your message has been sent. We will reply to the email you provided.",
            "is-success"
          );
        })
        .catch(function () {
          setFormNote(
            note,
            "The message could not be sent. Please email " + CONTACT_INBOX + " or try again.",
            "is-error"
          );
        })
        .then(function () {
          if (submit) {
            submit.disabled = false;
            submit.textContent = idleLabel;
          }
        });
    });
  }

  bindContactForm(document.getElementById("contact-form"), { source: "Contact page" });
  bindContactForm(document.getElementById("home-contact-form"), { source: "Homepage" });
  bindContactForm(document.getElementById("article-contact-form"), { source: "Insights article" });

  /* ---------------------------------------------
     Contact popup (CTAs only; nav/footer still go to contact.html)
     --------------------------------------------- */

  function isContactHref(href) {
    return Boolean(href) && /contact\.html(?:[?#]|$)/.test(href);
  }

  function isContactCta(link) {
    if (!link || !isContactHref(link.getAttribute("href"))) return false;
    return !link.closest(".main-nav, .mobile-nav, .footer-directory, .footer-legal, .contact-popup");
  }

  (function initContactPopup() {
    const root = document.createElement("div");
    root.className = "contact-popup";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML =
      '<button type="button" class="contact-popup__backdrop" tabindex="-1" aria-label="Close contact form"></button>' +
      '<div class="contact-popup__panel" role="dialog" aria-modal="true" aria-labelledby="contact-popup-title" tabindex="-1">' +
        '<button type="button" class="contact-popup__close" aria-label="Close">' +
          '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>' +
        "</button>" +
        '<h2 class="contact-popup__title" id="contact-popup-title">Contact us</h2>' +
        '<form class="contact-popup__form" id="contact-popup-form" novalidate>' +
          '<div class="contact-popup__row">' +
            '<div class="contact-popup__field">' +
              '<label for="contact-popup-first">First name <span class="contact-popup__req" aria-hidden="true">*</span></label>' +
              '<input class="field" type="text" id="contact-popup-first" name="first_name" autocomplete="given-name" required>' +
            "</div>" +
            '<div class="contact-popup__field">' +
              '<label for="contact-popup-last">Last name <span class="contact-popup__req" aria-hidden="true">*</span></label>' +
              '<input class="field" type="text" id="contact-popup-last" name="last_name" autocomplete="family-name" required>' +
            "</div>" +
          "</div>" +
          '<div class="contact-popup__field">' +
            '<label for="contact-popup-email">Email <span class="contact-popup__req" aria-hidden="true">*</span></label>' +
            '<input class="field" type="email" id="contact-popup-email" name="email" autocomplete="email" required>' +
          "</div>" +
          '<div class="contact-popup__field">' +
            '<label for="contact-popup-company">Business / Company name <span class="contact-popup__req" aria-hidden="true">*</span></label>' +
            '<input class="field" type="text" id="contact-popup-company" name="company" autocomplete="organization" required>' +
          "</div>" +
          '<div class="contact-popup__field">' +
            '<label for="contact-popup-topic">Topic <span class="contact-popup__req" aria-hidden="true">*</span></label>' +
            '<select class="field" id="contact-popup-topic" name="topic" required>' +
              '<option value="">Select…</option>' +
              '<option value="exposure">Territorial Exposure Assessment</option>' +
              '<option value="response">Operational Disruption Response</option>' +
              '<option value="recovery">Strategic Territorial Recovery</option>' +
            "</select>" +
          "</div>" +
          '<div class="contact-popup__field">' +
            '<label for="contact-popup-comments">Any extra comments</label>' +
            '<textarea class="field" id="contact-popup-comments" name="comments" rows="4"></textarea>' +
          "</div>" +
          '<label class="contact-popup__consent">' +
            '<input type="checkbox" id="contact-popup-privacy" name="privacy" required>' +
            "<span>I have read the <a href=\"" + withRoot("privacy.html") + "\">Privacy Policy</a>.</span>" +
          "</label>" +
          '<input class="contact-honey" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<button type="submit" class="contact-popup__submit">Submit</button>' +
          '<p class="form-note" data-popup-note aria-live="polite"></p>' +
        "</form>" +
        '<aside class="contact-popup__hotline" data-contact-hotline-panel hidden>' +
          '<h3 class="contact-popup__hotline-title">Hotline</h3>' +
          '<p class="contact-popup__hotline-item"><span>Email</span> <a href="mailto:odr@terranova.global">odr@terranova.global</a></p>' +
          '<p class="contact-popup__hotline-item site-phone" hidden><span>Phone</span> <a href="tel:+41610000000">+41 61 000 00 00</a></p>' +
        "</aside>" +
      "</div>";

    document.body.appendChild(root);
    if ("inert" in root) root.inert = true;

    const panel = root.querySelector(".contact-popup__panel");
    const form = root.querySelector("#contact-popup-form");
    const topic = root.querySelector("#contact-popup-topic");
    const firstField = root.querySelector("#contact-popup-first");
    const note = root.querySelector("[data-popup-note]");
    const hotlinePanel = root.querySelector("[data-contact-hotline-panel]");
    let lastTrigger = null;

    function focusable() {
      return Array.prototype.slice.call(
        panel.querySelectorAll(
          "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
        )
      ).filter(function (el) {
        return !el.closest("[hidden]");
      });
    }

    function preselectTopic() {
      const servicePage = document.querySelector("main[data-service]");
      if (servicePage && servicePage.dataset.service) {
        topic.value = servicePage.dataset.service;
      }
    }

    function setHotline(show) {
      if (!hotlinePanel) return;
      hotlinePanel.hidden = !show;
      root.classList.toggle("has-hotline", show);
    }

    function setBackgroundInert(open) {
      Array.prototype.forEach.call(document.body.children, function (el) {
        if (el === root || !("inert" in el)) return;
        el.inert = open;
      });
    }

    function openPopup(trigger) {
      lastTrigger = trigger || null;
      form.reset();
      preselectTopic();
      setFormNote(note, "");
      setHotline(Boolean(trigger && trigger.hasAttribute("data-contact-hotline")));
      root.classList.add("is-open");
      root.setAttribute("aria-hidden", "false");
      if ("inert" in root) root.inert = false;
      setBackgroundInert(true);
      document.body.classList.add("contact-popup-open");
      window.requestAnimationFrame(function () {
        firstField.focus();
      });
    }

    function closePopup() {
      if (!root.classList.contains("is-open")) return;
      root.classList.remove("is-open");
      root.setAttribute("aria-hidden", "true");
      if ("inert" in root) root.inert = true;
      setBackgroundInert(false);
      document.body.classList.remove("contact-popup-open");
      setHotline(false);
      if (lastTrigger && typeof lastTrigger.focus === "function") {
        lastTrigger.focus();
      }
    }

    document.addEventListener(
      "click",
      function (event) {
        const link = event.target.closest("a");
        if (!link || !isContactCta(link)) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        event.stopPropagation();
        openPopup(link);
      },
      true
    );

    root.querySelector(".contact-popup__backdrop").addEventListener("click", closePopup);
    root.querySelector(".contact-popup__close").addEventListener("click", closePopup);

    document.addEventListener("keydown", function (event) {
      if (!root.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closePopup();
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = focusable();
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    bindContactForm(form, {
      note: note,
      source: "Contact popup",
      onReset: preselectTopic
    });
  })();

  /* ---------------------------------------------
     Page transition on internal links
     --------------------------------------------- */

  if (!reduceMotion) {
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented) return;

      const link = event.target.closest("a");
      if (!link) return;
      if (isContactCta(link)) return;

      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank" ||
        link.hostname !== window.location.hostname ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("is-leaving");
      window.setTimeout(function () {
        window.location.href = href;
      }, 280);
    });
  }

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) document.body.classList.remove("is-leaving");
  });

  /* ---------------------------------------------
     Scroll to the first homepage service
     --------------------------------------------- */

  function headerOffset() {
    return 16;
  }

  function scrollToServices(options) {
    var targetEl = document.querySelector("#services") || document.querySelector(".services-grid .service-card");
    if (!targetEl) return;

    var top = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset();
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var target = Math.max(0, Math.min(top, maxScroll));

    if ((options && options.instant) || reduceMotion) {
      window.scrollTo(0, target);
      return;
    }

    window.scrollTo({ top: target, behavior: "smooth" });
  }

  function isServicesLink(href) {
    if (!href) return false;
    return href === "#services" || href.endsWith("#services");
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (!link) return;

    var href = link.getAttribute("href");
    if (!isServicesLink(href)) return;

    var onHomepage = document.querySelector(".services-grid");
    var samePage = href === "#services";
    var homeLink =
      href === "index.html#services" ||
      href.endsWith("/index.html#services") ||
      href.endsWith("/#services");

    if (samePage || (homeLink && onHomepage)) {
      event.preventDefault();
      scrollToServices();
      history.pushState(null, "", "#services");
    }
  }, true);

  if (window.location.hash === "#services" && document.querySelector(".services-grid")) {
    window.requestAnimationFrame(function () {
      scrollToServices({ instant: true });
    });
  }

  /* ---------------------------------------------
     Urgent 48h ring — draw when scrolled into view
     --------------------------------------------- */

  (function initUrgentRing() {
    var section = document.querySelector(".offer-urgent");
    if (!section) return;

    var progress = section.querySelector(".offer-urgent__ring-progress");
    if (!progress) return;

    function play() {
      section.classList.remove("is-loaded", "is-loading");
      void progress.getBoundingClientRect();
      if (reduceMotion) {
        section.classList.add("is-loaded");
        return;
      }
      section.classList.add("is-loading");
    }

    function onAnimEnd(event) {
      if (event.target !== progress) return;
      section.classList.remove("is-loading");
      section.classList.add("is-loaded");
    }

    progress.addEventListener("animationend", onAnimEnd);

    if (!("IntersectionObserver" in window)) {
      play();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            play();
          } else {
            section.classList.remove("is-loading", "is-loaded");
          }
        });
      },
      { threshold: 0.45 }
    );

    observer.observe(section);
  })();

  /* ---------------------------------------------
     Cycle graphic — three arrows close into a ring
     --------------------------------------------- */

  (function initCycleGraphic() {
    var root = document.querySelector("[data-cycle]");
    if (!root) return;

    var svg = root.querySelector("[data-cycle-svg]");
    var arrowLayer = root.querySelector("[data-cycle-arrows]");
    var labelLayer = root.querySelector("[data-cycle-labels]");
    var hub = root.querySelector("[data-cycle-hub]");
    if (!svg || !arrowLayer || !labelLayer || !hub) return;

    var cx = 320;
    var cy = 308;
    var rOut = 168;
    var rIn = 104;
    var gap = 0.26;
    var sweep = (Math.PI * 2) / 3 - gap;
    var head = 0.2;
    var colors = ["#AF2832", "#C1575F", "#D18288"];
    var names = ["Prevention", "Reaction", "Recovery"];
    var side = 20;
    var gapX = -6;
    var chevH = 78;
    var headW = 30;
    var chevW = 140;
    var chevY = cy - chevH / 2;
    var arrows = [];

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function polar(radius, angle) {
      return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    }

    var steps = 36;
    var rMid = (rOut + rIn) / 2;
    var filletR = 20;
    var runIn = 4;
    var filletStartX = cx + rMid - filletR;
    var straightSpan = filletStartX - side - runIn;
    chevW = (straightSpan - gapX * 2) / 3;

    function toPath(pts) {
      return "M" + pts.map(function (pt) {
        return pt[0].toFixed(1) + " " + pt[1].toFixed(1);
      }).join("L") + "Z";
    }

    function smoothstep(edge0, edge1, value) {
      var t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
      return t * t * (3 - 2 * t);
    }

    function pointAt(pts, u) {
      var n = pts.length - 1;
      var f = clamp(u, 0, 1) * n;
      var i = Math.min(n - 1, Math.floor(f));
      var t = f - i;
      return [
        pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t,
        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t
      ];
    }

    function cubic(p0, p1, p2, p3, u) {
      var m = 1 - u;
      var a = m * m * m;
      var b = 3 * m * m * u;
      var c = 3 * m * u * u;
      var d = u * u * u;
      return [
        a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
        a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]
      ];
    }

    function buildTrack() {
      var midY = chevY + chevH / 2;
      var bodyLen = chevW - headW;
      var pitch = chevW + gapX;
      var lineSpan = filletStartX - side;
      var pts = [];
      var i;
      for (i = 0; i <= 24; i++) {
        pts.push([side + lineSpan * (i / 24), midY]);
      }
      var straightEnd = polylineLength(pts);
      var center = [filletStartX, midY - filletR];
      var filletSteps = 14;
      for (i = 1; i <= filletSteps; i++) {
        var theta = (Math.PI / 2) * (i / filletSteps);
        pts.push([
          center[0] + filletR * Math.sin(theta),
          center[1] + filletR * Math.cos(theta)
        ]);
      }
      var tails = [0, 1, 2].map(function (index) {
        return -Math.PI / 2 - index * ((Math.PI * 2) / 3) + sweep / 2;
      });
      var filletEnd = pts[pts.length - 1];
      var aStart = Math.atan2(filletEnd[1] - cy, filletEnd[0] - cx);
      pts[pts.length - 1] = polar(rMid, aStart);
      var aEnd = tails[2] - sweep;
      var arcSteps = 96;
      var arcOrigin = 0;
      var length = polylineLength(pts);
      var prevA = aStart;
      var prevPt = pts[pts.length - 1];
      for (i = 1; i <= arcSteps; i++) {
        var a = aStart + (aEnd - aStart) * (i / arcSteps);
        var pt = polar(rMid, a);
        var seg = Math.hypot(pt[0] - prevPt[0], pt[1] - prevPt[1]);
        if (!arcOrigin && a <= tails[0]) {
          var spanA = prevA - a;
          var into = (prevA - tails[0]) / (spanA || 1);
          arcOrigin = length + seg * into;
        }
        length += seg;
        pts.push(pt);
        prevA = a;
        prevPt = pt;
      }
      for (i = 1; i <= 12; i++) pts.push(polar(rMid, aEnd - head * (i / 12)));
      return {
        pts: pts,
        straightEnd: straightEnd,
        arcOrigin: arcOrigin,
        total: polylineLength(pts),
        bodyLen: bodyLen,
        pitch: pitch,
        arcLen: rMid * sweep,
        arcPitch: rMid * ((Math.PI * 2) / 3)
      };
    }

    function sampleSpan(pts, start, length, n) {
      var out = [];
      var i;
      for (i = 0; i <= n; i++) out.push(pointAtDistance(pts, start + length * (i / n)));
      return out;
    }

    function rail(track, index, t) {
      var windowLen = track.bodyLen + (track.arcLen - track.bodyLen) * t;
      var from = index * track.pitch;
      var to = track.arcOrigin + index * track.arcPitch;
      var start = from + (to - from) * t;
      var end = start + windowLen;
      var onCurve = clamp((end - track.straightEnd) / windowLen, 0, 1);
      var body = sampleSpan(track.pts, start, windowLen, steps);
      var headLen = headW + (head * rMid - headW) * onCurve;
      var tip = pointAtDistance(track.pts, Math.min(track.total - 0.5, end + headLen));
      return {
        body: body,
        tip: tip,
        width: chevH + (rOut - rIn - chevH) * onCurve,
        notch: headW * 0.72 * (1 - onCurve)
      };
    }

    function ribbon(shape) {
      var body = shape.body;
      var left = [];
      var right = [];
      var i;
      var i0;
      var i1;
      var dx;
      var dy;
      var len;
      for (i = 0; i < body.length; i++) {
        i0 = Math.max(0, i - 1);
        i1 = Math.min(body.length - 1, i + 1);
        dx = body[i1][0] - body[i0][0];
        dy = body[i1][1] - body[i0][1];
        len = Math.hypot(dx, dy) || 1;
        left.push([
          body[i][0] + (-dy / len) * shape.width / 2,
          body[i][1] + (dx / len) * shape.width / 2
        ]);
        right.push([
          body[i][0] - (-dy / len) * shape.width / 2,
          body[i][1] - (dx / len) * shape.width / 2
        ]);
      }
      var pts = left.concat([shape.tip], right.reverse());
      if (shape.notch > 0.5) {
        dx = body[1][0] - body[0][0];
        dy = body[1][1] - body[0][1];
        len = Math.hypot(dx, dy) || 1;
        pts.push([
          body[0][0] + (dx / len) * shape.notch,
          body[0][1] + (dy / len) * shape.notch
        ]);
      }
      return pts;
    }

    function polylineLength(pts) {
      var total = 0;
      var i;
      for (i = 1; i < pts.length; i++) {
        total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      }
      return total;
    }

    function pointAtDistance(pts, dist) {
      var remain = Math.max(0, dist);
      var i;
      for (i = 1; i < pts.length; i++) {
        var dx = pts[i][0] - pts[i - 1][0];
        var dy = pts[i][1] - pts[i - 1][1];
        var seg = Math.hypot(dx, dy);
        if (remain <= seg || i === pts.length - 1) {
          var t = seg === 0 ? 0 : Math.min(1, remain / seg);
          return [pts[i - 1][0] + dx * t, pts[i - 1][1] + dy * t];
        }
        remain -= seg;
      }
      return pts[pts.length - 1];
    }

    function placeWord(body, texts, inset) {
      var len = polylineLength(body);
      var advances = texts.map(function (text) {
        return Math.max(7, text.getComputedTextLength());
      });
      var tracking = 1.6;
      var count = texts.length;
      var glyphs = 0;
      var i;
      for (i = 0; i < count; i++) glyphs += advances[i];
      var span = glyphs + tracking * (count - 1);
      var pad = Math.max(len * 0.08, inset || 0);
      var endPad = Math.min(len * 0.08, Math.max(4, len - pad - 16));
      var room = Math.max(10, len - pad - endPad);
      if (span > room) {
        tracking = Math.max(0, (room - glyphs) / (count - 1));
        span = glyphs + tracking * (count - 1);
      }
      var midDist = (pad + Math.max(pad + 1, len - endPad)) / 2;
      var midPt = pointAtDistance(body, midDist);
      var ahead = pointAtDistance(body, Math.min(len, midDist + 8));
      var angForward = Math.atan2(ahead[1] - midPt[1], ahead[0] - midPt[0]);
      var reverse = Math.cos(angForward) < 0;
      var slack = Math.max(0, room - span) / 2;
      var cursor = reverse ? len - endPad - slack : pad + slack;
      for (i = 0; i < count; i++) {
        cursor += (reverse ? -1 : 1) * advances[i] / 2;
        var p = pointAtDistance(body, cursor);
        var p2 = pointAtDistance(body, cursor + (reverse ? -5 : 5));
        var ang = Math.atan2(p2[1] - p[1], p2[0] - p[0]);
        texts[i].setAttribute(
          "transform",
          "translate(" + p[0].toFixed(1) + " " + p[1].toFixed(1) + ") rotate(" + (ang * 180 / Math.PI).toFixed(1) + ")"
        );
        cursor += (reverse ? -1 : 1) * (advances[i] / 2 + tracking);
      }
    }

    names.forEach(function (name, index) {
      var ns = "http://www.w3.org/2000/svg";
      var group = document.createElementNS(ns, "g");
      var path = document.createElementNS(ns, "path");
      path.setAttribute("fill", colors[index]);
      var word = document.createElementNS(ns, "g");
      word.setAttribute("fill", "#FFFFFF");
      word.setAttribute("font-family", "Inter, Segoe UI, sans-serif");
      word.setAttribute("font-size", "14");
      word.setAttribute("font-weight", "500");
      var letters = name.toUpperCase().split("");
      var texts = letters.map(function (letter) {
        var text = document.createElementNS(ns, "text");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "central");
        text.textContent = letter;
        word.appendChild(text);
        return text;
      });
      group.appendChild(path);
      group.appendChild(word);
      arrowLayer.appendChild(group);
      arrows.push({ group: group, path: path, texts: texts, word: word });
    });

    var track = buildTrack();

    function frame(progress) {
      arrows.forEach(function (arrow, index) {
        var shape = rail(track, index, progress);
        arrow.path.setAttribute("d", toPath(ribbon(shape)));
        var len = polylineLength(shape.body);
        var room = Math.max(36, len - shape.notch * 0.9 - len * 0.1);
        arrow.word.setAttribute("font-size", "15");
        var glyphs = 0;
        arrow.texts.forEach(function (text) {
          glyphs += Math.max(6, text.getComputedTextLength());
        });
        var size = Math.min(15, 15 * room / (glyphs + 1.2 * (arrow.texts.length - 1)));
        arrow.word.setAttribute("font-size", size.toFixed(2));
        placeWord(shape.body, arrow.texts, shape.notch * 0.9);
      });
      hub.setAttribute("opacity", smoothstep(0.78, 1, progress).toFixed(3));
    }

    frame(0);

    if (reduceMotion) {
      frame(1);
      return;
    }

    var played = false;

    function play() {
      if (played) return;
      played = true;
      var startTime = 0;
      var duration = 1800;
      function tick(now) {
        if (!startTime) startTime = now;
        var progress = clamp((now - startTime) / duration, 0, 1);
        frame(progress);
        if (progress < 1) window.requestAnimationFrame(tick);
      }
      window.requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      play();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) play();
        });
      },
      { threshold: 0.42 }
    );
    observer.observe(root);
  })();
})();
