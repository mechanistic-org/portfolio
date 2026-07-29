#!/usr/bin/env python3
"""
project_pipeline.py — canon <-> site round-trip generator (C24 spike).

  Obsidian/canon vault  ->  generator  ->  site (read-only render target)

Prose-first record: the heavy structured data the Astro components consume lives
in the canon record as RELATABLE markdown (dossier tables + a ## Galleries
section), and the generator partitions it back into the lean index.mdx + the
dormant data.json / _entropy.json sidecar hooks.

Modes (all run by default): extract -> generate -> verify (lossless) -> idempotency.
Non-destructive: never writes the live src/content/projects/<slug>/index.mdx.
"""
import os, sys, json
import yaml

SLUG = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else "c24"
WRITE_LIVE = "--write-live" in sys.argv  # generate-only, targets the live site dir
CANON_DIR  = r"H:\workspace\canon\entities\projects\%s" % SLUG
CANON_REC  = os.path.join(CANON_DIR, "%s.md" % SLUG)
SITE_DIR   = r"D:\GitHub\portfolio\src\content\projects\%s" % SLUG
SITE_MDX   = os.path.join(SITE_DIR, "index.mdx")
SITE_ENTROPY = os.path.join(SITE_DIR, "_entropy.json")
OUT_DIR    = r"D:\GitHub\portfolio\scripts\_roundtrip_out\%s" % SLUG

# --- Field ownership ---
# Dossier fields -> prose-first markdown tables (the DossierCast/Scars/Bom/Timeline consumers).
DOSSIER = [  # (frontmatter field, ## heading, ordered columns)
    # Contract v2 (2026-07-02, WP4): `scars` removed from the dossier tables — the V8
    # scar-instrument fields (severity/phase/anchor/T-I-R/evidence) don't survive a
    # 3-column table round-trip. Scars ride frontmatter, canon and site alike.
    # `linkedin` and `consent` added 2026-07-29: both were absent from the column
    # list, so a curated profile URL did not survive a canon->site->canon trip.
    # `consent` is the publish gate for linking a named colleague (see the cast
    # schema in src/content.config.ts) and MUST round-trip losslessly.
    ("cast",     "Cast",     ["name", "role", "org", "roster", "linkedin", "consent"]),
    ("bom",      "BOM",      ["label", "value"]),
    ("timeline", "Timeline", ["date", "title", "description"]),
]
# cyberspace -> the ## Galleries section.
GALLERY_HEADING = "Galleries"
# Heavy structured content that still rides the data.json sidecar (HUD metrics etc.).
# NOTE: `## Metrics` (canon KPI table -> generator-assembled nested `metrics` for the HUD)
# is designed but unbuilt — C24 uses forensic_metrics strings, not the nested object.
DATA_JSON_FIELDS = ["metrics", "complexity_vector"]
ENTROPY_FIELDS   = ["timeline_events", "events"]
# Contract v2 (2026-07-01, #109 K7): `tier` moved out of CANON_ONLY — it is now a
# site frontmatter field (deep_dive|lite) the generator emits from compute_tier.
# 2026-07-03 amendment: enum value renamed flagship -> deep_dive ("flagship" now
# means only the featured subset concept, never a tier); legacy spelling still read.
CANON_ONLY = ["created", "updated", "type", "sensitivity", "confidence", "sources", "entropy"]
# Contract v2 kill list (canon/queries/k2-stranded-data-decision-sheet.md).
# `isomorphics` REMOVED from DROP_FIELDS — operator lean-in ruling 2026-07-01:
# it round-trips canon -> site like scars.
DROP_FIELDS = [
    "stats", "phase_stats", "forensic_data", "hydration_status", "hxo_ready",
    "skillData", "gallery", "documents", "links", "additionalSkills",
    "skillGraph", "partGraph", "statusLabel", "transcript",
    "notebook_url", "nlm_url", "asset_bucket",
]

# Markdown section names the generator appends to the record body (in this order).
APPENDED = [GALLERY_HEADING] + [h for _, h, _ in DOSSIER]


# ---------------------------------------------------------------- frontmatter
def split_frontmatter(text):
    if not text.startswith("---\n"):
        raise ValueError("no frontmatter")
    end = text.index("\n---\n", 4)
    return yaml.safe_load(text[4:end]), text[end + 5:]


