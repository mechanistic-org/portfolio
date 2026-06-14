---
title: "`PORTFOLIO_ROOT` now validates candidate directories by checking for `package.json` to ensure correct repository resolution."
description: "The `PORTFOLIO_ROOT` resolution logic was updated to no longer trust a path solely for its existe..."
source: "4b11ac0d-b1cf-4ee9-a7dd-8291efb25da6"
---

The `PORTFOLIO_ROOT` resolution logic was updated to no longer trust a path solely for its existence. It now probes candidate directories (`D:/portfolio`, then `GITHUB_ROOT/portfolio`) and accepts only the one containing `package.json`, ensuring it points to the actual repository. This robust validation prevents misconfiguration and is inherited by `get_repo_root('portfolio')` for consistent behavior.

**Tags:** configuration, path resolution, validation, architecture, system update
