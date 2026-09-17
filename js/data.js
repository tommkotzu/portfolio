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
    location: "Web",
    year: "2025",
    role: "Director",
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "Production", name: "RG/A" },
      { role: "3D Asset Creation", name: "Kurt Drubbel" },
    ],
    links: ["https://rga.com/work/nike-all-conditions-world?previous=/"],
    tags: ["3D Production", "Asset Creation", "Video Production", "WebGL"],
    blurb: "To relaunch Nike ACG for a new generation of trail runners and hikers — timed to the Milan Winter Olympics and the ACG All Conditions Express train takeover to Cortina d'Ampezzo — we created a site that broke all conventions: a digital experience built to get visitors offline. All Conditions World is an immersive site featuring a WebGL globe that surfaces the wildest trails in Europe, hand-sourced by ACG athletes and trail communities, each route linked to a real route on Strava. Reframing outdoor culture away from standard digital performance metrics and toward play, connection and a sense of shared adventure.",
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
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "3D Production", name: "Woodblock" },
    ],
    tags: ["Artist", "Asset Creation", "Lookdev"],
    blurb: "Through our work for Afterlife, I created a highly detailed character: a translucent human shell revealing a hybrid interior of mechanical and organic structures. The design resonated so strongly with Anyma that he adopted it as his alter ego for digital performances. After several rounds of refinement, I handed the avatar over to the team at Woodblock, who took it to the next level for The Sphere in Las Vegas.",
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
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "Production", name: "April Studio" },
      { role: "Studio", name: "Looping Lovers" },
    ],
    tags: ["Art Direction", "3D Production", "Video Production"],
    blurb: "We collaborated with Luisaviaroma and Vogue to create a captivating out-of-home video displayed in the heart of Times Square, New York. The piece combines a series of dynamic, monochromatic animations that evoke the essence of fashion and creation. Through abstract shapes and seamless transitions, the video tells a visual story that resonates with the spirit of haute couture and innovation, capturing the audience's attention in one of the world's most iconic locations.",
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
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "Studio", name: "OBJ.Studio" },
      { role: "Grading", name: "Bjoern Dunne" },
      { role: "Comp", name: "Philipp Ries" },
    ],
    links: ["https://obj.studio/work#adidas-nmd_s1"],
    tags: ["Art Direction", "3D Production", "Lookdev"],
    blurb: "For the launch of the Adidas NMD_S1 we created an art movie in cooperation with OBJ.Studio and Overkill. The film tells the story of two humans longing for a physical connection in an uninhabitable space. To achieve its unique look we used a mix of classic filmmaking with cutting-edge physical LED technology and highly artistic CGI, shot in AMBION's Superoom XR studio.",
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
    credits: [
      { role: "Concept", name: "Thomas Mayer" },
      { role: "Creative Direction", name: "Philipp Ries" },
      { role: "3D Production", name: "Jan Sommer" },
      { role: "Compositing", name: "Henning Herrholz" },
    ],
    tags: ["Artist", "360"],
    blurb: "OpenAI invited Looping Lovers to create an artistic centrepiece for the opening of its new Munich office — a cinematic installation that embodied the dialogue between human and intelligent systems. Presented inside the 360° Streaming Dome of the Deutsches Museum, “The Space Between” transformed movement into a living field of light and sound, exploring creativity as a shared process between body and machine.",
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
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "Production", name: "Artificial Rome" },
      { role: "Architecture", name: "cables.gl" },
    ],
    tags: ["Art Direction", "3D Production", "Augmented Reality"],
    blurb: "The fifth iteration of the Pigalle Duperré court in Paris, this time featuring a more graphical, block-colour design to tie in with the new Nike Pigalle Converse collection. Since the court is narrower than usual and surrounded by walls, players have additional ways to score points — bouncing balls off the wall for extra points. We set out to bring this rulebook to life on the court with web AR technology, implementing an Augmented Reality application that explains the court-specific rules.",
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
    client: "The Weeknd",
    location: "São Paulo",
    year: "2023",
    role: "Director",
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "Producer", name: "Michael Titze" },
    ],
    tags: ["Asset Creation", "3D Production"],
    blurb: "For The Weeknd's exclusive São Paulo show, we delivered a set of media assets, including the stage opening doors and IMAX visuals. Working closely with the team, we ran through multiple iterations to meet the standard a world-class artist demands — under real pressure, tight deadlines, and no room for error.",
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
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "Studio", name: "Looping Lovers" },
    ],
    tags: ["3D Production", "VFX Supervisor", "AI"],
    blurb: "“Beyond Romance” became the core of Zalando's Valentine's campaign, translating the brand's message of inclusive love into a cinematic moving-image format.",
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
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "Studio", name: "Looping Lovers" },
      { role: "Compositing", name: "Henning Herrholz" },
    ],
    tags: ["Artist", "Art Direction", "Lookdev", "AI"],
    blurb: "SuperPop Festival invited us to contribute a visual artist performance to their show. Alongside a lineup of musicians and artists, we delivered a stage show in collaboration with DJ Raiden — built around a falling star, and a moment of freedom and power, as experienced through music. We brought together our full 3D pipeline, motion capture, environment building, and the latest AI methods to make it happen.",
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
    credits: [
      { role: "Artist", name: "Thomas Mayer" },
      { role: "Partner", name: "Philipp Ries" },
    ],
    links: ["https://www.instagram.com/loopinglovers/"],
    tags: ["Motion Design", "3D Explorations", "Artist"],
    blurb: "Loopinglovers began at university as a creative outlet — a way to be part of an emerging digital pop culture and contribute to the kind of imagery I found genuinely mesmerizing. It grew into a core identity project: using humanoid meshes to explore both production tools and artistic identity, always pushing to try something new. That exploration led to collaborations with musicians, solo exhibitions, and, over time, growing interest from brands and talents worldwide.",
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
    title: "Stage Shows",
    client: "Afterlife",
    location: "World",
    year: "2025", // not given — confirm/adjust
    role: "Director",
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "Producer", name: "Michael Titze" },
      { role: "Creative Director", name: "Alessio De Vecchi" },
      { role: "Producer", name: "Roberto Rosolin" },
      { role: "Partner", name: "Philipp Ries" },
      { role: "Studio", name: "Looping Lovers" },
    ],
    tags: ["3D Production", "Art Direction", "Lookdev"],
    blurb: "Afterlife became a long-term collaboration partner. Over the years we contributed visuals to numerous stage shows across locations and songs — always high-end, always on tight timelines, keeping pace with the relentless demand of this visual, music-driven storytelling machine. The work came with a lot of creative freedom, backed by sharp art direction from the team, and took us to the US and London to see the massive screen installations first hand.",
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
    title: "Tour Announcement",
    client: "Afterlife",
    location: "South America",
    year: "2024",
    role: "Director",
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "Narrative, Animation", name: "Philipp Ries" },
    ],
    links: ["https://www.instagram.com/p/C0PC0eCqp-K/?hl=de"],
    tags: ["3D Production", "ComfyUI", "AI"],
    blurb: "For the 2024 South America Tour of Afterlife.OFC, we created a full visual trailer using some of the most advanced generative AI image workflows available at the time. Our pipeline combined ComfyUI with a custom-developed Stable Diffusion img2img workflow, allowing us to merge traditional 3D asset creation with generative AI. Base assets were modeled and animated in Cinema 4D, AI layers were generated and refined through our tailored workflows, and everything was brought together in compositing to achieve the final look.",
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
    title: "Not In London",
    client: "Highsnobiety",
    location: "Berlin",
    year: "2025", // not given — confirm/adjust
    role: "Director",
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "Producer", name: "Manus Browne" },
      { role: "Creative Direction", name: "Laura Fritz" },
    ],
    tags: ["3D Production", "Asset Creation", "Motion Design"],
    blurb: "Not In London is an editorial series for a lifestyle magazine. We visualized a selection of classic stereotypes across the series — a fun, exploratory project that gave us room to try out different ideas and bring our own take to the work.",
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
  {
    slug: "ffs-identity",
    title: "Identity",
    client: "FFS",
    location: "Berlin", // not given — confirm/adjust
    year: "2025", // not given — confirm/adjust
    role: "Director",
    credits: [
      { role: "Direction", name: "Thomas Mayer" },
      { role: "Studio", name: "Looping Lovers" },
    ],
    links: ["https://flowersforsociety.com/"],
    tags: ["Branding", "3D Production", "Art Direction", "AI", "NFT"],
    blurb: "We developed the full core identity for Flowers for Society's exclusive NFT membership club, building a narrative rooted in the essence of their young, bold brand and their long-lasting journey in the sneaker world. Each digital flower became a symbol of growth, individuality, and belonging — generated through a custom AI-driven process, training models on curated datasets and crossbreeding imagery with tools like Artbreeder and RunwayML. Every flower was analyzed and categorized into metadata, forming a collection of 5,000 unique NFTs that act as membership keys to the Flowers for Society world. The visuals extended beyond the digital space, carried into the physical world through apparel prints and brand touchpoints — bridging sneakers, technology and art into one cohesive universe.",
    // gen_gallery.py "FFS - Identity" — 010.mp4 is the only bare-numbered
    // file (no L/M/S letter), so it's the hero by convention
    hero: media("video", ASSET_ROOT + "FFS - Identity/010.mp4"),
    previews: previews(
      "FFS - Identity/preview/020L.jpg",
      "FFS - Identity/preview/040M.jpg",
      "FFS - Identity/preview/064M.jpg"
    ),
    galleryStyle: "editorial",
    gallery: [
      media("image", ASSET_ROOT + "FFS - Identity/020L.jpg"), // 0 (L)
      media("image", ASSET_ROOT + "FFS - Identity/020S.jpg"), // 1 (S)
      media("image", ASSET_ROOT + "FFS - Identity/030M.jpg"), // 2 (M)
      media("image", ASSET_ROOT + "FFS - Identity/040M.jpg"), // 3 (M)
      media("video", ASSET_ROOT + "FFS - Identity/045L.mp4"), // 4 (L)
      media("image", ASSET_ROOT + "FFS - Identity/050L.jpg"), // 5 (L)
      media("video", ASSET_ROOT + "FFS - Identity/060M.mp4"), // 6 (M)
      media("image", ASSET_ROOT + "FFS - Identity/061M.jpg"), // 7 (M)
      media("image", ASSET_ROOT + "FFS - Identity/062L.jpg"), // 8 (L)
      media("image", ASSET_ROOT + "FFS - Identity/063S.jpg"), // 9 (S)
      media("image", ASSET_ROOT + "FFS - Identity/064M.jpg"), // 10 (M)
      media("image", ASSET_ROOT + "FFS - Identity/065L.jpg"), // 11 (L)
      media("image", ASSET_ROOT + "FFS - Identity/070L.jpg"), // 12 (L)
      media("image", ASSET_ROOT + "FFS - Identity/075m.png"), // 13 (M)
      media("image", ASSET_ROOT + "FFS - Identity/080M.jpg"), // 14 (M)
      media("image", ASSET_ROOT + "FFS - Identity/090S.jpg"), // 15 (S)
      media("image", ASSET_ROOT + "FFS - Identity/090m.gif"), // 16 (M)
      media("video", ASSET_ROOT + "FFS - Identity/100S.mp4"), // 17 (S)
    ],
    editorialRows: [
      { cols: [0], align: "left" },
      { cols: [1, 2], sizes: ["S", "M"], offsets: [50, 60], align: "right" },
      { cols: [3], align: "center", size: "M" },
      { cols: [4], align: "left" },
      { cols: [5], align: "right" },
      { cols: [6, 7], sizes: ["M", "M"], offsets: [50, 60], align: "center" },
      { cols: [8], align: "left" },
      { cols: [9, 10], sizes: ["S", "M"], offsets: [70, 0], align: "right" },
      { cols: [11], align: "center" },
      { cols: [12], align: "left" },
      { cols: [13, 14], sizes: ["M", "M"], offsets: [40, 70], align: "right" },
      { cols: [15, 16], sizes: ["S", "M"], offsets: [0, 50], align: "center" },
      { cols: [17], align: "left", size: "S" },
    ],
  },
  {
    slug: "robotics",
    title: "Robotics",
    client: "", // confidential — no client name to show
    location: "Berlin",
    year: "2025", // not given — confirm/adjust
    role: "Director",
    credits: [],
    tags: ["Kidad", "CAD", "Automation"],
    blurb: "Ongoing robotics and automation work — CAD design and hardware build. Case details available on request.",
    hero: null, // no public content yet
    previews: previews(),
    gallery: [],
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
  media("video", "Assets/screenshots/001_.mp4"),
  media("image", "Assets/screenshots/02_04_516.png"),
  media("image", "Assets/screenshots/02_04_518.png"),
  media("image", "Assets/screenshots/02_18.52_5557.jpg"),
  media("image", "Assets/screenshots/02_24_626.png"),
  media("image", "Assets/screenshots/03_13.29_6029.png"),
  media("image", "Assets/screenshots/08_16.05_5572.jpg"),
  media("image", "Assets/screenshots/08_22_1290.jpg"),
  media("image", "Assets/screenshots/08_27_1329.png"),
  media("image", "Assets/screenshots/08_27_1331.png"),
  media("image", "Assets/screenshots/08_27_1332.png"),
  media("image", "Assets/screenshots/10_13_94.jpg"),
  media("image", "Assets/screenshots/10_18.53_3909.png"),
  media("image", "Assets/screenshots/14_16.47_3663.png"),
  media("image", "Assets/screenshots/15_17.40_5598.png"),
  media("image", "Assets/screenshots/17_15.11_69.png"),
  media("image", "Assets/screenshots/17_15.58_580.gif"),
  media("image", "Assets/screenshots/17_15.59_2704.png"),
  media("video", "Assets/screenshots/2020_hs_instaActivation.mp4"),
  media("image", "Assets/screenshots/20_08.18_1517.jpg"),
  media("image", "Assets/screenshots/22.05.14 -13.5857 DAZStudio.png"),
  media("image", "Assets/screenshots/22.07.15 -08.5312 chrome.png"),
  media("image", "Assets/screenshots/22.11.16 15.41.51 Cinema_4D.png"),
  media("image", "Assets/screenshots/22.11.18 16.48.46 Cinema_4D.jpg"),
  media("image", "Assets/screenshots/22.11.24 11.53.03 blender_3.3.png"),
  media("image", "Assets/screenshots/22.12.05 16.08.55 blender_3.3.jpg"),
  media("image", "Assets/screenshots/22.12.05 16.13.03 blender_3.3.jpg"),
  media("image", "Assets/screenshots/24_18.31_5965.jpg"),
  media("image", "Assets/screenshots/27_15.03_4349.png"),
  media("image", "Assets/screenshots/28_14.22_1561.jpg"),
  media("image", "Assets/screenshots/29_18.33_5608.png"),
  media("image", "Assets/screenshots/31_14.33_4223.jpg"),
  media("image", "Assets/screenshots/a_generattive1.jpg"),
  media("image", "Assets/screenshots/a_generattive2.png"),
  media("image", "Assets/screenshots/aquatic01.png"),
  media("image", "Assets/screenshots/aquatic02.png"),
  media("image", "Assets/screenshots/aquatic03.png"),
  media("image", "Assets/screenshots/aquatic04.png"),
  media("image", "Assets/screenshots/aquatic05.png"),
  media("image", "Assets/screenshots/aquatic06.png"),
  media("image", "Assets/screenshots/aquatic07.png"),
  media("image", "Assets/screenshots/aquatic08.png"),
  media("image", "Assets/screenshots/aquatic09.png"),
  media("image", "Assets/screenshots/aquatic10.png"),
  media("image", "Assets/screenshots/aquatic11.png"),
  media("image", "Assets/screenshots/aquatic12.png"),
  media("image", "Assets/screenshots/barbie - bts  1.png"),
  media("image", "Assets/screenshots/barbie - bts  2.jpg"),
  media("image", "Assets/screenshots/barbie - bts  2.png"),
  media("image", "Assets/screenshots/barbie - bts  4.png"),
  media("image", "Assets/screenshots/barbie - bts  5 (1).jpg"),
  media("image", "Assets/screenshots/barbie - bts  5.jpg"),
  media("image", "Assets/screenshots/barbie - comp  1.jpg"),
  media("image", "Assets/screenshots/barbie - comp  11.jpg"),
  media("image", "Assets/screenshots/barbiexbalmain.jpg"),
  media("image", "Assets/screenshots/candy (1).jpg"),
  media("image", "Assets/screenshots/candy (1).png"),
  media("image", "Assets/screenshots/candy (2).jpg"),
  media("image", "Assets/screenshots/candy (3).jpg"),
  media("image", "Assets/screenshots/candy (4).jpg"),
  media("image", "Assets/screenshots/car4.png"),
  media("image", "Assets/screenshots/car5.png"),
  media("image", "Assets/screenshots/cyborg1.png"),
  media("image", "Assets/screenshots/cyborg2.png"),
  media("image", "Assets/screenshots/cyborg3.png"),
  media("image", "Assets/screenshots/cyborg4.jpg"),
  media("image", "Assets/screenshots/cyborg5.png"),
  media("image", "Assets/screenshots/cyborg6.jpg"),
  media("image", "Assets/screenshots/fabbit001.png"),
  media("image", "Assets/screenshots/fabbit002.png"),
  media("image", "Assets/screenshots/fabbit003.png"),
  media("image", "Assets/screenshots/fabbit004.png"),
  media("image", "Assets/screenshots/ffs006.png"),
  media("image", "Assets/screenshots/ffs014.png"),
  media("image", "Assets/screenshots/ffs_shoes001.jpg"),
  media("image", "Assets/screenshots/ffs_shoes002.png"),
  media("image", "Assets/screenshots/ffs_shoes003.png"),
  media("image", "Assets/screenshots/ffs_shoes004.png"),
  media("image", "Assets/screenshots/ffs_shoes005.png"),
  media("image", "Assets/screenshots/ffs_shoes006.png"),
  media("image", "Assets/screenshots/ffs_shoes007.png"),
  media("image", "Assets/screenshots/ffs_shoes008.png"),
  media("image", "Assets/screenshots/ffs_shoes009.png"),
  media("image", "Assets/screenshots/ffs_shoes010.png"),
  media("image", "Assets/screenshots/ffs_shoes011.png"),
  media("video", "Assets/screenshots/ffs_shoes012.mp4"),
  media("image", "Assets/screenshots/ffs_shoes013.png"),
  media("image", "Assets/screenshots/ffs_shoes014.jpg"),
  media("video", "Assets/screenshots/ffs_shoes015.mp4"),
  media("image", "Assets/screenshots/ffs_shoes016.png"),
  media("image", "Assets/screenshots/ffs_shoes017.png"),
  media("image", "Assets/screenshots/ffs_shoes018.png"),
  media("image", "Assets/screenshots/ffs_shoes019.png"),
  media("image", "Assets/screenshots/ffs_shoes020.png"),
  media("image", "Assets/screenshots/ffs_shoes021.png"),
  media("image", "Assets/screenshots/ffs_shoes022.png"),
  media("image", "Assets/screenshots/ffs_shoes023.png"),
  media("image", "Assets/screenshots/generative3.jpg"),
  media("image", "Assets/screenshots/generative4.png"),
  media("image", "Assets/screenshots/generative5.jpg"),
];

const CLIENTS_COLLAB = ["Woodblock", "Siemens", "Nike", "Adidas", "Pigalle", "ACG", "RG/A", "LuisaViaRoma", "Vogue", "The Weeknd", "Google", "GNTM", "Psyop", "YouTube", "Artificial Rome", "B-Reel"];
const CLIENTS_DIRECT = ["OpenAI", "CRO", "Breuninger", "Zalando", "Anyma", "Afterlife", "Balmain", "Flowers For Society", "Pacemaker", "About You", "Barbie", "Vly"];

const EXHIBITIONS = [
  { event: "CCC", location: "Hamburg, Germany" },
  { event: "Innovation Week", location: "Istanbul, Turkey" },
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
  { event: "Artbeam", location: "São Paulo, Brazil" },
  { event: "Subli_me, The Wrong", location: "Brazil" },
  { event: "Cyber Glitch", location: "Bristol, UK" },
  { event: "sadgif, Glasshouse", location: "New York, USA" },
  { event: "sadgif, Floodwall Studio", location: "Virginia, USA" },
  { event: "Computer Generated", location: "Art Anthology Book, Print" },
  { event: "Forward Festival", location: "Berlin and Hamburg, Germany" },
  { event: "Superpop", location: "Seoul, Korea" },
];