def dump_yaml(d):
    return yaml.safe_dump(d, sort_keys=False, allow_unicode=True, width=4096, default_flow_style=False)


def read_mdx(path):
    with open(path, encoding="utf-8") as f:
        return split_frontmatter(f.read())


# ---------------------------------------------------------------- dossier tables
def render_table(rows, cols):
    out = ["| " + " | ".join(c.title() for c in cols) + " |",
           "| " + " | ".join("---" for _ in cols) + " |"]
    for r in rows:
        out.append("| " + " | ".join((str(r.get(c, "")) or "").replace("|", "\\|") for c in cols) + " |")
    return "\n".join(out)


def parse_table(md, cols):
    rows, started = [], False
    header = [c.title() for c in cols]
    for line in md.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip().replace("\\|", "|") for c in line.strip().strip("|").split("|")]
        if cells[:len(cols)] == header:
            started = True; continue
        if set("".join(cells)) <= set("-: "):
            continue
        if started:
            rows.append({c: cells[i] for i, c in enumerate(cols)})
    return rows


# ---------------------------------------------------------------- galleries
def render_galleries(cyber):
    out = ["## %s" % GALLERY_HEADING, ""]
    meta = {k: v for k, v in cyber.items() if k != "stickies"}
    out.append("<!-- cyberspace %s -->" % json.dumps(meta, sort_keys=True))
    for st in cyber.get("stickies", []):
        out.append(""); out.append("### %s" % st.get("title", ""))
        imgs = None
        params = dict(st)
        params.pop("deck", None)
        params.pop("title", None)   # authoritative in the ### heading, not the comment
        # Empty images lists stay in the sticky JSON (an absent **Images:** block
        # can't distinguish `images: []` from no key, so parse can't restore it).
        if isinstance(params.get("data"), dict) and params["data"].get("images"):
            imgs = params["data"]["images"]
            params["data"] = {k: v for k, v in params["data"].items() if k != "images"}
        out.append("<!-- sticky %s -->" % json.dumps(params, sort_keys=True))
        if imgs:
            out.append(""); out.append("**Images:**")
            for im in imgs:
                ar = im.get("aspectRatio", "")
                out.append("- %s :: %s :: %s" % (im.get("alt", ""), im.get("src", ""), ar))
        for card in st.get("deck", []):
            out.append(""); out.append("#### %s" % card.get("title", ""))
            if card.get("subtitle", ""):
                out.append("<!-- subtitle %s -->" % json.dumps(card["subtitle"]))
            out.append(card.get("body", ""))
    return "\n".join(out) + "\n"


def parse_galleries(md):
    lines = md.splitlines()
    cyber, stickies, cur = {}, [], None
    i = 0
    while i < len(lines):
        ln = lines[i]
        if ln.startswith("<!-- cyberspace "):
            cyber = json.loads(ln[len("<!-- cyberspace "):-len(" -->")])
        elif ln.startswith("### "):
            cur = {"_imgs": [], "deck": [], "_title": ln[4:]}
            stickies.append(cur)
        elif ln.startswith("<!-- sticky ") and cur is not None:
            cur["_params"] = json.loads(ln[len("<!-- sticky "):-len(" -->")])
        elif ln.startswith("- ") and " :: " in ln and cur is not None:
            parts = ln[2:].split(" :: ")
            im = {"alt": parts[0], "src": parts[1]}
            if len(parts) > 2 and parts[2] != "":
                im["aspectRatio"] = float(parts[2]) if "." in parts[2] else int(parts[2])
            cur["_imgs"].append(im)
        elif ln.startswith("#### ") and cur is not None:
            title = ln[5:]
            sub = ""
            j = i + 1
            if j < len(lines) and lines[j].startswith("<!-- subtitle "):
                sub = json.loads(lines[j][len("<!-- subtitle "):-len(" -->")]); j += 1
            body_lines = []
            while j < len(lines) and not lines[j].startswith(("#### ", "### ", "## ")):
                body_lines.append(lines[j]); j += 1
            body = "\n".join(body_lines).strip("\n")
            cur["deck"].append({"body": body, "subtitle": sub, "title": title})
            i = j - 1
        i += 1
    out = []
    for st in stickies:
        params = st.get("_params", {})
        sticky = dict(params)
        sticky["title"] = st["_title"]   # ### heading is authoritative
        if st["_imgs"]:
            sticky["data"] = {**params.get("data", {}), "images": st["_imgs"]}
        sticky["deck"] = st["deck"]
        out.append(sticky)
    cyber["stickies"] = out
    return cyber


