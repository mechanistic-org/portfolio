# C24 [Curtis] Forensic Report

## I. PROJECT SUMMARY

- **Role:** Lead Mechanical Engineer / Industrial Design Lead
- **Mandate:** Execute a "RoHS/Refresh" of the legacy Control|24 console. Objectives: Eliminate **~$200/unit Focusrite royalty**, integrate 5.1 surround monitoring, and maintain a **$9,995 MSRP** while achieving regulatory compliance.
- **Core Achievement:** Delivered **500 units** for Q4 2007 FQA/Revenue recognition despite a "No-Bid" supply chain crisis and catastrophic thermal yield failure during Pilot.

## II. THE ANATOMY OF FAILURE (Heuristic Analysis)

_Discovery Heuristics applied to the "Death March" scenario._

### 1. Thermal Crisis: The "Banana Defect"

- **The Trigger (Crisis):** During Pilot, ABS Side Caps (P/N 9440-55165/166) arrived with **2.50mm** "Banana" warping and **2.27mm** linear shrinkage. Forensic analysis traced the defect to the "Rubberized Soft Paint" cure cycle where parts were baked on flat racks without support ("Method C"), causing the ABS to sag and lock into deformed shapes.
- **The Intervention (Fix):** I rejected the vendor's standard process and engineered **"Method A"** (Vertical Hanging Fixture). I codified this in **ECO 12740**, utilizing gravity to maintain straightness during the paint cure glass-transition phase.
- **The Result (Impact):** Reduced flatness deviation to **<0.50mm**, salvaging the Pilot yield and ensuring the unit met "Spectral Master" cosmetic standards.

### 2. Supply Chain Fracture: The "No-Bid" Shock

- **The Trigger (Crisis):** Primary overseas manufacturer (Kwanta/VTech) issued a "No-Bid" on the complex Top Panel (9420-55105) mid-schedule. Their automated stud-welding equipment could not handle the high density of standoffs required for the channel strips, threatening a line-down scenario.
- **The Intervention (Fix):** Executed a **Dual-Source Bridge Strategy**. I contracted **Mass Precision** (Silicon Valley) for emergency manual fabrication to bridge the Pilot schedule while qualifying a manual offset-welding process at the overseas vendor (Kenny).
- **The Result (Impact):** Protected the November 2007 FCS date by bypassing the blocked supply chain link; Mass Precision units served as "freebies for a fit check" to validate geometry.

### 3. Serviceability Friction: The Trap Door Protocol

- **The Trigger (Crisis):** Late-stage data revealed the legacy headphone jack had a **4.8% field failure rate** and was buried inside the unit, requiring a 2-hour teardown.
- **The Intervention (Fix):** I executed an emergency redesign (ECO 12993) of the Sheet Metal Headphone Bracket and Plastic Front Bolster. Created a recessed "trap door" geometry.
- **The Result (Impact):** Reduced Mean Time To Repair (MTTR) from >2 hours to **<10 minutes**, converting a "Return-to-Factory" liability into a Field Replaceable Unit (FRU).

## III. GOVERNANCE & RHYTHM

- **The Pulse:** Managed via weekly "War Room" status reports and direct vendor intervention (VTech/Jetcrown). Enforced a **Data Control Drawing (DCD)** protocol to lock PCB layouts against mechanical constraints.
- **The Artifacts:**
  - **ECO 12740:** Large Plastic Parts / Paint Fixture Protocol.
  - **ECO 13707:** Final tooling adjustments.
  - **DCD_9150-55200-00:** Geometric contracts for PCB integration.

## IV. LINKEDIN ARTIFACTS (The Numbers)

- **Eliminated** ~$200/unit licensing royalty by re-architecting chassis for internal pre-amps.
- **Secured** 51.80% Gross Margin despite 20% rise in raw steel costs.
- **Reduced** Headphone Jack MTTR from 2 hours to <10 minutes via "Trap Door" redesign.
- **Salvaged** 100% of Pilot cosmetic yield by engineering a Vertical Hanging Fixture to correct 2.50mm warp.
- **Delivered** 500 units for Q4 2007 revenue recognition under "Line Down" supply constraints.

## V. VISUAL EVIDENCE

