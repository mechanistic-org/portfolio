#!/usr/bin/env python3
"""
project_pipeline.py — canon <-> site round-trip generator (C24 spike).

  Obsidian/canon vault  ->  generator  ->  site (read-only render target)

Prose-first record: the heavy structured data the Astro components consume lives
in the canon record as RELATABLE markdown (dossier tables + a ## Galleries
section), and the generator partitions it back into the lean index.mdx + the
dormant data.json / _entropy.json sidecar hooks.

Modes:
  (default)      generate -> verify (lossless) -> idempotency.   READ-ONLY.
  --extract      site MDX -> canon record FIRST. Bootstrap only. Writes canon.
  --write-live   canon record -> the live site MDX. Writes the site.

Directions and what each one may write:

  canon record  --generate-->  scratch (default) or live site (--write-live)
  site MDX      --extract-->   canon record                    (--extract only)

`extract` used to run on the bare invocation, because this began as the C24
spike when no canon records existed and the only way to get one was to derive
it from the site. That default became destructive the moment records started
being hand-curated: `generate` deliberately drops CANON_ONLY fields on the way
to the site (correct - provenance is canon's, not the page's), so `extract`
then read a file that structurally cannot contain them and wrote the empty
literals back over canon. Both halves individually correct; composed, they
deleted provenance. Measured damage before the 2026-07-29 fix: 32 records with
`sources: []`, 28 sharing one fabricated `created` date, and all 30 forced to
`sensitivity: public` - the publish gate, defaulted open by a script.

The old docstring claimed "non-destructive" because it never wrote the live
index.mdx. It was defending the render target and overwriting the source of
truth. The protection pointed backwards.
"""
import hashlib, os, sys, json
from datetime import date
import yaml

SLUG = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else "c24"
WRITE_LIVE = "--write-live" in sys.argv  # generate-only, targets the live site dir
DO_EXTRACT = "--extract" in sys.argv     # opt-in: the ONLY mode that writes canon

# Repo paths derive from this file, not a hardcoded absolute. The old constants
# pointed at D:\GitHub\portfolio, so a run from a git worktree silently read and
# wrote the MAIN checkout instead of the tree the operator was working in.
REPO_ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANON_ROOT = os.environ.get("CANON_ROOT", r"D:\GitHub\portfolio-canon")
EVIDENCE_ROOT = os.environ.get("EVIDENCE_ROOT", r"D:\GitHub\portfolio-evidence")
EVIDENCE_REGISTRY = os.environ.get(
    "EVIDENCE_REGISTRY", os.path.join(EVIDENCE_ROOT, "registry", "evidence.jsonl")
)
CANON_DIR  = os.path.join(CANON_ROOT, "entities", "projects", SLUG)
CANON_REC  = os.path.join(CANON_DIR, "%s.md" % SLUG)
SITE_DIR   = os.path.join(REPO_ROOT, "src", "content", "projects", SLUG)
SITE_MDX   = os.path.join(SITE_DIR, "index.mdx")
SITE_ENTROPY = os.path.join(SITE_DIR, "_entropy.json")
OUT_DIR    = os.path.join(REPO_ROOT, "scripts", "_roundtrip_out", SLUG)

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
CANON_ONLY = ["created", "updated", "type", "sensitivity", "confidence", "sources", "entropy", "vault"]

# Provenance (portfolio#142). TWO fields, deliberately not one:
#
#   vault:   the record's collection under the local evidence root.
#            One declared string. Machine-checkable, cheap for every record, and
#            what the tier gate verifies.
#   sources: CURATED citations — the specific documents a page's claims rest on.
#            Hand-picked, never derived, never overwritten by the generator.
#
# An earlier pass tried to DERIVE sources from the vault. Measured result on c24:
# 564 entries where 16 curated ones existed, because the vault is the full
# extraction (554 files). A directory listing is INVENTORY, not provenance — it
# proves material exists, not that a claim rests on it. The curated 16 were the
# whole value, and deriving destroyed them. So: vault answers "does this page
# trace to a real locker?" and sources answers "which documents back this
# claim?" Conflating them loses the second question.
LOCKER_ROOT = os.path.join(EVIDENCE_ROOT, "raw", "_archive_extracts")


