---
title: "Unify Git credential management by using `gh auth setup-git` to integrate GCM into the `gh` keychain."
description: "For optional full unification, `gh auth setup-git` can be used to configure `gh` as the Git crede..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

For optional full unification, `gh auth setup-git` can be used to configure `gh` as the Git credential helper. This action collapses the Git Credential Manager, currently a separate store for raw `git push` operations, into the `gh` keychain, thereby removing the last independent credential store with low risk.

**Tags:** architecture_decision, tooling, credential_management, workflow
