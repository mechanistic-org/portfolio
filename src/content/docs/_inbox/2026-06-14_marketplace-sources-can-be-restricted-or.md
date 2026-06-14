---
title: "Marketplace sources can be restricted or allowed by hostname using regex patterns."
description: "The system allows marketplace sources to be restricted or allowed based on hostnames. For GitHub ..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

The system allows marketplace sources to be restricted or allowed based on hostnames. For GitHub sources, it matches against 'github.com', and for Git sources (SSH or HTTPS), it extracts the hostname from the URL. This mechanism is used in `strictKnownMarketplaces` to permit all marketplaces from a specific host, such as '^github\.mycompany\.com$'.

**Tags:** marketplace, security, configuration, hostname
