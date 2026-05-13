---
title: "The Intake Engine uses a monitored local `inbox` directory for automatic data classification and routing."
description: "A core architectural decision for the Intake Engine is the creation of a local `inbox` directory,..."
---

A core architectural decision for the Intake Engine is the creation of a local `inbox` directory, which the `intake_router.py` continuously monitors. This design ensures that any input dropped into this directory will be automatically classified and routed based on its file extension and semantic content, providing a seamless data ingestion point.

**Tags:** architecture, intake_engine, inbox, routing, design_decision
