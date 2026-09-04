# Resume authority and local candidates

`resume_master.ts` owns identity/contact, summary, career facts, explicit date precision,
canonical and reviewed channel titles, competencies, education, recognition, and the
canonical PDF URL. `resume_projection.ts` derives the compact HTML resume model,
JSON Resume, site identity metadata, global Person JSON-LD, and PDF/download configuration.
The homepage career span reads the canonical periods. Project content/evidence keeps its
existing authority. `work_history.json` is a legacy timeline input, not a public identity
or structured-resume authority; this migration does not rewrite its historical content.

`linkedin_master.ts` owns only channel wording: headline, About, and program-first blurbs
referencing stable role IDs. Company names and positions never serve as join keys.
The accepted LinkedIn ordering (including Noon before the 2018 consultancy) is explicit.
The compact resume has eight presentations, with five early engagements grouped in
`earlier-work`; the LinkedIn projection has twelve separate entries.

## Accepted facts and review

Requirements: [portfolio#219](https://github.com/mechanistic-org/portfolio/issues/219).
Accepted source: [1b2cd2f6](https://github.com/mechanistic-org/portfolio/commit/1b2cd2f6eaba20544cef087d5e031f1e2dba8bac).
Acceptance: [#152 receipt](https://github.com/mechanistic-org/global_agent/issues/152#issuecomment-5546214741).
The execution cold-read verified 8 resume and 12 LinkedIn entries at that revision.
Focused tests load that exact Git source as TypeScript modules and compare every accepted
blurb, headline, About, channel company/title, and compact resume entry.

All seven recent canonical titles come from the accepted resume. The different accepted
LinkedIn labels remain explicit display mappings under each canonical role; they are not
new formal titles, promotion dates, seniority, or management claims. For example, Hyphen's
resume label `Staff Mechanical Engineer → Principal Systems Architect` and LinkedIn label
`Principal Systems Architect / Senior Mechanical Engineer` remain channel wording for the
same engagement. Neither implies a separately dated promotion. Earlier canonical labels
come from the accepted LinkedIn roles; EP Technologies' employer, title and dates are stated
in its accepted prose. The grouped resume title is a category, not an employer or job title.

| Role ID              | Canonical period | Compact presentation |
| -------------------- | ---------------- | -------------------- |
| mechanistic-2022     | 2022 - Present   | own entry            |
| hyphen-2021          | 2021 - 2022      | own entry            |
| mechanistic-2018     | 2018 - 2021      | own entry            |
| noon-2017            | 2017 - 2018      | own entry            |
| avegant-2015         | 2015 - 2017      | own entry            |
| kaleidescape-2008    | 2008 - 2015      | own entry            |
| digidesign-2003      | 2003 - 2008      | own entry            |
| mechanistic-1998     | 1998 - 2003      | earlier-work         |
| frogdesign-1997      | 1997 - 1999      | earlier-work         |
| mechanistic-1993     | 1993 - 1997      | earlier-work         |
| sgi                  | unknown          | earlier-work         |
| ep-technologies-1986 | 1986 - 1989      | earlier-work         |

Known dates have year precision only. Overlapping accepted periods are retained. The
accepted SGI entry supplies no dates, so its period is explicitly unknown; it is not an
ongoing job. Legacy `work_history.json` contains conflicting dates/titles and unsupported
precision, including a 1985 EP start and 1999 consultancy start, and does not settle these
facts. Unknown dates are omitted from machine schemas and described as unspecified in the
packet. JSON Resume permits year-only ISO dates; current roles omit `endDate`, never
inventing January 1 or emitting `Present` as a date. See the
[JSON Resume 1.0 schema](https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json).
Person employment uses the [schema.org Role intermediary](https://schema.org/Role) with
`hasOccupation`; educational organizations use `alumniOf`. No employment is presented as
education or an invented skill mastery level.

`linkedin_review.ts` pins the normalized prose and complete canonical authority values
by SHA-256, with the accepted source/review links. This migration's new structure preserves
the accepted facts and prose. Any later factual or prose change must identify primary
evidence, record review on its authorized ticket, and deliberately replace the relevant
acceptance digest. There is no automatic approval/hash-update command. Irreconcilable
facts require an operator ruling. The known-claim regular expressions catch regressions;
they cannot establish factual support for arbitrary prose. Even innocuous unreviewed text
fails the acceptance digest. The export never edits source to make checks pass.

## Deterministic LinkedIn packet

Requires Node 24 (as in CI). From the intended checkout:

```powershell
npm run test:resume
npm run export:linkedin
# Optional private local output, never a served directory:
npm run export:linkedin -- --output C:/private-candidates/linkedin
```

The default `.astro/linkedin/` output is ignored. `linkedin.txt` contains the headline,
About and all twelve mapped Experience entries in reviewed order. Strings normalize
CRLF/CR to LF and Unicode to NFC; each field is trimmed only at its edges. Sections have
one blank line between them and the packet ends with exactly one LF. Encoding is UTF-8
without BOM. No clock, random ID, or receipt metadata enters packet bytes.
`linkedin.receipt.json` separately records source HEAD, dirty state of relevant inputs,
input-file SHA-256 values, exporter version, packet SHA-256, byte count, and entry count.
The exporter binds data and receipt to its own physical checkout; supplying another root
fails. Unchanged inputs produce identical packet bytes, including across repeat writes.
There are no network calls or publication actions. An output packet is a local candidate,
not an authorization to publish. Validate the exact candidate with the read-only shared
`global_agent/scripts/validate_outbound_voice.py` before any subsequent authorized release.

`harvest_linkedin.py` now exits 2 with retirement guidance. `LINKEDIN_READY.txt` is a
retirement marker only. Neither can regenerate TIR/project-derived publication text.

## Local PDF preparation and route compatibility

`/resume/pdf/` is a static HTML redirect with a usable anchor to the canonical R2 PDF.
It contains no separate career prose. Desktop and mobile resume navigation use ordinary
`Download PDF` anchors, including with JavaScript disabled. Live PDF freshness and
Content-Disposition are outside this issue; no download-header promise is made here.

```powershell
$revision = git rev-parse HEAD
npm run prepare:resume-pdf -- --source-root (Get-Location).Path --revision $revision --output C:/private-candidates/resume/candidate.pdf --port 43919
```

Invoke the script in the intended checkout; another checkout root is rejected. Source
revision must match the full HEAD. Dirty source requires explicit `--allow-dirty` for local
testing and is recorded as dirty, never attributed to a clean commit. Output must not
exist and must remain outside served directories. There is no default R2 mirror or archive
write. The preparer owns an Astro dev server bound to loopback, checks port occupancy,
uses strict-port mode, verifies the resolved render root and a per-process identity nonce,
and checks revision/input hashes plus the rendered response before printing. It refuses
another server, changed inputs, mismatched revision/root, and occupied endpoints. The
server and browser stop on success or failure. The local PDF receipt includes exact source
identity, input hashes, canonical PDF configuration and candidate SHA-256. It is private.
Astro output remains static; the development-only identity middleware creates no public route.

## Verification and stop boundary

`npm run test:resume-browser` starts only the intended local checkout, verifies desktop and
mobile no-JavaScript anchors and the compatibility route, and mutates canonical test fields
in this isolated checkout to prove emitted HTML/JSON/Person/footer/download propagation.
It restores the source in `finally`; do not run it concurrently with an editor or build.
Screenshots and sampled JSON remain under ignored `.astro/resume-checks/`.

Required release checks are focused tests, browser inspection, `npm run check:ci`,
`npm run audit:integrity`, and `npm run build`. Land exact reviewed paths on origin/main,
publish the receipt, close only #219, set it Done on the Main Board, and stop. Site, PDF,
R2 and LinkedIn deployment/publication, canon/evidence/generated records, and #479/#480
execution are excluded.
