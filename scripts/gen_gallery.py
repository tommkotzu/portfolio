#!/usr/bin/env python3
"""
Reads a project's asset folder (recursively, any depth) using the naming
convention:

    <number><L|M|S>_<anything>.<ext>

- number: sort order (use gaps like 010, 020, 030... so you can insert
  025 between 010 and 020 later without renaming everything)
- L/M/S: Large = full-width single row. Medium/Small = paired into a
  two-up row with whichever M/S item comes next in number order.
- a filename containing "hero" (case-insensitive) is pulled out as the
  project's hero and left out of the gallery. A file with a number but NO
  L/M/S letter (e.g. "010.mp4") is also treated as a hero candidate —
  useful for the one lead item before you've decided/tagged the rest.
- files can live directly in the project folder or in any subfolder
  (e.g. "behind the scenes/120M.png") — sort order is global across all
  of them, by number, regardless of which subfolder they're in.
- the "preview/" subfolder is always skipped — that still feeds the
  hover-scrub previews array separately, same as before.

Usage:
    python3 scripts/gen_gallery.py "adidas"

Prints a JS snippet (hero / gallery / editorialRows) to paste into the
matching project entry in js/data.js. Doesn't touch data.js itself —
review before pasting, since the script can't know captions or blurb text.
"""
import os
import re
import sys

ASSET_ROOT = "Assets/projects/"
VIDEO_EXT = {".mp4", ".webm", ".mov"}
SIZED_RE = re.compile(r"^(\d+)\s*([LMS])_?(.*)$", re.IGNORECASE)
BARE_RE = re.compile(r"^(\d+)_?(.*)$")
ALIGNS = ["left", "right", "center"]
OFFSETS = [0, 50, 60, 40, 70]


def js_escape(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def parse_folder(folder):
    items = []
    for root, dirs, files in os.walk(folder):
        dirs[:] = [d for d in dirs if d.lower() != "preview"]
        for f in sorted(files):
            full = os.path.join(root, f)
            rel = os.path.relpath(full, folder)
            m = SIZED_RE.match(f)
            bare_hero = False
            if m:
                num = int(m.group(1))
                size = m.group(2).upper()
            else:
                m2 = BARE_RE.match(f)
                if not m2:
                    print(f"  (skipping, no number prefix: {rel})", file=sys.stderr)
                    continue
                num = int(m2.group(1))
                size = None
                bare_hero = True
            ext = os.path.splitext(f)[1].lower()
            kind = "video" if ext in VIDEO_EXT else "image"
            items.append({
                "file": rel.replace(os.sep, "/"), "num": num, "size": size, "kind": kind,
                "is_hero": bare_hero or "hero" in f.lower(),
            })
    items.sort(key=lambda x: x["num"])
    return items


def build_rows(gallery):
    rows = []
    i = 0
    align_i = 0

    def next_align():
        nonlocal align_i
        a = ALIGNS[align_i % len(ALIGNS)]
        align_i += 1
        return a

    while i < len(gallery):
        it = gallery[i]
        if it["size"] == "L":
            rows.append({"cols": [i], "align": next_align()})
            i += 1
        else:
            if i + 1 < len(gallery) and gallery[i + 1]["size"] in ("M", "S"):
                rows.append({
                    "cols": [i, i + 1],
                    "sizes": [it["size"], gallery[i + 1]["size"]],
                    "offsets": [OFFSETS[i % len(OFFSETS)], OFFSETS[(i + 1) % len(OFFSETS)]],
                    "align": next_align(),
                })
                i += 2
            else:
                # unpaired M/S (no M/S neighbor to pair with) — still render it
                # at its own size rather than snapping to full width
                rows.append({"cols": [i], "align": next_align(), "size": it["size"]})
                i += 1
    return rows


def main():
    if len(sys.argv) != 2:
        print("usage: gen_gallery.py <project-folder-name>", file=sys.stderr)
        sys.exit(1)
    project_dir_name = sys.argv[1]
    base = os.path.join(os.path.dirname(__file__), "..", "Assets", "projects", project_dir_name)
    base = os.path.normpath(base)
    if not os.path.isdir(base):
        print(f"no such folder: {base}", file=sys.stderr)
        sys.exit(1)

    items = parse_folder(base)
    heroes = [it for it in items if it["is_hero"]]
    gallery = [it for it in items if not it["is_hero"]]

    hero = heroes[0] if heroes else None
    rows = build_rows(gallery)

    print(f"// ---- generated from Assets/projects/{project_dir_name}/ ----")
    if hero:
        path = js_escape(f"{project_dir_name}/{hero['file']}")
        print(f'hero: media("{hero["kind"]}", ASSET_ROOT + "{path}"),')
    else:
        print("hero: null, // no file with \"hero\" in its name")

    print("gallery: [")
    for idx, it in enumerate(gallery):
        path = js_escape(f"{project_dir_name}/{it['file']}")
        print(f'  media("{it["kind"]}", ASSET_ROOT + "{path}"), // {idx} ({it["size"]})')
    print("],")

    print("editorialRows: [")
    for row in rows:
        if len(row["cols"]) == 1:
            size_attr = f', size: "{row["size"]}"' if "size" in row else ""
            print(f'  {{ cols: [{row["cols"][0]}], align: "{row["align"]}"{size_attr} }},')
        else:
            c0, c1 = row["cols"]
            o0, o1 = row["offsets"]
            s0, s1 = row["sizes"]
            print(f'  {{ cols: [{c0}, {c1}], sizes: ["{s0}", "{s1}"], offsets: [{o0}, {o1}], align: "{row["align"]}" }},')
    print("],")

    if len(heroes) > 1:
        print(f"// NOTE: {len(heroes)} files matched \"hero\" — used the first, ignored the rest:", file=sys.stderr)
        for h in heroes[1:]:
            print(f"//   {h['file']}", file=sys.stderr)


if __name__ == "__main__":
    main()
