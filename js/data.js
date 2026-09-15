// Site content + real asset wiring for the Thomas Mayer portfolio.
// Best-guess mapping from Assets/ onto the design spec — flag anything wrong and it's a one-line fix here.

const ASSET_ROOT = "Assets/projects/";

function a(path) {
  // percent-encode each path segment (filenames have spaces, commas, parens) but keep slashes
  return path.split("/").map(encodeURIComponent).join("/");
}

function media(type, src, extra) {
  return Object.assign({ type, src: a(src) }, extra || {});
}

// convenience: turn a list of image paths (relative to ASSET_ROOT) into preview-image media objects
function previews(...paths) {
  return paths.map((p) => media("image", ASSET_ROOT + p));
}

const SOCIAL = {
  instagram: "https://www.instagram.com/tomm.boo/",
  behance: "https://www.behance.net/thomasmayerberlin",
  linkedin: "https://www.linkedin.com/in/thomas-ludwig-mayer-9b2088138/",
};

const HOME = {
  reel: media("mux", "zEin01eAJjNEYNt2XS7TEtWanGfaw7nbv02OUZoafvmLo", { poster: a("posters/home-reel.jpg") }),
};

// About page portrait — click cycles through these
const PROFILE_PICS = [
  a("Assets/about/profilePic/010.jpeg"),
  a("Assets/about/profilePic/2023-02-11 12.57.01-1.jpg"),
  a("Assets/about/profilePic/2023-04-27 19.17.22.jpg"),
  a("Assets/about/profilePic/Pasted image.png"),
];

