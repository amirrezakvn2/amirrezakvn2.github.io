(function () {
  const page = document.body.dataset.page;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const img = (src, alt, eager) =>
    `<img src="${esc(src)}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

  /* ---------- Shared header + footer ---------- */
  document.title = page === "home" ? `${SITE.name} — Photography` : document.title.replace("NAME", SITE.name);
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="brand" href="./">${esc(SITE.name)}</a>
    <nav class="nav">
      <a href="./#work" class="${page === "home" || page === "series" ? "is-active" : ""}">Work</a>
      <a href="about.html" class="${page === "about" ? "is-active" : ""}">About</a>
    </nav>`;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `<span>© ${new Date().getFullYear()} ${esc(SITE.name)}</span><a href="https://instagram.com/${esc(SITE.instagram)}" target="_blank" rel="noopener">Instagram</a>`;
  document.body.append(footer);

  const main = document.querySelector("main");

  /* ---------- Pages ---------- */
  if (page === "home") {
    main.innerHTML = `
      <section class="hero">
        <h1 class="reveal">${esc(SITE.name)}</h1>
        <p class="reveal">${esc(SITE.tagline)}</p>
        <div class="scroll-hint reveal"></div>
      </section>
      <section class="series-list" id="work">
        ${SERIES.map((s, i) => `
          <a class="series-card reveal" href="series.html?s=${encodeURIComponent(s.id)}">
            <div class="card-index">${String(i + 1).padStart(2, "0")}</div>
            <div class="frame">${img(`images/${s.id}/${s.cover}`, s.title, i < 2)}</div>
            <div class="card-meta"><h2>${esc(s.title)}</h2><span>${esc(s.year)}</span></div>
          </a>`).join("")}
      </section>`;
  }

  if (page === "series") {
    const id = new URLSearchParams(location.search).get("s");
    const idx = Math.max(0, SERIES.findIndex((s) => s.id === id));
    const s = SERIES[idx];
    const next = SERIES[(idx + 1) % SERIES.length];
    document.title = `${s.title} — ${SITE.name}`;
    main.innerHTML = `
      <section class="series-head">
        <div class="eyebrow reveal">${esc(s.place)} · ${esc(s.year)}</div>
        <h1 class="reveal">${esc(s.title)}</h1>
        <p class="reveal">${esc(s.statement)}</p>
      </section>
      <section class="photos">
        ${s.photos.map((p, i) => `
          <figure class="photo reveal ${p.vertical ? "vertical" : ""}" data-i="${i}">
            <div class="frame">${img(`images/${s.id}/${p.file}`, p.caption || `${s.title}, ${i + 1}`, i === 0)}</div>
            ${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}
          </figure>`).join("")}
      </section>
      ${SERIES.length > 1 ? `
      <a class="next-series reveal" href="series.html?s=${encodeURIComponent(next.id)}">
        <small>Next series</small><div>${esc(next.title)} →</div>
      </a>` : ""}`;
    setupLightbox(s.photos.map((p) => `images/${s.id}/${p.file}`));
  }

  if (page === "about") {
    main.innerHTML = `
      <section class="about">
        <div class="frame reveal">${img(SITE.aboutPhoto, SITE.name, true)}</div>
        <div>
          <h1 class="reveal">About</h1>
          ${SITE.about.map((p) => `<p class="reveal">${esc(p)}</p>`).join("")}
          <div class="contact reveal">
            <a href="mailto:${esc(SITE.email)}"><span>Email</span><span>${esc(SITE.email)}</span></a>
            <a href="https://instagram.com/${esc(SITE.instagram)}" target="_blank" rel="noopener"><span>Instagram</span><span>@${esc(SITE.instagram)}</span></a>
          </div>
        </div>
      </section>`;
  }

  /* ---------- Image fade-in ---------- */
  document.querySelectorAll(".frame img").forEach((el) => {
    const done = () => el.classList.add("is-loaded");
    el.complete && el.naturalWidth ? done() : el.addEventListener("load", done, { once: true });
    el.addEventListener("error", done, { once: true });
  });

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (el.closest(".hero, .series-head")) el.style.transitionDelay = `${(i % 4) * 120}ms`;
    io.observe(el);
  });

  /* ---------- Header hides on scroll down ---------- */
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    header.classList.toggle("is-hidden", y > lastY && y > 120);
    lastY = y;
  }, { passive: true });

  /* ---------- Page transitions ---------- */
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
  addEventListener("pageshow", (e) => { if (e.persisted) document.body.classList.remove("is-leaving"); });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.protocol === "mailto:") return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(() => (location.href = url.href), 320);
  });

  /* ---------- Lightbox ---------- */
  function setupLightbox(sources) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = `<img alt=""><button class="lb-btn lb-close">Close</button><button class="lb-btn lb-prev">Prev</button><button class="lb-btn lb-next">Next</button><div class="lb-count"></div>`;
    document.body.append(lb);
    const view = lb.querySelector("img"), count = lb.querySelector(".lb-count");
    let cur = 0;
    const show = (i, animate) => {
      cur = (i + sources.length) % sources.length;
      const set = () => { view.src = sources[cur]; count.textContent = `${cur + 1} / ${sources.length}`; view.classList.remove("is-switching"); };
      if (animate) { view.classList.add("is-switching"); setTimeout(set, 200); } else set();
    };
    const open = (i) => { show(i); lb.classList.add("is-open"); document.body.style.overflow = "hidden"; };
    const close = () => { lb.classList.remove("is-open"); document.body.style.overflow = ""; };
    document.querySelectorAll(".photo").forEach((f) => f.addEventListener("click", () => open(+f.dataset.i)));
    lb.querySelector(".lb-close").onclick = close;
    lb.querySelector(".lb-prev").onclick = (e) => { e.stopPropagation(); show(cur - 1, true); };
    lb.querySelector(".lb-next").onclick = (e) => { e.stopPropagation(); show(cur + 1, true); };
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(cur + 1, true);
      if (e.key === "ArrowLeft") show(cur - 1, true);
    });
    let x0 = null;
    lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1), true);
      x0 = null;
    });
  }
})();
