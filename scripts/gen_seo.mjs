#!/usr/bin/env node
// Bakes search-engine pages for the portfolio. Run after editing js/data.js
// or js/seo.js:
//
//     node scripts/gen_seo.mjs
//
// Writes, from index.html as the template:
//   index.html, work/, work/<slug>/, notes/, about/, impressum/, datenschutz/
//     → each gets its own <title>, description, canonical, Open Graph tags,
//       JSON-LD structured data and the page's text + links baked into #app
//       (app.js replaces that on first render). <base> points back at the
//       site root so every relative asset path keeps working.
//   404.html     → same app, noindex, so unknown URLs still land somewhere
//   sitemap.xml  → submit this in Google Search Console / Bing Webmaster Tools
//   robots.txt   → only takes effect at a domain root (i.e. with a custom domain)
//
// Everything between <!-- SEO:START/END --> and <!-- STATIC:START/END --> in
// index.html is generated — edit js/seo.js instead.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rd = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// data.js + seo.js are browser scripts with top-level consts; run them as one
// script and hand back what we need as its completion value
const ctx = vm.createContext({});
const S = vm.runInContext(
  rd("js/data.js") + "\n" + rd("js/seo.js") +
    "\n;({ PROJECTS, SERVICES, CLIENTS_COLLAB, CLIENTS_DIRECT, EXHIBITIONS, SOCIAL, SITE_URL, SEO_PERSON, SEO_PAGES, seoFor, seoAbs, seoStripHtml, seoProjectName })",
  ctx
);

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonld = (o) => `<script type="application/ld+json">\n${JSON.stringify(o, null, 1).replace(/</g, "\\u003c")}\n</script>`;

const P = S.SEO_PERSON;
const personId = S.SITE_URL + "#person";
const person = {
  "@type": "Person",
  "@id": personId,
  name: P.name,
  alternateName: ["Thomas Ludwig Mayer", "tomm.boo"],
  url: S.SITE_URL,
  image: S.seoAbs("Assets/about/profilePic/profile-poster.jpg"),
  email: "mailto:" + P.email,
  jobTitle: P.roles,
  description: S.SEO_PAGES.about.description,
  address: { "@type": "PostalAddress", addressLocality: P.city, addressRegion: "Berlin", addressCountry: P.country },
  workLocation: { "@type": "Place", name: "Berlin, Germany" },
  areaServed: "Worldwide",
  knowsLanguage: ["en", "de"],
  knowsAbout: ["3D", "CGI", "3D Animation", "Motion Design", "Art Direction", "Blender", "Cinema 4D", "Houdini", "Geometry Nodes", "Shader Development", "Look Development", "Generative AI", "ComfyUI", "Creative Coding", "WebGL", ...S.SERVICES].filter((v, i, a) => a.indexOf(v) === i),
  sameAs: Object.values(S.SOCIAL),
};

const navLinks = `<nav><a href="./">Home</a> · <a href="work/">Work</a> · <a href="notes/">Notes</a> · <a href="about/">About</a> · <a href="mailto:${esc(P.email)}">Contact</a></nav>`;
const tagline = `<p>${esc(P.name)} — ${esc(P.roles.slice(0, 4).join(", "))}. Based in Berlin, Germany, working worldwide.</p>`;
const projectList = () =>
  `<ul>${S.PROJECTS.map((p) => `<li><a href="work/${esc(p.slug)}/">${esc(S.seoProjectName(p))}</a>${p.tags?.length ? ` — ${esc(p.tags.join(", "))}` : ""}</li>`).join("")}</ul>`;

