# Digidesign Console Portfolio (Buckley, Danko, Curtis, Lux) Intelligence Bolus

> **Source:** NotebookLM
> **Extracted:** 2026-01-01

## I. PROJECT SUMMARY

- **Role:** Lead Mechanical Engineer / Industrial Designer
- **Timeline:** 2002 – 2008
- **Objective:** To architect and deliver the mechanical systems for Digidesign's premier line of professional audio mixing consoles (D-Control, D-Command, C|24, SC48) under strict aesthetic and thermal requirements.
- **Core Achievement:** I personally engineered and released over 113 unique mechanical parts into production, successfully transitioning the department from local fabrication to high-volume offshore manufacturing (VTech/Jetcrown) while maintaining "Class A" cosmetic standards.

## II. THE CAST (Team & Stakeholders)

**Internal Team**

- **Neal Breitbarth**: ID/Mechanical Manager (My direct report; provided air cover on budget/schedule).
- **Terri Merrell**: Senior Buyer/Planner (The critical link to vendors; managed the POs).
- **Marc Schuman**: Hardware Engineering Lead (EE counterpart; primary collaborator on PCB/Mech integration).
- **Mary Carnero / Mary O'Callaghan**: KMS/Quality (Managed the ECO/Deviation process).
- **Stan Cotey**: Product Marketing (Defined the "look and feel" requirements).

**External Partners**

- **Fidel Saucedo & Ed Stegall**: Mass Precision (Primary domestic sheet metal vendor).
- **Jason**: PPI Plastics (Domestic injection molding/finishing).
- **Roger Lau & "Ruby"**: Jetcrown/Kwanasia (Offshore manufacturing partners).

## III. CRITICAL MECHANICAL INTERVENTIONS (Ranked STAR Stories)

### 1. The "Ghost Dimension" Protocol Failure (Project Danko)

- **The Trigger:** Mass Precision halted fabrication on the "B-Mid Rails" because their wireframe software read the part length as **84.478”**, while my 3D model specification was **82.83”**.
- **The Tension:** Critical structural rails for the console stand were at risk of being manufactured 1.6 inches too long, which would have scrapped the entire run and stalled the assembly line.
- **The Intervention:** I diagnosed a specific Pro/ENGINEER CAD failure where the model had not been "regenerated" prior to export. I forced a regeneration of the geometry, validated the database integrity, and re-issued the files to match the manufacturing print.
- **The Result:** Prevented the fabrication of scrap metal; manufacturing proceeded with the correct **82.83”** specification.

### 2. The "End Cap" Yield Crisis (Project Buckley)

- **The Trigger:** The cosmetic "End Caps" (P/N 944011674-00) were failing incoming inspection at catastrophic rates due to warping and bonding issues. Yield dropped to **5 acceptable sets out of 10**.
- **The Tension:** Shipment of the flagship D-Control console was halted because we could not assemble the side panels without cracking them or accepting large cosmetic gaps.
- **The Intervention:** I conducted a post-mortem and authored **ECO 6310**. I modified the interference fit by increasing the mounting hole diameter from **0.20” to 0.25”** and the boss diameter from **0.37” to 0.25”**, and increased boss height by **0.050”** to relieve assembly stress.
- **The Result:** Yields improved immediately, allowing us to clear the backlog of unshippable consoles without scrapping the expensive tooling.

### 3. The Power Supply Integration (Project Danko)

- **The Trigger:** A new power supply (DGN-Z15J) was required for the unit, but its mounting points interfered with the existing chassis PEMs (standoffs).
- **The Tension:** Redesigning the sheet metal chassis would require scrapping existing inventory and re-tooling.
- **The Intervention:** I negotiated a mechanical modification to the Power Supply PCB itself. I authorized a **$6,000 NRE** (Non-Recurring Engineering) charge to add four **0.3” diameter keep-out zones** on the bottom of the PCB to clear the chassis hardware.
- **The Result:** Allowed the new power supply to be retrofitted into the existing chassis design, saving the project schedule and metal inventory.

### 4. The "Warped Pan" Rejection (Project Danko)

- **The Trigger:** The main fader pans (sheet metal chassis) were arriving twisted. I inspected the first **42 units** and rejected **over 50%** due to flatness issues.
- **The Tension:** Installers were forced to "squeeze and pray" to align the units, or shim the feet, which was unacceptable for a premium product.
- **The Intervention:** I instigated **Deviation 8429** to document the spacing issues and authorized a formal rework procedure. I coordinated with Mass Precision to adjust the break angles and tooling.
- **The Result:** Restored assembly line flow and eliminated the need for field shimming in subsequent runs.

## IV. LINKEDIN / RESUME ARTIFACTS

- [ ] Engineered and released over **113 unique mechanical parts** (plastic and sheet metal) for the D-Control and D-Command console lines [Part Count Analysis].
- [ ] Solved a critical 50% yield failure on flagship console plastics by authoring **ECO 6310**, modifying geometric tolerances to eliminate assembly stress cracking.
- [ ] Negotiated a **$6,000** PCB modification to avoid a costly chassis re-tooling, saving weeks of schedule slippage on the D-Command launch.
- [ ] Managed the mechanical transition of the C|24 product line to offshore manufacturing (VTech), releasing **15+** complex sheet metal fabrication drawings in a single campaign (ECO 12263).
- [ ] Designed the "Lux" (SC48) thermal management system, utilizing a 3-fan array to maintain CPU temps below the **75°C** shutdown threshold during stress testing [Exhibit Hall 1].

## V. TECHNICAL STACK & GOVERNANCE

- **Tools:** Pro/ENGINEER Wildfire (Advanced Assembly Extension), Pro/INTRALINK 3.4 to 8.0 migration, Agile (Ask), SAP.
- **Partners:** Mass Precision (Sheet Metal), PPI Plastics (Injection Molding), Jetcrown/VTech (Offshore Turnkey), Cycle Start (Prototyping).
- **Governance:**
  - **ECO 6310:** Plastic tolerance modification.
  - **ECO 12263:** Massive C24 Sheetmetal Release to VTech.
  - **Deviation 8429:** Fader Spacing Rework authorization.
  - **MRB #1355:** Rejection of non-conforming back panels.

## VI. CITATIONS & VISUALS (The BUD Input)

- **Visuals:**
  - `9420-55107-01_REV_2_Master.pdf` (Back panel artwork/metal integration).
  - `PCII_CONFIGS.pdf` (The modular stand configuration drawing I created).
  - `DANKO_MAIN_STRUCTURE_REV2.pdf` (The product structure tree I managed).
- **Quotes:**
  - _"We strapped and squeezed and pressed and prayed - finally we put shims under the feet to 'hold it together'."_ — Feedback on the warped pans I solved.
  - _"Figure it out why until “REGENERATE” button was pushed. After regenerate button was pushed, the length changed to 82.83”."_ — The "Ghost Dimension" discovery.
  - _"I’m not sure if you are worried just about complete units or individual boards, but remember that we are scrapping out the current Fader Top boards... "_ — Evidence of the fast-moving engineering environment.