- `944055165-166-00 baking fixture chg.pdf` (Photos of warped parts vs. hanging fixture).
- `before_and_after_rubber_paint.pdf` (Data proving 2.27mm shrinkage).
- `China Sheet Metal.pdf` (Evidence of ripples/dents in rejected panels).
- `fit-check-01.jpg` (Gap analysis showing shrinkage interference).
- `bourns_em14.pdf` (Spec sheet for Jog Wheel integration).

---

# 🕵️ Forensic Dossier (Case Studies)

## Case Study 1: The Data Control Drawing (DCD) Protocol

**SUBJECT:** Geometric Governance & Conflict Resolution
**ROLE:** Lead Mechanical Architect (Erik Norris)
**SCOPE:** Integration of 19 PCB Assemblies into the C|24 Chassis
**STATUS:** **Mission Critical**

The **19 Data Control Drawings (DCD) protocol** was the primary governance mechanism established by Erik Norris to manage the mechanical integration of the C|24 console. It functioned as a unilateral **"Geometric Firewall,"** preventing the fabrication of electrically viable but mechanically impossible circuit boards.

### I. THE PROBLEM: "Wild West" Integration Risk

Prior to this protocol, the project suffered from "wild west" file swapping. Electrical layout designers (Franco Piccininni, Jose Perez, Greg Vieyra) would often shift mounting holes or component placements to optimize electrical routing without realizing they were creating catastrophic downstream collisions with the sheet metal chassis or other boards.

With **19 distinct PCBs** crammed into a low-profile chassis, the margin for error was zero. A single uncoordinated move of a connector by 1mm could result in a "board spin" (re-fabrication) costing tens of thousands of dollars and weeks of schedule delays.

### II. THE MECHANISM: The "Geometric Contract"

Norris replaced the ad-hoc workflow with a rigid, binding "round-trip" verification process:

1.  **The Contract (The DCD):** Norris authored a unique DCD for every PCB (e.g., `DCD_9150-55200-00_REV_12.pdf`). This document was a **binding contract** defining the exact PCB Outline, Mounting Hole (MH) locations, and strict **Z-height "Keep-Out" Zones**.
2.  **The Gatekeeper:** Layout designers were forbidden from releasing a board for fabrication until their design matched the DCD. They were required to submit **DXF files** of their completed placements for verification.
3.  **The Verification (The Overlay):** Norris imported these layout DXFs back into the **Pro/Engineer 3D Master Assembly**. He overlaid the electrical reality against the mechanical truth to check for interference. If a variance existed, the board was rejected.

### III. FORENSIC EVIDENCE: Intercepted Collisions

The archives document specific "Showstopper" failures this protocol intercepted _before_ physical tooling:

- **The MicPre 8 I/O Crash (Interface Design):**
  - **The Threat:** The layout placed power connectors vertically.
  - **The Interception:** 3D verification revealed these connectors would crash into the bottom pan, making it impossible to close the unit.
  - **The Fix:** Norris issued **DCD Rev 8**, enforcing a hard constraint: _"The power connector should be a right angle pointing away from the back of the unit."_ This forced a layout change prior to the prototype build.
- **The SubMix I/O "Dead Zone" (Assembly Logic):**
  - **The Threat:** Headers were placed in "electrically optimal" locations that were physically unreachable by human hands once the board was screwed down.
  - **The Interception:** Norris rejected the layout, flagging that assembly workers could not connect the ribbon cables.
  - **The Fix:** He enforced **DCD Rev 5**, mandating connectors be moved to the **left edge** of the PCB to ensure serviceability.
- **The Time Code Display (Mechanical Interference):**
  - **The Threat:** 7-segment LED displays were positioned too high on the Y-axis.
  - **The Interception:** The protocol revealed the displays would crash into the top panel metalwork.
  - **The Fix:** Norris issued **DCD Rev 6**, forcing the entire display block down by exactly **8.12mm**.

### IV. THE RESULT

By establishing the DCD as the single source of mechanical truth, the project achieved **100% mechanical fit** on the first physical build of the Pilot units. This effectively decoupled the mechanical schedule from the electrical layout iterations, allowing parallel development without the risk of integration failure.

---

## Case Study 2: The "Banana Defect" (Thermal Failure)