const PROJECTS = [
  {
    slug: "acg-x-nike",
    title: "Campaign",
    client: "ACG x Nike",
    location: "Online",
    year: "2025",
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["3D Production", "Asset Creation", "Video Production"],
    blurb: "A 3D-led campaign for ACG x Nike — built from the ground up in CG, from lookdev through final comp.",
    hero: null, // no "hero" folder for this project
    previews: previews(
      "Acg/00_acg/preview/10_30_1908.png",
      "Acg/00_acg/preview/11_05_2318.png",
      "Acg/00_acg/preview/11_24_2631.jpg",
      "Acg/00_acg/preview/Image 3_4.png",
      "Acg/00_acg/preview/image 719.png",
      "Acg/00_acg/preview/Pasted image.png"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("vimeo", "1165000847", { caption: "Hero cut." }), // 0
      media("image", ASSET_ROOT + "Acg/00_acg/acg_be/03.png"), // 1
      media("image", ASSET_ROOT + "Acg/00_acg/acg_be/04.png"), // 2
      media("vimeo", "1165509413", { caption: "Globe rotation pass." }), // 3
      media("image", ASSET_ROOT + "Acg/00_acg/preview/11_05_2318.png"), // 4
      media("image", ASSET_ROOT + "Acg/00_acg/acg_be/06.png"), // 5
      media("vimeo", "1165502822", { caption: "Modeling breakdown." }), // 6
      media("image", ASSET_ROOT + "Acg/00_acg/preview/11_24_2631.jpg"), // 7
      media("vimeo", "1165513848", { caption: "Lookdev pass." }), // 8
      media("image", ASSET_ROOT + "Acg/00_acg/preview/Image 3_4.png"), // 9
      media("vimeo", "1166048550", { caption: "Main comp breakdown." }), // 10
      media("image", ASSET_ROOT + "Acg/00_acg/preview/image 719.png"), // 11
      media("image", ASSET_ROOT + "Acg/00_acg/preview/Pasted image.png"), // 12
      media("image", ASSET_ROOT + "Acg/00_acg/acg_be/090m.png"), // 13 (M)
      media("image", ASSET_ROOT + "Acg/00_acg/acg_be/100L+.jpg"), // 14 (L)
      media("image", ASSET_ROOT + "Acg/00_acg/acg_be/110M.png"), // 15 (M)
      media("image", ASSET_ROOT + "Acg/00_acg/acg_be/120m.jpg"), // 16 (M)
      media("image", ASSET_ROOT + "Acg/00_acg/acg_be/130S.png"), // 17 (S)
      media("image", ASSET_ROOT + "Acg/00_acg/acg_be/140S.jpg"), // 18 (S)
      media("image", ASSET_ROOT + "Acg/00_acg/acg_be/150M.png"), // 19 (M)
      media("image", ASSET_ROOT + "Acg/00_acg/acg_be/160S.png"), // 20 (S)
    ],
    editorialRows: [
      { cols: [0], align: "left" },
      { cols: [1, 2], offsets: [0, 60], align: "left" },
      { cols: [3], align: "right" },
      { cols: [4, 5], offsets: [50, 0], align: "right" },
      { cols: [6], align: "center" },
      { cols: [7, 8], offsets: [0, 50], align: "left" },
      { cols: [9, 10], offsets: [40, 0], align: "right" },
      { cols: [11, 12], offsets: [0, 60], align: "center" },
      { cols: [13], align: "left", size: "M" },
      { cols: [14], align: "right" },
      { cols: [15, 16], sizes: ["M", "M"], offsets: [50, 60], align: "center" },
      { cols: [17, 18], sizes: ["S", "S"], offsets: [0, 50], align: "left" },
      { cols: [19, 20], sizes: ["M", "S"], offsets: [60, 40], align: "right" },
    ],
  },
  {
    slug: "anyma-character-development",
    title: "Character Development",
    client: "Anyma",
    location: "Home",
    year: "2024",
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["Asset Creation", "Lookdev", "Art Direction", "3D Production"],
    blurb: "Ground-up character design, lookdev and stage-visual direction for Anyma — spanning asset creation, live-show production and tour visuals.",
    // gallery regenerated from Assets/projects/Anyma Character Development/ via
    // scripts/gen_gallery.py — rerun that script after renaming/adding files
    // there instead of hand-editing this list. NOTE: that folder has no
    // "preview/" subfolder anymore, so previews below are just picked from
    // the gallery itself (the 4 "L" shots) — swap in dedicated preview shots
    // any time by adding a preview/ folder back with images in it.
    // Also: Entropy@officialrezz.mp4, bts_02 copy.jpg, bts_06 copy (Copy).jpg
    // and bts_06.jpg still have no number prefix, so they were dropped from
    // the gallery — rename them into the 0-9-0-L/M/S scheme to bring them back.
    hero: null, // no "hero"-named or bare-numbered file in this project
    previews: previews(
      "Anyma Character Development/012L.jpg",
      "Anyma Character Development/034L.jpg",
      "Anyma Character Development/040L.jpg",
      "Anyma Character Development/140L.jpg"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("image", ASSET_ROOT + "Anyma Character Development/012L.jpg"), // 0 (L)
      media("video", ASSET_ROOT + "Anyma Character Development/015S.mp4"), // 1 (S)
      media("video", ASSET_ROOT + "Anyma Character Development/020M.mp4"), // 2 (M)
      media("video", ASSET_ROOT + "Anyma Character Development/030M.mp4"), // 3 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/034L.jpg"), // 4 (L)
      media("image", ASSET_ROOT + "Anyma Character Development/035s.jpg"), // 5 (S)
      media("image", ASSET_ROOT + "Anyma Character Development/036M.jpg"), // 6 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/037S.jpg"), // 7 (S)
      media("image", ASSET_ROOT + "Anyma Character Development/038M.jpg"), // 8 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/040L.jpg"), // 9 (L)
      media("image", ASSET_ROOT + "Anyma Character Development/050m.jpg"), // 10 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/060M.jpg"), // 11 (M)
      media("video", ASSET_ROOT + "Anyma Character Development/100M.mp4"), // 12 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/110m.jpg"), // 13 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/120M.png"), // 14 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/130M.jpg"), // 15 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/140L.jpg"), // 16 (L)
      media("image", ASSET_ROOT + "Anyma Character Development/140M.jpg"), // 17 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/150S.jpg"), // 18 (S)
      media("image", ASSET_ROOT + "Anyma Character Development/160L.jpg"), // 19 (L)
      media("image", ASSET_ROOT + "Anyma Character Development/160M.jpg"), // 20 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/170L.jpg"), // 21 (L)
      media("image", ASSET_ROOT + "Anyma Character Development/180M.png"), // 22 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/190M.png"), // 23 (M)
      media("image", ASSET_ROOT + "Anyma Character Development/200S.png"), // 24 (S)
    ],
    editorialRows: [
      { cols: [0], align: "left" },
      { cols: [1, 2], sizes: ["S", "M"], offsets: [50, 60], align: "right" },
      { cols: [3], align: "center", size: "M" },
      { cols: [4], align: "left" },
      { cols: [5, 6], sizes: ["S", "M"], offsets: [0, 50], align: "right" },
      { cols: [7, 8], sizes: ["S", "M"], offsets: [60, 40], align: "center" },
      { cols: [9], align: "left" },
      { cols: [10, 11], sizes: ["M", "M"], offsets: [0, 50], align: "right" },
      { cols: [12, 13], sizes: ["M", "M"], offsets: [60, 40], align: "center" },
      { cols: [14, 15], sizes: ["M", "M"], offsets: [70, 0], align: "left" },
      { cols: [16], align: "right" },
      { cols: [17, 18], sizes: ["M", "S"], offsets: [60, 40], align: "center" },
      { cols: [19], align: "left" },
      { cols: [20], align: "right", size: "M" },
      { cols: [21], align: "center" },
      { cols: [22, 23], sizes: ["M", "M"], offsets: [60, 40], align: "left" },
      { cols: [24], align: "right", size: "S" },
    ],
  },
  {
    slug: "luisa-via-roma-x-vogue",
    title: "Time Square OOH",
    client: "Luisa Via Roma x VOGUE",
    location: "New York",
    year: "2024",
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["Art Direction", "3D Production", "Video Production"],
    blurb: "Out-of-home campaign for Luisa Via Roma x VOGUE, built for the Times Square billboard format.",
    // gallery/hero regenerated from Assets/projects/luisa via roma/ via
    // scripts/gen_gallery.py — rerun that script after renaming/adding files
    // there instead of hand-editing this list
    hero: media("video", ASSET_ROOT + "luisa via roma/010.mp4"),
    // "Loopinglovers teaser luisaviaroma.mp4" in this preview/ folder is a
    // leftover from the Looping Lovers project, not a real preview for this
    // one — left out rather than mixed in by mistake
    previews: previews(
      "luisa via roma/preview/02.jpg",
      "luisa via roma/preview/2a45c0212037017.672dfbbd2a564.png",
      "luisa via roma/preview/Pasted image.png"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("image", ASSET_ROOT + "luisa via roma/020M.jpg"), // 0 (M)
      media("video", ASSET_ROOT + "luisa via roma/025L.mp4"), // 1 (L)
      media("image", ASSET_ROOT + "luisa via roma/030M.png"), // 2 (M)
      media("image", ASSET_ROOT + "luisa via roma/040L.png"), // 3 (L)
      media("video", ASSET_ROOT + "luisa via roma/045M.mp4"), // 4 (M)
      media("image", ASSET_ROOT + "luisa via roma/050M.png"), // 5 (M)
      media("image", ASSET_ROOT + "luisa via roma/060S.jpg"), // 6 (S)
      media("image", ASSET_ROOT + "luisa via roma/070M.jpg"), // 7 (M)
      media("image", ASSET_ROOT + "luisa via roma/080M.jpg"), // 8 (M)
      media("image", ASSET_ROOT + "luisa via roma/085S.jpg"), // 9 (S)
      media("image", ASSET_ROOT + "luisa via roma/090M.jpg"), // 10 (M)
      media("image", ASSET_ROOT + "luisa via roma/100S.jpg"), // 11 (S)
      media("image", ASSET_ROOT + "luisa via roma/behind the scenes/120M.png"), // 12 (M)
      media("video", ASSET_ROOT + "luisa via roma/behind the scenes/130M.mp4"), // 13 (M)
      media("image", ASSET_ROOT + "luisa via roma/behind the scenes/140S.gif"), // 14 (S)
      media("video", ASSET_ROOT + "luisa via roma/behind the scenes/150L.mp4"), // 15 (L)
      media("image", ASSET_ROOT + "luisa via roma/behind the scenes/160M.gif"), // 16 (M)
      media("image", ASSET_ROOT + "luisa via roma/behind the scenes/160M.png"), // 17 (M)
      media("image", ASSET_ROOT + "luisa via roma/behind the scenes/170S.gif"), // 18 (S)
    ],
    editorialRows: [
      { cols: [0], align: "left", size: "M" },
      { cols: [1], align: "right" },
      { cols: [2], align: "center", size: "M" },
      { cols: [3], align: "left" },
      { cols: [4, 5], sizes: ["M", "M"], offsets: [70, 0], align: "right" },
      { cols: [6, 7], sizes: ["S", "M"], offsets: [50, 60], align: "center" },
      { cols: [8, 9], sizes: ["M", "S"], offsets: [40, 70], align: "left" },
      { cols: [10, 11], sizes: ["M", "S"], offsets: [0, 50], align: "right" },
      { cols: [12, 13], sizes: ["M", "M"], offsets: [60, 40], align: "center" },
      { cols: [14], align: "left", size: "S" },
      { cols: [15], align: "right" },
      { cols: [16, 17], sizes: ["M", "M"], offsets: [50, 60], align: "center" },
      { cols: [18], align: "left", size: "S" },
    ],
  },
  {
    slug: "adidas-nmd-s1",
    title: "ADIDAS NMD_S1",
    client: "Adidas",
    location: "Berlin",
    year: "2023",
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["Art Direction", "3D Production", "Lookdev"],
    blurb: "Product launch film and stills for the Adidas NMD_S1, shot and rendered out of the Berlin studio.",
    // gallery/hero regenerated from the 010L/020M/030S-style filenames in
    // Assets/projects/adidas/ via scripts/gen_gallery.py — rerun that script
    // after renaming/adding files there instead of hand-editing this list
    hero: media("mux", "QWAc6U7I800Cdov3H0201NEI9yGqwcMRwsh7InIeJlM6p4"),
    previews: previews(
      "adidas/preview/03.jpg",
      "adidas/preview/OBJ-bts-8-1.jpg",
      "adidas/preview/obj-styleframes-11.jpg"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("image", ASSET_ROOT + "adidas/020L.jpg"), // 0 (L)
      media("image", ASSET_ROOT + "adidas/030M.jpg"), // 1 (M)
      media("image", ASSET_ROOT + "adidas/040L.jpg"), // 2 (L)
      media("image", ASSET_ROOT + "adidas/050L.jpg"), // 3 (L)
      media("image", ASSET_ROOT + "adidas/070L.jpg"), // 4 (L)
      media("image", ASSET_ROOT + "adidas/080L.jpg"), // 5 (L)
      media("image", ASSET_ROOT + "adidas/090M.jpg"), // 6 (M)
      media("image", ASSET_ROOT + "adidas/100S.jpg"), // 7 (S)
      media("image", ASSET_ROOT + "adidas/110L.jpg"), // 8 (L)
      media("image", ASSET_ROOT + "adidas/120S.jpg"), // 9 (S)
      media("image", ASSET_ROOT + "adidas/150M.jpg"), // 10 (M)
      media("image", ASSET_ROOT + "adidas/160S.jpg"), // 11 (S)
      media("image", ASSET_ROOT + "adidas/170M.jpg"), // 12 (M)
      media("image", ASSET_ROOT + "adidas/180M.jpg"), // 13 (M)
      media("image", ASSET_ROOT + "adidas/190S.jpg"), // 14 (S)
      media("image", ASSET_ROOT + "adidas/200L.jpg"), // 15 (L)
      media("image", ASSET_ROOT + "adidas/210M.jpg"), // 16 (M)
      media("image", ASSET_ROOT + "adidas/220L.jpg"), // 17 (L)
      media("image", ASSET_ROOT + "adidas/230S.jpg"), // 18 (S)
    ],
    editorialRows: [
      { cols: [0], align: "left" },
      { cols: [1], align: "right", size: "M" },
      { cols: [2], align: "center" },
      { cols: [3], align: "left" },
      { cols: [4], align: "right" },
      { cols: [5], align: "center" },
      { cols: [6, 7], sizes: ["M", "S"], offsets: [50, 60], align: "left" },
      { cols: [8], align: "right" },
      { cols: [9, 10], sizes: ["S", "M"], offsets: [70, 0], align: "center" },
      { cols: [11, 12], sizes: ["S", "M"], offsets: [50, 60], align: "left" },
      { cols: [13, 14], sizes: ["M", "S"], offsets: [40, 70], align: "right" },
      { cols: [15], align: "center" },
      { cols: [16], align: "left", size: "M" },
      { cols: [17], align: "right" },
      { cols: [18], align: "center", size: "S" },
    ],
  },
  {
    slug: "openai-munich-hq",
    title: "De Headquarter Opening Munich",
    client: "OpenAI",
    location: "Munich",
    year: "2025",
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["Artist"],
    blurb: "On-location visuals for the opening of OpenAI's Munich office.",
    // gallery/hero regenerated from Assets/projects/openAI/ via
    // scripts/gen_gallery.py — rerun that script after renaming/adding files
    // there instead of hand-editing this list
    hero: media("video", ASSET_ROOT + "openAI/010.mp4"),
    previews: previews(
      "openAI/preview/Pasted image (2).png",
      "openAI/preview/Pasted image (3).png",
      "openAI/preview/Pasted image (4).png",
      "openAI/preview/Pasted image.png"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("image", ASSET_ROOT + "openAI/020M.png"), // 0 (M)
      media("image", ASSET_ROOT + "openAI/020S.png"), // 1 (S)
      media("image", ASSET_ROOT + "openAI/030M.png"), // 2 (M)
      media("video", ASSET_ROOT + "openAI/040S.webm"), // 3 (S)
      media("video", ASSET_ROOT + "openAI/050M.webm"), // 4 (M)
      media("video", ASSET_ROOT + "openAI/060L.webm"), // 5 (L)
      media("video", ASSET_ROOT + "openAI/070M.webm"), // 6 (M)
      media("video", ASSET_ROOT + "openAI/080M.webm"), // 7 (M)
      media("video", ASSET_ROOT + "openAI/090L.webm"), // 8 (L)
    ],
    editorialRows: [
      { cols: [0, 1], sizes: ["M", "S"], offsets: [0, 50], align: "left" },
      { cols: [2, 3], sizes: ["M", "S"], offsets: [60, 40], align: "right" },
      { cols: [4], align: "center", size: "M" },
      { cols: [5], align: "left" },
      { cols: [6, 7], sizes: ["M", "M"], offsets: [50, 60], align: "right" },
      { cols: [8], align: "center" },
    ],
  },
  {
    slug: "nike-x-pigalle",
    title: "AR Campaign",
    client: "Nike x PIGALLE",
    location: "Paris",
    year: "2023",
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["Art Direction", "3D Production"],
    blurb: "AR-driven campaign for the Nike x Pigalle collaboration, art directed and produced for Paris activation.",
    // gallery/hero regenerated from Assets/projects/Pigalle x nike/ via
    // scripts/gen_gallery.py — rerun that script after renaming/adding files
    // there instead of hand-editing this list. NOTE: page/Animations/*.mp4 and
    // posters/*.jpg|webp still use the old naming and were dropped from the
    // gallery — rename them into the 0-9-0-L/M/S scheme to bring them back
    hero: media("video", ASSET_ROOT + "Pigalle x nike/010.mp4"),
    previews: previews(
      "Pigalle x nike/preview/pigalle - official 14.jpg",
      "Pigalle x nike/preview/pigalle - poster 2.jpg",
      "Pigalle x nike/preview/pigalle - styleframe 2.jpg",
      "Pigalle x nike/preview/pigalle - styleframe LR (3).jpg"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("image", ASSET_ROOT + "Pigalle x nike/020M.jpeg"), // 0 (M)
      media("image", ASSET_ROOT + "Pigalle x nike/030S.jpeg"), // 1 (S)
      media("image", ASSET_ROOT + "Pigalle x nike/040L.jpg"), // 2 (L)
      media("image", ASSET_ROOT + "Pigalle x nike/050S.jpg"), // 3 (S)
      media("image", ASSET_ROOT + "Pigalle x nike/060M.jpg"), // 4 (M)
      media("image", ASSET_ROOT + "Pigalle x nike/070S.jpg"), // 5 (S)
      media("image", ASSET_ROOT + "Pigalle x nike/075S.jpg"), // 6 (S)
      media("image", ASSET_ROOT + "Pigalle x nike/080M.jpg"), // 7 (M)
      media("image", ASSET_ROOT + "Pigalle x nike/090M.png"), // 8 (M)
      media("image", ASSET_ROOT + "Pigalle x nike/100L.jpg"), // 9 (L)
      media("image", ASSET_ROOT + "Pigalle x nike/110M.jpg"), // 10 (M)
      media("image", ASSET_ROOT + "Pigalle x nike/120L.jpg"), // 11 (L)
      media("image", ASSET_ROOT + "Pigalle x nike/130M.jpg"), // 12 (M)
      media("image", ASSET_ROOT + "Pigalle x nike/140S.jpg"), // 13 (S)
      media("image", ASSET_ROOT + "Pigalle x nike/150M.jpg"), // 14 (M)
      media("image", ASSET_ROOT + "Pigalle x nike/160M.webp"), // 15 (M)
      media("image", ASSET_ROOT + "Pigalle x nike/170L.webp"), // 16 (L)
      media("image", ASSET_ROOT + "Pigalle x nike/180S.png"), // 17 (S)
      media("image", ASSET_ROOT + "Pigalle x nike/190S.png"), // 18 (S)
      media("image", ASSET_ROOT + "Pigalle x nike/200m.webp"), // 19 (M)
      media("image", ASSET_ROOT + "Pigalle x nike/210S.png"), // 20 (S)
    ],
    editorialRows: [
      { cols: [0, 1], sizes: ["M", "S"], offsets: [0, 50], align: "left" },
      { cols: [2], align: "right" },
      { cols: [3, 4], sizes: ["S", "M"], offsets: [40, 70], align: "center" },
      { cols: [5, 6], sizes: ["S", "S"], offsets: [0, 50], align: "left" },
      { cols: [7, 8], sizes: ["M", "M"], offsets: [60, 40], align: "right" },
      { cols: [9], align: "center" },
      { cols: [10], align: "left", size: "M" },
      { cols: [11], align: "right" },
      { cols: [12, 13], sizes: ["M", "S"], offsets: [60, 40], align: "center" },
      { cols: [14, 15], sizes: ["M", "M"], offsets: [70, 0], align: "left" },
      { cols: [16], align: "right" },
      { cols: [17, 18], sizes: ["S", "S"], offsets: [60, 40], align: "center" },
      { cols: [19, 20], sizes: ["M", "S"], offsets: [70, 0], align: "left" },
    ],
  },
  {
    slug: "the-weeknd-performance",
    title: "Performance",
    client: "Weekend",
    location: "São Paulo",
    year: "2023",
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["Asset Creation", "3D Production"],
    blurb: "Live-performance visual package for The Weeknd's São Paulo show.",
    // gallery/hero regenerated from Assets/projects/weekend/ via
    // scripts/gen_gallery.py — rerun that script after renaming/adding files
    // there instead of hand-editing this list
    hero: media("video", ASSET_ROOT + "weekend/010.webm"),
    previews: previews(
      "weekend/preview/Screenshot From 2026-09-11 13-56-28.png",
      "weekend/preview/Screenshot From 2026-09-11 13-57-14.png",
      "weekend/preview/Screenshot From 2026-09-11 13-57-41.png",
      "weekend/preview/Screenshot From 2026-09-11 13-58-55.png"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("image", ASSET_ROOT + "weekend/020M.png"), // 0 (M)
      media("video", ASSET_ROOT + "weekend/030M.webm"), // 1 (M)
      media("image", ASSET_ROOT + "weekend/040S.jpg"), // 2 (S)
      media("image", ASSET_ROOT + "weekend/050M.jpg"), // 3 (M)
      media("video", ASSET_ROOT + "weekend/060L.webm"), // 4 (L)
      media("video", ASSET_ROOT + "weekend/070M.webm"), // 5 (M)
      media("image", ASSET_ROOT + "weekend/080S.jpg"), // 6 (S)
      media("image", ASSET_ROOT + "weekend/090L.png"), // 7 (L)
      media("image", ASSET_ROOT + "weekend/100M.png"), // 8 (M)
      media("image", ASSET_ROOT + "weekend/110S.png"), // 9 (S)
      media("image", ASSET_ROOT + "weekend/120L.png"), // 10 (L)
      media("video", ASSET_ROOT + "weekend/130S.webm"), // 11 (S)
      media("video", ASSET_ROOT + "weekend/140M.webm"), // 12 (M)
      media("video", ASSET_ROOT + "weekend/150S.webm"), // 13 (S)
      media("video", ASSET_ROOT + "weekend/160S.webm"), // 14 (S)
      media("image", ASSET_ROOT + "weekend/170L.png"), // 15 (L)
      media("image", ASSET_ROOT + "weekend/180m.png"), // 16 (M)
      media("image", ASSET_ROOT + "weekend/190M.jpg"), // 17 (M)
    ],
    editorialRows: [
      { cols: [0, 1], sizes: ["M", "M"], offsets: [0, 50], align: "left" },
      { cols: [2, 3], sizes: ["S", "M"], offsets: [60, 40], align: "right" },
      { cols: [4], align: "center" },
      { cols: [5, 6], sizes: ["M", "S"], offsets: [0, 50], align: "left" },
      { cols: [7], align: "right" },
      { cols: [8, 9], sizes: ["M", "S"], offsets: [40, 70], align: "center" },
      { cols: [10], align: "left" },
      { cols: [11, 12], sizes: ["S", "M"], offsets: [50, 60], align: "right" },
      { cols: [13, 14], sizes: ["S", "S"], offsets: [40, 70], align: "center" },
      { cols: [15], align: "left" },
      { cols: [16, 17], sizes: ["M", "M"], offsets: [50, 60], align: "right" },
    ],
  },
  {
    slug: "zalando-valentines",
    title: "Valentines Campaign",
    client: "Zalando",
    location: "Berlin",
    year: "2023",
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["3D Production", "VFX Supervisor"],
    blurb: "“Beyond Romance” — a Valentine's campaign for Zalando, full CG production with VFX supervision.",
    // gallery/hero regenerated from Assets/projects/zalando/ via
    // scripts/gen_gallery.py — rerun that script after renaming/adding files
    // there instead of hand-editing this list
    hero: media("mux", "v4KSahh02VID4T01mZzm7BPBmhm5yY6bjKxWGCTyc7fh8"),
    previews: previews(
      "zalando/preview/Foto 05.12.23, 14 08 45.jpg",
      "zalando/preview/Foto 05.12.23, 16 33 12.jpg",
      "zalando/preview/Pasted image.png",
      "zalando/preview/Screenshot From 2026-09-11 13-49-32.png"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("video", ASSET_ROOT + "zalando/010S.webm"), // 0 (S)
      media("video", ASSET_ROOT + "zalando/020L.webm"), // 1 (L)
      media("video", ASSET_ROOT + "zalando/030M.mp4"), // 2 (M)
      media("video", ASSET_ROOT + "zalando/040S.webm"), // 3 (S)
      media("image", ASSET_ROOT + "zalando/045M.jpg"), // 4 (M)
      media("image", ASSET_ROOT + "zalando/048S.jpg"), // 5 (S)
      media("video", ASSET_ROOT + "zalando/050L.webm"), // 6 (L)
      media("image", ASSET_ROOT + "zalando/055S.jpg"), // 7 (S)
      media("image", ASSET_ROOT + "zalando/060L.jpg"), // 8 (L)
      media("image", ASSET_ROOT + "zalando/060M.jpg"), // 9 (M)
      media("image", ASSET_ROOT + "zalando/065S.jpg"), // 10 (S)
    ],
    editorialRows: [
      { cols: [0], align: "left", size: "S" },
      { cols: [1], align: "right" },
      { cols: [2, 3], sizes: ["M", "S"], offsets: [60, 40], align: "center" },
      { cols: [4, 5], sizes: ["M", "S"], offsets: [70, 0], align: "left" },
      { cols: [6], align: "right" },
      { cols: [7], align: "center", size: "S" },
      { cols: [8], align: "left" },
      { cols: [9, 10], sizes: ["M", "S"], offsets: [70, 0], align: "right" },
    ],
  },
  {
    slug: "superpop-stage-show",
    title: "Stage Show",
    client: "Superpop",
    location: "Seoul",
    year: "2025",
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["Artist", "Art Direction", "Lookdev", "AI"],
    blurb: "Character and stage-visual direction for Superpop's Seoul show, from storyboard through final lookdev.",
    hero: media("mux", "5kPcLdjeceiNMoey3Z8aRW2htQeVrxQOQSiSqF1yN7M"),
    previews: previews(
      "superpop/preview/cleaned-copy-1536x866.jpg",
      "superpop/preview/Pasted image (2).png",
      "superpop/preview/Pasted image.png",
      "superpop/preview/sh010-1.jpg"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("image", ASSET_ROOT + "superpop/015L.webp"), // 0 (L)
      media("image", ASSET_ROOT + "superpop/019M.png"), // 1 (M)
      media("image", ASSET_ROOT + "superpop/020M.png"), // 2 (M)
      media("image", ASSET_ROOT + "superpop/030S.png"), // 3 (S)
      media("image", ASSET_ROOT + "superpop/040L.webp"), // 4 (L)
      media("image", ASSET_ROOT + "superpop/060L.png"), // 5 (L)
      media("image", ASSET_ROOT + "superpop/070M.png"), // 6 (M)
      media("image", ASSET_ROOT + "superpop/080M.png"), // 7 (M)
      media("vimeo", "1107468409", { caption: "Character animation — full cut." }), // 8 (L)
      media("image", ASSET_ROOT + "superpop/090L.png"), // 9 (L)
      media("image", ASSET_ROOT + "superpop/100L.jpg"), // 10 (L)
      media("image", ASSET_ROOT + "superpop/110L.png"), // 11 (L)
      media("image", ASSET_ROOT + "superpop/130S.png"), // 12 (S)
      media("image", ASSET_ROOT + "superpop/140S.png"), // 13 (S)
      media("image", ASSET_ROOT + "superpop/150M.png"), // 14 (M)
      media("image", ASSET_ROOT + "superpop/180s.png"), // 15 (S)
      media("image", ASSET_ROOT + "superpop/190S.jpg"), // 16 (S)
      media("image", ASSET_ROOT + "superpop/195S.jpg"), // 17 (S)
      media("image", ASSET_ROOT + "superpop/195S.png"), // 18 (S)
      media("image", ASSET_ROOT + "superpop/200S.png"), // 19 (S)
    ],
    editorialRows: [
      { cols: [0], align: "left" },
      { cols: [1, 2], sizes: ["M", "M"], offsets: [50, 60], align: "right" },
      { cols: [3], align: "center", size: "S" },
      { cols: [4], align: "left" },
      { cols: [5], align: "right" },
      { cols: [6, 7], sizes: ["M", "M"], offsets: [50, 60], align: "center" },
      { cols: [8], align: "left" },
      { cols: [9], align: "right" },
      { cols: [10], align: "center" },
      { cols: [11], align: "left" },
      { cols: [12, 13], sizes: ["S", "S"], offsets: [60, 40], align: "right" },
      { cols: [14, 15], sizes: ["M", "S"], offsets: [70, 0], align: "center" },
      { cols: [16, 17], sizes: ["S", "S"], offsets: [50, 60], align: "left" },
      { cols: [18, 19], sizes: ["S", "S"], offsets: [40, 70], align: "right" },
    ],
  },
  {
    slug: "looping-lovers",
    title: "Looping Lovers",
    client: "", // self-initiated — no client
    location: "Schwäbisch Gmünd",
    year: "Since 2016",
    role: "Artist",
    credits: [{ role: "Artist", name: "Thomas Mayer" }],
    tags: ["Motion Design", "3D Explorations", "Artist"],
    blurb: "A personal, ongoing visual project started in 2016 in Schwäbisch Gmünd.",
    hero: media("mux", "dP01ov5G2vkGsojAKM02cPZXPDzlsgZjTqKfiK01u00tfl00"),
    // gen_gallery.py loopinglovers — also skipped Comp.mp4 and the long
    // Instagram-caption-named .mp4, both with no number prefix; rename them
    // into the convention to bring them in
    previews: previews(
      "loopinglovers/preview/Screenshot From 2026-09-14 21-15-54.png",
      "loopinglovers/preview/Screenshot From 2026-09-14 21-16-26.png",
      "loopinglovers/preview/Screenshot From 2026-09-14 21-16-39.png"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("video", ASSET_ROOT + "loopinglovers/010M.mp4"), // 0 (M)
      media("video", ASSET_ROOT + "loopinglovers/020S.mp4"), // 1 (S)
      media("image", ASSET_ROOT + "loopinglovers/025m.jpg"), // 2 (M)
      media("image", ASSET_ROOT + "loopinglovers/026S.png"), // 3 (S)
      media("video", ASSET_ROOT + "loopinglovers/030m.mp4"), // 4 (M)
      media("video", ASSET_ROOT + "loopinglovers/040L.mp4"), // 5 (L)
      media("video", ASSET_ROOT + "loopinglovers/050S.mp4"), // 6 (S)
      media("image", ASSET_ROOT + "loopinglovers/060M.jpg"), // 7 (M)
    ],
    editorialRows: [
      { cols: [0, 1], sizes: ["M", "S"], offsets: [0, 50], align: "left" },
      { cols: [2, 3], sizes: ["M", "S"], offsets: [60, 40], align: "right" },
      { cols: [4], align: "center", size: "M" },
      { cols: [5], align: "left" },
      { cols: [6, 7], sizes: ["S", "M"], offsets: [50, 60], align: "right" },
    ],
  },
  {
    slug: "afterlife-shows",
    title: "Shows",
    client: "Afterlife",
    location: "World Wide",
    year: "2025", // not given — confirm/adjust
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["3D Production"],
    blurb: "3D visual production for Afterlife's world tour shows.",
    hero: media("mux", "IqfxlAhHn00HMetv9Mso53NhrClGQa6B00s4oqbfU4vBI"),
    // gen_gallery.py picked up 7abd3d218995693.68a83fa7e5f88.jpeg as a
    // hero candidate (its name starts with a digit) — that's an accidental
    // match, not a real hero tag, so left out entirely rather than guess
    // where it belongs; rename it into the convention to bring it in
    previews: previews(
      "Afterlife Shows/preview/020L.jpg",
      "Afterlife Shows/preview/040m.png",
      "Afterlife Shows/preview/120L.jpg"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("image", ASSET_ROOT + "Afterlife Shows/020L.jpg"), // 0 (L)
      media("image", ASSET_ROOT + "Afterlife Shows/030M.webp"), // 1 (M)
      media("image", ASSET_ROOT + "Afterlife Shows/040m.png"), // 2 (M)
      media("image", ASSET_ROOT + "Afterlife Shows/050m.jpg"), // 3 (M)
      media("video", ASSET_ROOT + "Afterlife Shows/060L.mp4"), // 4 (L)
      media("video", ASSET_ROOT + "Afterlife Shows/070S.mp4"), // 5 (S)
      media("video", ASSET_ROOT + "Afterlife Shows/080S.mp4"), // 6 (S)
      media("video", ASSET_ROOT + "Afterlife Shows/090m.mp4"), // 7 (M)
      media("image", ASSET_ROOT + "Afterlife Shows/100m.png"), // 8 (M)
      media("video", ASSET_ROOT + "Afterlife Shows/110S.mov"), // 9 (S)
      media("image", ASSET_ROOT + "Afterlife Shows/120L.jpg"), // 10 (L)
    ],
    editorialRows: [
      { cols: [0], align: "left" },
      { cols: [1, 2], sizes: ["M", "M"], offsets: [50, 60], align: "right" },
      { cols: [3], align: "center", size: "M" },
      { cols: [4], align: "left" },
      { cols: [5, 6], sizes: ["S", "S"], offsets: [0, 50], align: "right" },
      { cols: [7, 8], sizes: ["M", "M"], offsets: [60, 40], align: "center" },
      { cols: [9], align: "left", size: "S" },
      { cols: [10], align: "right" },
    ],
  },
  {
    slug: "afterlife-announcement",
    title: "Announcement",
    client: "Afterlife",
    location: "World Wide",
    year: "2025", // not given — confirm/adjust
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["3D Production"],
    blurb: "3D visual production for Afterlife's tour announcement.",
    // gen_gallery.py "Afterlife announement" — no Mux video for this one,
    // hero is the local 010.jpg
    hero: media("image", ASSET_ROOT + "Afterlife announement/010.jpg"),
    previews: previews(
      "Afterlife announement/preview/010.jpg",
      "Afterlife announement/preview/060S.png"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("image", ASSET_ROOT + "Afterlife announement/020M.jpg"), // 0 (M)
      media("image", ASSET_ROOT + "Afterlife announement/030M.jpg"), // 1 (M)
      media("video", ASSET_ROOT + "Afterlife announement/040L.mp4"), // 2 (L)
      media("image", ASSET_ROOT + "Afterlife announement/050S.jpg"), // 3 (S)
      media("image", ASSET_ROOT + "Afterlife announement/060S.png"), // 4 (S)
    ],
    editorialRows: [
      { cols: [0, 1], sizes: ["M", "M"], offsets: [0, 50], align: "left" },
      { cols: [2], align: "right" },
      { cols: [3, 4], sizes: ["S", "S"], offsets: [40, 70], align: "center" },
    ],
  },
  {
    slug: "highsnobiety",
    title: "Not in London",
    client: "Highsnobiety",
    location: "Berlin",
    year: "2025", // not given — confirm/adjust
    role: "Director",
    credits: [{ role: "Direction", name: "Thomas Mayer" }],
    tags: ["3D Production", "Asset Production", "Motion Design"],
    blurb: "“Not in London” — work for Highsnobiety.", // flesh out once there's more detail
    // gen_gallery.py "High Snobiety - not in london" — 160.png is the only
    // bare-numbered file (no L/M/S letter), so it's the hero by convention
    hero: media("image", ASSET_ROOT + "High Snobiety - not in london/160.png"),
    previews: previews(
      "High Snobiety - not in london/preview/080L.png",
      "High Snobiety - not in london/preview/100m.jpg",
      "High Snobiety - not in london/preview/135S.png"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("video", ASSET_ROOT + "High Snobiety - not in london/010L.mp4"), // 0 (L)
      media("video", ASSET_ROOT + "High Snobiety - not in london/020M.mp4"), // 1 (M)
      media("video", ASSET_ROOT + "High Snobiety - not in london/030S.mp4"), // 2 (S)
      media("video", ASSET_ROOT + "High Snobiety - not in london/040M.mp4"), // 3 (M)
      media("image", ASSET_ROOT + "High Snobiety - not in london/045S.jpg"), // 4 (S)
      media("image", ASSET_ROOT + "High Snobiety - not in london/050S.jpg"), // 5 (S)
      media("image", ASSET_ROOT + "High Snobiety - not in london/060M.png"), // 6 (M)
      media("image", ASSET_ROOT + "High Snobiety - not in london/070m.png"), // 7 (M)
      media("image", ASSET_ROOT + "High Snobiety - not in london/080L.png"), // 8 (L)
      media("image", ASSET_ROOT + "High Snobiety - not in london/090m.png"), // 9 (M)
      media("image", ASSET_ROOT + "High Snobiety - not in london/100m.jpg"), // 10 (M)
      media("image", ASSET_ROOT + "High Snobiety - not in london/110m.jpg"), // 11 (M)
      media("image", ASSET_ROOT + "High Snobiety - not in london/120m.jpg"), // 12 (M)
      media("image", ASSET_ROOT + "High Snobiety - not in london/130m.gif"), // 13 (M)
      media("image", ASSET_ROOT + "High Snobiety - not in london/135S.png"), // 14 (S)
      media("image", ASSET_ROOT + "High Snobiety - not in london/140l.png"), // 15 (L)
      media("image", ASSET_ROOT + "High Snobiety - not in london/150S.jpg"), // 16 (S)
      media("image", ASSET_ROOT + "High Snobiety - not in london/170s.png"), // 17 (S)
      media("image", ASSET_ROOT + "High Snobiety - not in london/180S.png"), // 18 (S)
      media("image", ASSET_ROOT + "High Snobiety - not in london/190S.png"), // 19 (S)
    ],
    editorialRows: [
      { cols: [0], align: "left" },
      { cols: [1, 2], sizes: ["M", "S"], offsets: [50, 60], align: "right" },
      { cols: [3, 4], sizes: ["M", "S"], offsets: [40, 70], align: "center" },
      { cols: [5, 6], sizes: ["S", "M"], offsets: [0, 50], align: "left" },
      { cols: [7], align: "right", size: "M" },
      { cols: [8], align: "center" },
      { cols: [9, 10], sizes: ["M", "M"], offsets: [70, 0], align: "left" },
      { cols: [11, 12], sizes: ["M", "M"], offsets: [50, 60], align: "right" },
      { cols: [13, 14], sizes: ["M", "S"], offsets: [40, 70], align: "center" },
      { cols: [15], align: "left" },
      { cols: [16, 17], sizes: ["S", "S"], offsets: [50, 60], align: "right" },
      { cols: [18, 19], sizes: ["S", "S"], offsets: [40, 70], align: "center" },
    ],
  },
];

