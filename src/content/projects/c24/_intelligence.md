# C24 Project Intelligence Bolus

> **Notebook Title:** C24
> **Source:** [NotebookLM](https://notebooklm.google.com/notebook/b8f893fe-234c-44ca-9d92-8fff6f82e53d?authuser=1)
> **Extracted:** 2026-01-08

## I. PROJECT SUMMARY: THE C|24 ("CURTIS") CONSOLE

- **Role:** Mechanical Engineering Lead (Erik Norris)
- **Timeline:** 2006 – 2007
- **Objective:** Engineer the successor to the Control|24, improving margins, manufacturability, and meeting RoHS environmental standards.
- **Core Achievement:** Achieved 100% mechanical fit on the first physical build despite the integration of 19 distinct PCBs into a low-profile chassis.

## II. CRITICAL MECHANICAL INTERVENTIONS & DESIGN WINS

### 1. The "Side Cap" Thermal Warping Rescue

- **The Crisis:** During the Pilot phase, the long plastic side caps (P/N 9440-55165/166) exhibited severe warping (up to 2.70mm) and linear shrinkage (1.5mm to 2mm) during the paint curing process, creating unacceptable gaps.
- **The Root Cause:** The vendor (Jetcrown) was using "Method C"—placing parts flat on racks without support during the oven-bake cycle.
- **The Solution:** Erik Norris engineered "Method A"—a **Vertical Hanging Fixture** strategy that utilized gravity to pull the parts straight during the bake cycle. This was formalized via **ECO 12740**.

### 2. The "No-Bid" Top Panel Strategy

- **The Crisis:** The primary overseas manufacturer (VTech/Kwanta) issued a "no-bid" on the complex top panel due to the high density of welded hardware.
- **The Solution:** Orchestrated a dual-sourcing strategy, leveraging domestic partner **Mass Precision** for rapid-turn Pilot units while validating a manual offset-welding process with overseas engineers for mass production.

### 3. Data Control Drawing (DCD) Governance

- **The Intervention:** Architected and enforced a strict DCD system to synchronize 19 PCBs with the mechanical chassis.
- **The Result:** Managed up to 13 revisions per board, resolving all connector collisions and keep-out violations before layout finalization, ensuring a "first-time fit."

### 4. The Headphone Jack "Fire Drill"

- **The Intervention:** Late in the design phase (April 2007), redesigned the Headphone Jack Bracket (9420-55126-00) and surrounding mechanicals to ensure ease of serviceability and orientation for the MicPre board, solving a multi-variable geometric puzzle at the 11th hour.

## III. TECHNICAL STACK & GOVERNANCE

- **CAD/PDM:** Administered the **Pro/Intralink 8.0** server migration and authored the department-wide "General Modeling Guide."
- **Manufacturing:** Managed technical diplomacy with overseas partners (Jetcrown, VTech, Kwanta) and domestic fabricators (Mass Precision).
- **Compliance:** Preserved 100% data integrity for thousands of files during the complex RoHS Bill of Materials conversion.
