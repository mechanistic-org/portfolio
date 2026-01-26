# C|24 ("Curtis") Forensic Report

**Source:** NotebookLM
**Extracted:** 2025-12-22

## I. PROJECT SUMMARY

- **Role:** Mechanical Engineering Lead / Industrial Design Lead
- **Objective:** Replace the legacy Control|24 with a modernized, RoHS-compliant, low-profile control surface ("Curtis") that eliminates the Focusrite royalty while adding 5.1 monitoring and improving manufacturability.
- **Core Achievement:** Orchestrated the mechanical integration of 19 PCBs into a constrained chassis and salvaged a critical Pilot build by engineering a custom "Vertical Hanging" fixture solution for warped plastic components, ensuring a November 2007 launch.

## II. THE CAST (Team & Stakeholders)

**Internal: Digidesign / Avid**

- **Erik Norris**: Mechanical Engineering Lead (Originator of ECOs, DCDs, and mechanical architecture).
- **Neal Breitbarth**: Mechanical/ID Lead (Industrial Design direction, thermal modeling).
- **Robin Parnaby**: Hardware Engineering Lead (Primary electrical counterpart, PCB architecture).
- **David Anthony**: Hardware Engineer (PSU, connectors, encoders).
- **Michael Moskowitz**: Program Manager (Schedule, Phase Exits, Resource allocation).
- **Matt Cho**: Program Manager (Vendor logistics, Tooling).
- **Greg Westall**: Product Marketing (Feature definitions, cost targets).
- **Stan Cotey**: Product Manager (Surface layout, graphics, user workflow).
- **Kerwin Yuen**: Manufacturing Engineer (Pilot build lead, DFM feedback).
- **Ed Bangert**: Manufacturing Engineer (Legacy parts, RoHS compliance).
- **Ping Zhang**: Manufacturing Engineer (Documentation, CAD database, Intralink).
- **Terri Merrell**: Senior Buyer/Planner (Vendor quotes, BOMs).
- **Franco Piccininni**: PCB Design (Auto/Fader/Encoder layouts).
- **Greg Vieyra**: PCB Design (MicPre, SubMix layouts).
- **Jose Perez**: PCB Design (Comm, Monitor layouts).
- **Marc Schuman**: Firmware Engineer (Display protocols).

**External: Global Supply Chain**

- **VTech (Kenny)**: Contract Manufacturer (Sheet Metal & Assembly) — Henry Lee, Ben Ho, Lucy Liu.
- **Jetcrown**: Plastics Injection Molding & Painting — ZW, Warren Man.
- **Mass Precision**: Domestic Sheet Metal (Proto/Bridge) — Ed Stegall, Fidel Saucedo.
- **Skynet**: Power Supply Vendor.

## III. CRITICAL MECHANICAL INTERVENTIONS (Ranked STAR Stories)

### 1. The Side Cap "Banana" Defect (Thermal Warping)

- **The Trigger:** During the Pilot build, the large ABS "Side Cap" parts (9440-55165/166) arrived with severe bowing (>2.50mm deviation) and twist, failing to mate with the sheet metal chassis.
- **The Tension:** The defect was caused by the high heat required to cure the "Rubberized Soft Paint" (Spectral Master DS-022). The vendor's standard flat-rack curing method caused the plastic to sag and lock into a warped shape, threatening to scrap the entire cosmetic yield for launch.
- **The Intervention:** I rejected the vendor's (Jetcrown) attempt to use simple support blocks ("Method B"). I engineered and approved "Method A," a **Vertical Hanging Fixture** protocol. By hanging the parts vertically during the bake cycle, we used gravity to pull the parts straight during the cure, rather than allowing them to sag.
- **The Result:** Reduced flatness deviation to acceptable limits (<0.5mm), allowing the parts to fit the chassis and saving the Pilot schedule. This process was formalized in ECO 12740.

### 2. The "No-Bid" Sheet Metal Crisis

