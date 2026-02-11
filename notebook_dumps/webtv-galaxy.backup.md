### Galaxy / UltimateTV Forensic Report

**Source:** NotebookLM
**Extracted:** October 26, 2023

#### I. PROJECT SUMMARY

- **Role:** Lead Mechanical Architect / Principal Consultant (Mechanistic)
- **Mandate:** Architect a "Technology Showcase" Home Gateway capable of integrating desktop-class computing power (AMD K7, 3 Tuners, HDD) into a consumer electronics form factor for Microsoft/WebTV.
- **The Xbox Bridge:** This project was the biological ancestor of the Xbox. We took a "Cold" WebTV lineage and forced a "Blast Furnace" PC architecture into it. The thermal learnings from this 150W crisis directly informed the first-generation Xbox thermal architecture.
- **Core Achievement:** Successfully engineered a chassis architecture capable of dissipating a critical **150W thermal load** within a constrained 300mm footprint, preventing component failure while maintaining mass-production feasibility before the division was consolidated into Xbox.

#### II. THE ANATOMY OF FAILURE (Heuristic Analysis)

##### 1. The 150-Watt Thermal Crisis

- **The Trigger:** April 2001. CFD simulations confirmed that the integration of the AMD K7 desktop processor and triple-tuner architecture generated a **150W total power load**, pushing internal ambient temperatures to destructive levels.
- **The Crisis:** The thermal density threatened component viability. Specifically, the Smart Card reader location hit **55.0°C**, creating a user-safety hazard and risking card failure. The standard "Mercury" form factor could not support the required heat rejection.
- **The Fix:** I engineered a chassis depth expansion to **300mm** to support a high-velocity airflow tunnel. I specified a **50x60x30mm extruded heatsink** and a Delta fan running at 2700 RPM to force **28.3 CFM** through the enclosure. This intervention stabilized the CPU junction temperature at **84.0°C** and mitigated the Smart Card hotspot.

##### 2. The "Warped Base" Manufacturing Defect

- **The Trigger:** June 2001. Fabrication vendor D&D Manufacturing flagged a critical flaw in the stamping design regarding the "drawn standoffs" specified for motherboard mounting.
- **The Crisis:** The density and placement of these integral standoffs induced excessive material stress, causing the sheet metal base to **warp** during the stamping process. This threatened to yield twisted chassis bottoms that would not sit flat or align with the PCB.
- **The Fix:** I authorized a redesign of the chassis floor, replacing the problematic drawn standoffs with a "Hook 29" detail and adding specific **strengthening ribs** to counteract the material distortion, ensuring flatness for the production line.

##### 3. The "Impossible Assembly" CPU Puck

- **The Trigger:** July 2001. The "Mechanical Design Hitlist" identified that the CPU "puck" assembly could not be installed into the main chassis as a pre-assembled unit due to fastener interference with the fixed partition.
- **The Crisis:** This geometric conflict rendered the unit **unable to be assembled** in a standard manufacturing sequence, threatening to halt the "DEV" build schedule.
- **The Fix:** I executed a modular redesign of the CPU enclosure, breaking it into sub-components for _in situ_ assembly. I simultaneously upgraded the EMI shielding strategy, implementing **EMI flanges** and a **12.5mm hex hole pattern** to maintain RF containment despite the segmented assembly.

#### III. GOVERNANCE & RHYTHM

- **The Pulse:** Managed a high-velocity "Mechanical Design Hitlist" protocol to track and kill defects (EMI leaks, fitment issues, cabling routing) across multiple subsystems.
- **Blind Discovery (The "Spoons" Incident):** We found that the heatsink retention clips were failing drop tests. I didn't have FEA. I grabbed a handful of cafeteria spoons, bent them to match the spring rate, and proved the concept in 20 minutes.
- **Tactile Reference (The Datsun 510):** Roy Askeland drove a Datsun 510. It became the metaphor for the project: "It doesn't have to be a Ferrari. It just has to be tunable, reliable, and fun to drive."
- **The Artifacts:** Maintained the "Galaxy Mechanical Design Hitlist" and enforced a centralized **FTP workflow** ("share.webtv.net") to resolve version control chaos between WebTV engineering, ID partners, and fabrication vendors.
- **Supply Chain Command:** Directly managed vendor relationships during critical failures, including coordinating 4-day "quick turn" fabrication cycles with E-M Solutions during a historic company-wide shutdown.

#### IV. LINKEDIN ARTIFACTS (The Numbers)

