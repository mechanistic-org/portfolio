---
title: "Develop a `self-model-extract` skill to automatically synthesize and store an agent's behavioral model."
description: "The current manual and undocumented extraction protocol will be formalized by creating a `self-mo..."
---

The current manual and undocumented extraction protocol will be formalized by creating a `self-model-extract` skill. This skill will prompt the agent to synthesize a structured behavioral model from past sessions, tagging the output as `context_layer: behavioral_relationship` and storing it in a top-level `registry/self_model/` namespace for regular updates.

**Tags:** gap, self-model, extraction-protocol, skill, behavioral-relationship