# ---------------------------------------------------------------- body sectioning
def first_appended_index(body):
    idxs = [body.find("\n## %s\n" % name) for name in APPENDED]
    idxs = [x for x in idxs if x != -1]
    return min(idxs) if idxs else -1


def appended_sections(body):
    """Return {name: section_text} for each appended ## section present."""
    out, start = {}, first_appended_index(body)
    if start == -1:
        return out
    region = body[start:]
    # find all (pos, name)
    marks = sorted((region.find("\n## %s\n" % n), n) for n in APPENDED if region.find("\n## %s\n" % n) != -1)
    for k, (pos, name) in enumerate(marks):
        nxt = marks[k + 1][0] if k + 1 < len(marks) else len(region)
        out[name] = region[pos:nxt]
    return out


# ---------------------------------------------------------------- tiering
def compute_tier(data):
    """Collapse the (up to 5) tier signals into one deep_dive|lite classification.
    In practice only presentation_mode is populated across the corpus, but tier
    (string enum, incl. its legacy "flagship" spelling, or legacy numeric 1),
    hxo_ready and hydration_status are honored if a record carries them."""
    pm = (data.get("presentation_mode") or "").lower()
    deep = (
        pm in ("deep_dive", "flagship")
        or str(data.get("tier") or "").lower() in ("deep_dive", "flagship")
        or data.get("tier") == 1
        or data.get("hxo_ready") is True
        or (data.get("hydration_status") or "").lower() == "full"
    )
    return "deep_dive" if deep else "lite"


# ---------------------------------------------------------------- extract
def extract():
    data, body = read_mdx(SITE_MDX)
    rec = {"title": data.get("title"), "slug": data.get("slug", SLUG),
           "created": "2026-06-13", "updated": "2026-06-13", "type": "entity",
           "tier": compute_tier(data),
           "sensitivity": "public", "confidence": "high", "sources": []}
    dossier_fields = {f for f, _, _ in DOSSIER}
    for k, v in data.items():
        if k in DROP_FIELDS or k in dossier_fields or k == "cyberspace":
            continue
        rec.setdefault(k, v)
    if os.path.exists(SITE_ENTROPY):
        with open(SITE_ENTROPY, encoding="utf-8") as f:
            rec["entropy"] = json.load(f)
    # build record body: prose + ## Galleries + dossier tables
    record_body = body.rstrip("\n")
    if isinstance(data.get("cyberspace"), dict):
        record_body += "\n\n" + render_galleries(data["cyberspace"])
    for field, heading, cols in DOSSIER:
        if data.get(field):
            record_body += "\n\n## %s\n\n%s\n" % (heading, render_table(data[field], cols))
    os.makedirs(CANON_DIR, exist_ok=True)
    with open(CANON_REC, "w", encoding="utf-8") as f:
        f.write("---\n"); f.write(dump_yaml(rec)); f.write("---\n")
        f.write(record_body if record_body.endswith("\n") else record_body + "\n")
    present = [h for f, h, _ in DOSSIER if data.get(f)] + (["Galleries"] if data.get("cyberspace") else [])
    print(f"[extract]  canon record -> {CANON_REC}  ({len(rec)} fm keys; prose sections: {present})")
    return rec, record_body


