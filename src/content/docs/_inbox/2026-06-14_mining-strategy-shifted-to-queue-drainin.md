---
title: "Mining strategy shifted to queue draining, deprecating `--most-recent-claude`."
description: "The `--most-recent-claude` flag, initially deemed to have avoided misattribution (0, 1), was advi..."
source: "88202b23-460e-48b7-933a-373808bc153a"
---

The `--most-recent-claude` flag, initially deemed to have avoided misattribution (0, 1), was advised for retirement (5) and officially retired from ritual use (26, 151) due to concurrency issues and its tendency to pick the top of the active stack (172). The mining process for Claude Code has now shifted to draining a queue via `process_mine_queue.py --sweep` instead of relying on recency, and the `--most-recent-claude` flag is explicitly forbidden in any ritual (175, 194).

**Tags:** mining, workflow, automation, process, protocol, bug_resolution, tooling, provenance, system_behavior, race_condition, tooling_policy, process_improvement, issue_223, model_management, deprecation, claude, conversation_id, agent_behavior, issue_219, Claude_Code, override
