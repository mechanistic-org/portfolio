#!/usr/bin/env python
"""PreToolUse guard: block Edit/Write that switches Astro output to 'server'.

CLAUDE.md invariant: astro.config must stay output:"static". Server mode bundles
the whole site into one _worker.js and hits Cloudflare's 10,000-module limit.

Reads the tool-call JSON from stdin (fields: tool_name, tool_input). Exits 2 to
block (stderr is shown to the model); fails OPEN on any parse error so a malformed
payload never wedges editing. Exit-2 is used deliberately over the newer
hookSpecificOutput.permissionDecision form for version portability.
"""
import json
import re
import sys

try:
	data = json.load(sys.stdin)
except Exception:
	sys.exit(0)  # fail open

ti = data.get("tool_input", {}) or {}
path = (ti.get("file_path") or "").replace("\\", "/").lower()

if "astro.config" not in path:
	sys.exit(0)

# Text this call would write into the file (Edit -> new_string, Write -> content)
payload = ti.get("new_string") or ti.get("content") or ""

if re.search(r"""output\s*:\s*['"]server['"]""", payload):
	print(
		"BLOCKED: astro.config must stay output:'static' (CLAUDE.md invariant). "
		"Server mode bundles the site into one _worker.js and hits Cloudflare's "
		"10,000-module limit. If this is truly intended, edit the file outside the "
		"Edit/Write tools.",
		file=sys.stderr,
	)
	sys.exit(2)

sys.exit(0)