function staticBody(route, seo) {
  let inner;
  if (route.page === "detail") {
    const p = seo.project;
    const facts = [p.client && `Client: ${p.client}`, p.role && `Role: ${p.role}`, p.year && `Year: ${p.year}`, p.location && `Location: ${p.location}`].filter(Boolean);
    const credits = (p.credits || []).map((c) => `<li>${esc(c.role)}: ${esc(c.name)}</li>`).join("");
    inner = `<h1>${esc(S.seoProjectName(p))}</h1>
<p>${esc(facts.join(" · "))}</p>
<p>${esc((p.tags || []).join(", "))}</p>
${/<p>/.test(p.blurb || "") ? p.blurb : `<p>${esc(S.seoStripHtml(p.blurb))}</p>`}
${credits ? `<h2>Credits</h2><ul>${credits}</ul>` : ""}
<p><a href="work/">← All work by ${esc(P.name)}</a></p>`;
  } else if (route.page === "about") {
    inner = `<h1>Motion design and 3D generalist for artists and marketing clients</h1>
${tagline}
<p>For over ten years Thomas Mayer has worked across commercials, music films and brand work as a 3D generalist, motion designer, art director and digital artist.</p>
<h2>What I do</h2><p>${esc(S.SERVICES.join(", "))}</p>
<h2>Clients &amp; collaborations</h2><p>${esc([...S.CLIENTS_DIRECT, ...S.CLIENTS_COLLAB].join(", "))}</p>
<h2>Exhibitions &amp; talks</h2><ul>${S.EXHIBITIONS.map((e) => `<li>${esc(e.event)} — ${esc(e.location)}</li>`).join("")}</ul>
<p><a href="mailto:${esc(P.email)}">Get in touch</a></p>`;
  } else if (route.page === "work") {
    inner = `<h1>Work — 3D, CGI &amp; motion design</h1>${tagline}${projectList()}`;
  } else if (route.page === "welcome") {
    inner = `<h1>Thomas Mayer — 3D generalist, motion designer &amp; artist in Berlin</h1>
${tagline}
<p>I take projects from first spark to final frame: concept, strategy and hands-on execution in 3D, CGI, motion design and generative AI, for brands and artists like Nike, OpenAI, The Weeknd, Anyma, Zalando and Adidas.</p>
<h2>Selected work</h2>${projectList()}`;
  } else {
    inner = `<h1>${esc(seo.title)}</h1><p>${esc(seo.description)}</p>`;
  }
  return `<div class="seo-static">\n${navLinks}\n${inner}\n</div>`;
}

function headBlock(route, seo, base, { noindex } = {}) {
  const url = S.seoAbs(seo.path);
  const img = S.seoAbs(seo.image);
  const robots = noindex || seo.noindex ? "noindex, follow" : "index, follow, max-image-preview:large";
  const graph = [person];
  if (route.page === "welcome") {
    graph.push({ "@type": "WebSite", "@id": S.SITE_URL + "#website", url: S.SITE_URL, name: "Thomas Mayer — 3D Generalist & Motion Designer, Berlin", inLanguage: "en", publisher: { "@id": personId } });
  }
  graph.push({
    "@type": route.page === "about" ? "ProfilePage" : route.page === "detail" ? "WebPage" : "CollectionPage",
    "@id": url + "#webpage",
    url,
    name: seo.title,
    description: seo.description,
    inLanguage: "en",
    isPartOf: { "@id": S.SITE_URL + "#website" },
    about: { "@id": personId },
    ...(route.page === "about" ? { mainEntity: { "@id": personId } } : {}),
  });
  if (route.page === "detail") {
    const p = seo.project;
    graph.push({
      "@type": "CreativeWork",
      "@id": url + "#work",
      name: S.seoProjectName(p),
      description: S.seoStripHtml(p.blurb),
      url,
      image: img,
      creator: { "@id": personId },
      ...(p.year && /^\d{4}$/.test(p.year) ? { dateCreated: p.year } : {}),
      keywords: (p.tags || []).join(", "),
      ...(p.client ? { sourceOrganization: { "@type": "Organization", name: p.client } } : {}),
    });
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Thomas Mayer", item: S.SITE_URL },
        { "@type": "ListItem", position: 2, name: "Work", item: S.SITE_URL + "work/" },
        { "@type": "ListItem", position: 3, name: S.seoProjectName(p), item: url },
      ],
    });
  }
  return [
    "<!-- SEO:START (generated by scripts/gen_seo.mjs — edit js/seo.js, then re-run) -->",
    `<base href="${base}">`,
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}">`,
    `<meta name="robots" content="${robots}">`,
    `<meta name="author" content="${esc(P.name)}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    `<meta name="geo.region" content="DE-BE">`,
    `<meta name="geo.placename" content="Berlin">`,
    `<meta property="og:type" content="${route.page === "about" ? "profile" : "website"}">`,
    `<meta property="og:site_name" content="Thomas Mayer — 3D Generalist &amp; Motion Designer">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:title" content="${esc(seo.title)}">`,
    `<meta property="og:description" content="${esc(seo.description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:image" content="${esc(img)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(seo.title)}">`,
    `<meta name="twitter:description" content="${esc(seo.description)}">`,
    `<meta name="twitter:image" content="${esc(img)}">`,
    jsonld({ "@context": "https://schema.org", "@graph": graph }),
    "<!-- SEO:END -->",
  ].join("\n");
}