- [ ] **Engineered** a high-performance thermal architecture for a 150W satellite gateway, utilizing CFD data to manage a 28.3 CFM airflow path for an AMD K7 processor.
- [ ] **Salvaged** the manufacturing schedule during a critical vendor shutdown by personally coordinating off-cycle "quick turn" fabrication, meeting a 4-day delivery target.
- [ ] **Eliminated** catastrophic chassis warpage risk by redesigning stamping features and adding structural ribs, validating the solution for high-volume progressive die tooling.
- [ ] **Directed** the transition of engineering assets from the cancelled "UltimateTV" program to the Microsoft Xbox division, redesigning EMI liners and HDD carriers for the console.
- [ ] **Managed** a complex multi-vendor supply chain (E-M Solutions, Sputnik, NT Vision) to deliver functional mechanical prototypes for executive review in under 4 weeks.

#### V. VISUAL EVIDENCE

- `model-iso.jpg` (CFD Thermal simulation model)
- `tempxz.jpg` (Heat map of the 150W load distribution)
- `Base_Proto_Deviations.jpg` (Markup of manufacturing defects)
- `Galaxy Mechanical Design Hitlist 7-27.doc` (The defect tracking log)

#### VI. THE CAST (Team & Stakeholders)

**Core Team:**

- **Erik Lincicum (Norris):** Lead Mechanical Engineer (Mechanistic).
- **Roy Askeland:** Engineering Manager / WebTV (Microsoft). Primary client contact.
- **Frank Salinas:** Hardware Systems Engineer / WebTV.
- **Leslie Leland:** Product Design Manager / WebTV.

**Partners:**

- **Shelly Evans:** NPI Manager / E-M Solutions.
- **Avijit Goswami:** Thermal Consultant / Applied Thermal Technologies.

---

### Thermal Forensic Comparison: SC48 vs. WebTV Galaxy

**Forensic Audit of Thermal Thresholds and System Stabilization.**

| Feature                 | Project SC48 (Lux)                 | Project WebTV (Galaxy)               |
| ----------------------- | ---------------------------------- | ------------------------------------ |
| **Component**           | Kontron 986LCD-M (Embedded PC)     | AMD K7 CPU + Triple Tuners           |
| **Total Thermal Load**  | High-Density DSP + XPe Host        | **150W TDP** (Desktop Class)         |
| **The "Heat Wall"**     | **75.0°C** (Catastrophic Shutdown) | **84.0°C** (Thermal Equilibrium)     |
| **Thermal Delta (t)**   | Stabilized at 22.6°C Rise          | High-Pressure Directed Conduction    |
| **Failure Mode**        | System OS Halt / Log Error         | Media Corruption (Smart Card @ 55°C) |
| **Mechanical Fix**      | Folded Steel "I-Beam" Spine        | Chassis Partition / 28.3 CFM Tunnel  |
| **Material Constraint** | sub-$15k CoGS (No Extrusions)      | 300mm Footprint (Consumer STB)       |

#### CONTRAST ANALYSIS: THE 75°C vs. 84°C DELTA

- **The SC48 Failure (The Shutdown):** The 75°C reading was a **binary failure point**. Due to the XPe architecture and standard PC protection protocols, breaching 75°C triggered an emergency system shutdown to prevent component damage. The failure was architectural: ID mandated side-intake only in a sealed 4U box, creating a thermal dead zone for the motherboard.
- **The Galaxy Stabilization (The High-Bar):** In contrast, 84.0°C on the Galaxy AMD K7 was a **managed victory**. While higher than the SC48 failure point, this temperature represented the stabilized junction point within the manufacturer's operating specification for a high-performance 150W chip. The "Crisis" was not the CPU temperature itself, but the radiation of that heat into the Smart Card Reader (55°C), which threatened data integrity.

## III. THE FORENSIC DOSSIER (2026 Deep Dive)

### Galaxy Forensic Report

#### I. PROJECT SUMMARY

- **Role:** Principal Mechanical Architect / Proprietor (Mechanistic).
- **Mandate:** Architect the "Technology Showcase" Home Network Gateway for WebTV/Microsoft. The objective: Integrate desktop-class computing power—specifically a high-heat **AMD K7 CPU**, three satellite tuners, and dual HDDs—into a consumer electronics set-top box form factor.
- **Core Achievement:** Engineered a chassis architecture capable of dissipating a critical **150W thermal load** within a constrained 300mm footprint at **45°C ambient**, preventing component meltdown while maintaining mass-production feasibility prior to the division's consolidation into Xbox.

