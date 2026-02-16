# Galaxy Forensic Report

## I. PROJECT SUMMARY

- **Role:** Principal Mechanical Architect / Proprietor (Mechanistic).
- **Mandate:** Architect the "Technology Showcase" Home Network Gateway for WebTV/Microsoft. The objective: Integrate desktop-class computing power—specifically a high-heat **AMD K7 CPU**, three satellite tuners, and dual HDDs—into a consumer electronics set-top box form factor.
- **Core Achievement:** Engineered a chassis architecture capable of dissipating a critical **150W thermal load** within a constrained 300mm footprint at **45°C ambient**, preventing component meltdown while maintaining mass-production feasibility prior to the division's consolidation into Xbox.

## II. THE ANATOMY OF FAILURE (Heuristic Analysis)

_Discovery Heuristics applied to the "Galaxy Mechanical Design Hitlist" and thermal simulation logs._

- **Thermal/Mechanical Crisis:**
  - **The Heat Wall:** CFD simulations confirmed the AMD K7 and triple-tuner architecture generated **150W** of power. Initial "Mercury-like" form factors failed; the **CPU junction temperature** spiked to **84.0°C**, and the Smart Card Reader sat in a thermal dead zone, hitting **55.0°C**—a critical failure point for media integrity.
  - **The Warpage:** Fabrication vendor D&D Manufacturing flagged a fatal flaw in the stamping design. The density of "drawn standoffs" specified for the motherboard created excessive material stress, causing the sheet metal base to **warp** during the stamping process, threatening yield and PCB alignment.
  - **The "Impossible Assembly":** The CPU "puck" assembly could not be installed into the chassis as a pre-assembled unit due to fastener interference with the fixed partition, halting the "DEV" build sequence.

- **Quality/Supply Chain Friction:**
  - **Vendor Shutdowns:** Critical fabrication partner E-M Solutions faced a company-wide shutdown; I had to personally coordinate **4-day "quick turn"** fabrication cycles to salvage the prototype schedule.
  - **EMI Leaks:** The chassis cover exhibited flexing, breaking the EMI seal. Early designs relied on unreliable interference tabs rather than continuous contact flanges.

- **The Fix:**
  - **Thermal Architecture:** I forced a chassis depth expansion to **300mm** to support a high-velocity airflow tunnel. I specified a **50x60x30mm extruded heatsink** and a Delta fan (2700 RPM) to drive **28.3 CFM** of airflow, directing intake over the HDDs and exhaust through the PSU.
  - **Structural ECOs:** Replaced drawn standoffs with "Hook 29" details and added strengthening ribs to arrest base warpage.
  - **Modular Redesign:** Decomposed the CPU enclosure into sub-components for _in-situ_ assembly and implemented **12.5mm hex hole patterns** and continuous EMI flanges to restore RF containment.

## III. GOVERNANCE & RHYTHM

- **The Pulse:**
  - Project execution followed a high-velocity "Mercenary Rhythm." I managed the entire mechanical database as a solo consultant, coordinating with WebTV stakeholders (Roy Askeland, Frank Salinas) via **Weekly "Hitlist"** reviews to track and kill 30+ blocking defects per cycle.
  - Data control was enforced through a centralized FTP hub (`ftp.mechanistic.com` / `share.webtv.net`) to eliminate version control chaos across distributed vendors.

- **The Artifacts:**
  - **Galaxy Mechanical Design Hitlist:** A living punch list tracking "AC connector misalignment," "EMI flange gaps," and "thermal partition" failures.
  - **Thermal Simulation Logs:** Iterative CFD reports from Applied Thermal Technologies validating the 150W dissipation strategy.
  - **Invoices:** Bi-weekly documentation of a **$14,200/month** burn rate for solo engineering services.

## IV. LINKEDIN ARTIFACTS (The Numbers)

- Engineered a high-performance thermal architecture dissipating **150 Watts** of power within a consumer acoustic envelope.
- Generated **28.3 CFM** of directed system airflow through custom chassis partitioning and vent optimization.
- Resolved **100%** of critical chassis warpage defects by redesigning stamping features and integrating structural ribs for progressive die tooling.
- Managed a **$14,000/month** engineering workload, simultaneously driving Galaxy, Mercury, and Xbox deliverables.
- Salvaged the manufacturing schedule by coordinating **4-day** quick-turn fabrication cycles during critical vendor shutdowns.

## V. VISUAL EVIDENCE

- `model-iso.jpg` / `tempxz.jpg` (CFD Thermal Simulation & Heat Map).
- `Base_Proto_Deviations.jpg` (QA Redlines of manufacturing defects).
- `Galaxy Mechanical Design Hitlist 7-27.doc` (Defect Tracking Log).
- `cpu_06_26_01.zip` (Pro/E Master Assembly of the CPU "Puck").
