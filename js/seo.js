// Search-engine metadata for every route — one source of truth, used twice:
//  - in the browser (app.js calls applySeo on each route change, so the tab
//    title / description / canonical follow the page)
//  - by scripts/gen_seo.mjs, which bakes the same values into a static
//    index.html at each clean URL (work/<slug>/, about/, …) plus sitemap.xml
// Edit wording here, then re-run `node scripts/gen_seo.mjs`.

const SITE_URL = "https://tommkotzu.github.io/portfolio/";

const SEO_PERSON = {
  name: "Thomas Mayer",
  // what people search for — keep the most important first
  roles: ["3D Generalist", "Motion Designer", "Designer", "Digital Artist", "Art Director", "Creative Director"],
  city: "Berlin",
  country: "DE",
  email: "thomasludwigwork@pm.me",
};

const SEO_DEFAULT_IMAGE = "posters/home-reel.jpg";

const SEO_PAGES = {
  welcome: {
    path: "",
    title: "Thomas Mayer — 3D Generalist, Motion Designer & Artist in Berlin",
    description:
      "Thomas Mayer is a Berlin-based 3D generalist, motion designer and digital artist working worldwide. 3D, CGI, motion design, art direction and GenAI for brands like Nike, OpenAI, Zalando, Adidas and Anyma.",
  },
  work: {
    path: "work/",
    title: "Work — 3D, CGI & Motion Design Projects | Thomas Mayer, Berlin",
    description:
      "Selected 3D, CGI, motion design and generative AI projects by Thomas Mayer, 3D generalist and designer in Berlin, for clients worldwide including Nike, OpenAI, The Weeknd, Anyma and Zalando.",
  },
  screens: {
    path: "notes/",
    title: "Notes — Sketches, Tests & R&D | Thomas Mayer, 3D Artist Berlin",
    description:
      "Notes, sketches, look-dev tests and R&D from Thomas Mayer, 3D generalist and motion designer based in Berlin: Blender, Cinema 4D, Geometry Nodes, shaders and ComfyUI.",
  },
  about: {
    path: "about/",
    title: "About Thomas Mayer — 3D Generalist & Motion Designer, Berlin",
    description:
      "Thomas Mayer is a 3D generalist, motion designer and artist based in Berlin, Germany, working worldwide. 10+ years of commercials, music films and brand work for Nike, OpenAI, Dior, Zalando and more.",
  },
  impressum: {
    path: "impressum/",
    title: "Impressum | Thomas Mayer",
    description: "Impressum — Thomas Mayer, 3D generalist and motion designer, Berlin.",
    noindex: true,
  },
  datenschutz: {
    path: "datenschutz/",
    title: "Datenschutz | Thomas Mayer",
    description: "Datenschutzerklärung — Thomas Mayer, Berlin.",
    noindex: true,
  },
};

function seoStripHtml(s) {
  return String(s || "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
}

function seoTruncate(s, n) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\-–—]+$/, "") + "…";
}

function seoProjectName(p) {
  return p.client ? `${p.client} — ${p.title}` : p.title;
}

// first still we can use as a share/preview image (relative to site root, or absolute)
function seoProjectImage(p) {
  if (p.hero && p.hero.type === "mux") return `https://image.mux.com/${p.hero.src}/thumbnail.jpg?time=0`;
  if (p.hero && p.hero.type === "image") return p.hero.src;
  if (p.hero && p.hero.type === "youtube") return `https://i.ytimg.com/vi/${p.hero.src}/maxresdefault.jpg`;
  const still = (p.previews || []).find((m) => m.type === "image" && /\.(jpe?g|png|webp)$/i.test(m.src));
  return still ? still.src : SEO_DEFAULT_IMAGE;
}

function seoFor(route) {
  if (route.page === "detail") {
    const p = PROJECTS.find((x) => x.slug === route.slug);
    if (p) {
      const name = seoProjectName(p);
      const lead = seoStripHtml(p.blurb);
      const tags = (p.tags || []).slice(0, 3).join(", ");
      return {
        path: `work/${p.slug}/`,
        title: `${name} | Thomas Mayer, 3D & Motion Design Berlin`,
        description: seoTruncate(`${name}${p.year ? ` (${p.year})` : ""}: ${tags}. ${lead}`, 158),
        image: seoProjectImage(p),
        project: p,
      };
    }
  }
  const page = SEO_PAGES[route.page] || SEO_PAGES.welcome;
  return Object.assign({ image: SEO_DEFAULT_IMAGE }, page);
}

function seoAbs(url) {
  return /^https?:\/\//.test(url) ? url : SITE_URL + url;
}

// browser only: sync <head> with the current route
function applySeo(route) {
  const s = seoFor(route);
  document.title = s.title;
  const set = (sel, attr, val) => {
    let el = document.head.querySelector(sel);
    if (!el) {
      const m = sel.match(/^(\w+)\[(\w+)="([^"]+)"\]$/);
      el = document.createElement(m[1]);
      el.setAttribute(m[2], m[3]);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, val);
  };
  set('meta[name="description"]', "content", s.description);
  set('link[rel="canonical"]', "href", seoAbs(s.path));
  set('meta[property="og:title"]', "content", s.title);
  set('meta[property="og:description"]', "content", s.description);
  set('meta[property="og:url"]', "content", seoAbs(s.path));
  set('meta[property="og:image"]', "content", seoAbs(s.image));
  set('meta[name="robots"]', "content", s.noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
}

if (typeof module !== "undefined") module.exports = { SITE_URL, SEO_PERSON, SEO_PAGES, SEO_DEFAULT_IMAGE, seoFor, seoAbs, seoStripHtml, seoProjectName };
