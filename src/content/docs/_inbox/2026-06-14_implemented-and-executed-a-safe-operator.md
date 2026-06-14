---
title: "Implemented and executed a safe, operator-approved protocol for pruning 16 stale PDFs from the public R2 bucket."
description: "A new protocol was established and executed to prune stale, dated PDFs from the public R2 bucket...."
source: "b5c5be79-7653-4e43-b9f8-af971800f312"
---

A new protocol was established and executed to prune stale, dated PDFs from the public R2 bucket. The process involved listing the `resume/` prefix, presenting items for deletion, obtaining explicit operator approval, and ETag-verifying every deleted object against local copies before removal. This safely removed all 16 stale objects (~136 MB) that accumulated due to the additive-only sync.

**Tags:** data hygiene, cleanup, R2, cloud storage, protocol, security
