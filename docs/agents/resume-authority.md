# Resume and LinkedIn publication authority

Erik approved the complete hiring edition on 2026-11-20 under Moreplay #19, including
the Avegant whole-mechanical-BOM and roughly 40-tools addition. This supersedes the
older #152 LinkedIn wording and the #278 resume projection wording. The private
biography package is the editable source, inventory and design reference; the
site's existing bio-content workflow locates that package without committing it here.

Erik approved the SC48-aligned resume bullet and Digidesign LinkedIn Experience
on 2026-11-21 under Moreplay #22. All other hiring prose, dates and company
associations retain their prior accepted values. The print job-entry gap is
12px; typography and margins retain the restored layout. Earlier fixtures and
private review/publication receipts remain historical.

Erik approved the De Anza education correction on 2026-11-21 under Moreplay #23:
completed two-year Automotive Technology program, with engine-controls and
drivability specialization; no AA/AS award is asserted. All other resume wording
and employment facts remain. The print job-entry gap is now 8px to retain
the expanded education line on page two; type, line heights, margins and
screen layout remain unchanged.

## Installed edition

`resume_master.ts` owns the approved resume copy, identity/contact, capabilities,
education and canonical PDF URL. `linkedin_master.ts` owns the approved headline,
About and twelve Experience descriptions. `linkedin_review.ts` locks the approved
prose and role authority by hash. Changing that lock requires a new review.
The immutable public-only fixture in `tests/resume/fixtures/approved-2026-11-21-education.json`
records the approved edition and previous canonical periods for regression checks.

`portfolio-canon/career/chronology.json` owns role identity, canonical periods and
channel title mappings. Its existing source was cross-checked against be6419f, confirming
that all twelve roles matched the published projection exactly. Only approved channel
labels and their review provenance changed; all periods and project placements remain.
`scripts/project_career.mjs` checks full canon parity for twelve roles and 87 projects.

The resume groups five early engagements into one entry; LinkedIn retains twelve.
Neither chronology array position nor company name is a join key. Known canonical
dates retain year precision and SGI remains unknown in the machine-readable canon.
LinkedIn's existing, more precise date fields are preserved during installation;
the year-only export must never replace them. Preserve all existing company-page
associations, employment types and locations when updating the reviewed text.

## Keep publication deliberate

Project synopses continue to supply separately selected Project drafts. They cannot
silently replace the approved Experience paragraphs or resume bullets. Seven former
resume claim-consumer bindings were retired in canon for this edition; their underlying
claims, evidence and other site consumers remain unchanged. This avoids reintroducing
older prose on the next export or build. New project findings can inform the next review.

`resume_projection.ts` derives HTML, JSON Resume, identity metadata and Person JSON-LD
from the installed authority. Date precision is retained and unknown dates are omitted
from machine schemas. `/resume/pdf/` redirects to the canonical R2 object:
https://assets.eriknorris.com/resume/Erik_Norris_Resume_Current.pdf

The restored layout and grouped Core competencies were approved for publication on
2026-11-20. The current PDF is SHA-256
2f2a87263dec5a13c0f2549ceb0e9fd5197f534e6410b66fcc6753028b6a7852.
It uses the existing HTML print renderer and retains all approved hiring copy.
Core competencies groups the existing terms under Engineering, Manufacturing,
and Tools & systems. Two pages is a target, not a rule: preserve readable type,
white space, hierarchy and sensible pagination when the copy changes. The private
publication receipt binds these PDF bytes to the source and live readback.
The earlier ReportLab edition remains historical in its original release receipt.

## Workflow

Run `npm run test:resume`, `npm run export:linkedin`, canonical career/claim parity,
the standard site checks and build, then inspect desktop/mobile output. Export remains
a local candidate operation; it is not publication approval. Validate the exact outbound
copy with the shared no-em-dash validator. Keep source, inventory, accepted hashes and
publication receipts in the private biography package, using its established CLI.
Live publication must verify both PDF URL bytes and saved LinkedIn fields, including
unchanged dates and company associations. Site deployment follows README's Worker
contract and requires accepted source on origin/main.
