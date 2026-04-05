---
title: "Dedicated `inbox/` and `archive/` directories, ignored by Git, streamline asset management and data hygiene."
description: "To manage the lifecycle of incoming and processed files, new `inbox/` and `archive/` directories ..."
---

To manage the lifecycle of incoming and processed files, new `inbox/` and `archive/` directories have been introduced. The `inbox/` serves as a dedicated drop-zone for raw files, while `archive/` stores successfully processed assets. Both directories are explicitly added to `.gitignore` to prevent unstructured data from being committed to version control, ensuring a clean and focused central registry.

**Tags:** file management, architecture, git, data hygiene, version control
