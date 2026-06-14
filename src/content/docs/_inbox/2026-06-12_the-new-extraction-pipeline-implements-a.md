---
title: "The new extraction pipeline implements a robust chunked map-reduce with deterministic merge verdicts to prevent silent data loss."
description: "The extraction pipeline now uses a chunked map-reduce approach over the full transcript, employin..."
---

The extraction pipeline now uses a chunked map-reduce approach over the full transcript, employing overlapping 18k-character chunks. The final chunk always covers the last 15k characters verbatim. The reduce step applies merge verdicts deterministically, ensuring that any item not explicitly referenced by a verdict passes through unchanged, preventing silent data loss.

**Tags:** architecture, pipeline, data integrity, map-reduce
