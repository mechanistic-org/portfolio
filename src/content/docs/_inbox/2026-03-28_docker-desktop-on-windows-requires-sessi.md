---
title: "Docker Desktop on Windows requires session restarts, reboots, and manual GUI interaction for post-installation verification."
description: "A common blocker encountered after silent Docker Desktop installation on Windows is the `ObjectNo..."
---

A common blocker encountered after silent Docker Desktop installation on Windows is the `ObjectNotFound` error for the `docker` CLI. This occurs because active terminal sessions do not automatically refresh `Path` environment variables. Additionally, a system reboot is often required for the user's profile to be appended to the `docker-users` security group, and the Docker Desktop GUI must be manually launched once to accept the Terms of Service and initialize the virtualization engine.

**Tags:** docker, windows, troubleshooting, environment variables, post-install
