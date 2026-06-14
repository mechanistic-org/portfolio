---
title: "Enabled regex-based `hostPattern` and `pathPattern` for granular policy control over marketplace sources."
description: "The `strictKnownMarketplaces` policy supports highly flexible source restrictions through `hostPa..."
source: "88202b23-460e-48b7-933a-373808bc153a"
---

The `strictKnownMarketplaces` policy supports highly flexible source restrictions through `hostPattern` and `pathPattern` types (75). `hostPattern` allows regex matching against the hostname of network-based marketplace sources (e.g., `^github\.mycompany\.com$`), while `pathPattern` enables regex matching against local filesystem paths (e.g., `^/opt/approved/`). This provides granular control for both remote and local marketplace sources within an enterprise policy (91, 92).

**Tags:** security, policy, regex, marketplace, enterprise, architecture, marketplaces, admin-control, configuration, hostPattern, pathPattern, filesystem
