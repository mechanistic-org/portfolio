# Publish dated metrics from private receipts

The Pulse publishes immutable manual snapshots, not live telemetry. A metric is
eligible only when an independent reproduction receipt privately preserves its
exact query, raw output, and hashes; the public artifact exposes the definition,
window, date, source class, method, and verification state without exposing
private records. Snapshots older than 90 days remain available as archived
evidence. This trades live freshness and fully public reproduction for stable
provenance, explicit staleness, and protection of confidential operating data.
Each proposed snapshot is atomic: if any required headline metric fails
validation or reproduction, the previous approved snapshot remains in place and
none of the proposed values publish.

Approval binds the exact definitions, values, public wording, `as_of` date, and
public-projection hash. A valid snapshot becomes archived after 90 days; a
snapshot later found incorrect or provenance-invalid is withdrawn instead. A
correction creates a separately approved snapshot and preserves a public link
from the withdrawn record rather than rewriting history.
