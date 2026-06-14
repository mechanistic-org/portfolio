---
title: "Established `strictKnownMarketplaces` for enterprise policy enforcement, blocking unapproved marketplace sources pre-download."
description: "The `strictKnownMarketplaces` setting provides an enterprise-grade policy gate for marketplace so..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

The `strictKnownMarketplaces` setting provides an enterprise-grade policy gate for marketplace sources. When configured in managed settings, it strictly limits allowed marketplace sources, ensuring that only approved origins can be added. This check occurs prior to any download, preventing blocked sources from ever touching the filesystem and enhancing security.

**Tags:** security, enterprise, policy, marketplace-management
