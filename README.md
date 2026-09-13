# Thomas Mayer — Portfolio

Motion director portfolio site. Plain HTML/CSS/JS, no framework or build step — client-side hash routing (`#/work`, `#/work/:slug`, `#/screens`, `#/about`).

## Running locally

```bash
python3 scripts/dev_server.py 8420
```

Then open `http://localhost:8420`. This is a thin wrapper around `http.server` that disables browser caching, so edits show up on a normal reload.

## Structure

- `index.html` — page shell (nav, footer, script tags)
- `css/styles.css` — all styling
- `js/data.js` — project content (title, client, gallery, captions, etc.)
- `js/app.js` — rendering and routing logic
- `Assets/projects/<project>/` — media per project
- `scripts/gen_gallery.py` — generates a project's `gallery`/`editorialRows` snippet for `data.js` from its asset folder

## Adding or reordering project media

Files inside `Assets/projects/<project>/` follow a naming convention that controls both order and size in the gallery:

```
<number><L|M|S>_<anything>.<ext>
```

- **number** — sort order. Use gapped numbers (010, 020, 030…) so a new file can be inserted later (e.g. `025M_...`) without renaming everything.
- **L / M / S** — Large renders full-width; Medium/Small pair up two-per-row with the next M/S item in order.
- A filename containing `hero` (case-insensitive), or a numbered file with no size letter, becomes the project's hero and is left out of the gallery.
- The `preview/` subfolder is skipped by the generator — it only feeds the hover-scrub preview thumbnails.

After renaming files, regenerate that project's gallery snippet:

```bash
python3 scripts/gen_gallery.py "project-folder-name"
```

Review the output and paste it into the matching project entry in `js/data.js`.

## Video hosting

Some clips are embedded from Vimeo rather than served as local files — see the `vimeo` media type in `js/data.js`. Larger clips are being moved to Mux for adaptive streaming; that media type isn't wired up in `app.js` yet.