const template = rd("index.html");
for (const m of ["SEO", "STATIC"]) {
  if (!new RegExp(`<!-- ${m}:START[\\s\\S]*?<!-- ${m}:END -->`).test(template)) throw new Error(`index.html is missing the <!-- ${m}:START/END --> markers`);
}
function page(route, base, opts) {
  const seo = S.seoFor(route);
  return template
    .replace(/<!-- SEO:START[\s\S]*?<!-- SEO:END -->/, () => headBlock(route, seo, base, opts))
    .replace(/<!-- STATIC:START[\s\S]*?<!-- STATIC:END -->/, () => `<!-- STATIC:START -->\n${staticBody(route, seo)}\n<!-- STATIC:END -->`);
}

const routes = [
  { page: "welcome" },
  { page: "work" },
  ...S.PROJECTS.map((p) => ({ page: "detail", slug: p.slug })),
  { page: "screens" },
  { page: "about" },
  { page: "impressum" },
  { page: "datenschutz" },
];

// drop project folders whose slug no longer exists
const workDir = path.join(ROOT, "work");
if (fs.existsSync(workDir)) {
  const live = new Set(S.PROJECTS.map((p) => p.slug));
  for (const d of fs.readdirSync(workDir)) {
    const full = path.join(workDir, d);
    if (fs.statSync(full).isDirectory() && !live.has(d) && fs.existsSync(path.join(full, "index.html")) && fs.readdirSync(full).length === 1) {
      fs.rmSync(full, { recursive: true });
      console.log("removed stale", path.relative(ROOT, full));
    }
  }
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = [];
for (const r of routes) {
  const seo = S.seoFor(r);
  const depth = seo.path.split("/").filter(Boolean).length;
  const base = depth ? "../".repeat(depth) : "./";
  const out = path.join(ROOT, seo.path, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(r, base));
  if (!seo.noindex) {
    const prio = r.page === "welcome" ? "1.0" : r.page === "work" || r.page === "about" ? "0.9" : r.page === "detail" ? "0.8" : "0.5";
    sitemap.push(`  <url><loc>${esc(S.seoAbs(seo.path))}</loc><lastmod>${today}</lastmod><priority>${prio}</priority></url>`);
  }
  console.log("wrote", path.relative(ROOT, out));
}

// GitHub Pages serves 404.html for any unknown path at any depth, so it needs
// an absolute base
const siteBase = new URL(S.SITE_URL).pathname;
fs.writeFileSync(path.join(ROOT, "404.html"), page({ page: "welcome" }, siteBase, { noindex: true }));
fs.writeFileSync(
  path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.join("\n")}\n</urlset>\n`
);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${S.SITE_URL}sitemap.xml\n`);
console.log(`wrote 404.html, sitemap.xml (${sitemap.length} urls), robots.txt`);
