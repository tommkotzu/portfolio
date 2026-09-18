(() => {
  "use strict";

  const app = document.getElementById("app");
  const navClock = document.getElementById("nav-clock");
  const themeToggles = document.querySelectorAll(".theme-toggle");

  // "Client — Title", or just the title for client-less/self-initiated projects
  function projectTitle(p) {
    return p.client ? `${p.client} — ${p.title}` : p.title;
  }

  function linkDomain(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  }

  const state = {
    theme: localStorage.getItem("tm-theme") || "dark",
    density: localStorage.getItem("tm-density") || "2",
    galleryView: "spacious",
    editorialGalleryView: "editorial", // "editorial" | "grid" — preview toggle, superpop only for now
    lightboxOpen: false,
    mobileNavOpen: false,
  };

  // ---------- mobile nav ----------
  const mobileNavToggle = document.getElementById("nav-menu-toggle");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
  function setMobileNavOpen(open) {
    state.mobileNavOpen = open;
    mobileNavToggle.classList.toggle("open", open);
    mobileNavToggle.setAttribute("aria-expanded", String(open));
    mobileNavOverlay.classList.toggle("open", open);
    document.body.classList.toggle("mobile-nav-locked", open);
  }
  mobileNavToggle.addEventListener("click", () => setMobileNavOpen(!state.mobileNavOpen));
  mobileNavOverlay.addEventListener("click", (e) => {
    if (e.target === mobileNavOverlay || e.target.closest("a")) setMobileNavOpen(false);
  });

  // ---------- theme ----------
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
  }

  // easter egg: 5 rapid clicks on the theme toggle triggers a one-second
  // disco strobe before settling back into whichever theme you landed on
  let discoClicks = 0;
  let discoLastClick = 0;
  let discoPlaying = false;
  function triggerDisco() {
    if (discoPlaying) return;
    discoPlaying = true;
    document.body.classList.add("disco-strobe");
    document.body.addEventListener(
      "animationend",
      () => {
        document.body.classList.remove("disco-strobe");
        discoPlaying = false;
      },
      { once: true }
    );
  }

  themeToggles.forEach((btn) => btn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("tm-theme", state.theme);
    applyTheme();

    const now = Date.now();
    discoClicks = now - discoLastClick > 600 ? 1 : discoClicks + 1;
    discoLastClick = now;
    if (discoClicks >= 5) {
      discoClicks = 0;
      triggerDisco();
    }
  }));
  applyTheme();


  // easter egg: 5 rapid clicks on the editorial/grid view toggle scrambles the
  // gallery — everything crooked, overlapping and crushed into one screen.
  // preview: only wired up for Luisa Via Roma for now.
  const CHAOS_SLUGS = ["luisa-via-roma-x-vogue"];
  let chaosClicks = 0;
  let chaosLastClick = 0;
  function triggerChaos() {
    const container = document.querySelector(".detail-wide");
    if (!container) return;
    const items = container.querySelectorAll(".editorial-item, .editorial-col");
    if (!items.length) return;
    container.classList.add("chaos-mode");
    items.forEach((el) => {
      const rot = (Math.random() * 34 - 17).toFixed(1);
      const top = Math.random() * 78;
      const left = Math.random() * 78;
      const scale = 0.32 + Math.random() * 0.22;
      el.style.position = "absolute";
      el.style.top = `${top}%`;
      el.style.left = `${left}%`;
      el.style.margin = "0";
      el.style.width = "320px";
      el.style.maxWidth = "320px";
      el.style.transform = `rotate(${rot}deg) scale(${scale})`;
      el.style.zIndex = String(Math.floor(Math.random() * items.length));
    });
  }

  // easter egg: hovering the logo scrambles through a roulette of alternate
  // names, letter by letter, until the cursor leaves — where it lands is
  // random too, not always back to the real name
  const NAME_ROULETTE = ["Thomas Mayer", "Thomas Ludwig", "Atomic Tomfritz", "Tommbommboo", "Pommfred"];
  const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const navLogo = document.querySelector(".nav-logo");
  if (navLogo) {
    const original = navLogo.textContent;

    // reserve enough width for the longest candidate up front, via canvas
    // text measurement (no visible flicker) — otherwise the logo's own box
    // resizes with the text and pushes Work/Screens/About sideways. A fixed
    // width (not min-width) + overflow:hidden on the element, since random
    // scramble noise can render wider than any of the actual target strings
    // (e.g. a run of "W"s) — min-width alone let those transient frames grow
    // the box and jiggle everything after it
    const measureCanvas = document.createElement("canvas").getContext("2d");
    measureCanvas.font = getComputedStyle(navLogo).font;
    const widest = Math.max(
      ...NAME_ROULETTE.map((n) => measureCanvas.measureText(n.toUpperCase()).width),
      measureCanvas.measureText(original).width
    );
    navLogo.style.width = `${Math.ceil(widest * 1.15)}px`;

    let scrambleActive = false;
    let holdTimer = null;
    let lastShown = original;

    let animToken = 0;
    function scrambleTo(target, duration, onDone) {
      const token = ++animToken;
      const start = performance.now();
      (function frame(now) {
        if (token !== animToken) return; // a newer scramble started — stop writing
        const progress = Math.min(1, (now - start) / duration);
        const lockedCount = Math.floor(progress * target.length);
        let out = "";
        for (let i = 0; i < target.length; i++) {
          out += i < lockedCount || target[i] === " " ? target[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        navLogo.textContent = out;
        if (progress < 1) requestAnimationFrame(frame);
        else { navLogo.textContent = target; if (onDone) onDone(); }
      })(start);
    }

    function pickNext() {
      let next = lastShown;
      while (next === lastShown) next = NAME_ROULETTE[Math.floor(Math.random() * NAME_ROULETTE.length)];
      lastShown = next;
      return next;
    }

    function cycle() {
      if (!scrambleActive) return;
      scrambleTo(pickNext().toUpperCase(), 350, () => {
        if (!scrambleActive) return;
        holdTimer = setTimeout(cycle, 300);
      });
    }

    navLogo.addEventListener("mouseenter", () => {
      if (scrambleActive) return;
      scrambleActive = true;
      cycle();
    });
    navLogo.addEventListener("mouseleave", () => {
      scrambleActive = false;
      clearTimeout(holdTimer);
      scrambleTo(pickNext().toUpperCase(), 350);
    });
  }

  // welcome-page headline: the role word auto-shuffles on a timer, and
  // hovering it jumps straight to another one (same letter-scramble as the
  // nav-logo roulette above, just lowercase and on a slower, ambient cadence)
  const ROLE_ROULETTE = [
    "multidisciplinary designer", "artist", "technologist", "little geek",
    "motion designer", "3D generalist", "art director", "creative producer",
    "Blender nerd", "Linux enthusiast", "salad chef",
    "creative", "problem solver", "style framer", "interaction designer",
    "carpenter", "papa", "notion organizer", "Vibecoder",
    "animator", "keyframe schubser", "node noodler", "cgMemes subscriber",
  ];
  let roleRouletteTimer = null;
  function mountRoleRoulette() {
    clearInterval(roleRouletteTimer);
    const el = document.getElementById("role-roulette");
    const articleEl = document.getElementById("role-article");
    const wrap = document.getElementById("role-roulette-wrap");
    if (!el) return;

    let lastShown = el.textContent;
    let animToken = 0;

    // "an" before a vowel SOUND — skip any leading digits (e.g. "3D
    // generalist" is spoken "three-D", a consonant sound, so it stays "a")
    function articleFor(word) {
      const firstLetter = word.replace(/^[0-9]+/, "").charAt(0).toLowerCase();
      return "aeiou".includes(firstLetter) ? "an" : "a";
    }

    function scrambleTo(target, duration) {
      const token = ++animToken;
      const start = performance.now();
      (function frame(now) {
        if (token !== animToken) return;
        const progress = Math.min(1, (now - start) / duration);
        const lockedCount = Math.floor(progress * target.length);
        let out = "";
        for (let i = 0; i < target.length; i++) {
          out += i < lockedCount || target[i] === " " ? target[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        el.textContent = out;
        if (progress < 1) requestAnimationFrame(frame);
        else el.textContent = target;
      })(start);
    }

    function pickNext() {
      let next = lastShown;
      while (next === lastShown) next = ROLE_ROULETTE[Math.floor(Math.random() * ROLE_ROULETTE.length)];
      lastShown = next;
      return next;
    }

    function restartTimer() {
      clearInterval(roleRouletteTimer);
      roleRouletteTimer = setInterval(advance, 15000);
    }

    function advance() {
      const next = pickNext();
      if (articleEl) articleEl.textContent = articleFor(next);
      scrambleTo(next, 400);
    }

    function selectRole(word) {
      lastShown = word;
      if (articleEl) articleEl.textContent = articleFor(word);
      scrambleTo(word, 400);
      restartTimer();
    }

    el.addEventListener("mouseenter", () => {
      advance();
      restartTimer();
    });

    // click opens a dropdown of every role so a visitor can just pick one,
    // instead of only ever landing on one at random — appended to <body>
    // (not wrap) with fixed positioning computed from wrap's own rect,
    // since .intro-headline clips overflow (see above) and would otherwise
    // clip this dropdown along with it
    if (wrap) {
      let dropdown = null;
      function closeDropdown() {
        if (dropdown) { dropdown.remove(); dropdown = null; }
        document.removeEventListener("click", onOutsideClick);
      }
      function onOutsideClick(e) {
        if (!wrap.contains(e.target) && !(dropdown && dropdown.contains(e.target))) closeDropdown();
      }
      wrap.addEventListener("click", (e) => {
        e.stopPropagation();
        if (dropdown) { closeDropdown(); return; }
        const rect = wrap.getBoundingClientRect();
        dropdown = document.createElement("div");
        dropdown.className = "role-dropdown";
        dropdown.style.top = `${rect.bottom + 10}px`;
        dropdown.style.left = `${rect.left}px`;
        dropdown.innerHTML = ROLE_ROULETTE.map((w) => `<div class="role-dropdown-item" data-role="${w}">${w}</div>`).join("");
        document.body.appendChild(dropdown);
        dropdown.addEventListener("click", (ev) => {
          ev.stopPropagation();
          const item = ev.target.closest(".role-dropdown-item");
          if (!item) return;
          selectRole(item.dataset.role);
          closeDropdown();
        });
        document.addEventListener("click", onOutsideClick);
      });
    }

    restartTimer();
  }

  // ---------- clock ----------
  function updateClock() {
    const now = new Date();
    const t = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });
    navClock.textContent = `Berlin, DE — ${t}`;
  }
  updateClock();
  setInterval(updateClock, 30000);

  // <mux-video> is a custom element loaded from a deferred ES module, which
  // can still be un-upgraded (no .play()/.pause() yet) the moment this classic
  // script runs — wait for its definition first when that's the case
  function safePlay(video) {
    if (!video) return;
    const attempt = () => video.play().catch(() => {
      // first attempt can land before the stream has buffered anything yet —
      // one retry once it actually has data covers that race
      video.addEventListener("loadeddata", () => video.play().catch(() => {}), { once: true });
    });
    if (typeof video.play === "function") { attempt(); return; }
    customElements.whenDefined(video.tagName.toLowerCase()).then(attempt);
  }

  // native controls (volume, scrub bar, fullscreen) only while hovering the
  // hero — familiar browser UI without it sitting on screen the rest of the
  // time. onHoverChange lets the caller suppress its own click-to-toggle
  // while the native control bar is what the visitor is actually clicking on
  function mountHeroHoverControls(wrap, video, onHoverChange) {
    const setControls = (on) => { video.controls = on; };
    wrap.addEventListener("mouseenter", () => {
      onHoverChange(true);
      if (typeof video.play === "function") setControls(true);
      else customElements.whenDefined(video.tagName.toLowerCase()).then(() => setControls(true));
    });
    wrap.addEventListener("mouseleave", () => {
      onHoverChange(false);
      setControls(false);
    });
  }

  // ---------- media rendering ----------
  function mediaHTML(item, opts = {}) {
    const cls = opts.cls || "";
    const fill = opts.fill !== false;
    const innerCls = fill ? "media-fill" : "media-natural";
    if (!item) return `<div class="media-wrap ${cls} stripe"></div>`;
    if (item.type === "image") {
      return `<div class="media-wrap ${cls}"><img class="${innerCls}" src="${item.src}" loading="lazy" alt=""></div>`;
    }
    if (item.type === "vimeo") {
      const src = `https://player.vimeo.com/video/${item.src}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;loop=1&amp;muted=1&amp;background=1`;
      const allow = `allow="autoplay;fullscreen;picture-in-picture;clipboard-write;encrypted-media;web-share" referrerpolicy="strict-origin-when-cross-origin" loading="lazy" title="video"`;
      const style = "position:absolute;inset:0;width:100%;height:100%;border:0";
      // an iframe has no natural size of its own to shrink-wrap to (unlike a real
      // photo's actual pixel dimensions), so outside of fill mode it needs the
      // "vimeo-embed" marker — renderEditorialGallery gives that item's wrapper
      // a real width to fill, and .vimeo-embed turns that into a 16:9 box
      const vimeoCls = fill ? "" : "vimeo-embed";
      return `<div class="media-wrap ${vimeoCls} ${cls}"><iframe src="${src}" style="${style}" ${allow}></iframe></div>`;
    }
    if (item.type === "video") {
      const poster = item.poster ? ` poster="${item.poster}"` : "";
      const controls = opts.controls ? "controls" : "";
      // videos autoplay + loop, but only once actually scrolled into view (see
      // observeVideos()) — starting every clip at once is what caused the page to
      // choke with many large clips on one page; muted is required for autoplay.
      // no type= for .mov: Chrome's canPlayType flatly rejects "video/quicktime"
      // and skips the <source> before ever probing the real (often playable)
      // codec inside, which silently broke playback — only hint types Chrome
      // reliably recognizes, and let it sniff anything else on its own
      const ext = item.src.split(".").pop().split("?")[0].toLowerCase();
      const mime = ext === "webm" ? "video/webm" : ext === "mp4" ? "video/mp4" : "";
      const typeAttr = mime ? ` type="${mime}"` : "";
      // hero videos manage their own play/pause (mountWelcome/mountDetailHero); only
      // gallery videos get the scroll-driven observer, so the two never fight
      const observedAttr = opts.hero ? "" : " data-autoplay";
      return `<div class="media-wrap ${cls}"><video class="${innerCls}" ${poster} preload="metadata" ${controls} muted loop playsinline${observedAttr}><source src="${item.src}"${typeAttr}></video></div>`;
    }
    if (item.type === "mux") {
      // <mux-video> is Mux's custom element — same attributes/API as a native
      // <video> (autoplay, muted, loop, .play()/.pause(), play/pause events),
      // so it drops into the exact same hero/gallery wiring as the "video"
      // branch above, just streaming adaptive HLS instead of one fixed file
      const poster = item.poster ? ` poster="${item.poster}"` : "";
      const controls = opts.controls ? "controls" : "";
      const observedAttr = opts.hero ? "" : " data-autoplay";
      return `<div class="media-wrap ${cls}"><mux-video class="${innerCls}" playback-id="${item.src}"${poster} preload="metadata" ${controls} muted loop playsinline${observedAttr}></mux-video></div>`;
    }
    return `<div class="media-wrap ${cls} stripe"></div>`;
  }

  // a media card whose image cycles through a project's preview-folder images as the
  // cursor moves vertically over it (mirrors the original design's frame-scrub concept,
  // but driven by real preview photos instead of placeholder frames)
  function scrubMediaHTML(previewItems, opts = {}) {
    const cls = opts.cls || "";
    const fill = opts.fill !== false;
    const innerCls = fill ? "media-fill" : "media-natural";
    if (!previewItems || !previewItems.length) return `<div class="media-wrap ${cls} stripe"></div>`;
    const urls = previewItems.map((p) => p.src);
    const data = encodeURIComponent(JSON.stringify(urls));
    // opts.randomStart: begin on a random frame from this project's own set
    // instead of always the first — used on the welcome page so it feels
    // different each visit, without ever mixing in another project's images
    const startIdx = opts.randomStart ? Math.floor(Math.random() * urls.length) : 0;
    const ambientCls = opts.ambient ? " ambient" : "";
    return `<div class="media-wrap scrub${ambientCls} ${cls}" data-scrub="${data}" data-idx="${startIdx}">
      <img class="${innerCls} active" src="${urls[startIdx]}" loading="lazy" alt="">
      <img class="${innerCls}" loading="lazy" alt="">
    </div>`;
  }

  // shared crossfade step for any .media-wrap.scrub — swaps the hidden layer's
  // src, waits for it to decode, then fades it in over the visible one
  function swapScrubImage(el, idx, url) {
    el.dataset.idx = String(idx);
    const front = el.querySelector("img.active");
    const back = el.querySelector("img:not(.active)");
    back.onload = () => {
      back.classList.add("active");
      front.classList.remove("active");
    };
    back.src = url;
  }

  // delegated hover-scrub: works for any .media-wrap.scrub on the page, survives re-renders.
  // crossfades between two stacked <img> layers instead of hard-cutting the src.
  document.body.addEventListener("mousemove", (e) => {
    const el = e.target.closest(".media-wrap.scrub");
    if (!el) return;
    const urls = JSON.parse(decodeURIComponent(el.dataset.scrub));
    if (urls.length < 2) return;
    const rect = el.getBoundingClientRect();
    const pct = (e.clientY - rect.top) / rect.height;
    const idx = Math.min(urls.length - 1, Math.max(0, Math.floor(pct * urls.length)));
    if (Number(el.dataset.idx) === idx) return;
    swapScrubImage(el, idx, urls[idx]);
  });
  document.body.addEventListener("mouseout", (e) => {
    const el = e.target.closest(".media-wrap.scrub");
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget)) || el.classList.contains("ambient")) return;
    const urls = JSON.parse(decodeURIComponent(el.dataset.scrub));
    if (el.dataset.idx !== "0") swapScrubImage(el, 0, urls[0]);
  });

  // ambient rotation for the welcome page's featured cards: every so often,
  // gently dissolve to another random frame from that same project's own
  // preview set — each card on its own randomized timer so they never all
  // change at once, which is what would make it feel busy instead of calm
  function scheduleAmbientScrub(el) {
    const delay = 6000 + Math.random() * 5000;
    setTimeout(() => {
      if (!document.body.contains(el)) return; // navigated away — stop the chain
      if (!el.matches(":hover")) {
        const urls = JSON.parse(decodeURIComponent(el.dataset.scrub));
        if (urls.length > 1) {
          const cur = Number(el.dataset.idx);
          let next = cur;
          while (next === cur) next = Math.floor(Math.random() * urls.length);
          swapScrubImage(el, next, urls[next]);
        }
      }
      scheduleAmbientScrub(el);
    }, delay);
  }

  function tagPills(tags) {
    return tags.map((t) => `<span class="tag-pill">${t}</span>`).join("");
  }

  // ---------- router ----------
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    const parts = h.split("/").filter(Boolean);
    if (parts.length === 0) return { page: "welcome" };
    if (parts[0] === "work" && parts[1]) return { page: "detail", slug: parts[1] };
    if (parts[0] === "work") return { page: "work" };
    if (parts[0] === "screens") return { page: "screens" };
    if (parts[0] === "about") return { page: "about" };
    if (parts[0] === "impressum") return { page: "impressum" };
    if (parts[0] === "datenschutz") return { page: "datenschutz" };
    return { page: "welcome" };
  }

  function goto(page, slug) {
    if (page === "welcome") location.hash = "#/";
    else if (page === "work") location.hash = "#/work";
    else if (page === "detail") location.hash = `#/work/${slug}`;
    else location.hash = `#/${page}`;
  }

  window.addEventListener("hashchange", render);

  // ---------- welcome ----------
  function renderWelcome() {
    const featured = PROJECTS.slice(0, 4).map((p, i) => ({ p, layout: FEATURED_LAYOUT[i] }));
    return `
    <div class="page" data-screen="welcome">
      <div class="hero">
        <div class="hero-inner" id="hero-video-wrap">
          ${mediaHTML(HOME.reel, { cls: "media-fill-wrap", hero: true })}
          <div class="hero-play" id="hero-play-toggle">
            <div class="hero-play-glyph"></div>
          </div>
        </div>
      </div>

      <div class="intro">
        <div class="intro-headline">Hey there, I'm Thomas, <span id="role-article">a</span> <span class="role-roulette-wrap" id="role-roulette-wrap"><span class="role-roulette" id="role-roulette">multidisciplinary designer</span></span>.</div>
        <div class="intro-bio">
          <p>I <svg class="heart-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 20.6c-.3 0-.6-.1-.83-.33C7.4 16.86 4 13.3 4 9.6 4 6.6 6.24 4.4 9.1 4.4c1.63 0 3.2.76 4.4 1.98 1.2-1.22 2.77-1.98 4.4-1.98 2.86 0 5.1 2.2 5.1 5.2 0 3.7-3.4 7.26-7.17 10.67-.23.23-.53.33-.83.33z"/></svg> working in 3D. Let's get complex things done exactly the way you want on time!</p>
          <p>Need a hand, <a href="mailto:thomasludwigwork@pm.me" class="intro-mail-link">let's chat!</a></p>
        </div>
      </div>

      <div class="selected-work">
        <div class="selected-work-head">
          <h2>Selected Work</h2>
          <span data-nav="work">View all →</span>
        </div>
        <div class="featured-grid">
          ${featured
            .map(
              ({ p, layout }) => `
            <div class="featured-card" style="grid-column:${layout.span};margin-top:${layout.offset}px;aspect-ratio:${layout.ratio}" data-open-project="${p.slug}">
              ${scrubMediaHTML(p.previews, { randomStart: true, ambient: true })}
              <div class="card-overlay">
                <div class="card-overlay-row"><span class="t">${projectTitle(p)}</span></div>
                <div class="tag-row">${tagPills(p.tags.slice(0, 2))}</div>
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </div>`;
  }

  function mountWelcome() {
    mountRoleRoulette();
    const wrap = document.getElementById("hero-video-wrap");
    const video = wrap.querySelector("video, mux-video");
    const overlay = document.getElementById("hero-play-toggle");
    if (!video) return;
    // starts paused with sound on (not autoplaying) — visitor has to press play.
    // guarded the same way as safePlay: pre-upgrade property writes on a custom
    // element like <mux-video> can get lost once its real setters take over
    const setVolume = () => { video.muted = false; video.volume = 0.8; };
    if (typeof video.play === "function") setVolume();
    else customElements.whenDefined(video.tagName.toLowerCase()).then(setVolume);
    let hovering = false;
    const toggle = () => { if (hovering) return; if (video.paused) video.play(); else video.pause(); };
    video.addEventListener("click", toggle);
    overlay.addEventListener("click", toggle);
    video.addEventListener("pause", () => wrap.classList.remove("is-playing"));
    video.addEventListener("play", () => wrap.classList.add("is-playing"));
    mountHeroHoverControls(wrap, video, (v) => { hovering = v; });
    document.querySelectorAll(".featured-card .media-wrap.scrub.ambient").forEach(scheduleAmbientScrub);
  }

  // ---------- work (grid) ----------
  const DENSITY_OPTIONS = [
    { key: "list", label: "List" },
    { key: "1", label: "1" },
    { key: "2", label: "2" },
  ];

  function densityIconHTML(key, active) {
    const activeCls = active ? "active" : "";
    if (key === "list") return `<span class="density-icon list-icon"><span></span><span></span><span></span></span>`;
    if (key === "1") return `<span class="density-icon d1 ${activeCls}"></span>`;
    return `<span class="density-icon d2 ${activeCls}">${"<span></span>".repeat(9)}</span>`;
  }

  function renderWork() {
    const density = state.density;
    const count = String(PROJECTS.length).padStart(2, "0");
    const head = `
      <div class="work-head">
        <h1>Work <span class="work-count">(${count})</span></h1>
        <div class="density-switch">
          ${DENSITY_OPTIONS.map(
            (d) => `<div class="density-btn" data-set-density="${d.key}" style="background:${d.key === density ? "var(--activeBg)" : "transparent"}">${densityIconHTML(d.key, d.key === density)}</div>`
          ).join("")}
        </div>
      </div>`;

    let body = "";
    if (density === "list") {
      body = `<div class="list-rows" id="list-rows">
        ${PROJECTS.map(
          (p, i) => `
        <div class="list-row" data-open-project="${p.slug}" data-previews="${encodeURIComponent(JSON.stringify(p.previews.map((pv) => pv.src)))}">
          <span class="li-idx">${String(i + 1).padStart(2, "0")}</span>
          <span class="li-title">${projectTitle(p)}</span>
          <div class="li-tags">${tagPills(p.tags)}</div>
          <span class="li-loc">${p.location}</span>
        </div>`
        ).join("")}
      </div>`;
    } else if (density === "1") {
      body = `<div class="project-grid density-1">
        ${PROJECTS.map(
          (p) => `
        <div class="card-full" data-open-project="${p.slug}">
          ${scrubMediaHTML(p.previews, { cls: "card-thumb-full" })}
          <div class="card-meta">
            <span class="title">${projectTitle(p)}</span>
            <div class="tag-row">${tagPills(p.tags)}</div>
            <span class="loc">${p.location}</span>
          </div>
        </div>`
        ).join("")}
      </div>`;
    } else {
      body = `<div class="project-grid density-2">
        ${PROJECTS.map(
          (p, i) => `
        <div class="card-default" data-open-project="${p.slug}">
          <span class="card-index">${String(i + 1).padStart(2, "0")}</span>
          ${scrubMediaHTML(p.previews, { cls: "card-thumb" })}
          <div class="card-meta">
            <span class="title">${projectTitle(p)}</span>
            <span class="loc">${p.location}</span>
          </div>
        </div>`
        ).join("")}
      </div>`;
    }

    // same width for every density so switching between them doesn't jump the layout
    const wideCls = " work-page-wide";
    return `<div class="page work-page${wideCls}" data-screen="work">${head}${body}</div>`;
  }

  // list-view hover trail: as the cursor moves across a row, drop a fading
  // image stamp at each point along its path (instead of one panel dragged
  // along with the cursor) — a trace of images that appear and dissolve.
  function fadePreviewStamp(el) {
    if (!el) return;
    // a normal hold-then-fade, same as any trail stamp — NOT instant. Started
    // only once this stamp is superseded by a newer one (see mountWork), so
    // it sits fully visible for as long as the cursor stays put, and multiple
    // stamps can still be mid-fade at once during fast movement (the trail)
    setTimeout(() => {
      el.classList.remove("in");
      el.classList.add("out");
      setTimeout(() => el.remove(), 500);
    }, 550);
  }

  function spawnPreviewStamp(x, y, url) {
    const el = document.createElement("div");
    el.className = "list-preview-stamp";
    el.dataset.url = url;
    el.style.left = `${x + 20}px`;
    el.style.top = `${y}px`;
    el.innerHTML = `<img alt="">`;
    const img = el.querySelector("img");
    img.onload = () => {
      // vertically center on the drop point once we know the real height
      el.style.top = `${y - el.getBoundingClientRect().height / 2}px`;
      // two rAFs: the first commits the initial (opacity:0) style to a frame,
      // the second then adds "in" so the browser actually animates the change
      // instead of coalescing both into one paint and skipping the transition
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("in")));
    };
    img.src = url;
    document.body.appendChild(el);
    return el;
  }

  function mountWork() {
    // a stamp with no timeout of its own can only be cleared by its own
    // mousemove/mouseleave handlers — if the density view changed while one
    // was showing, those handlers are gone with the old row elements, so
    // sweep up anything orphaned before wiring up a fresh set
    document.querySelectorAll(".list-preview-stamp").forEach((el) => el.remove());
    const rows = document.getElementById("list-rows");
    if (!rows) return;
    let lastX = null, lastY = null, lastSpawn = 0;
    let currentStamp = null;
    const MIN_DIST = 70, MIN_GAP = 90;
    rows.addEventListener("mousemove", (e) => {
      const row = e.target.closest(".list-row");
      if (!row) return;
      const now = performance.now();
      const dist = lastX === null ? Infinity : Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist < MIN_DIST && now - lastSpawn < MIN_GAP) return;
      lastX = e.clientX; lastY = e.clientY; lastSpawn = now;
      const urls = JSON.parse(decodeURIComponent(row.dataset.previews));
      if (!urls.length) return; // no preview images for this project yet
      // a random frame each time, not one mapped to cursor position — avoid
      // repeating whatever the current stamp is already showing
      let idx = Math.floor(Math.random() * urls.length);
      if (urls.length > 1 && urls[idx] === currentStamp?.dataset.url) {
        idx = (idx + 1) % urls.length;
      }
      // spawning a new stamp is what starts the previous one's fade timer —
      // a stamp has none of its own, so it sits still for as long as it's
      // "current" and only begins fading once superseded or the cursor leaves
      fadePreviewStamp(currentStamp);
      currentStamp = spawnPreviewStamp(e.clientX, e.clientY, urls[idx]);
    });
    rows.addEventListener("mouseleave", () => {
      fadePreviewStamp(currentStamp);
      currentStamp = null;
    });
  }

  // editorial gallery: uncropped, original-proportion media, sized well below the
  // full container width/height, drifting left/right/center for a floaty off-grid feel
  function renderEditorialGallery(active) {
    const rowHTML = (row) => {
      const align = row.align || "left";
      if (row.cols.length === 1) {
        const item = active.gallery[row.cols[0]];
        const sizeCls = row.size === "M" ? " size-m" : row.size === "S" ? " size-s" : "";
        // a real photo shrink-wraps to its own natural size (capped by the
        // size class); an embed has no natural size to shrink-wrap to, so it
        // needs an explicit width — matching the size class's own cap makes it
        // land exactly where a same-sized image would
        const capPx = row.size === "M" ? 820 : row.size === "S" ? 560 : 1140;
        const forceWidth = item.type === "vimeo" ? ` style="width:${capPx}px"` : "";
        return `<div class="editorial-row single align-${align}">
          <div class="editorial-item${sizeCls}"${forceWidth}>
            ${mediaHTML(item, { fill: false })}
            ${item.caption ? `<div class="caption">${item.caption}</div>` : ""}
          </div>
        </div>`;
      }
      const cols = row.cols
        .map((colIdx, i) => {
          const item = active.gallery[colIdx];
          const offset = (row.offsets && row.offsets[i]) || 0;
          // row.sizes (parallel to cols) is "M" or "S" per column — controls
          // how wide that column renders; omit it and both sides default even
          const size = row.sizes && row.sizes[i];
          const sizeCls = size === "M" ? " size-m" : size === "S" ? " size-s" : "";
          const capPx = size === "M" ? 760 : size === "S" ? 460 : 680;
          const forceWidth = item.type === "vimeo" ? `width:${capPx}px;` : "";
          return `<div class="editorial-col${sizeCls}" style="margin-top:${offset}px;${forceWidth}">
            ${mediaHTML(item, { fill: false })}
            ${item.caption ? `<div class="caption">${item.caption}</div>` : ""}
          </div>`;
        })
        .join("");
      return `<div class="editorial-row pair align-${align}">${cols}</div>`;
    };
    return `<div class="editorial-gallery">${active.editorialRows.map(rowHTML).join("")}</div>`;
  }

  // real masonry via round-robin column assignment — item 0,1,2,3 go into
  // columns 1,2,3,4, then 4,5,6,7 into 1,2,3,4 again, so scanning
  // left-to-right/top-to-bottom follows file order. CSS columns can't do
  // this: they fill one column completely before starting the next
  function renderMasonryGrid(items, breakpoints = { mobile: 2, tablet: 3, desktop: 4 }) {
    const w = window.innerWidth;
    const count = w <= 600 ? breakpoints.mobile : w <= 900 ? breakpoints.tablet : breakpoints.desktop;
    const cols = Array.from({ length: count }, () => []);
    items.forEach((item, i) => cols[i % count].push({ item, idx: i }));
    return `<div class="screens-grid">${cols
      .map((col) => `<div class="screens-col">${col
        .map(({ item, idx }) => `<div class="screens-item" data-idx="${idx}">${mediaHTML(item, { fill: false })}</div>`)
        .join("")}</div>`)
      .join("")}</div>`;
  }

  // grid view for editorial project galleries: same masonry treatment as
  // Screens (natural uncropped proportions, round-robin reading order),
  // just a narrower column count since project galleries are shorter
  const PROJECT_GRID_BREAKPOINTS = { mobile: 1, tablet: 2, desktop: 3 };
  function renderProjectGrid(active) {
    return renderMasonryGrid(active.gallery, PROJECT_GRID_BREAKPOINTS);
  }

  // ---------- project detail ----------
  function renderDetail(slug) {
    const idx = PROJECTS.findIndex((p) => p.slug === slug);
    const active = idx >= 0 ? PROJECTS[idx] : PROJECTS[0];
    const realIdx = idx >= 0 ? idx : 0;
    const prevIdx = (realIdx - 1 + PROJECTS.length) % PROJECTS.length;
    const nextIdx = (realIdx + 1) % PROJECTS.length;

    const isEditorial = active.galleryStyle === "editorial";
    const showViewToggle = isEditorial;
    const useGrid = showViewToggle && state.editorialGalleryView === "grid";
    const galleryBody = isEditorial
      ? useGrid ? renderProjectGrid(active) : renderEditorialGallery(active)
      : state.galleryView === "grid"
      ? `<div class="gallery-grid">${active.gallery.map((g) => mediaHTML(g, { fill: false })).join("")}</div>`
      : `<div class="gallery-spacious">${active.gallery
          .map(
            (g) => `
          <div class="gallery-spacious-item">
            ${mediaHTML(g, {})}
            ${g.caption ? `<div class="caption">${g.caption}</div>` : ""}
          </div>`
          )
          .join("")}</div>`;

    const hero = active.hero;
    return `
    <div class="page" data-screen="detail">
      ${hero ? `
      <div class="hero hero-detail hero-detail-top">
        <div class="hero-inner is-playing" id="hero-video-wrap">
          ${mediaHTML(hero, { hero: true })}
          ${hero.type !== "vimeo" ? `<div class="hero-play" id="hero-play-toggle"><div class="hero-play-glyph"></div></div>` : ""}
        </div>
      </div>` : ""}

      <div class="detail-scroll-area">
        <div class="project-nav">
          <a data-open-project="${PROJECTS[prevIdx].slug}"><span class="arrow">←</span><span class="proj-title">${PROJECTS[prevIdx].title}</span></a>
          <a data-open-project="${PROJECTS[nextIdx].slug}"><span class="proj-title">${PROJECTS[nextIdx].title}</span><span class="arrow">→</span></a>
        </div>

        <div class="detail-narrow" id="detail-text-block">
          <div class="detail-meta">
            <div class="detail-title-group">
              <span class="detail-idx">${String(realIdx + 1).padStart(2, "0")}</span>
              <div class="detail-title">${projectTitle(active)}</div>
              <div class="tag-row">${tagPills(active.tags)}</div>
              <div class="detail-loc">${active.location}</div>
            </div>
          </div>
          <div class="detail-blurb">${active.blurb}</div>
          ${isEditorial || !active.gallery.length ? "" : `
          <div class="gallery-toggle">
            <div class="opt ${state.galleryView === "spacious" ? "active" : ""}" data-set-gallery="spacious">Spacious</div>
            <div class="opt ${state.galleryView === "grid" ? "active" : ""}" data-set-gallery="grid">Grid</div>
          </div>`}
        </div>

        ${isEditorial ? (useGrid ? `<div class="detail-narrow">${galleryBody}</div>` : `<div class="detail-wide">${galleryBody}</div>`) : `<div class="detail-narrow">${galleryBody}</div>`}

        <div class="detail-narrow detail-footer">
          ${active.credits && active.credits.length ? `
          <div class="detail-credits">
            <h3>Credits</h3>
            <ul>${active.credits.map((c) => `<li><span class="credit-role">${c.role}</span><span class="credit-name">${c.name}</span></li>`).join("")}</ul>
          </div>` : ""}
          ${active.links && active.links.length ? `
          <div class="detail-links">
            <h3>Links</h3>
            <ul>${active.links.map((l) => `<li><a href="${l}" target="_blank" rel="noopener">${linkDomain(l)}</a></li>`).join("")}</ul>
          </div>` : ""}
        </div>
      </div>
    </div>
    ${showViewToggle ? `<button class="view-toggle" data-set-editorial-view="${useGrid ? "editorial" : "grid"}">${useGrid ? "Editorial view" : "Grid view"}</button>` : ""}
    ${state.lightboxOpen ? renderLightbox(active) : ""}`;
  }

  function renderLightbox(project) {
    return `<div class="lightbox" id="lightbox">
      <div class="lightbox-media">${mediaHTML(project.hero, { controls: true, hero: true })}</div>
      <div class="lightbox-close" id="lightbox-close">Close ✕</div>
    </div>`;
  }

  // ---------- screens ----------
  function renderScreens() {
    return `<div class="page screens-page" data-screen="screens">
      <div class="screens-title">Notes</div>
      <div class="screens-sub">A running collection of frames, stills and process shots.</div>
      ${renderMasonryGrid(SCREENS)}
    </div>`;
  }

  // ---------- about ----------
  // splits a client list into two side-by-side columns (so Studios + Direct
  // Clients together read as 4 columns) — the group label sits only on the
  // first column, the second just continues the list
  function clientGroupHTML(label, list) {
    const mid = Math.ceil(list.length / 2);
    const cols = [list.slice(0, mid), list.slice(mid)];
    return cols
      .map(
        (col, i) => `<div class="clients-col">
          ${i === 0 ? `<div class="clients-col-label">${label}</div>` : ""}
          <div class="client-list">${col.map((c) => `<div>${c}</div>`).join("")}</div>
        </div>`
      )
      .join("");
  }

  function renderAbout() {
    return `<div class="page about-page" data-screen="about">
      <div class="about-hero">
        <div class="about-hero-text">
          <div class="about-eyebrow">About</div>
          <h1>Motion Design and 3D generalist for Artists and Marketing clients.</h1>
          <p>For over ten years I've worked across commercials, music films and brand work — with an obsessive eye for pacing, texture and sound design.</p>
          <div class="about-actions">
            <a class="btn-primary" href="mailto:thomasludwigwork@pm.me">Get in touch</a>
            <a class="btn-ghost" href="#">Download CV ↓</a>
          </div>
        </div>
        <div class="about-portrait media-wrap" id="about-portrait" data-idx="0">
          <img class="media-fill active" src="${PROFILE_PICS[0]}" alt="Thomas Mayer">
          <img class="media-fill" alt="Thomas Mayer">
        </div>
      </div>

      <div class="about-row">
        <div class="about-row-label">What I Do</div>
        <div class="about-services">${SERVICES.map((s) => `<span>${s}</span>`).join('<span class="dot">·</span>')}</div>
      </div>

      <div class="about-row">
        <div class="about-row-label">Clients</div>
        <div class="clients-row">
          ${clientGroupHTML("Studios", CLIENTS_COLLAB)}
          ${clientGroupHTML("Direct Clients", CLIENTS_DIRECT)}
        </div>
      </div>

      <div class="about-row">
        <div class="about-row-label">Exhibitions &amp; Talks</div>
        <div class="clients-row">
          ${[EXHIBITIONS.slice(0, Math.ceil(EXHIBITIONS.length / 2)), EXHIBITIONS.slice(Math.ceil(EXHIBITIONS.length / 2))]
            .map(
              (col) => `<div class="clients-col">
            ${col.map((e) => `<div class="exhib-row"><span>${e.event}</span><span class="loc">${e.location}</span></div>`).join("")}
          </div>`
            )
            .join("")}
        </div>
      </div>
    </div>`;
  }

  // clicking the About portrait cycles through PROFILE_PICS, crossfading —
  // same two-layer swap technique as the scrub cards, just click- not
  // hover-driven
  function mountAbout() {
    const portrait = document.getElementById("about-portrait");
    if (!portrait) return;
    portrait.addEventListener("click", () => {
      const next = (Number(portrait.dataset.idx) + 1) % PROFILE_PICS.length;
      portrait.dataset.idx = String(next);
      const front = portrait.querySelector("img.active");
      const back = portrait.querySelector("img:not(.active)");
      back.onload = () => {
        back.classList.add("active");
        front.classList.remove("active");
      };
      back.src = PROFILE_PICS[next];
    });
  }

  // ---------- legal ----------
  // NOTE: placeholders in [brackets] need real details filled in before this
  // is legally valid — see the Impressumspflicht (§5 TMG) and DSGVO/GDPR.
  // Get this reviewed once the real business details are in.
  function renderImpressum() {
    return `<div class="page legal-page" data-screen="impressum">
      <h1>Impressum</h1>
      <div class="legal-section">
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>Thomas Mayer<br>Boxhagener Straße 42<br>10245 Berlin<br>Deutschland</p>
      </div>
      <div class="legal-section">
        <h2>Kontakt</h2>
        <p>Telefon: [Telefonnummer]<br>E-Mail: <a href="mailto:thomasludwigwork@pm.me">thomasludwigwork@pm.me</a></p>
      </div>
      <div class="legal-section">
        <h2>Umsatzsteuer-ID</h2>
        <p>Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: [USt-IdNr., falls vorhanden]</p>
      </div>
      <div class="legal-section">
        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>Thomas Mayer<br>Boxhagener Straße 42, 10245 Berlin</p>
      </div>
      <div class="legal-section">
        <h2>Haftungsausschluss</h2>
        <p>Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Diese Website enthält Verlinkungen zu externen Videoplattformen (Vimeo, Mux) — für deren Inhalte sind ausschließlich die jeweiligen Betreiber verantwortlich.</p>
      </div>
    </div>`;
  }

  function renderDatenschutz() {
    return `<div class="page legal-page" data-screen="datenschutz">
      <h1>Datenschutzerklärung</h1>
      <div class="legal-section">
        <h2>Verantwortlicher</h2>
        <p>Thomas Mayer<br>Boxhagener Straße 42<br>10245 Berlin<br>E-Mail: <a href="mailto:thomasludwigwork@pm.me">thomasludwigwork@pm.me</a></p>
      </div>
      <div class="legal-section">
        <h2>Hosting</h2>
        <p>Diese Website wird über GitHub Pages gehostet (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). Beim Aufruf der Seite verarbeitet GitHub automatisch technische Daten (u. a. IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Datei) in Server-Logfiles. Weitere Informationen: <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub Privacy Statement</a>.</p>
      </div>
      <div class="legal-section">
        <h2>Eingebettete Videos (Vimeo, Mux)</h2>
        <p>Auf dieser Seite werden Videos über die Dienste Vimeo (Vimeo.com Inc., New York, USA) und Mux (Mux, Inc., San Francisco, USA) eingebunden. Beim Abspielen eines Videos wird eine Verbindung zu den Servern des jeweiligen Anbieters hergestellt, wobei technische Daten (u. a. IP-Adresse) übertragen werden können. Weitere Informationen: <a href="https://vimeo.com/privacy" target="_blank" rel="noopener">Vimeo Datenschutz</a>, <a href="https://www.mux.com/privacy" target="_blank" rel="noopener">Mux Datenschutz</a>.</p>
      </div>
      <div class="legal-section">
        <h2>Cookies</h2>
        <p>Diese Website selbst setzt keine Tracking- oder Werbe-Cookies. Beim Abspielen eingebetteter Videos können die Anbieter Vimeo und Mux technisch notwendige Cookies auf ihren eigenen Domains setzen, die für die Wiedergabe erforderlich sind.</p>
      </div>
      <div class="legal-section">
        <h2>Ihre Rechte</h2>
        <p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung Ihrer personenbezogenen Daten sowie ein Beschwerderecht bei einer Aufsichtsbehörde. Wenden Sie sich hierzu an die oben genannte Kontaktadresse.</p>
      </div>
    </div>`;
  }


  function mountDetailHero() {
    const wrap = document.getElementById("hero-video-wrap");
    if (!wrap) return;
    const video = wrap.querySelector("video, mux-video");
    const overlay = document.getElementById("hero-play-toggle");
    if (video && overlay) {
      safePlay(video);
      let hovering = false;
      const toggle = () => { if (hovering) return; if (video.paused) video.play(); else video.pause(); };
      video.addEventListener("click", toggle);
      overlay.addEventListener("click", toggle);
      video.addEventListener("pause", () => wrap.classList.remove("is-playing"));
      video.addEventListener("play", () => wrap.classList.add("is-playing"));
      mountHeroHoverControls(wrap, video, (v) => { hovering = v; });
    }
    const openLb = document.getElementById("hero-lightbox-open");
    if (openLb) openLb.addEventListener("click", () => { state.lightboxOpen = true; render(); });
    const closeLb = document.getElementById("lightbox-close");
    if (closeLb) closeLb.addEventListener("click", () => { state.lightboxOpen = false; render(); });
    const lb = document.getElementById("lightbox");
    if (lb) lb.addEventListener("click", (e) => { if (e.target === lb) { state.lightboxOpen = false; render(); } });
  }

  function updateNavActive(page) {
    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((el) => {
      const target = el.dataset.nav;
      const isActive = target === page || (target === "work" && page === "detail");
      el.classList.toggle("active", isActive);
    });
  }

  // ---------- main render ----------
  // gallery videos (data-autoplay) only actually play while scrolled into view —
  // starting every clip on a page at once (e.g. Weekend's 8 clips) chokes the
  // browser, so playback follows the viewport instead, one/two clips at a time.
  let galleryVideoObserver = null;
  function observeGalleryVideos() {
    if (!galleryVideoObserver) {
      galleryVideoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const v = entry.target;
            if (entry.isIntersecting) v.play().catch(() => {});
            else v.pause();
          });
        },
        { rootMargin: "200px 0px", threshold: 0.15 }
      );
    }
    galleryVideoObserver.disconnect();
    app.querySelectorAll("video[data-autoplay], mux-video[data-autoplay]").forEach((v) => galleryVideoObserver.observe(v));
  }

  function render() {
    document.querySelectorAll(".list-preview-stamp").forEach((el) => el.remove());
    const route = parseHash();
    updateNavActive(route.page);

    if (route.page === "welcome") {
      app.innerHTML = renderWelcome();
      mountWelcome();
    } else if (route.page === "work") {
      app.innerHTML = renderWork();
      mountWork();
    } else if (route.page === "detail") {
      state.lightboxOpen = false;
      app.innerHTML = renderDetail(route.slug);
      mountDetailHero();
    } else if (route.page === "screens") {
      app.innerHTML = renderScreens();
    } else if (route.page === "about") {
      app.innerHTML = renderAbout();
      mountAbout();
    } else if (route.page === "impressum") {
      app.innerHTML = renderImpressum();
    } else if (route.page === "datenschutz") {
      app.innerHTML = renderDatenschutz();
    }
    observeGalleryVideos();
    window.scrollTo(0, 0);
  }

  // re-render just the detail page in place (gallery toggle / lightbox), no scroll jump
  function rerenderDetail(slug) {
    app.innerHTML = renderDetail(slug);
    mountDetailHero();
    observeGalleryVideos();
  }

  // ---------- delegated events ----------
  document.body.addEventListener("click", (e) => {
    const navEl = e.target.closest("[data-nav]");
    if (navEl) { setMobileNavOpen(false); goto(navEl.dataset.nav); return; }

    const openEl = e.target.closest("[data-open-project]");
    if (openEl) { goto("detail", openEl.dataset.openProject); return; }

    const densityEl = e.target.closest("[data-set-density]");
    if (densityEl) {
      state.density = densityEl.dataset.setDensity;
      localStorage.setItem("tm-density", state.density);
      app.innerHTML = renderWork();
      mountWork();
      return;
    }

    const galEl = e.target.closest("[data-set-gallery]");
    if (galEl) {
      state.galleryView = galEl.dataset.setGallery;
      const route = parseHash();
      if (route.page === "detail") rerenderDetail(route.slug);
      return;
    }

    const viewEl = e.target.closest("[data-set-editorial-view]");
    if (viewEl) {
      const route = parseHash();
      const now = Date.now();
      chaosClicks = now - chaosLastClick > 600 ? 1 : chaosClicks + 1;
      chaosLastClick = now;
      if (chaosClicks >= 5 && CHAOS_SLUGS.includes(route.slug)) {
        chaosClicks = 0;
        triggerChaos();
        return; // scramble instead of switching views this time
      }
      state.editorialGalleryView = viewEl.dataset.setEditorialView;
      if (route.page === "detail") rerenderDetail(route.slug);
      return;
    }
  });

  render();
})();