#### II. THE ANATOMY OF FAILURE (Heuristic Analysis)

_Discovery Heuristics applied to the "Galaxy Mechanical Design Hitlist" and thermal simulation logs._

- **The Trigger (Crisis):**
  - **Thermal Wall:** CFD simulations confirmed the AMD K7 and triple-tuner architecture generated **150W** of power. Initial form factors failed; the **CPU junction temperature** spiked to **84.0°C**, and the Smart Card Reader sat in a thermal dead zone, hitting **55.0°C**—a critical failure point for media integrity.
  - **Yield Crisis:** Fabrication vendor D&D Manufacturing flagged a fatal flaw in the stamping design. The density of "drawn standoffs" specified for the motherboard created excessive material stress, causing the sheet metal base to **warp** during the stamping process, threatening yield and PCB alignment.
  - **The "Impossible Assembly":** The CPU "puck" assembly could not be installed into the chassis as a pre-assembled unit due to fastener interference with the fixed partition, halting the "DEV" build sequence.

- **The Intervention (Fix):**
  - **Thermal Architecture:** I forced a chassis depth expansion to **300mm** to support a high-velocity airflow tunnel. I specified a **50x60x30mm extruded heatsink** and a Delta fan (2700 RPM) to drive **28.3 CFM** of airflow, directing intake over the HDDs and exhaust through the PSU.
  - **Structural ECOs:** Replaced drawn standoffs with "Hook 29" details and added strengthening ribs to arrest base warpage.
  - **Modular Redesign:** Decomposed the CPU enclosure into sub-components for _in-situ_ assembly and implemented **12.5mm hex hole patterns** and continuous EMI flanges to restore RF containment.

- **The Result (Impact):**
  - **Stabilization:** Reduced critical Smart Card local ambient temperature to **<55°C** and stabilized CPU junction temperature at 84.0°C.
  - **Yield Recovery:** Resolved **100%** of critical chassis warpage defects prior to high-volume progressive die tooling release.
  - **Production Velocity:** Salvaged the manufacturing schedule by personally coordinating **4-day "quick turn"** fabrication cycles during critical vendor shutdowns.

#### III. GOVERNANCE & RHYTHM

- **The Pulse:** Project execution followed a high-velocity "Mercenary Rhythm." I managed the entire mechanical database as a solo consultant, coordinating with WebTV stakeholders (Roy Askeland, Frank Salinas) via **Weekly "Hitlist"** reviews to track and kill 30+ blocking defects per cycle.
- **The Artifacts:**
  - **Galaxy Mechanical Design Hitlist:** A living punch list tracking "AC connector misalignment," "EMI flange gaps," and "thermal partition" failures.
  - **Thermal Simulation Logs:** Iterative CFD reports from Applied Thermal Technologies validating the 150W dissipation strategy.
  - **Invoices:** Bi-weekly documentation of a **$14,200/month** burn rate for solo engineering services.

#### IV. LINKEDIN ARTIFACTS (The Numbers)

- Engineered a high-performance thermal architecture dissipating **150 Watts** of power within a consumer acoustic envelope.
- Generated **28.3 CFM** of directed system airflow through custom chassis partitioning and vent optimization.
- Resolved **100%** of critical chassis warpage defects by redesigning stamping features and integrating structural ribs.
- Managed a **$14,200/month** engineering workload, simultaneously driving Galaxy, Mercury, and Xbox deliverables.
- Coordinated **4-day** quick-turn fabrication cycles during critical vendor shutdowns to salvage prototype schedules.

#### V. VISUAL EVIDENCE

- `model-iso.jpg` (CFD Thermal Simulation Model)
- `tempxz.jpg` (Heat Map showing 150W load distribution)
- `Base_Proto_Deviations.jpg` (QA Redlines of manufacturing defects)
- `Galaxy Mechanical Design Hitlist 7-27.doc` (Defect Tracking Log)
- `cpu_06_26_01.zip` (Pro/E Master Assembly of the CPU "Puck")

### Galaxy Forensic Report: Technical Failure Analysis

#### I. THERMAL DENSITY CRISIS (The 150W Wall)

The primary engineering constraint was the integration of desktop-class computing architecture into a consumer set-top box form factor. The system generated a **150W Total Power Load**, driven by the **AMD K7 CPU** and triple-tuner array.

