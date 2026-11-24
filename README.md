# Thomas Mayer

3D generalist, motion designer & artist in Berlin. Publishing my portfolio site here.

🔗 [tommkotzu.github.io/portfolio](https://tommkotzu.github.io/portfolio/)

## SEO

Every page has a real URL (`work/<slug>/`, `about/`, …) with its own title,
description, Open Graph tags and JSON-LD. Wording lives in `js/seo.js`.
After changing `js/data.js` or `js/seo.js`, regenerate the static pages +
sitemap:

    node scripts/gen_seo.mjs