**SUBJECT:** Thermal Deformation of ABS Components (Side Caps)
**SEVERITY:** Critical (Pilot Line Down / Cosmetic Yield Failure)
**ROLE:** Lead Mechanical Architect (Erik Norris)

The **"Banana Defect"** was a catastrophic manufacturing failure identified during the C|24 Pilot build (June 2007). The large ABS plastic side caps (P/N 9440-55165/166) arrived at the assembly line severely warped, exhibiting a "bow" and "twist" that resembled a banana.

### I. THE ANATOMY OF THE DEFECT

- **The Symptom:** Inspection reports revealed flatness deviations of **2.50mm**, **2.25mm**, and **2.30mm**—far exceeding the 0.50mm tolerance. The parts physically could not be mated to the straight sheet metal chassis, leaving massive gaps.
- **The Root Cause:** The defect was not in the molding, but in the **secondary finishing process**. The premium "Rubberized Soft Paint" (Spectral Master DS-022) specified for the unit required a high-temperature cure cycle.
- **The Physics:** The Jetcrown factory was using **"Method C"** (Standard Flat Racking), placing the long, thin plastic parts on flat wire racks in the oven. As the parts heated to cure the paint, the ABS plastic reached its **glass-transition temperature ($T_g$)**. Softened by heat and unsupported against gravity, the plastic sagged between the rack wires, locking into a warped shape as it cooled.

### II. THE FIX: GRAVITY-DRIVEN FIXTURING

I rejected the vendor's standard process and their initial "band-aid" attempts. Instead, I engineered a solution that used physics to our advantage.

- **The Intervention (Method A):** I mandated a **Vertical Hanging Fixture** protocol.
- **The Mechanism:** By suspending the parts vertically from a hook during the bake cycle, gravity acted along the longitudinal axis of the part. Instead of pulling the softened plastic _down_ into a curve (sag), gravity pulled it _straight_, effectively self-correcting any warp during the glass-transition phase.

### III. METHODS & TACTICS

I executed this resolution remotely, without flying to the Guangdong factory, using the following tactics:

1.  **Remote Telemetry (Data Forensics):** I analyzed the incoming inspection logs (`94455165...dimension before and after painting.pdf`). The data showed a consistent **~2.27mm linear shrinkage** (756.61mm → 754.24mm) on painted parts versus unpainted parts. This correlated the defect directly to the thermal stress of the paint oven, ruling out molding errors.
2.  **Directed DOE (Design of Experiments):** I forced the vendor to run a comparative study of three racking methods, documented in photo logs:
    - **Method C (Control):** Flat rack. Result: **Failure** ("caused a lot of deformation").
    - **Method B (Vendor Proposal):** Flat rack with 3 support blocks. Result: **Failure** ("still have a twisted & de[formation]").
    - **Method A (My Directive):** Vertical Hanging. Result: **Success** ("minimize the deforma[tion]").
3.  **The Engineering Change Order (ECO):** Once validated, I codified this process change in **ECO 12740**, effectively making the "Vertical Hanging" method a binding specification for production.

### IV. COST & RESULT

- **The Cost:** The solution required the fabrication of custom vertical racking carts by the vendor. This was a minimal NRE (Non-Recurring Engineering) charge compared to the alternative: scrapping the expensive injection molds or the entire Pilot inventory.
- **The Result:**
  - **Metric:** Flatness deviation dropped from **2.50mm** to **<0.50mm**.
  - **Yield:** Salvaged 100% of the cosmetic yield for the Pilot build.
  - **Schedule:** Prevented a "Stop Ship" scenario, protecting the November 2007 launch window.

---

## Case Study 3: The "No-Bid" Shock (Supply Chain Recovery)

**SUBJECT:** Supply Chain Fracture / Manufacturing Feasibility Crisis
**COMPONENT:** Top Panel (P/N 9420-55105)
**ROLE:** Lead Mechanical Architect (Erik Norris)
**SEVERITY:** **Critical (Line Down / Pilot Stop)**

## I. THE CRISIS: THE "NO-BID" SHOCK

Mid-schedule, the primary overseas contract manufacturer's metal partner, **Kwanta**, issued a formal **"No-Bid"** on the console's primary interface surface, the Top Panel.