- **The "Oven" Test:** CFD simulations (Applied Thermal Technologies) revealed critical component failures. The **CPU junction temperature** spiked to **84.0°C**, pushing the limits of the silicon.
- **The Smart Card Dead Zone:** A critical hotspot formed around the Smart Card reader, reaching **55.0°C** ambient air temperature. This threatened to warp or destroy user media, necessitating immediate component relocation closer to the inlet vents.
- **The Fix:** The chassis depth was forced to expand to **300mm** to accommodate a directed airflow tunnel. I specified a **50x60x30mm extruded heatsink** and a high-velocity **Delta fan (2700 RPM)** to drive **28.3 CFM** of airflow, prioritizing intake over the dual Quantum Fireball HDDs.

#### II. MECHANICAL YIELD & STRUCTURAL FAILURE

Fabrication validation revealed fatal flaws in the sheet metal stamping strategy that threatened mass production yield.

- **The Warped Base:** Vendor D&D Manufacturing flagged the density of "drawn standoffs" (integral motherboard mounts) as a yield killer. The stamping process introduced excessive material stress, causing the **0.91mm CRS chassis base** to warp, preventing a flat PCB interface.
- **The Intervention:** I executed a redesign of the chassis floor, replacing drawn standoffs with "Hook 29" details and integrating **strengthening ribs** to arrest material distortion during progressive die stamping.
- **EMI Containment:** The chassis cover exhibited flexing, breaking the electromagnetic interference (EMI) seal. The design was updated to include sheet metal interlocks (tabs/spoons) and continuous EMI flanges on the CPU cover to ensure grounding contact with the PCB metal pattern.

#### III. ASSEMBLY & INTEGRATION FRICTION

The transition from "Mercury" legacy architecture to the "Galaxy" layout introduced geometric conflicts that halted the "DEV" build sequence.

- **The "Impossible" Assembly:** The **CPU "Puck"** sub-assembly could not be installed into the chassis as a pre-assembled unit due to fastener interference with the fixed air partition. The unit was geometrically locked out of the enclosure.
- **The Fix:** I decomposed the CPU enclosure into modular sub-components for _in-situ_ assembly, resolving the interference while maintaining RF containment via **12.5mm hex hole patterns**.
- **Power Supply Collision:** The draw for the power supply air inlet physically interfered with the CPU assembly, requiring a re-tooling of the partition geometry to eliminate the collision.

#### IV. SUPPLY CHAIN VOLATILITY

Engineering execution occurred during a period of extreme vendor instability.

- **The Shutdown:** Key fabrication partner **E-M Solutions** faced a company-wide shutdown during the critical prototype phase.
- **The Response:** I personally coordinated **4-day "quick turn"** fabrication cycles, bypassing standard queues to salvage the prototype schedule despite the vendor's operational paralysis.

### Galaxy Forensic Report: Thermal Architecture Impact Analysis

#### I. THERMAL TRIGGER

**The Load:** Integration of the **AMD K7 (Thunderbird) CPU** and a triple-tuner array generated a **150W Total Power Load**.
**The Crisis:** Initial form factors (based on the "Mercury" legacy chassis) failed completely. CFD simulations by Applied Thermal Technologies revealed:

- **CPU Junction Temp:** Spiked to **84.0°C**.
- **Smart Card Dead Zone:** Local ambient air temps reached **55.0°C** around the Smart Card reader, threatening media integrity.
- **Nemo Case Temp:** Reached **89.3°C**.

#### II. ARCHITECTURAL MUTATION (The 150W Impact)

The 150W load forced a departure from standard consumer electronics dimensions, dictating a "form follows heat flux" architecture.

1.  **Chassis Hypertrophy:** The chassis depth was forcibly increased to **300mm**. This was not an aesthetic choice; it was a thermodynamic necessity to create sufficient volume for a high-velocity airflow tunnel.
2.  **Hexagonal Venting:** Standard perforation patterns were rejected in favor of a **hexagonal hole pattern** (4mm holes). This maximized the open area ratio for airflow intake and exhaust while maintaining just enough material structure for EMI shielding.
3.  **The Directed Airflow Tunnel:** To reject 150W at 45°C ambient, system required **28.3 CFM** of active airflow. The Hard Drive mounting bracket was re-engineered to double as a structural **air partition**, forcing intake air to flow over the dual Quantum Fireball HDDs before channeling it into the high-heat zones.
4.  **Active Propulsion:** A high-performance **Delta fan (2700 RPM, 37dB)** was specified to drive the pressure differential.
5.  **The CPU "Puck" & Heatsink:** A custom **50x60x30mm extruded heatsink** was engineered to fit within the EMI cage. The large "Puck" had to be decomposed into modular sub-components for _in-situ_ assembly.

