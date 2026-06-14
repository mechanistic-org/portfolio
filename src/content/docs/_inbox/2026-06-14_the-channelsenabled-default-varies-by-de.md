---
title: "The `channelsEnabled` default varies by deployment (`claude.ai` off, `Console` on) for managed-org channel notifications, requiring explicit opt-in for users."
description: "The `channelsEnabled` setting provides a managed-organization opt-in for channel notifications fr..."
source: "88202b23-460e-48b7-933a-373808bc153a"
---

The `channelsEnabled` setting provides a managed-organization opt-in for channel notifications from MCP servers. Its default state varies by deployment: `claude.ai Teams/Enterprise` defaults to off, while `Console` defaults to on unless managed settings are present. Enabling it allows users to select servers via `--channels`, reflecting a nuanced approach to enterprise feature rollout and control.

**Tags:** enterprise, channels, notifications, default-state, configuration, policy