def vault_status(vault):
    """(exists, item_count) for a declared vault. (None, 0) when undeclared."""
    if not vault:
        return None, 0
    d = os.path.join(LOCKER_ROOT, vault)
    if not os.path.isdir(d):
        return False, 0
    n = sum(1 for x in os.listdir(d) if os.path.isfile(os.path.join(d, x)))
    nlm = os.path.join(LOCKER_ROOT, "_notebooklm", vault)
    if os.path.isdir(nlm):
        n += sum(1 for x in os.listdir(nlm) if os.path.isfile(os.path.join(nlm, x)))
    return True, n


def validate_sources(sources):
    """Resolve curated evidence IDs locally without exposing paths to canon Git."""
    if not isinstance(sources, list):
        raise ValueError("canon `sources` must be a list")
    registry = {}
    with open(EVIDENCE_REGISTRY, encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, 1):
            if not line.strip():
                continue
            row = json.loads(line)
            if set(row) != {"id", "path", "sha256"}:
                raise ValueError(f"evidence registry line {line_number} has invalid keys")
            if row["id"] in registry:
                raise ValueError(f"duplicate evidence id: {row['id']}")
            registry[row["id"]] = row
    root = os.path.realpath(EVIDENCE_ROOT)
    for source in sources:
        if not isinstance(source, str) or not source.startswith("evidence:"):
            raise ValueError(f"canon source is not an opaque evidence id: {source!r}")
        evidence_id = source.removeprefix("evidence:")
        row = registry.get(evidence_id)
        if row is None:
            raise ValueError(f"canon source is absent from local registry: {evidence_id}")
        path = os.path.realpath(os.path.join(root, *row["path"].split("/")))
        if os.path.commonpath([root, path]) != root or not os.path.isfile(path):
            raise ValueError(f"evidence id does not resolve inside the evidence root: {evidence_id}")
        with open(path, "rb") as handle:
            actual = hashlib.sha256(handle.read()).hexdigest()
        if actual != row["sha256"]:
            raise ValueError(f"evidence hash mismatch: {evidence_id}")
    print(f"[evidence] resolved {len(sources)} curated source id(s)")
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
    """Parse a dossier table using the columns the table ACTUALLY declares.

    Previously this required an exact prefix match against the full column
    contract, so adding a column to DOSSIER silently broke every record written
    before it: the header no longer matched, `started` stayed False, and the
    field parsed as an empty list. Reading the table's own header instead makes
    a column addition additive — old records keep round-tripping, and the new
    column simply arrives empty until something writes it.

    Empty cells are omitted rather than emitted as "", so an absent optional
    field falls through to its schema default instead of failing enum
    validation on an empty string.
    """
    known = {c.title(): c for c in cols}
    rows, actual = [], None
    for line in md.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip().replace("\\|", "|") for c in line.strip().strip("|").split("|")]
        if actual is None:
            # A header row is one whose every cell names a column we know about.
            # No data row can satisfy that, so it is a safe discriminator.
            if cells and all(c in known for c in cells):
                actual = [known[c] for c in cells]
            continue
        if set("".join(cells)) <= set("-: "):
            continue
        rows.append({c: cells[i] for i, c in enumerate(actual)
                     if i < len(cells) and cells[i] != ""})
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

    # MERGE, don't clobber. Everything in CANON_ONLY is owned by the canon record
    # and is deliberately absent from the site MDX (generate() drops it). Reading
    # its absence as truth is what destroyed provenance on 32 records. When a
    # record already exists, its values win; the literals below only ever seed a
    # brand-new record.
    prior = {}
    if os.path.exists(CANON_REC):
        prior, _ = read_mdx(CANON_REC)

    rec = {"title": data.get("title"), "slug": data.get("slug", SLUG)}

    # `created` is never invented. Preserve it, or leave it out and say so.
    if prior.get("created"):
        rec["created"] = prior["created"]
    else:
        print(f"[extract]  WARNING: no prior `created` for {SLUG} — omitted, set it by hand")
    rec["updated"] = date.today().isoformat()
    rec["type"] = prior.get("type", "entity")
    rec["tier"] = compute_tier(data)
    # `sensitivity` and `confidence` are NO LONGER entity-record fields
    # (portfolio#143, ruled 2026-07-29). Neither was ever wired: both are
    # CANON_ONLY so generate() strips them, and no site code reads either. The
    # clearance question is answered one level down, per artifact, by
    # tools/census_crawl.py — which is the altitude the doctrine specifies. Page
    # visibility is the site MDX `draft:` flag, which is real and in the build.
    #
    # They are not re-seeded here, and they are not carried forward from a prior
    # record: the field is retired, so preserving it would keep the ambiguity
    # alive. Extract used to hardcode `sensitivity: "public"` on every run, which
    # marked all 30 records publishable without anyone deciding.
    # Provenance (portfolio#142). Both fields are canon-owned and PRESERVED, never
    # regenerated: `sources` is a curated citation list and deriving it from the
    # vault produced a 564-entry directory listing that destroyed 16 real citations.
    if prior.get("vault"):
        rec["vault"] = prior["vault"]
    rec["sources"] = prior.get("sources", [])

    exists, count = vault_status(rec.get("vault"))
    if exists is None:
        print(f"[extract]  WARNING: {SLUG} declares no `vault`. Add "
              f"`vault: <dir>` (a collection in the local evidence store) so the page's "
              f"provenance is machine-checkable.")
    elif exists is False:
        print(f"[extract]  WARNING: declared vault not found in the evidence store: {rec['vault']}")
    else:
        print(f"[extract]  vault: {rec['vault']} ({count} locker items) · "
              f"sources: {len(rec['sources'])} curated citation(s)")

    dossier_fields = {f for f, _, _ in DOSSIER}
    for k, v in data.items():
        if k in DROP_FIELDS or k in dossier_fields or k == "cyberspace":
            continue
        rec.setdefault(k, v)
    if os.path.exists(SITE_ENTROPY):
        with open(SITE_ENTROPY, encoding="utf-8") as f:
            rec["entropy"] = json.load(f)
    elif prior.get("entropy") is not None:
        # entropy is CANON_ONLY too: no sidecar on the site is not evidence of
        # absence in canon.
        rec["entropy"] = prior["entropy"]
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
    validate_sources(rec.get("sources", []))
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
def _drop_empty(o):
    """Recursively drop empty lists/dicts so `images: []` compares equal to absent.

    The site MDX is inconsistent about this: pages written by different
    generations of tooling variously carry `data: {columns, layout}` and
    `data: {columns, layout, images: []}`. Both mean "gallery with no images",
    and no generator shape can match both — emitting the empty list fixes three
    slugs and breaks fourteen; omitting it does the reverse.

    So the fix belongs in the COMPARISON, not the data. This normalizes shape
    only. A field going populated -> empty still reports CHANGED, because the
    other side still has content; only absent-vs-empty is treated as equal.
    """
    if isinstance(o, dict):
        return {k: _drop_empty(v) for k, v in o.items() if v not in ([], {}, None)}
    if isinstance(o, list):
        return [_drop_empty(v) for v in o]
    return o


def _norm(o):
    return _drop_empty(json.loads(json.dumps(o, default=str, sort_keys=True)))


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
    if WRITE_LIVE and DO_EXTRACT:
        sys.exit("[pipeline] --write-live and --extract are opposite directions; pick one")

    if WRITE_LIVE:
        # Live write: canon record is authoritative — never extract here.
        generate()
        print("\n=== WRITE-LIVE ===  canon record -> live site MDX (validation mode proves losslessness)")
        sys.exit(0)

    if DO_EXTRACT:
        # The ONLY canon-writing path, and it must be asked for by name.
        # Bootstrap a slug that has no record yet; on an existing record it now
        # merges CANON_ONLY rather than overwriting it.
        extract()

    # Default is READ-ONLY: generate to the scratch dir and prove the canon
    # record still reproduces the published page. Without --extract this is a
    # genuine drift check (canon -> site vs. what is actually committed), which
    # is what "validation" should have meant all along.
    generate()
    v = verify(); i = idempotency()
    print(f"\n=== SUMMARY ===  lossless={v}  idempotent={i}")
    sys.exit(0 if (v and i) else 1)