#### III. COMPONENT RELOCATION

- **Smart Card Evacuation:** The Smart Card reader was physically relocated closer to the **inlet vents** to escape the 55°C thermal dead zone.
- **Power Supply Ducting:** The draw for the power supply air inlet was redrawn to eliminate interference with the CPU assembly.

### Galaxy Forensic Report: Mechanistic / WebTV Collaboration

#### I. PROJECT SUMMARY

- **Role:** Principal Mechanical Architect (Mechanistic).
- **Mandate:** Serve as the high-velocity external engineering organ for WebTV Networks (Microsoft). The objective: Architect the physical form of the "Galaxy" Home Gateway, integrating a desktop-class **150W thermal load** into a consumer electronics enclosure.
- **Core Achievement:** Orchestrated the mechanical design release for "Galaxy" prototypes, resolving critical thermal and EMI architecture blocks under a solo-consultant mandate, effectively acting as the entire mechanical engineering department for the project.

#### II. THE ANATOMY OF FAILURE (Heuristic Analysis)

_Collaboration was not a partnership; it was a series of crisis interventions driven by the "Mechanical Design Hitlist."_

- **Integration Friction (Data Control):** The project initially suffered from "version control chaos" due to disparate communication channels with vendors (E-M Solutions, Sputnik).
  - **The Fix:** Frank Salinas (WebTV Hardware Systems) and I enforced a **centralized FTP protocol** (`share.webtv.net`) to act as the single source of truth for the Pro/ENGINEER database, eliminating 14 different methods of data transfer.
- **Thermal Crisis Response:** Collaboration was driven by thermodynamic failure. Avijit Goswami (Applied Thermal Technologies) provided CFD data indicating component meltdown (**84.0°C CPU**, **55.0°C Smart Card**). I translated these simulations into physical geometry—forcing a chassis depth expansion to 300mm and integrating a directed airflow tunnel—to scour heat from the enclosure.
- **Supply Chain Triage:** When standard fabrication queues threatened the "DEV 2.1" schedule, I coordinated directly with **Shelly Evans** (NPI Manager, E-M Solutions). We executed **4-day "quick turn"** fabrication cycles, bypassing standard lead times even during a historic company-wide vendor shutdown.

#### III. GOVERNANCE & RHYTHM

