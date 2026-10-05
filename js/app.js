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
    // click-to-enlarge lightbox shared by Notes and project galleries —
    // lightboxItems is whichever array is currently open (SCREENS or a
    // project's .gallery), lightboxIndex is null when closed. lightboxCaptions
    // is an optional parallel array (same length/order as lightboxItems) of
    // {title, tags} to show below the image — only Work's "All" view (which
    // mixes items from every project) uses it, so viewers can tell which
    // project a given tile belongs to.
    lightboxItems: null,
    lightboxIndex: null,
    lightboxCaptions: null,
    lightboxAllowVimeo: false,
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
    "artist", "technologist", "little geek",
    "motion designer", "3D generalist", "art director", "creative producer",
    "Blender nerd", "Linux enthusiast", "salad chef",
    "creative", "problem solver", "style framer", "interaction designer",
    "carpenter", "papa", "notion organizer", "Vibecoder",
    "animator", "keyframe schubser", "node noodler", "cg meme machine",
  ];
  let roleRouletteTimer = null;
  function mountRoleRoulette() {
    clearTimeout(roleRouletteTimer);
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

    // first 3 auto-shuffles are quick (every 5s) to show off the effect,
    // then it settles into a slower ambient pace (every 10s)
    let autoCount = 0;
    function scheduleNext() {
      clearTimeout(roleRouletteTimer);
      const delay = autoCount < 3 ? 5000 : 10000;
      roleRouletteTimer = setTimeout(() => {
        autoCount++;
        advance();
        scheduleNext();
      }, delay);
    }
    function restartTimer() {
      autoCount = 0;
      scheduleNext();
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
    // opts.dataIdx: stamps the wrapper with data-idx so a click-to-enlarge
    // handler can map it back to its position in whatever array it came from.
    // opts.extraAttrs: any other raw attribute string to stamp on the wrapper.
    const dataIdx = (opts.dataIdx !== undefined ? ` data-idx="${opts.dataIdx}"` : "") + (opts.extraAttrs ? ` ${opts.extraAttrs}` : "");
    if (!item) return `<div class="media-wrap ${cls} stripe"${dataIdx}></div>`;
    // known intrinsic size -> reserve the tile's box up front so lazy-loading
    // media doesn't resize it (and shove the masonry columns around) on arrival
    const dims = typeof MEDIA_DIMS !== "undefined" && MEDIA_DIMS[item.src];
    const arStyle = dims && opts.reserve ? ` style="aspect-ratio:${dims[0]}/${dims[1]}"` : "";
    if (item.type === "image") {
      return `<div class="media-wrap ${cls}"${arStyle}${dataIdx}><img class="${innerCls}" src="${item.src}" loading="lazy" decoding="async" alt=""></div>`;
    }
    if (item.type === "vimeo") {
      const vimeoCls = fill ? "" : "vimeo-embed";
      // opts.noAutoplay (grid context, not enlarged, e.g. Work's "All" view):
      // don't mount a live iframe at all. Even non-autoplaying, a Vimeo
      // iframe still loads the entire player bundle once it nears the
      // viewport (there's no way to opt out of that beyond dropping the
      // iframe itself) — several of those loading in a burst during a fast
      // scroll is real main-thread work and was stalling the page. A cheap
      // static placeholder costs nothing to scroll past; the real embed only
      // gets created when the person actually opens it (opts.hero, below).
      if (opts.noAutoplay && !opts.hero) {
        return `<div class="media-wrap ${vimeoCls} ${cls} vimeo-placeholder"${dataIdx}>
          <div class="vimeo-placeholder-glyph"></div>
        </div>`;
      }
      // opts.hero: the enlarged lightbox render — show real player chrome
      // (background=0) and autoplay, since the person just deliberately
      // opened it. Anywhere else (decorative inline embeds, e.g. a project's
      // editorial gallery): autoplay/background=1, as before.
      const playParams = opts.hero ? "autoplay=1&amp;background=0" : "autoplay=1&amp;background=1";
      const src = `https://player.vimeo.com/video/${item.src}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;${playParams}&amp;loop=1&amp;muted=1`;
      const allow = `allow="autoplay;fullscreen;picture-in-picture;clipboard-write;encrypted-media;web-share" referrerpolicy="strict-origin-when-cross-origin" loading="lazy" title="video"`;
      const style = "position:absolute;inset:0;width:100%;height:100%;border:0";
      // an iframe has no natural size of its own to shrink-wrap to (unlike a real
      // photo's actual pixel dimensions), so outside of fill mode it needs the
      // "vimeo-embed" marker — renderEditorialGallery gives that item's wrapper
      // a real width to fill, and .vimeo-embed turns that into a 16:9 box
      return `<div class="media-wrap ${vimeoCls} ${cls}"${dataIdx}><iframe src="${src}" style="${style}" ${allow}></iframe></div>`;
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
      // hero videos manage their own play/pause (mountWelcome/mountDetailHero);
      // opts.noAutoplay opts a clip out of the observer entirely (press play
      // manually); opts.capAutoplay marks it for the observer's concurrency
      // cap (data-cap-autoplay) — a handful of these still autoplay on
      // scroll, but not an unlimited number at once. Plain gallery/grid
      // videos elsewhere get neither and autoplay on scroll uncapped, as
      // before.
      const observedAttr = opts.hero || opts.noAutoplay ? "" : opts.capAutoplay ? " data-autoplay data-cap-autoplay" : " data-autoplay";
      // hero videos need to start the instant they mount, so they preload
      // metadata ahead of time; gallery/grid videos are played on demand by
      // the scroll observer (or a manual press, for opts.noAutoplay), so
      // eagerly buffering all of them at once (their combined weight,
      // especially on pages with many clips) is what chokes the browser —
      // defer their fetch entirely until observed/pressed
      const preload = opts.hero ? "metadata" : "none";
      return `<div class="media-wrap ${cls}"${arStyle}${dataIdx}><video class="${innerCls}" ${poster} preload="${preload}" ${controls} muted loop playsinline${observedAttr}><source src="${item.src}"${typeAttr}></video></div>`;
    }
    if (item.type === "mux") {
      // <mux-video> is Mux's custom element — same attributes/API as a native
      // <video> (autoplay, muted, loop, .play()/.pause(), play/pause events),
      // so it drops into the exact same hero/gallery wiring as the "video"
      // branch above, just streaming adaptive HLS instead of one fixed file
      const poster = item.poster ? ` poster="${item.poster}"` : "";
      const controls = opts.controls ? "controls" : "";
      const observedAttr = opts.hero || opts.noAutoplay ? "" : opts.capAutoplay ? " data-autoplay data-cap-autoplay" : " data-autoplay";
      const preload = opts.hero ? "metadata" : "none";
      return `<div class="media-wrap ${cls}"${dataIdx}><mux-video class="${innerCls}" playback-id="${item.src}"${poster} preload="${preload}" ${controls} muted loop playsinline${observedAttr}></mux-video></div>`;
    }
    return `<div class="media-wrap ${cls} stripe"${dataIdx}></div>`;
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
  function featuredCardHTML(card) {
    const p = PROJECTS.find((pr) => pr.slug === card.slug);
    if (!p) return "";
    return `
      <div class="featured-card" style="flex-basis:${card.width}%;margin-top:${card.offset}px;aspect-ratio:${card.ratio}" data-open-project="${p.slug}">
        ${scrubMediaHTML(p.previews, { randomStart: true, ambient: true })}
        <div class="card-overlay">
          <div class="card-overlay-row"><span class="t">${projectTitle(p)}</span></div>
          <div class="tag-row">${tagPills(p.tags.slice(0, 2))}</div>
        </div>
      </div>`;
  }

  function renderWelcome() {
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
        <div class="intro-headline">Hey there, I'm Thomas, <span id="role-article">a</span> <span class="role-roulette-wrap" id="role-roulette-wrap"><span class="role-roulette" id="role-roulette">creative</span></span>.</div>
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
          ${FEATURED_ROWS.map((row) => `<div class="featured-row">${row.cards.map(featuredCardHTML).join("")}</div>`).join("")}
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
    // autoplays with sound on, same as the project-detail heroes — if the
    // browser's autoplay policy blocks unmuted playback (no prior user
    // interaction with the site), it just stays paused and the play glyph
    // below covers that. guarded the same way as safePlay: pre-upgrade
    // property writes on a custom element like <mux-video> can get lost
    // once its real setters take over
    const setVolume = () => { video.muted = false; video.volume = 0.8; };
    if (typeof video.play === "function") setVolume();
    else customElements.whenDefined(video.tagName.toLowerCase()).then(setVolume);
    safePlay(video);
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
    { key: "all", label: "All" },
  ];

  function densityIconHTML(key, active) {
    const activeCls = active ? "active" : "";
    if (key === "list") return `<span class="density-icon list-icon"><span></span><span></span><span></span></span>`;
    if (key === "1") return `<span class="density-icon d1 ${activeCls}"></span>`;
    if (key === "2") return `<span class="density-icon d2 ${activeCls}">${"<span></span>".repeat(4)}</span>`;
    return `<span class="density-icon dall ${activeCls}">${"<span></span>".repeat(9)}</span>`;
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
    } else if (density === "all") {
      body = renderAllContentGrid();
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

  // "All" density: every project's gallery flattened into one long grid —
  // a one-pager to scroll through instead of picking a project first. Same
  // masonry layout/breakpoints as Notes (renderMasonryGrid's default:
  // desktop 4 / tablet 3 / mobile 2 columns). A fade-in class lifts each
  // tile into place the first time it scrolls into view (see
  // observeAllContentFadeIn) rather than all appearing at once. Videos
  // auto-play on scroll same as every other grid/gallery
  // (observeGalleryVideos) — safe now that the gallery clips are lighter
  // H.264 instead of the old high-res VP9 files. Clicking a tile opens the
  // same click-to-enlarge lightbox as Notes (see openMediaLightbox), with
  // the source project's title/tags shown under the image so it's still
  // clear which project each tile came from, and arrow-navigates across
  // every project's content rather than opening the project page.
  function getAllContentTiles() {
    const tiles = [];
    const captions = [];
    PROJECTS.forEach((p) => {
      p.gallery.forEach((item) => {
        tiles.push(item);
        captions.push({ title: projectTitle(p), tags: p.tags, slug: p.slug });
      });
    });
    return { tiles, captions };
  }
  function renderAllContentGrid() {
    const { tiles } = getAllContentTiles();
    return renderMasonryGrid(tiles, { mobile: 2, tablet: 3, desktop: 4 }, (item) => ({
      cls: "all-content-item",
      // plain video files (already lightweight H.264) still autoplay on
      // scroll, just capped to a few at once (see observeGalleryVideos);
      // vimeo/mux — heavier per-instance (a full embedded player/adaptive
      // stream each) and vimeo has no viewport-observer hook at all — don't
      // autoplay here, press play manually instead
      ...(item.type === "video" ? { capAutoplay: true } : { noAutoplay: true, controls: true }),
    }));
  }
  function observeAllContentFadeIn() {
    const items = document.querySelectorAll(".all-content-item, .reveal");
    if (!items.length) return;
    // a tile only fades in once its image has actually arrived (otherwise the
    // fade plays on an empty box and the picture pops in afterwards); tiles
    // entering together get a small stagger so a row ripples in
    const obs = new IntersectionObserver(
      (entries) => {
        let n = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          obs.unobserve(el);
          const show = () => {
            el.style.transitionDelay = `${Math.min(n++, 6) * 70}ms`;
            requestAnimationFrame(() => el.classList.add("is-visible"));
          };
          const img = el.querySelector("img");
          if (!img || img.complete) show();
          else {
            let done = false;
            const once = () => { if (!done) { done = true; show(); } };
            img.addEventListener("load", once, { once: true });
            img.addEventListener("error", once, { once: true });
            setTimeout(once, 2500);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
    );
    items.forEach((el) => obs.observe(el));
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
    observeAllContentFadeIn();
    if (state.density === "all") workMasonryBucketWidth = masonryColumnCount({ mobile: 2, tablet: 3, desktop: 4 });
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
          <div class="editorial-item${sizeCls}"${forceWidth} data-idx="${row.cols[0]}">
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
          return `<div class="editorial-col${sizeCls}" style="margin-top:${offset}px;${forceWidth}" data-idx="${colIdx}">
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
  function masonryColumnCount(breakpoints) {
    const w = window.innerWidth;
    return w <= 600 ? breakpoints.mobile : w <= 900 ? breakpoints.tablet : breakpoints.desktop;
  }
  // itemOpts(item, idx), if given, merges extra mediaHTML opts (cls/extraAttrs)
  // per item — used by the Work page's "All" view to tag each tile with its
  // source project and a fade-in class, without changing any other caller
  function renderMasonryGrid(items, breakpoints = { mobile: 2, tablet: 3, desktop: 4 }, itemOpts) {
    const count = masonryColumnCount(breakpoints);
    const cols = Array.from({ length: count }, () => []);
    items.forEach((item, i) => cols[i % count].push({ item, idx: i }));
    return `<div class="screens-grid">${cols
      .map((col) => `<div class="screens-col">${col
        .map(({ item, idx }) => `<div class="screens-item" data-idx="${idx}">${mediaHTML(item, { fill: false, reserve: true, ...(itemOpts ? itemOpts(item, idx) : {}) })}</div>`)
        .join("")}</div>`)
      .join("")}</div>`;
  }

  // grid view for editorial project galleries: same masonry treatment as
  // Screens (natural uncropped proportions, round-robin reading order),
  // just a narrower column count since project galleries are shorter
  const PROJECT_GRID_BREAKPOINTS = { mobile: 2, tablet: 2, desktop: 3 };
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
      ? `<div class="gallery-grid">${active.gallery.map((g, i) => mediaHTML(g, { fill: false, dataIdx: i })).join("")}</div>`
      : `<div class="gallery-spacious">${active.gallery
          .map(
            (g, i) => `
          <div class="gallery-spacious-item">
            ${mediaHTML(g, { dataIdx: i })}
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
      ${renderMasonryGrid(SCREENS, undefined, () => ({ cls: "reveal" }))}
    </div>`;
  }

  // click-to-enlarge lightbox shared by Notes and every project gallery view
  // (grid, spacious, editorial) — kept out of the page's own render() output
  // and patched directly into the DOM (see updateMediaLightbox) so opening/
  // navigating it never touches the underlying gallery: no full re-render,
  // no scroll jump, no restarting whatever clips are already playing there.
  // state.lightboxItems is whichever array is currently open (SCREENS or a
  // project's .gallery) and skipIneligible() steps over vimeo embeds there,
  // since in those contexts they already play inline and have no standalone
  // "enlarged" form. Work's "All" view is the exception: its vimeo tiles are
  // click-to-play (not auto-playing inline), so enlarging them on click makes
  // sense — allowVimeo is derived from whether captions were passed, which
  // only happens for that view (see the .all-content-item click handler).
  function lightboxEligible(item, allowVimeo) {
    return !!item && (item.type !== "vimeo" || !!allowVimeo);
  }
  function openMediaLightbox(items, idx, captions) {
    const allowVimeo = !!captions;
    if (!lightboxEligible(items[idx], allowVimeo)) return;
    state.lightboxItems = items;
    state.lightboxIndex = idx;
    state.lightboxCaptions = captions || null;
    state.lightboxAllowVimeo = allowVimeo;
    updateMediaLightbox();
  }
  function lightboxCaptionHTML(idx) {
    const meta = state.lightboxCaptions && state.lightboxCaptions[idx];
    if (!meta) return "";
    return `<div class="lightbox-caption"><div class="t" data-open-project="${meta.slug}">${meta.title}</div><div class="tag-row">${tagPills(meta.tags)}</div></div>`;
  }
  function renderMediaLightbox(idx) {
    const items = state.lightboxItems;
    const item = items[idx];
    return `<div class="lightbox media-lightbox" id="media-lightbox">
      <div class="lightbox-body">
        <div class="lightbox-media">
          <div class="lightbox-slide">${mediaHTML(item, { controls: true, hero: true, fill: false })}</div>
        </div>
        ${lightboxCaptionHTML(idx)}
      </div>
      <div class="lightbox-close" id="media-lightbox-close">Close ✕</div>
      <div class="lightbox-nav lightbox-prev" id="media-lightbox-prev" aria-label="Previous">←</div>
      <div class="lightbox-nav lightbox-next" id="media-lightbox-next" aria-label="Next">→</div>
      <div class="lightbox-counter">${idx + 1} / ${items.length}</div>
    </div>`;
  }

  // opening/closing rebuilds the whole overlay (its own fade-in); stepping
  // between items reuses that same overlay and only swaps the slide inside
  // .lightbox-media (see stepMediaLightbox) — recreating the whole modal on
  // every arrow press was what caused the clipping/flicker, since the chrome
  // (backdrop, close, arrows) doesn't need to re-animate in, only the image
  // removes any lightbox DOM without going through the close animation —
  // used on route changes, where the underlying gallery is being replaced
  // wholesale anyway, so there's nothing to animate back to
  function closeMediaLightboxDom() {
    const existing = document.getElementById("media-lightbox");
    if (existing) existing.remove();
    mediaLightboxTopSlide = null;
  }
  function updateMediaLightbox() {
    closeMediaLightboxDom();
    const idx = state.lightboxIndex;
    if (idx === null) return;
    document.body.insertAdjacentHTML("beforeend", renderMediaLightbox(idx));
    const lb = document.getElementById("media-lightbox");
    const close = () => { state.lightboxItems = null; state.lightboxIndex = null; state.lightboxCaptions = null; state.lightboxAllowVimeo = false; updateMediaLightbox(); };
    document.getElementById("media-lightbox-close").addEventListener("click", close);
    document.getElementById("media-lightbox-prev").addEventListener("click", () => stepMediaLightbox(-1));
    document.getElementById("media-lightbox-next").addEventListener("click", () => stepMediaLightbox(1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    // clicking the media itself also closes — except on a video, where a
    // click is scrubbing/play-pause on its native controls, not "dismiss"
    lb.querySelector(".lightbox-media").addEventListener("click", (e) => {
      if (e.target.tagName !== "VIDEO" && e.target.tagName !== "MUX-VIDEO") close();
    });
    safePlay(lb.querySelector("video, mux-video"));
  }

  // true two-slide crossfade: the outgoing and incoming items are separate
  // absolutely-positioned elements that animate at the same time (outgoing
  // slides off one side while incoming slides in from the other), rather
  // than one element fading out and back in sequentially — that's what
  // actually reads as "sliding across the screen". no lock gates repeat
  // arrow presses: each press immediately starts a fresh transition using
  // whatever slide is currently on top (even if it's still mid-entrance from
  // the previous press), tracked via mediaLightboxTopSlide rather than
  // re-querying the DOM — so fast repeats stay responsive instead of being
  // throttled to one per animation. Each outgoing slide cleans itself up on
  // its own timer (matching the CSS duration, not transitionend — that can
  // fail to fire on a backgrounded/interrupted transition) independently of
  // the others, so a pile-up of quick presses can never get stuck.
  const MEDIA_LIGHTBOX_SLIDE_MS = 280;
  let mediaLightboxTopSlide = null;
  function stepMediaLightbox(dir) {
    const items = state.lightboxItems;
    if (!items || state.lightboxIndex === null) return;
    const viewport = document.querySelector("#media-lightbox .lightbox-media");
    const outgoing = mediaLightboxTopSlide || (viewport && viewport.querySelector(".lightbox-slide"));
    if (!viewport || !outgoing) return;

    // step past any vimeo embeds in either direction instead of opening them
    let newIdx = state.lightboxIndex;
    for (let i = 0; i < items.length; i++) {
      newIdx = (newIdx + dir + items.length) % items.length;
      if (lightboxEligible(items[newIdx], state.lightboxAllowVimeo)) break;
    }
    state.lightboxIndex = newIdx;

    const incoming = document.createElement("div");
    incoming.className = "lightbox-slide " + (dir > 0 ? "lb-off-right" : "lb-off-left");
    incoming.innerHTML = mediaHTML(items[newIdx], { controls: true, hero: true, fill: false });
    viewport.appendChild(incoming);
    safePlay(incoming.querySelector("video, mux-video"));
    mediaLightboxTopSlide = incoming;

    const counter = document.querySelector(".lightbox-counter");
    if (counter) counter.textContent = `${newIdx + 1} / ${items.length}`;
    const captionEl = document.querySelector("#media-lightbox .lightbox-caption");
    if (captionEl) captionEl.outerHTML = lightboxCaptionHTML(newIdx);

    // commit the incoming slide's starting (off-screen) position before
    // animating, so the browser doesn't collapse the "appear off-screen then
    // move to center" into a single no-op transition
    void incoming.offsetWidth;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        outgoing.classList.add(dir > 0 ? "lb-off-left" : "lb-off-right");
        incoming.classList.remove("lb-off-left", "lb-off-right");
      });
    });

    setTimeout(() => outgoing.remove(), MEDIA_LIGHTBOX_SLIDE_MS + 30);
  }

  // ---------- about ----------
  // splits a client list into two side-by-side columns (so Studios + Direct
  // Clients together read as 4 columns) — the group label sits only on the
  // first column, the second just continues the list
  // splits a flat list into n as-even-as-possible columns, left to right
  function chunkEven(list, n) {
    const base = Math.floor(list.length / n);
    const extra = list.length % n;
    const cols = [];
    let start = 0;
    for (let i = 0; i < n; i++) {
      const size = base + (i < extra ? 1 : 0);
      cols.push(list.slice(start, start + size));
      start += size;
    }
    return cols;
  }

  function clientGroupHTML(label, list) {
    const mid = Math.ceil(list.length / 2);
    const cols = [list.slice(0, mid), list.slice(mid)];
    return cols
      .map(
        (col, i) => `<div class="clients-col">
          <div class="clients-col-label"${i === 0 ? "" : ' style="visibility:hidden"'}>${label}</div>
          <div class="client-list">${col.map((c) => `<div>${c}</div>`).join("")}</div>
        </div>`
      )
      .join("");
  }

  // logo wall for clients we actually have artwork for — a CSS mask turns
  // each logo (regardless of its own brand colors) into a flat silhouette
  // filled with the current theme color, so a colorful PNG still reads as
  // pure black/white and flips correctly with the theme toggle
  function clientLogosHTML() {
    return CLIENT_LOGOS.map(({ name, file, ar }) => {
      const url = `Assets/logos/${file}`;
      const width = Math.round(46.5 * ar);
      return `<div class="client-logo" style="width:${width}px;-webkit-mask-image:url('${url}');mask-image:url('${url}')" title="${name}" aria-label="${name}"></div>`;
    }).join("");
  }

  // duplicated back-to-back so the marquee's translateX(-50% -> 0) loop is seamless
  function clientLogosMarqueeHTML() {
    const set = clientLogosHTML();
    return `<div class="client-logos-wrap"><div class="client-logos">${set}${set}</div></div>`;
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
            <a class="btn-ghost" href="Assets/cv/CV_Thomas_Mayer.pdf" download target="_blank" rel="noopener">Download CV ↓</a>
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

      ${clientLogosMarqueeHTML()}

      <div class="about-row">
        <div class="about-row-label">References</div>
        <div class="about-row-content">
          <div class="clients-row">
            ${clientGroupHTML("Collaborations", CLIENTS_COLLAB)}
            ${clientGroupHTML("Direct Clients", CLIENTS_DIRECT)}
          </div>
        </div>
      </div>

      <div class="about-row">
        <div class="about-row-label">Exhibitions &amp; Talks</div>
        <div class="about-row-content">
          <div class="clients-row exhib-clients-row">
            ${chunkEven(EXHIBITIONS, 2)
              .map(
                (col) => `<div class="clients-col">
              ${col.map((e) => `<div class="exhib-row"><span>${e.event}</span><span class="loc">${e.location}</span></div>`).join("")}
            </div>`
              )
              .join("")}
          </div>
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
  // starting every clip on a page at once used to choke the browser with the
  // old VP9 1080p clips, but now that gallery/grid clips are re-encoded as
  // lighter H.264 at grid-display resolution, all intersecting clips are
  // allowed to play concurrently (no hard cap).
  let galleryVideoObserver = null;
  // elements marked data-cap-autoplay (see mediaHTML's capAutoplay opt —
  // currently just Work's "All" view, which aggregates every project's
  // videos onto one page) share a concurrency cap so a fast scroll can't
  // start decoding dozens of clips at once; everywhere else autoplays on
  // scroll uncapped, same as always
  const MAX_CAPPED_AUTOPLAY = 3;
  let cappedPlaying = new Set();
  // a video's decoder pipeline is real work to spin up and tear down — on a
  // page with many clips (Work's "All" view has 49), a fast scroll crosses
  // the 0.4 threshold for a lot of them in a row, and calling .play()/.pause()
  // on every single crossing (even ones the scroll immediately carries back
  // out of view) was enough decoder churn to stall the main thread and freeze
  // the page. Debouncing each element's play/pause behind a short settle
  // timer means a clip only actually starts once it's stayed in view long
  // enough to be worth it — one that just flashes past during a fast scroll
  // never touches the decoder at all.
  const AUTOPLAY_SETTLE_MS = 150;
  const autoplayTimers = new Map();
  function observeGalleryVideos() {
    if (!galleryVideoObserver) {
      galleryVideoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const v = entry.target;
            clearTimeout(autoplayTimers.get(v));
            const capped = v.hasAttribute("data-cap-autoplay");
            if (entry.isIntersecting) {
              autoplayTimers.set(
                v,
                setTimeout(() => {
                  if (capped && !cappedPlaying.has(v) && cappedPlaying.size >= MAX_CAPPED_AUTOPLAY) return;
                  v.play().catch(() => {});
                  if (capped) cappedPlaying.add(v);
                }, AUTOPLAY_SETTLE_MS)
              );
            } else {
              autoplayTimers.set(
                v,
                setTimeout(() => {
                  v.pause();
                  cappedPlaying.delete(v);
                }, AUTOPLAY_SETTLE_MS)
              );
            }
          });
        },
        { rootMargin: "0px", threshold: 0.4 }
      );
    }
    galleryVideoObserver.disconnect();
    autoplayTimers.forEach((t) => clearTimeout(t));
    autoplayTimers.clear();
    cappedPlaying = new Set();
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
      state.lightboxItems = null;
      state.lightboxIndex = null;
      closeMediaLightboxDom();
      app.innerHTML = renderDetail(route.slug);
      mountDetailHero();
      detailMasonryBucketWidth = masonryColumnCount(PROJECT_GRID_BREAKPOINTS);
    } else if (route.page === "screens") {
      state.lightboxItems = null;
      state.lightboxIndex = null;
      closeMediaLightboxDom();
      app.innerHTML = renderScreens();
      observeAllContentFadeIn();
      screensMasonryBucketWidth = masonryColumnCount({ mobile: 2, tablet: 3, desktop: 4 });
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
    state.lightboxItems = null;
    state.lightboxIndex = null;
    closeMediaLightboxDom();
    app.innerHTML = renderDetail(slug);
    mountDetailHero();
    observeGalleryVideos();
    detailMasonryBucketWidth = masonryColumnCount(PROJECT_GRID_BREAKPOINTS);
  }

  // ---------- delegated events ----------
  document.body.addEventListener("click", (e) => {
    const navEl = e.target.closest("[data-nav]");
    if (navEl) { setMobileNavOpen(false); goto(navEl.dataset.nav); return; }

    const openEl = e.target.closest("[data-open-project]");
    if (openEl) { goto("detail", openEl.dataset.openProject); return; }

    // Notes grid — items are SCREENS itself
    const screensItemEl = e.target.closest(".screens-page .screens-item");
    if (screensItemEl) {
      openMediaLightbox(SCREENS, Number(screensItemEl.dataset.idx));
      return;
    }

    // Work's "All" grid — flattened across every project, so each item gets
    // a caption (that project's title/tags) rather than opening the project
    const allContentItemEl = e.target.closest(".all-content-item");
    if (allContentItemEl) {
      const wrapper = allContentItemEl.closest(".screens-item");
      const { tiles, captions } = getAllContentTiles();
      openMediaLightbox(tiles, Number(wrapper.dataset.idx), captions);
      return;
    }

    // any project gallery view (masonry grid, plain grid, spacious, or
    // editorial) — all four wrappers carry data-idx into that project's
    // own .gallery array (see mediaHTML's dataIdx opt / renderMasonryGrid /
    // renderEditorialGallery)
    const galleryItemEl = e.target.closest(
      '[data-screen="detail"] .screens-item, .gallery-grid [data-idx], .gallery-spacious-item [data-idx], .editorial-item[data-idx], .editorial-col[data-idx]'
    );
    if (galleryItemEl) {
      const route = parseHash();
      const idx = PROJECTS.findIndex((p) => p.slug === route.slug);
      const active = idx >= 0 ? PROJECTS[idx] : PROJECTS[0];
      openMediaLightbox(active.gallery, Number(galleryItemEl.dataset.idx));
      return;
    }

    const densityEl = e.target.closest("[data-set-density]");
    if (densityEl) {
      state.density = densityEl.dataset.setDensity;
      localStorage.setItem("tm-density", state.density);
      app.innerHTML = renderWork();
      mountWork();
      observeGalleryVideos();
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

  document.addEventListener("keydown", (e) => {
    if (state.lightboxIndex === null) return;
    if (e.key === "Escape") {
      state.lightboxItems = null;
      state.lightboxIndex = null;
      updateMediaLightbox();
    } else if (e.key === "ArrowLeft") {
      stepMediaLightbox(-1);
    } else if (e.key === "ArrowRight") {
      stepMediaLightbox(1);
    } else {
      return;
    }
    e.preventDefault();
  });

  // the masonry column count is only computed at render time, so resizing
  // the window (or rotating a device) without a route change left it stuck
  // on whatever bucket (mobile/tablet/desktop) was active on load — recheck
  // on resize and only touch the DOM when the bucket actually changed. Same
  // fix applies to both Notes and a project's own masonry "Grid view" (they
  // share renderMasonryGrid/.screens-grid), just with different breakpoints
  // and source arrays.
  let screensMasonryBucketWidth = null;
  let detailMasonryBucketWidth = null;
  let workMasonryBucketWidth = null;
  window.addEventListener("resize", () => {
    const route = parseHash();
    if (route.page === "screens") {
      const count = masonryColumnCount({ mobile: 2, tablet: 3, desktop: 4 });
      if (count === screensMasonryBucketWidth) return;
      screensMasonryBucketWidth = count;
      const grid = document.querySelector(".screens-grid");
      if (!grid) return;
      grid.outerHTML = renderMasonryGrid(SCREENS, undefined, () => ({ cls: "reveal" }));
      observeGalleryVideos();
      observeAllContentFadeIn();
    } else if (route.page === "detail") {
      const count = masonryColumnCount(PROJECT_GRID_BREAKPOINTS);
      if (count === detailMasonryBucketWidth) return;
      detailMasonryBucketWidth = count;
      const grid = document.querySelector(".screens-grid");
      if (!grid) return;
      const idx = PROJECTS.findIndex((p) => p.slug === route.slug);
      const active = idx >= 0 ? PROJECTS[idx] : PROJECTS[0];
      grid.outerHTML = renderProjectGrid(active);
      observeGalleryVideos();
    } else if (route.page === "work" && state.density === "all") {
      const count = masonryColumnCount({ mobile: 2, tablet: 3, desktop: 4 });
      if (count === workMasonryBucketWidth) return;
      workMasonryBucketWidth = count;
      const grid = document.querySelector(".screens-grid");
      if (!grid) return;
      grid.outerHTML = renderAllContentGrid();
      observeGalleryVideos();
      observeAllContentFadeIn();
    }
  });

  render();
})();
