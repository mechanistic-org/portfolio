---
title: "`pluginSuggestionMarketplaces` implements a managed-settings-only allowlist for contextual plugin suggestions, requiring both marketplace registration and source declaration, with an exemption for the official marketplace."
description: "`pluginSuggestionMarketplaces` defines an allowlist for marketplace names whose plugins may appea..."
source: "88202b23-460e-48b7-933a-373808bc153a"
---

`pluginSuggestionMarketplaces` defines an allowlist for marketplace names whose plugins may appear as contextual install suggestions. This feature is strictly policy-driven, only honored when set in managed settings, and ignored in user, project, or local configurations. For a name to be effective, the marketplace must be registered, and its source declared in managed settings (via `extraKnownMarketplaces` or `strictKnownMarketplaces`). The official marketplace is exempt from the source requirement.

**Tags:** plugin_suggestions, policy_enforcement, managed_settings, security, configuration, allowlist