// index into PROJECTS used on the Welcome screen's "Selected Work" grid
const FEATURED_LAYOUT = [
  { span: "1 / 8", offset: 0, ratio: "16/11" },
  { span: "8 / 13", offset: 170, ratio: "4/5" },
  { span: "1 / 6", offset: 60, ratio: "4/5" },
  { span: "6 / 13", offset: 0, ratio: "16/11" },
];

// real content from Assets/screenshots/ — a running collection of frames,
// stills and process shots, not derived from project galleries
const SCREENS = [
  media("image", "Assets/screenshots/02_18.52_5557.jpg"),
  media("image", "Assets/screenshots/03_13.29_6029.png"),
  media("image", "Assets/screenshots/08_27_1329.png"),
  media("image", "Assets/screenshots/08_27_1331.png"),
  media("image", "Assets/screenshots/08_27_1332.png"),
  media("image", "Assets/screenshots/08_27_1336.png"),
  media("image", "Assets/screenshots/10_15_108.png"),
  media("image", "Assets/screenshots/10_15_109.png"),
  media("image", "Assets/screenshots/10_15_110.png"),
  media("image", "Assets/screenshots/10_15_112.jpg"),
  media("image", "Assets/screenshots/11_10_148.jpg"),
  media("image", "Assets/screenshots/11_10_149.png"),
  media("image", "Assets/screenshots/15_17.40_5598.png"),
  media("image", "Assets/screenshots/15_17.40_5599.png"),
  media("image", "Assets/screenshots/17_15.24_75.jpg"),
  media("image", "Assets/screenshots/18_10.54_96.png"),
  media("image", "Assets/screenshots/18_14.44_156.png"),
  media("image", "Assets/screenshots/20_08.18_1517.jpg"),
  media("image", "Assets/screenshots/22.05.09 -11.5701 blender.png"),
  media("image", "Assets/screenshots/22.05.09 -11.5927 blender.png"),
  media("image", "Assets/screenshots/22.05.09 -12.0403 blender.png"),
  media("image", "Assets/screenshots/22.05.10 -09.3701 blender.png"),
  media("image", "Assets/screenshots/22.05.14 -13.5857 DAZStudio.png"),
  media("image", "Assets/screenshots/22.07.15 -08.5312 chrome.png"),
  media("image", "Assets/screenshots/22.11.02 -15.5732 Cinema_4D.png"),
  media("image", "Assets/screenshots/22.11.02 -16.2523 Cinema_4D.png"),
  media("image", "Assets/screenshots/22.11.02 -18.0036 Cinema_4D.png"),
  media("image", "Assets/screenshots/22.11.02 -18.0049 Cinema_4D.png"),
  media("image", "Assets/screenshots/22.11.03 -12.2647 Cinema_4D.png"),
  media("image", "Assets/screenshots/22.11.03 -13.4048 Cinema_4D.png"),
  media("image", "Assets/screenshots/22.11.03 -13.4103 Cinema_4D.png"),
  media("image", "Assets/screenshots/22.11.03 -13.4118 Cinema_4D.png"),
  media("image", "Assets/screenshots/22.11.03 -13.4140 Cinema_4D.png"),
  media("image", "Assets/screenshots/22.11.16 15.41.51 Cinema_4D.png"),
  media("image", "Assets/screenshots/22.11.24 11.53.03 blender_3.3.png"),
  media("image", "Assets/screenshots/22.12.05 16.08.55 blender_3.3.jpg"),
  media("image", "Assets/screenshots/22.12.05 16.13.03 blender_3.3.jpg"),
  media("image", "Assets/screenshots/25_16.09_267.jpg"),
  media("image", "Assets/screenshots/25_18.45_269.png"),
  media("image", "Assets/screenshots/25_18.45_270.jpg"),
  media("image", "Assets/screenshots/27_11.48_622.png"),
  media("image", "Assets/screenshots/27_11.50_623.png"),
  media("image", "Assets/screenshots/27_11.53_624.png"),
  media("image", "Assets/screenshots/27_12.45_625.png"),
  media("image", "Assets/screenshots/27_12.45_626.png"),
  media("image", "Assets/screenshots/27_12.45_627.png"),
  media("image", "Assets/screenshots/27_15.03_4349.png"),
  media("image", "Assets/screenshots/28_14.22_1561.jpg"),
  media("image", "Assets/screenshots/30_16.21_278.png"),
  media("image", "Assets/screenshots/30_16.22_281.png"),
  media("image", "Assets/screenshots/candy (1).jpg"),
  media("image", "Assets/screenshots/candy (1).png"),
  media("image", "Assets/screenshots/candy (2).jpg"),
  media("image", "Assets/screenshots/candy (3).jpg"),
  media("image", "Assets/screenshots/candy (4).jpg"),
  media("image", "Assets/screenshots/02_04_516.png"),
  media("image", "Assets/screenshots/02_04_518.png"),
  media("image", "Assets/screenshots/02_24_626.png"),
  media("image", "Assets/screenshots/05 -170301 %pn.png"),
  media("image", "Assets/screenshots/10_18.53_3909.png"),
  media("image", "Assets/screenshots/14_16.47_3663.png"),
  media("image", "Assets/screenshots/15_17.17_5579.jpg"),
  media("image", "Assets/screenshots/17_15.11_69.png"),
  media("image", "Assets/screenshots/17_15.58_580.gif"),
  media("image", "Assets/screenshots/17_15.59_2704.png"),
  media("image", "Assets/screenshots/22.11.18 16.48.46 Cinema_4D.jpg"),
  media("image", "Assets/screenshots/29_18.33_5608.png"),
  media("image", "Assets/screenshots/31_14.33_4223.jpg"),
  media("video", "Assets/screenshots/001_.mp4"),
  media("video", "Assets/screenshots/05 -152130 %pn.mp4"),
  media("video", "Assets/screenshots/06 -155454 %pn.mp4"),
  media("video", "Assets/screenshots/2020_hs_instaActivation.mp4"), // 100MB — heaviest asset on the page by far
];