- **The Threat:** Without this component, the Pilot build would stall, threatening the November 2007 First Customer Ship (FCS) date and Q4 revenue recognition.
- **The Stalemate:** The vendor refused to fabricate the part, claiming it was unmanufacturable with their existing automated equipment.

## II. THE ANATOMY OF FAILURE (Heuristic Analysis)

The failure was rooted in a conflict between **Geometric Density** and **Automated Tooling Constraints**.

- **The Constraint:** The mechanical architecture required an extremely high density of welded standoffs (PEM studs) to mount the 24 individual channel strip PCBs.
- **The Physical Conflict:** Standard automated CNC stud-welding heads are bulky. The design placed studs so close together that the machine head physically could not fit between existing studs to place the next one without collision.
- **The Failure Mode:** Automation deadlock. The robot could not execute the programming, leading to the vendor rejection.

## III. THE STRATEGY: DUAL-SOURCE BRIDGE

I executed a **Dual-Source Bridge Strategy** to decouple the Pilot schedule from the overseas tooling limitations. This involved running two parallel manufacturing paths: a domestic "Fire Drill" to save the immediate build, and an overseas process re-engineering for volume production.

## IV. TACTICS & METHODS

### 1. Domestic Intervention (Mass Precision)

- **Tactic:** I bypassed the blocked overseas supply chain by engaging **Mass Precision** (San Jose), a local high-mix/low-volume fabrication shop, for an emergency "Bridge Run".
- **Method (The Offset):** We utilized a **"Manual Offset Welder."** This tool features a modified tip geometry where the electrode is offset from the gun body, allowing a human operator to reach into the tight "canyons" between studs that the robot could not access.
- **The "Manual Operation" Fix:** Due to the speed of this intervention, the initial Mass Precision panels arrived with missing countersinks. I managed a "manual operation" workaround where the machine shop manually machined the countersinks into formed metal to salvage the parts rather than scrapping them.
- **Artifact:** Ed Stegall (Mass Precision) confirmed these units were provided as _"freebies for a fit check"_ to validate the design.

### 2. Overseas Triage (Kenny/VTech)

