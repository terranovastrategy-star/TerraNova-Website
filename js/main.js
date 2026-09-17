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

    fetch(withRoot("includes/footer.html?v=2"))
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

    const duration = 1400;
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
            "<span>I have read the <a href=\"#\">Privacy Policy</a>.</span>" +
          "</label>" +
          '<button type="submit" class="contact-popup__submit">Submit</button>' +
          '<p class="form-note" data-popup-note>Form delivery is not connected yet. Placeholder only.</p>' +
        "</form>" +
        '<aside class="contact-popup__hotline" data-contact-hotline-panel hidden>' +
          '<h3 class="contact-popup__hotline-title">Hotline</h3>' +
          '<p class="contact-popup__hotline-item"><span>Email</span> <a href="mailto:odr@terranova.global">odr@terranova.global</a></p>' +
          '<p class="contact-popup__hotline-item"><span>Phone</span> <a href="tel:+41610000000">+41 61 000 00 00</a></p>' +
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

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      note.textContent = "Form delivery is not connected yet. Placeholder only.";
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
    var header = document.querySelector(".site-header");
    return (header ? header.offsetHeight : 80) + 12;
  }

  function scrollToServices(options) {
    var first = document.querySelector(".services-grid .service-card");
    var targetEl = first || document.querySelector("#services");
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
})();