const CLIENTS_COLLAB = ["Woodblock", "Siemens", "Nike", "Adidas", "Pigalle", "ACG", "RG/A", "Boss", "LuisaViaRoma", "Vogue", "The Weeknd", "Google", "GNTM"];
const CLIENTS_DIRECT = ["OpenAI", "CRO", "Breuninger", "Zalando", "Anyma", "Afterlife", "Balmain", "Flowers For Society", "Pacemaker", "About You", "Barbie", "Vly"];

const EXHIBITIONS = [
  { event: "CCC", location: "Hamburg, Germany" },
  { event: "Innovation Week", location: "Turkey" },
  { event: "Laval Virtual", location: "Laval, France" },
  { event: "Soho House", location: "Berlin, Germany" },
  { event: "Table Tennis World Championship", location: "Shanghai, China" },
  { event: "Mobile World Congress", location: "Shanghai, China" },
  { event: "TOA", location: "Berlin, Germany" },
  { event: "The Wrong Biennale", location: "—" },
  { event: "Millerntor Gallery", location: "Hamburg, Germany" },
  { event: "Futur Festival", location: "Turin, Italy" },
  { event: "Porto Urbano", location: "Turin, Italy" },
  { event: "KantGaragen, Stilwerk", location: "Berlin, Germany" },
  { event: "48H, Kunsthalle Rostock", location: "Rostock, Germany" },
  { event: "No28, Soho House", location: "Paris, France" },
  { event: "Misa x OMR", location: "Hamburg, Germany" },
  { event: "Artbeam", location: "Munich, Germany" },
  { event: "Subli_me, The Wrong", location: "Brazil" },
  { event: "Cyber Glitch", location: "Bristol, UK" },
  { event: "sadgif, Glasshouse", location: "New York, USA" },
  { event: "sadgif, Floodwall Studio", location: "Virginia, USA" },
  { event: "Computer Generated", location: "Art Anthology Book" },
];