- **Tactic:** While Mass Precision supported the Pilot, I negotiated a process deviation with **Kenny** (VTech's alternative metal source).
- **Method:** I authorized a **"Manual Process"** for the initial production ramp-up. This allowed Kenny to manufacture the panels by hand-welding the studs using positioning fixtures ("Riveting Tools") while they engineered a custom automated solution for long-term volume.
- **Validation:** This manual process was qualified as a "Short-term supplier" strategy to support Proto 3 and Pilot builds.

## V. THE OUTCOME

- **Schedule Saved:** The Mass Precision bridge units allowed the Pilot build to proceed on schedule, preventing a "Line Down" event.
- **Design Validated:** The domestic prototypes proved the mechanical fit of the complex top panel was valid, forcing the overseas vendor to solve the tooling issue rather than demanding a design change.
- **Revenue Secured:** Successfully transitioned from domestic manual parts to overseas manual parts, delivering **500 units** for the Q4 2007 launch.

---

## Case Study 4: Headphone Jack "Fire Drill" (Serviceability)

**SUBJECT:** Serviceability vs. Aesthetics Conflict Resolution
**SEVERITY:** Critical (Late-Stage Design Pivot)
**TIMELINE:** April 25-30, 2007 (Pilot Phase)
**ROLE:** Lead Mechanical Architect (Erik Norris)

The **Headphone Jack Fire Drill** was a high-stakes confrontation between Manufacturing/Service and Product Marketing that occurred dangerously late in the schedule. It required a surgical mechanical intervention to prevent a warranty service disaster.

### I. THE PROBLEM: A "Return-to-Factory" Liability

In the original "Curtis" architecture, the headphone jack was mounted **behind** the cosmetic plastic Front Bolster. While aesthetically sleek (flush look), it created a serviceability nightmare for a high-wear component.

- **The Flaw:** To replace a broken headphone jack, a technician would have to:
  1.  Remove the bottom chassis pan.
  2.  **Remove 5-6 channel faders** to access hidden screws.
  3.  Remove the entire Front Bolster plastic assembly.
- **The Cost:** This procedure was estimated to take **2+ hours**, effectively classifying the repair as "Return-to-Factory" (RTF) rather than a Field Replaceable Unit (FRU).
- **The Data:** Customer Service (Arndt Hufenbach) produced a "smoking gun" statistic: the Digi 002 (a similar console) had a **4.8% failure rate** on headphone jacks. With thousands of units in the field, this predicted a massive warranty liability.

### II. THE RESISTANCE: Marketing & Design

The proposed fix—recessing the jack into a "cubby"—was met with immediate and stiff resistance from the Product Marketing and Industrial Design stakeholders.

- **The Argument:** Program Manager **Matt Cho** and Product Marketing Manager **David Gibbons** argued that the change ruined the console's ergonomics and aesthetics.
- **The Mock-Up Failure:** A "foam mock-up" was created to test the recessed design. Marketing rejected it, stating: _"From an ergonomic perspective, it doesn’t work... David Gibbons and Greg Westall prefer the original, unmodified design."_
- **The Schedule Threat:** Hardware Engineering (Robin Parnaby) pushed back, noting that changing the serviceability assumption _this_ late (post-Tooling Control Off) could cause _"significant delay"_.

### III. THE ARGUMENT: Data Overrules Aesthetics

The engineering team, led by **Kerwin Yuen** (Manufacturing) and supported by me (Norris), leveraged the failure rate data to force a decision.

- **The Leverage:** Arndt Hufenbach’s data (870+ replacements on the previous unit) made it clear that a 2-hour repair time was financially unsustainable.
- **The Ultimatum:** Service demanded the jack be a **FRU** (Field Replaceable Unit). The risk of customers breaking the jack by bumping into a protruding plug (sticking out 2" from the flush bolster) was too high to ignore.

### IV. THE IMPLEMENTATION: The "Trap Door" Protocol

Despite the resistance, I executed a unilateral redesign to satisfy the service requirement without slipping the November launch.

- **The Mechanism:** I redesigned the **Headphone Bracket (P/N 9420-55126-00)** to mount the jack directly to the steel frame of the fader panel rather than floating it behind the plastic.
- **The Tooling Mod:** I modified the **Front Bolster (P/N 9440-55167-00)** injection mold to "draw back" the geometry, creating a recessed **"trap door"** opening. This allowed the jack nut to be accessed from the _front_ of the unit.

### V. METHODS & TACTICS

1.  **Rapid Redesign:** I bypassed the usual "study" phase Marketing requested and went straight to tooling geometry updates to prove feasibility.
2.  **Geometric Isolation:** By mounting the jack to the fader bank frame, I decoupled it from the complex cosmetic assembly.
3.  **ECO Execution:** I formalized the change in **ECO 12993** ("MODIFY HEADPHONE JACK MOUNTING FEATURE"), effectively locking the new design into the production record before further debate could stall it.

### VI. THE RESULT

- **Metric:** Repair time reduced from **>2 hours** to **<10 minutes**.
- **Outcome:** The headphone jack became a true Field Replaceable Unit. A technician could now replace it by removing only the bottom pan and a single nut—no faders or cosmetic parts had to be touched.
- **Legacy:** The unit shipped with the recessed jack, preventing the predicted warranty bottleneck.

---

## Case Study 5: Validation & Certification Architecture

**SUBJECT:** Validation Strategy/UL Bypass
**ROLE:** Lead Mechanical Engineer / Validation Architect

### I. EXECUTIVE SUMMARY

- **Role:** Lead Mechanical Engineer / Validation Architect.
- **Mandate:** Orchestrate the simultaneous mechanical validation, thermal qualification, and regulatory certification (UL/FCC/CE) of the C|24 console.
- **Core Achievement:** Decoupled the **System UL Certification** from the delayed **Power Supply Unit (PSU)** certification, compressing the schedule to secure **Q4 2007 Revenue**.

### II. THE ANATOMY OF VALIDATION (Heuristic Analysis)

Erik Norris utilized a "Parallel Processing" doctrine to bypass linear dependencies that threatened the launch.

1.  **Regulatory De-Coupling (The UL Bypass):**
    - **The Trigger (Crisis):** The external PSU (Skynet) failed initial EMC prescans and was late for UL certification. Standard process dictates the System UL cannot start until the PSU UL is complete.
    - **The Intervention (Method):** Norris and the engineering team negotiated a **Simultaneous Certification Protocol** with UL. They convinced the agency to accept the C|24 surface for testing _without_ the finalized PSU as a pre-requisite, running the certifications in parallel.
    - **The Result (Effect):** Saved weeks of schedule. When PSU units finally arrived, Norris organized a **"Hand-Pack" operation** at the Menlo Park facility to manually apply UL stickers and package the first 100 units, securing the ship date.

2.  **Thermal & EMC "Rake" Pivot:**
    - **The Trigger (Crisis):** Preliminary validation of the "4U Rake" configuration revealed catastrophic **Electromagnetic Interference (EM)**. Placing the Power Supply under the Analog-to-Digital Converters (ADCs) caused significant noise issues.
    - **The Intervention (Method):** Norris directed a structural pivot to a **"3U Rake"** configuration. He coordinated real-time testing at **Elliot Labs**, utilizing modified PSUs with "metal connectors and shielded cables" to validate the new architecture.
    - **The Result (Effect):** The 3U configuration passed EM testing ("much better than 4U") and met thermal requirements, locking the chassis design for production.

---

## Case Study 6: Bourns Jog Wheel Integration (Value Engineering)

**SUBJECT:** Component Obsolescence & Cost Reduction / Mechanical Integration
**COMPONENT:** Jog/Shuttle Wheel Assembly
**ROLE:** Lead Mechanical Architect (Erik Norris)
**TIMELINE:** January 2007 – July 2007

The **Bourns Jog Wheel Integration** was a late-stage value engineering and obsolescence resolution effort. It required Erik Norris to architect a mechanical bridge that allowed a tiny, inexpensive off-the-shelf component to function with the tactile weight and stability of a premium custom assembly.

### I. THE REPLACEMENT: Legacy vs. Modern

- **The Legacy Design (Replaced):** The original _Control|24_ utilized an expensive, custom Jog Wheel assembly. Early project meetings (August 2005) initially planned to reuse this part to maintain the "Pro" feel, but cost and obsolescence pressures forced a change.
- **The New Component:** The hardware team selected the **Bourns EM14**, a standard 14mm Rotary Optical Encoder.
- **The Disparity:** The Bourns EM14 was significantly smaller than the legacy mechanism. Mounting it directly to the chassis would have resulted in a wobbly, "toy-like" feel incompatible with a $9,995 studio console.

### II. THE INNOVATION: The "Surround" Architecture

Erik Norris functioned as the integration architect, bridging the physical gap between the miniature component and the large console surface.

- **The "Plastic Surround":** Norris engineered a **custom plastic surround** to adapt the small encoder body to the larger chassis geometry. This injection-molded adapter provided the necessary structural footprint to stabilize the knob and maintain the correct Z-height relative to the top panel.
- **The Structural Mount:** He designed a specific sheet metal fabrication, **P/N 9420-56156-00 (FAB,SM,JOG WHEEL,C24)**. This bracket secured the plastic surround and encoder to the chassis frame, ensuring rigid operation during aggressive "scrubbing" maneuvers.
- **Release:** This sub-assembly was formally released via **ECO 13082** in July 2007.

### III. THE "LEADS" CRISIS: DFM Intervention

During the First Article inspection of the Bourns samples in January 2007, Norris identified a critical assembly risk that threatened manufacturing yield.

- **The Defect:** The sample units arrived with **"six exposed round wire leads"** (approx. 0.42mm OD) rather than a connector.
- **The Risk:** These tiny leads would require manual soldering on the production line, creating a high risk of bridging, cold solder joints, and long assembly times.
- **The Fix:** Norris rejected the raw lead configuration. He calipered the samples personally (~4.75mm high x 1mm spacing) and enforced a specification for a **pre-terminated harness**. This converted a delicate manual soldering operation into a robust "plug-and-play" assembly connection.

### IV. ADVANTAGES & SAVINGS

- **Cost Reduction (COGS):** Replaced a proprietary custom assembly with a mass-market "off-the-shelf" component, significantly lowering the Bill of Materials (BOM) cost.
- **Obsolescence Resolution:** Moved the product line onto a current-generation component with long-term availability.
- **Premium Haptics:** The "Surround" architecture successfully decoupled the component size from the user experience, maintaining the "heavy" premium feel required for professional audio editing despite the lighter underlying hardware.
