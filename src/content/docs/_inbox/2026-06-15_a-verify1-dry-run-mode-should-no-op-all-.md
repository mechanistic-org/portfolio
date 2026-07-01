---
title: "A `VERIFY=1` dry-run mode should no-op all external side effects during pipeline testing."
description: "Implement a `VERIFY=1` or dry-run side-effect floor: a single environment variable that no-ops al..."
source: "f4d5cfd2-2380-462b-820c-5583e707c926"
---

Implement a `VERIFY=1` or dry-run side-effect floor: a single environment variable that no-ops all external side effects during test runs. This mode prevents the pipeline from writing to external services like R2 or dialing the network, serving as a robust safety mechanism below any heuristic checks.

**Tags:** pipeline, testing, safety, environment-variables, dry-run
