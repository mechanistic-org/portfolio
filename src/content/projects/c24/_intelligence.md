# C|24 ("Curtis") Intelligence Bolus

> **Source:** NotebookLM
> **Extracted:** 2025-12-22

## I. PROJECT SUMMARY

- **Role:** Mechanical Engineering Lead / Industrial Design Lead
- **Timeline:** 2005 (Concept) – November 2007 (FCS)
- **Objective:** Replace the legacy Control|24 with a modernized, RoHS-compliant, low-profile control surface that eliminates the Focusrite royalty while adding 5.1 monitoring and improving manufacturability.
- **Core Achievement:** Orchestrated the mechanical integration of 19 PCBs into a constrained chassis and salvaged a critical Pilot build by engineering a custom "Vertical Hanging" fixture solution for warped plastic components, ensuring a November 2007 launch.

## II. THE CAST (Team & Stakeholders)

**Internal: Digidesign / Avid**

- **Neal Breitbarth**: Mechanical/ID Lead (Peer review, ID support)
- **Mark Sires**: Senior Mechanical Engineer (Sheet metal, RoHS compliance)
- **Robin Parnaby**: Hardware Engineering Lead (Primary electrical counterpart)
- **David Anthony**: Hardware Engineer (PSU, connectors, encoders)
- **Michael Moskowitz**: Program Manager (Schedule, Phase Exits)
- **Matt Cho**: Program Manager (Vendor logistics)
- **Greg Westall**: Product Marketing (Feature definitions)
- **Stan Cotey**: Product Manager (Surface layout, graphics)
- **Kerwin Yuen**: Manufacturing Engineer (Pilot build lead)
- **Ed Bangert**: Manufacturing Engineer (Legacy parts, RoHS)
- **Ping Zhang**: Manufacturing Engineer (Documentation, CAD database)
- **Terri Merrell**: Senior Buyer/Planner (Vendor quotes, BOMs)
- **Franco Piccininni**: PCB Design (Auto/Fader layouts)
- **Greg Vieyra**: PCB Design (MicPre, SubMix layouts)
- **Jose Perez**: PCB Design (Comm, Monitor layouts)

**External: Global Supply Chain**

- **Henry Lee**: Project Management, VTech/Kenny (China)
- **Ben Ho**: Mechanical Engineering, VTech/Kenny (China)
- **Lucy Liu**: Project Management, VTech (China)
- **ZW**: Engineering, Jetcrown (Plastics/Painting, China)
- **Ed Stegall**: Project Manager, Mass Precision (Domestic Sheet Metal)
- **Fidel Saucedo**: Programming, Mass Precision

## III. CRITICAL MECHANICAL INTERVENTIONS (Ranked STAR Stories)

### 1. The Side Cap "Banana" Defect (Thermal Warping)

- **The Trigger:** During the Pilot build, the large ABS "Side Cap" parts (9440-55165/166) arrived with severe bowing (>2.50mm deviation) and twist, failing to mate with the sheet metal chassis.
- **The Tension:** The defect was caused by the high heat required to cure the "Rubberized Soft Paint" (Spectral Master DS-022). The vendor's standard flat-rack curing method caused the plastic to sag and lock into a warped shape, threatening to scrap the entire cosmetic yield for launch.
- **The Intervention:** I rejected the vendor's (Jetcrown) attempt to use simple support blocks. I engineered and approved "Method A," a **Vertical Hanging Fixture** protocol. By hanging the parts vertically during the bake cycle, we used gravity to pull the parts straight during the cure, rather than allowing them to sag.
- **The Result:** Reduced flatness deviation to acceptable limits (<0.5mm), allowing the parts to fit the chassis and saving the Pilot schedule. This process was formalized in ECO 12740.

### 2. The "No-Bid" Sheet Metal Crisis

- **The Trigger:** The primary overseas contract manufacturer (VTech/Kwanta) issued a "no-bid" on the main Top Panel (9420-55105-00) due to the extreme density of welded standoffs and tight tolerances required for the 24-channel strip.
- **The Tension:** Without the top panel, the entire production line would stall. The vendor claimed the part was unmanufacturable with their current automation.
- **The Intervention:** I implemented a dual-sourcing strategy. I engaged **Mass Precision** (San Jose) to fabricate emergency sheet metal for the Proto 3 and Pilot builds to keep the line moving. Simultaneously, I negotiated a manual welding process with the overseas vendor (Kenny) to bridge the gap until their automatic fastener machine was online.
- **The Result:** We successfully built Pilot units using the domestic bridge run, and I later qualified the overseas process, driving tooling costs down from $40,770 to $34,860 through DFM negotiations.

