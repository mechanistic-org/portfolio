---
title: "Introduced `hostPattern` and `pathPattern` for regex-based, granular policy control over marketplace sources."
description: "Flexible policy enforcement for marketplace sources was achieved through the introduction of `hos..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

Flexible policy enforcement for marketplace sources was achieved through the introduction of `hostPattern` and `pathPattern` types within `strictKnownMarketplaces`. `hostPattern` allows regex matching against hostnames for network sources, while `pathPattern` enables regex matching for local filesystem paths. These patterns provide granular control, allowing administrators to define broad or narrow allowances for marketplace origins.

**Tags:** security, policy, regex, marketplace-management, flexibility