- **The Trigger:** The primary overseas contract manufacturer (VTech/Kwanta) issued a "no-bid" on the main Top Panel (9420-55105-00) due to the extreme density of welded standoffs and tight tolerances required for the 24-channel strip.
- **The Tension:** Without the top panel, the entire production line would stall. The vendor claimed the part was unmanufacturable with their current automation.
- **The Intervention:** I implemented a dual-sourcing strategy. I engaged **Mass Precision** (San Jose) to fabricate emergency sheet metal for the Proto 3 and Pilot builds to keep the line moving. Simultaneously, I negotiated a manual welding process with the overseas vendor (Kenny) to bridge the gap until their automatic fastener machine was online.
- **The Result:** We successfully built Pilot units using the domestic bridge run, and I later qualified the overseas process, protecting the November 2007 launch date.

### 3. Headphone Jack Serviceability Fire Drill

- **The Trigger:** Late in the design phase, Customer Service flagged the headphone jack as a high-failure-rate component (4.8% legacy failure rate). The original design buried the jack, requiring the removal of the entire upper bolster and fader banks to replace it.
- **The Tension:** A field replacement would take hours, driving up warranty costs and user frustration. Manufacturing Engineering (Kerwin Yuen) escalated the concern as a critical FRU (Field Replaceable Unit) issue.
- **The Intervention:** I executed an emergency redesign of the Sheet Metal Headphone Bracket (9420-55126-00) and the Plastic Front Bolster (9440-55167-00). I created a recess that allowed the jack to be serviced from the bottom/front by removing only a few screws, without tearing down the control surface.
- **The Result:** ECO 12993 was released to modify the mounting feature, drastically reducing Mean Time To Repair (MTTR) for this critical component.

### 4. The DCD (Data Control Drawing) Protocol

- **The Trigger:** The unit required integrating 19 distinct PCBs (MicPre, SubMix, Faders, Encoders) into a sleek, low-profile industrial design with zero margin for error.
- **The Tension:** "Wild west" file swapping was causing connector misalignments (e.g., MH5 interfering with routing on the SubMix IO) and threatening board spins.
- **The Intervention:** I enforced a strict **Data Control Drawing (DCD)** exchange protocol. I refused to accept layouts that didn't match my Released DCDs (e.g., 9150-55200 Rev 12). I personally reviewed every DXF feedback from the layout team to verify mounting holes and keep-outs before authorizing fabrication.
- **The Result:** Achieved 100% mechanical fit on the first physical build.

## IV. LINKEDIN ARTIFACTS

- **Engineered** a custom "Vertical Hanging Fixture" manufacturing process to resolve critical thermal warping in painted ABS components, reducing flatness deviation from >2.50mm to <0.50mm and saving the Pilot build schedule.
- **Led** the mechanical architecture and integration of 19 distinct PCBs into a low-profile chassis, enforcing a Data Control Drawing (DCD) protocol that achieved 100% mechanical fit on the first physical build.
- **Managed** a complex global supply chain transition, dual-sourcing sheet metal fabrication between Silicon Valley and China to bridge a "no-bid" production gap, protecting the November 2007 launch date.
- **Negotiated** DFM improvements with overseas vendors that reduced sheet metal tooling costs while maintaining Class A cosmetic standards.
- **Redesigned** the headphone jack assembly (ECO 12993) to enable bottom-access field serviceability, significantly reducing warranty repair labor time for a high-frequency failure component.

## V. TECHNICAL STACK & GOVERNANCE

- **Tools:**
  - **CAD:** Pro/Engineer Wildfire (Solid & Surface modeling).
  - **PDM:** Pro/Intralink 3.4 & 8.0 (Windchill) — Managed migration and user training.
  - **Exchange:** AutoCAD (DXF) for PCB interchange; Adobe Illustrator for Artwork.
  - **ERP:** SAP (BOM management).
- **Partners:**
  - **CM:** VTech (Primary Assembler) / Kenny (Sheet Metal).
  - **Plastics:** Jetcrown (Injection Molding & Painting).
  - **Sheet Metal:** Mass Precision (Domestic/Proto).
  - **Components:** Skynet (Power Supply), Varitronix (LCDs).
- **Governance:**
  - **ECO System:** Primary Originator for mechanical ECOs (e.g., ECO 12263 for Sheet Metal, ECO 12262 for Plastics).
  - **Knowledge Management:** Authored "General Modeling Guide" and hosted internal engineering intranet for standards compliance.
  - **FAI:** Enforced strict First Article Inspection (FAI) reviews, rejecting parts that failed cosmetic standards (e.g., "Dental White" silkscreen).