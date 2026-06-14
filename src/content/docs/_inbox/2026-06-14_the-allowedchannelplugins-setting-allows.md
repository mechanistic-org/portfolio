---
title: "The `allowedChannelPlugins` setting allows admins to override the default Anthropic allowlist for channel plugins, requiring `channelsEnabled: true`."
description: "The `allowedChannelPlugins` setting provides a managed-organization allowlist for channel plugins..."
source: "88202b23-460e-48b7-933a-373808bc153a"
---

The `allowedChannelPlugins` setting provides a managed-organization allowlist for channel plugins. When configured, it explicitly replaces the default Anthropic allowlist, empowering administrators to precisely control which plugins can push inbound messages. If undefined, it reverts to the default, and it requires `channelsEnabled: true` to function.

**Tags:** security, plugins, policy, allowlist, enterprise, configuration
