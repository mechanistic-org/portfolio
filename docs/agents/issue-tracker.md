# Issue tracker: GitHub

Issues and specifications for this repository live in GitHub Issues. Use the `gh`
CLI for all operations.

## Conventions

- Create an issue with `gh issue create`. For multiline content, write the body to
  a temporary Markdown file and pass it with `--body-file`.
- Read an issue with `gh issue view <number> --comments`, including labels where
  relevant.
- List issues with `gh issue list`, using explicit state and label filters.
- Comment with `gh issue comment <number> --body-file <path>`.
- Apply or remove labels with `gh issue edit`.
- Close with `gh issue close`.

Infer the repository from `git remote -v`; `gh` resolves it automatically when run
inside the clone.

## Pull requests as a triage surface

**PRs as a request surface: no.**

When changed to `yes`, external pull requests run through the same labels and
states as issues using the corresponding `gh pr` commands. Filter request-surface
PRs by author association, excluding owners, members, and collaborators.

GitHub shares one number space across issues and pull requests. Resolve an
ambiguous reference by checking the pull request first and then the issue.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Wayfinding operations

The map is one issue with child issues as tickets.

- Create maps with the `wayfinder:map` label.
- Link child tickets through GitHub sub-issues. If unavailable, use a task list in
  the map and put `Part of #<map>` in the child.
- Represent blocking with GitHub native issue dependencies. Fall back to a
  `Blocked by:` line only when native dependencies are unavailable.
- Build the frontier from open, unassigned children with no open blockers; map
  order breaks ties.
- Claim a ticket by assigning it to the driving developer.
- Resolve a ticket by commenting with the answer, closing it, and adding its
  context pointer to the map.