- **The Pulse:** I established a **"Mercenary Rhythm"** of weekly status reports and Thursday design reviews (2:00 PM, SVC-2) to synchronize cross-functional teams (ID, Thermal, EE). This was operational triage, not standard management.
- **The Artifacts:**
  - **The Hitlist:** Maintained a living "Galaxy Mechanical Design Hitlist" to track and kill critical blocking issues (e.g., "AC connector misalignment," "EMI flange gaps," and "thermal partition" failures.
  - **The BOM:** Co-developed the mechanical Bill of Materials with WebTV release engineers (Keva Nelson, Joan Strickland), assigning part numbers and managing "Agile" system entries to transition from prototype to production.

#### IV. LINKEDIN ARTIFACTS (The Numbers)

- **Managed** a **$14,200/month** engineering burn rate, simultaneously driving Galaxy, Mercury, and Xbox deliverables as a solo consultant.
- **Enforced** a centralized FTP data protocol to synchronize engineering files across **4+** distributed stakeholders (WebTV, Mechanistic, E-M, NewDealDesign).
- **Coordinated** **4-day** "quick turn" fabrication cycles with vendor E-M Solutions to bypass standard lead times during critical shutdowns.
- **Resolved** **100%** of chassis warpage defects by redesigning stamping features in collaboration with D&D Manufacturing.
- **Engineered** the mechanical integration of a **150W TDP** system, translating CFD thermal data into a manufacturable steel chassis.

#### V. VISUAL EVIDENCE

- `Galaxy Mechanical Design Hitlist 7-27.doc` (The governance artifact).
- `cpu_06_26_01.zip` (The Pro/E Master Assembly shared via FTP).
- `Base_Proto_Deviations.jpg` (QA Redlines confirming the "Hitlist" process).

### Forensic Report: Post-Mortem & Transition (Galaxy to Xbox)

#### I. PROJECT SUMMARY

- **Role:** Principal Mechanical Architect (Mechanistic).
- **Mandate:** Execute the **"End of Life"** protocol for the Galaxy/UltimateTV program and pivot engineering assets to the **Xbox Console** division.
- **Core Achievement:** Salvaged the mechanical engineering lineage of the Galaxy program by immediately transitioning into "Redesign" operations for the Xbox, specifically targeting EMI containment and storage integration failures.

#### II. THE ANATOMY OF FAILURE (The Strategic Pivot)

_The "Galaxy" did not fail mechanically; it failed strategically. The corporate objective shifted from the "Cable Box" to the "Console."_

- **The Collapse (Restructuring):** On **January 24, 2002**, I confirmed "harsh restructuring" and layoffs within UltimateTV. The division was effectively dissolved, and the mechanical engineering team was consolidated into Microsoft's **"eHome"** group.
- **The Verdict:** By February 2002, the strategic reality was undeniable: "Microsoft has (surprise) chosen the PC in general and the gaming console platform specifically rather than the 'cable TV box'". The Xbox became "THE one to watch" as the bridge product for the digital living room.
- **The "Zombie" Hardware:** Attempts were made to downsize the Galaxy architecture into a "Mercury LC" (Low Cost) or "MiniMerc" form factor using 2.5" laptop drives, but these efforts were ultimately abandoned in favor of the console.

#### III. GOVERNANCE & RHYTHM (The Xbox Pivot)

_Governance shifted immediately from "Satellite Gateway" deliverables to "Console Cost-Down" operations._

- **The Pulse:** The weekly "Galaxy Hitlist" was replaced by **Xbox Redesign Invoices**. By **March 18, 2002**, I was billing Microsoft directly for "xbox redesign work".
- **The Artifacts:**
  - **Xbox EMI Redesign:** I re-engineered the top and bottom **EMI liners** for the Xbox to eliminate plastic pans and modify shielding features.
  - **Storage Bridge:** I designed a "bridge-type" carrier to integrate the DVD and Hard Drive cabling and airflow, applying the thermal density lessons learned from Galaxy.
  - **Tuscany Power Supply:** I modified the Xbox bottom case, EMI shield, and HDD bracket to accommodate the new "Tuscany" power supply, replacing insulators with a plastic isolation box.

#### IV. LINKEDIN ARTIFACTS (The Numbers)

- **Directed** the transition of engineering assets from the cancelled UltimateTV program to the Microsoft Xbox division.
- **Redesigned** Xbox EMI liners and HDD carriers, delivering functional part files for prototyping within **50 hours**.
- **Engineered** mechanical modifications for the "Tuscany" power supply integration, eliminating insulator parts to reduce BOM count.
- **Identified** and removed **3** non-contacting EMI fingers from the Xbox top cover to optimize stamping yield.
- **Managed** a **$4,000** purchase order specifically for Xbox bottom case and HDD bracket modifications.

#### V. VISUAL EVIDENCE

- `xbo_wni_001.xls` (The smoking gun invoice confirming the Xbox transition).
- `xbox_04_08_02.zip` (The master CAD database for the Xbox EMI liner redesign).
- `XBoxTopCoverModification.jpg` (Visual confirmation of EMI finger removal).

### Appendix: Forensic Artifacts

**The "Hook 29" Detail:**
Based on the forensic engineering logs and vendor correspondence regarding the Galaxy project, the **"Hook 29"** details were a specific sheet metal forming feature utilized to resolve a critical yield crisis in the chassis base.

- **The Failure (Drawn Standoffs):** The original design specified "drawn standoffs" which caused the chassis base to **warp** during stamping due to material stress.
- **The Fix (Hook 29):** The "Hook 29" detail (lancing/bridging) relieved surface tension, eliminating the warpage condition, but required added **strengthening ribs** to restore rigidity.

**The CPU "Puck" Sub-Assembly:**

- **The Trigger:** Near-interference with fixed air partition prevented drop-in assembly.
- **The Fix:** I decomposed the "Puck" from a sealed box into a **modular clam-shell assembly** designed for _in-situ_ construction. This involved a **1.0mm SPTE Top Cover** (Rigidity/EMI) and a **0.40mm SPTE Bottom Cover** (Ground Plane), secured with continuous flanges and a **12.5mm hex** EMI pattern.

**Smart Card Relocation:**

- **The Trigger:** Smart Card Reader reached **55.0°C** ("Thermal Dead Zone") in the exhaust path.
- **The Fix:** Relocated upstream to the **inlet vent** (45°C ambient), requiring a modification to the internal "non-metal partition".

**Fan Acoustics:**

- **The Reality:** The **Delta fan** ran at **2700 RPM**, generating **37 dB**.
- **The Trade-off:** Silence was sacrificed for **28.3 CFM** airflow to stabilize the 150W load.