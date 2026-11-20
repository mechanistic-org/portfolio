# Biography, hiring copy and shared visual reference

The current biography candidates live in the private Moreplay source package `authoring/biography/`. Read its README, inventory and publication status before rewriting copy. The package includes the deeper source account, reusable bios, three-site introductions/essays, resume and all twelve LinkedIn Experience descriptions.

The current copy direction has been reviewed. Installation and public publication remain separate. The site's existing production content, career authority, acceptance hashes and release mechanism are unchanged by these review commands.

## Connect the private source

The bridge first reads `BIO_CONTENT_ROOT`, then repository-local `git config bio.contentSource`. Otherwise it tries the package in this checkout and a sibling Moreplay checkout. For an explicit source checkout:

```powershell
git config bio.contentSource /absolute/path/to/private-moreplay/authoring/biography
```

That setting is local Git configuration, not tracked public metadata. Use Node 24 and Python 3.12+. `BIO_PYTHON` can name a specific Python executable if needed. A missing private source fails with setup instructions; it never regenerates an approximate replacement.

## Commands

| Command | Result |
| --- | --- |
| `npm run bio:check` | Verify package/file and candidate hashes, shared opening, placement coverage and twelve role IDs; portfolio also compares its accepted role IDs |
| `npm run bio:status` | Show copy, installation and publication state for each surface |
| `npm run bio:export` | Write source-bound candidate copy, LinkedIn packet, resume Markdown/Word and a receipt to ignored `.astro/biography/` |
| `npm run bio:preview` | Rebuild the eleven connected private pages and living visual reference from the registered source |
| `npm run bio:serve` | Rebuild and serve only the generated review site on loopback port 8842; Ctrl+C stops it |

Outputs remain outside public page/content inputs. No command deploys, updates a profile, copies private research into a public bundle or changes acceptance hashes.

## Use the existing installation workflows

For the portfolio, `export:linkedin:candidate` and `prepare:resume:candidate` expose this new packet. `export:linkedin` still means the existing accepted channel authority, and `prepare:resume-pdf` still renders that accepted resume source. On exact installation approval, follow the current `docs/agents/resume-authority.md`: role facts/channel titles originate in canon chronology, identity remains in `resume_master.ts`, the current resume summary/selected achievements resolve in `resume_projection.ts` and shared claims, and LinkedIn wording remains in `linkedin_master.ts`. Update only the applicable sources and acceptance hashes, then run its focused checks and exports. Preserve role IDs and supported date precision. Do not infer missing months.

For Moreplay, source selection still goes through `review:publishing` and the selected revision/asset manifest in `publishing/`. The private package is not an Astro content input. The generic bio preview is a connected layout review; a final selected publication needs the site's exact release candidate and existing publishing checks.

For Mechanistic, use the registered practice copy and shared reference when selecting the actual practice/essay routes alongside Pipeline. Preserve useful existing navigation. Final installation follows the site's normal build and explicit deployment commands.

For all three sites, record the content ID and source hash installed into each page, panel or metadata field, then record the deployed revision separately. A new source edit does not silently replace an already published selection.