### 3. Headphone Jack Serviceability Fire Drill

- **The Trigger:** Late in the design phase, Customer Service flagged the headphone jack as a high-failure-rate component (4.8% legacy failure rate). The original design buried the jack, requiring the removal of the entire upper bolster and fader banks to replace it.
- **The Tension:** A field replacement would take hours, driving up warranty costs and user frustration.
- **The Intervention:** I executed an emergency redesign of the Sheet Metal Headphone Bracket (9420-55126-00) and the Plastic Front Bolster (9440-55167-00). I created a recess that allowed the jack to be serviced from the bottom/front by removing only a few screws, without tearing down the control surface.
- **The Result:** ECO 12993 was released to modify the mounting feature, drastically reducing Mean Time To Repair (MTTR) for this critical component.

### 4. The DCD (Data Control Drawing) Protocol

- **The Trigger:** The unit required integrating 19 distinct PCBs (MicPre, SubMix, Faders, Encoders) into a sleek, low-profile industrial design with zero margin for error.
- **The Tension:** "Wild west" file swapping was causing connector misalignments (e.g., MH5 interfering with routing on the SubMix IO).
- **The Intervention:** I enforced a strict **Data Control Drawing (DCD)** exchange protocol. I refused to accept layouts that didn't match my Released DCDs (e.g., 9150-55200 Rev 12). I personally reviewed every DXF feedback from the layout team to verify mounting holes and keep-outs before authorizing fabrication.
- **The Result:** Achieved mechanical-electrical fit on complex boards like the MicPre 8 I/O (which went through 12 DCD revisions), preventing costly board spins.

## IV. LINKEDIN / RESUME ARTIFACTS

- [ ] **Engineered** a custom "Vertical Hanging Fixture" manufacturing process to resolve critical thermal warping in painted ABS components, reducing flatness deviation from >2.50mm to <0.50mm and saving the Pilot build schedule.
- [ ] **Led** the mechanical architecture and integration of 19 distinct PCBs into a low-profile chassis, enforcing a Data Control Drawing (DCD) protocol that achieved 100% mechanical fit on the first physical build.
- [ ] **Managed** a complex global supply chain transition, dual-sourcing sheet metal fabrication between Silicon Valley and China to bridge a "no-bid" production gap, protecting the November 2007 launch date.
- [ ] **Negotiated** DFM improvements with overseas vendors that reduced sheet metal tooling costs by 14.5% (from $40,770 to $34,860) while maintaining Class A cosmetic standards.
- [ ] **Redesigned** the headphone jack assembly (ECO 12993) to enable bottom-access field serviceability, significantly reducing warranty repair labor time for a high-frequency failure component.

## V. TECHNICAL STACK & GOVERNANCE

- **Tools:**
  - **CAD:** Pro/Engineer Wildfire (Solid & Surface modeling).
  - **PDM:** Pro/Intralink 3.4 & 8.0 (Windchill) — Managed migration and user training.
  - **Exchange:** AutoCAD (DXF) for PCB interchange; Adobe Illustrator for Artwork.
- **Partners:**
  - **CM:** VTech (Primary Assembler) / Kenny (Sheet Metal).
  - **Plastics:** Jetcrown (Injection Molding & Painting).
  - **Sheet Metal:** Mass Precision (Domestic/Proto).
  - **Components:** Skynet (Power Supply), Varitronix (LCDs).
- **Governance:**
  - **ECO System:** Primary Originator for mechanical ECOs (e.g., ECO 12263 for Sheet Metal, ECO 12262 for Plastics).
  - **Knowledge Management:** Authored "General Modeling Guide" and hosted internal engineering intranet for standards compliance.

## VI. CITATIONS & VISUALS (The BUD Input)

- **Visuals:**
  - `944055165-166-00 baking fixture chg.xls` (Photos of the warping fix).
  - `C24_gap_check.pdf` (Photos of the side cap gap defect).
  - `proto-photos.pdf` (Images of the raw sheet metal chassis assembly).
  - `C_24_REV_3.2.pdf` (Final Industrial Design rendering).
  - `ALL_9420-in-one.pdf` (Comprehensive fabrication drawing package).

- **Quotes:**
  - _"We found 'C|24' , please confirm if '|' is needed"_ — VTech confirming the branding detail (Shows attention to detail in communication).
  - _"Also, we need the logo soon simply to make sure we fit it in correctly; eg. 'Curtis II' is longer than 'C24 II'"_ — Erik Norris (Shows ID/Branding constraints).
  - _"So, I assume with 'current C|24', you mean 'Control|24'? :)"_ — Arndt Hufenbach (Shows the legacy transition context).