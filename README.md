# Erik Norris

### Principal Mechanical Architect | Forensic Engineering | Digital Systems

**[eriknorris.com](https://eriknorris.com)**

Thirty years of shipped hardware across SGI, Frog Design, WebTV/Microsoft, Digidesign/Avid, Kaleidescape, Avegant, Noon and Hyphen — workstations, pro-audio consoles, set-top boxes, a head-mounted display, and a cobotic food-assembly platform.

This repository builds the record of it. Every published claim traces to an artifact: an ECO number, a drawing revision, an inspection report with a measurement on it. Where it does not, the page says so and downgrades the claim.

The pipeline below is the instrument that recovered that evidence from thirty years of paper and drives. It is not the product. Start with [the C|24 teardown](https://eriknorris.com/projects/c24/).

---

### 🔧 The Stack

- **Engine:** Astro (Static Site Generation)
- **Content:** MDX + Zod schema (Astro Content Collections)
- **Language:** TypeScript (Core), Python (Automation)
- **Deployment:** Cloudflare Workers Static Assets
- **Asset Storage:** Cloudflare R2 (Object Storage)
- **Styling:** TailwindCSS + Custom UI Library

### 🏗️ Architecture

This project follows the **"Law of Asset Sovereignty"**:

1.  **Immutable locker.** Raw evidence is extracted into a content-hashed archive of 152 program vaults. Nothing edits it; everything downstream cites it.
2.  **Canon is the source of truth.** One curated Markdown record per project, in its own git repo, each naming the locker directory its claims trace to. Not the website, not the résumé.
3.  **Single writer, proven every run.** `scripts/project_pipeline.py` projects canon into site content and verifies it: a field-by-field diff canon → site → canon plus a double-generate hash check. Non-lossless or non-idempotent exits non-zero. **Site content is a read-only render target** — no hand-editing published pages.
4.  **Publish gate.** `npm run build` refuses to ship machine placeholders, leaked markup, demo assets posing as evidence, or an unsourced deep dive. Incompleteness is reported as a burn-down rather than concealed.
5.  **Asset sovereignty.** Images and 3D models live in Cloudflare R2 (`assets.eriknorris.com`), never in Git.
6.  **Static pages with bounded runtime routes.** Astro precompiles the site with
    `output: "static"`. Workers Static Assets serves the static output; the
    generated Worker handles image and R2-proxy routes through the configured
    bindings.

> Superseded 2026-07: an earlier NotebookLM → `_intelligence.md` bolus → hydration flow. `hydrate_content.py` was deleted for destructively rewriting curated frontmatter; NotebookLM is now one input among several, not the system of record.

### 🚀 Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

### Deployment and rollback

Production uses Worker `eriknorris` with Workers Static Assets. The authoritative
deployment configuration is `wrangler.production.jsonc`: the apex and `www`
routes, `ASSETS` from `dist`, and `PROJECTS` bound to `assets-eriknorris-com`.
The Worker entrypoint imports the generated Astro runtime. Root Pages Functions
and the retired `wrangler.toml` are not deployment authority.

#### Observed mechanism and selected contract

Production deployment is manual and requires the existing human authorization
for the specific release. Accepted Git changes and passing CI do not deploy
the site.

On 2026-09-05 at 22:33 UTC, read-only inspection found no Git repository connected
under the Worker's Builds settings. The repository's GitHub workflows perform
validation only. The active deployment was made through Wrangler from reviewed
source `eb541ef70e41d8033028455cafc2ce94f12ff07d` under
[global_agent#479](https://github.com/mechanistic-org/global_agent/issues/479#issuecomment-5549457282):
version `f626a4e9-6966-4149-a316-b7ee439a7450` at 100% traffic, deployment
`2165122e-83a6-457f-9c51-722ddeb7d7d2`. This is a dated observation; inspect live
deployment metadata before each release.

Human-gated automation was evaluated as the default alternative. A remote
executor would require a selected approval mechanism, bounded credentials,
deployment concurrency, artifact identity, failure handling, and rollback
controls that are not currently installed. This contract therefore retains
the working manual mechanism. Automatic deployment and remote human-gated
automation require a separately approved implementation; neither is implied
by CI success or by this documentation.

#### Prepare, authorize, deploy, verify

1. Identify the accepted source commit reachable from `origin/main`, the
   isolated release worktree, the exact change scope, and the applicable
   verification tier. Keep source acceptance distinct from deployment state.
2. Use the committed dependency lockfile and the established workstation
   tooling. Build the candidate with `npm run build:worker`, then run
   `npm run check:worker` and the checks required by the changed behavior.
   `build:worker` supplies `CF_PAGES=1`, which selects the compatible
   `react-dom/server.edge` build. The variable's historical name does not
   indicate a Pages deployment.
3. Record the prepared artifact identity, successful validation, intended
   public URLs, current deployment/version, and the exact prior version
   available for recovery. Review the prepared output and record the release
   authorization. Existing authorization for that same source, artifact, and
   target remains valid; a changed artifact requires renewed review.
4. Deploy that prepared output with
   `npm run deploy:production -- --message "<ticket> source <commit>"`.
   This command invokes Wrangler with `wrangler.production.jsonc`; it does
   not build or regenerate the site. Rebuilding after artifact review creates
   a new candidate.
5. Read back the resulting deployment ID, version ID, traffic allocation,
   Worker identity, and message. Run the selected live checks and retain the
   source/artifact identity, approval, results, and recovery outcome in the
   focal release receipt. Complete the normal issue and repository closeout.

The executor is Erik or an agent operating the approved local release task.
Use the existing Wrangler OAuth authority with encrypted keyring storage and
a sanitized child environment as documented in the
[Cloudflare authentication authority](https://github.com/mechanistic-org/global_agent/blob/main/docs/cloudflare_auth_authority.md).
The release scripts do not enforce human approval or credential scope.
This contract adds no credential, token, runner, Access, DNS, or R2-object
authority.

`wrangler.jsonc` and `wrangler.production.jsonc` both name `eriknorris`.
The first omits production route declarations for direct verification; it
does not name an isolated Worker. Deploying it can replace the code serving
existing production traffic. Use the dry-run checks for non-deploying bundle
verification. A separately named staging Worker or version-preview workflow
would require its own approved setup.

#### Application recovery

Capture the active version before deploying. On an application regression,
use that explicit known-good version under the release's recovery authority:

```powershell
npx --no-install wrangler rollback <captured-version-id> --config wrangler.production.jsonc
```

Read back the new deployment, confirm the selected version receives 100% of
traffic, and repeat the failed checks plus the routine smoke tier. Preserve
the failed deployment and recovery evidence. Investigate an ambiguous outcome
before repeating a production command.

A version rollback restores the selected application version. It does not
restore external R2 object contents, DNS, or resources that were separately
changed or deleted. Check that the selected version's bindings still resolve
before using it. Cloudflare limits rollback to the 100 most recent published
versions; an old historical UUID is not a standing recovery guarantee.

The Pages project `portfolio` was deleted by
[global_agent#457](https://github.com/mechanistic-org/global_agent/issues/457#issuecomment-5482671656).
Removing the apex or `www` Worker route now detaches traffic from the Worker.
It does not restore the deleted Pages deployment. Route detachment is a
separate infrastructure action and is not the application rollback command.

The #457 receipt proves its historical Pages-fallback rehearsal. The #479
receipt records a captured Worker recovery version and command; that release
completed without executing rollback. A read-only version inspection or
command review must be reported as such, rather than as an executed rollback.

#### Verification tiers

Select the tier from the actual change. Before deployment, freeze the finite
list of changed public routes and their expected behavior in the release
record. Documentation-only changes require documentation/configuration review
and no production deployment.

| Tier | Exact trigger | Required checks |
|---|---|---|
| Routine | A release changes static page content, styling, or browser code while the Worker runtime, routing, headers, bindings, dependency/build configuration, domains, DNS, and storage remain unchanged. | Validate the prepared Worker build. Check apex `/` for `200` HTML, `www /` for `301` to the apex, one bundled `/_astro/` asset against the prepared bytes and expected cache policy, one deliberate missing route for `404` with `no-store`, and the canonical resume PDF through `/assets/r2/resume/Erik_Norris_Resume_Current.pdf` for `200`, PDF media type, and the accepted artifact hash. Check each route in the release's frozen changed-route list against its expected status and reviewed content. Run a focused browser check when the change affects an interaction or responsive layout. |
| Expanded | A release changes `worker-entry`, the image adapter, Astro/runtime generation, compatibility settings, dependencies/build configuration, `run_worker_first`, bindings, `_headers`, `_redirects`, or Worker route configuration, without a destructive hosting/domain/DNS/storage transition. | Run routine checks and both Worker dry-run configurations. Read back exact live routes, bindings, compatibility settings, deployment and version. Apply the affected branch checks below; changes to build/runtime generation or dependencies apply all branches. |
| Destructive transition | An explicitly approved operation retires or replaces hosting, removes or reassigns a domain, changes DNS, deletes a required resource, or migrates/deletes storage. | Prepare an exact target/prestate inventory and independently recoverable state, explicit mutation and stop boundaries, a complete affected-surface equivalence matrix, and a recovery plan appropriate to the surviving resources. Prove recovery before the irreversible step where possible; run the matrix before and after it and across the approved quiet interval. Retain exact deletion/migration identities and final readback. Use a separately scoped transition transaction; routine deployments do not inherit this campaign. |

Expanded branch checks:

- **Runtime or bindings:** valid local `/_image?href=%2Ffavicon-96x96.png`
  returns the favicon's exact bytes and media type; bare `/_image` returns
  `400`; an absent server island returns `400`; stale `/debug/health` and
  `/r2/` behavior remains `404`. Compare the selected C24 image and canonical
  resume PDF through the apex Worker proxy, direct Worker, and public R2
  custom domain for status, media type, byte count, and SHA-256 equality.
  Compare each path's cache headers with its recorded policy rather than
  assuming all delivery paths use identical cache headers.
- **Routing, headers, or redirects:** verify apex/`www` canonical behavior,
  `/projects/c24` canonicalization to `/projects/c24/`, both legacy
  `/projects/zeus` forms and their final destination, a `/docs/` page's
  `X-Robots-Tag: noindex, nofollow`, and the missing-page status/cache policy.
  Verify `/resume` canonicalization, `/resume/`, `/resume.json`, the
  `/resume/pdf/` compatibility route, and the resume vanity destination when
  the affected configuration can change them.
- **Build/runtime generation or dependency changes:** apply both branches
  and check that generated runtime precedence, static upload exclusions,
  image handling, and the `PROJECTS` binding match the reviewed configuration.
  The existing `check:worker` assertions cover the generated contract;
  passing them does not substitute for live readback after deployment.

An application rollback uses the routine smoke tier plus the checks that
detected the failure. Expanded verification does not by itself authorize a
live rollback rehearsal, resource mutation, or a destructive transition.

#### Evidence and reference

- [Deployment-contract issue and acceptance clarification](https://github.com/mechanistic-org/portfolio/issues/215)
- [Pages retirement and original equivalence receipt](https://github.com/mechanistic-org/global_agent/issues/457#issuecomment-5482671656)
- [Accepted manual publication and Worker recovery record](https://github.com/mechanistic-org/global_agent/issues/479#issuecomment-5549457282)
- [Cloudflare Worker rollbacks](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)
- [Cloudflare Wrangler rollback command](https://developers.cloudflare.com/workers/wrangler/commands/workers/#rollback)
- [Cloudflare Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)

---

_Built with [Cosmic Themes](https://github.com/Cosmic-Themes) & Custom Engineering._