# ---------------------------------------------------------------- generate
def generate():
    rec, record_body = read_mdx(CANON_REC)
    cut = first_appended_index(record_body)
    site_body = record_body if cut == -1 else record_body[:cut]
    sections = appended_sections(record_body)

    site_fm = {k: v for k, v in rec.items()
               if k not in CANON_ONLY and k not in DATA_JSON_FIELDS and k not in ("timeline",)}
    # Contract v2 (2026-07-02, WP4): dossier arrays + cyberspace ride site FRONTMATTER —
    # they are contract fields the components read directly, and the data.json sidecar
    # glob is disabled pending a sidecar validator. data.json carries only
    # DATA_JSON_FIELDS (nested metrics / complexity_vector) when a record has them.
    data_json = {k: rec[k] for k in DATA_JSON_FIELDS if k in rec}
    for field, heading, cols in DOSSIER:
        if heading in sections and field != "timeline":  # timeline is canon-only (removed from contract)
            site_fm[field] = parse_table(sections[heading], cols)
    if GALLERY_HEADING in sections:
        site_fm["cyberspace"] = parse_galleries(sections[GALLERY_HEADING])
    # entropy
    entropy = rec.get("entropy")

    out_dir = SITE_DIR if WRITE_LIVE else OUT_DIR
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "index.mdx"), "w", encoding="utf-8") as f:
        f.write("---\n"); f.write(dump_yaml(site_fm)); f.write("---\n")
        # Final-newline-terminated so Prettier/format hooks don't dirty generated pages.
        f.write(site_body if site_body.endswith("\n") else site_body + "\n")
    if data_json:
        with open(os.path.join(out_dir, "data.json"), "w", encoding="utf-8") as f:
            json.dump(data_json, f, indent=2, ensure_ascii=False, sort_keys=True, default=str)
    if entropy is not None:
        with open(os.path.join(out_dir, "_entropy.json"), "w", encoding="utf-8") as f:
            json.dump(entropy, f, indent=2, ensure_ascii=False, sort_keys=True, default=str)
    extra = f" + data.json (keys: {sorted(data_json)})" if data_json else ""
    print(f"[generate] -> {out_dir}\\index.mdx ({len(site_fm)} fm keys){extra}")
    return site_fm, data_json, site_body


# ---------------------------------------------------------------- verify
def _norm(o):
    return json.loads(json.dumps(o, default=str, sort_keys=True))


def verify():
    orig_fm, orig_body = read_mdx(SITE_MDX)
    gen_fm, gen_body = read_mdx(os.path.join(OUT_DIR, "index.mdx"))
    data_path = os.path.join(OUT_DIR, "data.json")
    data_json = json.load(open(data_path, encoding="utf-8")) if os.path.exists(data_path) else {}
    reconstructed = {**gen_fm, **data_json}
    missing, changed = [], []
    for k, v in orig_fm.items():
        if k in DROP_FIELDS:
            continue
        if k not in reconstructed:
            missing.append(k)
        elif _norm(reconstructed[k]) != _norm(v):
            changed.append(k)
    # Trailing-newline tolerant: format hooks (Prettier) add a final newline to
    # committed pages; that is formatting, not content loss (minimerc false FAIL).
    body_ok = (gen_body.rstrip("\n") == orig_body.rstrip("\n"))
    print("\n=== VERIFY (lossless round-trip) ===")
    print(f"  original fm keys {len(orig_fm)} -> lean {len(gen_fm)} + data.json {sorted(data_json)}")
    print(f"  MISSING after merge : {missing or 'none'}")
    print(f"  CHANGED after merge : {changed or 'none'}")
    print(f"  body identical      : {body_ok}")
    ok = not missing and not changed and body_ok
    print(f"  RESULT              : {'PASS (lossless)' if ok else 'FAIL'}")
    return ok


def idempotency():
    import hashlib
    def snap():
        generate()
        return {f: hashlib.sha256(open(os.path.join(OUT_DIR, f), "rb").read()).hexdigest()[:12]
                for f in os.listdir(OUT_DIR)}
    a, b = snap(), snap()
    print("\n=== IDEMPOTENCY (generate x2) ===")
    for f in sorted(a):
        print(f"  {f:16} {a[f]} {'OK' if a[f]==b.get(f) else 'DRIFT'}")
    return a == b


if __name__ == "__main__":
    if WRITE_LIVE:
        # Live write: canon record is authoritative — NO extract (extract overwrites the
        # curated canon record from the site; that direction only runs in validation mode).
        generate()
        print("\n=== WRITE-LIVE ===  canon record -> live site MDX (validation mode proves losslessness)")
        sys.exit(0)
    extract(); generate()
    v = verify(); i = idempotency()
    print(f"\n=== SUMMARY ===  lossless={v}  idempotent={i}")
    sys.exit(0 if (v and i) else 1)
