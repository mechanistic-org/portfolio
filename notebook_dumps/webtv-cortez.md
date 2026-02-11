# Cortez Forensic Report

## I. PROJECT SUMMARY

- **Role:** Product Designer / Surface Development Consultant.
- **Mandate:** Execute the mechanical design and complex surfacing for "Cortez," the reference wireless keyboard for the Galaxy HomeNet system, integrating specific key matrices within a tight aesthetic envelope.
- **Core Achievement:** Delivered a fully surfaced, manufacturing-ready Pro/ENGINEER database for the hard model in a six-week "sprint," resolving critical ergonomic and IR transmission geometry failures.

## II. THE ANATOMY OF FAILURE (Heuristic Analysis)

_Discovery Heuristics Applied: Geometry Conflict (Key Matrix) & Mechanical Crisis (IR/Ergonomics)._

- **The Trigger (Crisis):**
  The initial hard model review revealed catastrophic functional defects. The unit was "entirely flat," lacking necessary curvature, and the infrared (IR) transmission angle was insufficient (0°) compared to the required 3-15° tilt for reliable signal transmission. Simultaneously, a yield-killing tolerance conflict emerged: ID specified a 19mm key pitch, while the vendor (Silitek) mandated a 19.05mm pitch standard, creating a 0.05mm delta that accumulated across the array to threaten bezel fit. Further compounding this, the alternate vendor (Panasonic) provided unusable wireframe data derived from Catia/IDEAS, lacking surface definitions for navigation keys.

- **The Intervention (Fix):**
  I executed a 43-hour surgical reconstruction of the Pro/E database to enforce "Design Review" hitlist items. This required:
  1.  **Angle Implementation:** 28 hours dedicated to angling the top surface to achieve the required IR tilt.
  2.  **Surface Lofting:** 9 hours adding organic curvature to grip areas to eliminate the "flat" profile.
  3.  **Matrix Arbitration:** Forced resolution of the pitch conflict by demanding accurate CAD files to validate "keep-out" zones and accommodating the 19.05mm constraint within the ID envelope.

- **The Result (Impact):**
  The intervention delivered flawless machined surfaces and met the 0.6kg weight target via internal ribbing and wall thickness optimization. The final CAD files were released to prototype in six weeks with zero tooling gaps, enabling the "Galaxy" technology showcase to proceed on schedule.

## III. GOVERNANCE & RHYTHM

- **The Pulse:** High-velocity iteration managed through weekly status reports and bi-weekly invoicing cycles. Design reviews triggered immediate, same-day CAD restructuring.
- **The Artifacts:**
  - **PRD:** WebTV Cortez Keyboard Specification 2.2.
  - **RFQ:** Lite-On/Silitek Cortez Quotation (Word97 format).
  - **Review Log:** Cortez Hard Model Review (June 19, 2000) detailing "puffy" corners and "sharp" eye edges.

## IV. LINKEDIN ARTIFACTS (The Numbers)

- **Billed** $24,900 in a single month (June 2000) for accelerated surface development rescue.
- **Rectified** a 0.05mm accumulated tolerance error between ID specification (19mm) and vendor tooling (19.05mm).
- **Engineered** a 3-15 degree variable IR transmission angle into the primary housing geometry.
- **Managed** 2 disparate vendor data streams (Panasonic/Silitek) to unify the mechanical database.
- **Reduced** model weight to meet the 0.6kg target via internal ribbing and wall thickness optimization.

## V. VISUAL EVIDENCE

- `SK-7510 Key switch layout Drawing KK7510-401 (May 162000).dwg`
- `cortezkeys.pdf`
- `kb6-r03_$B9=@.^_(J.pdf` (Panasonic RFQ Critique)
- `rel_2d_6_27.zip` (Final Release 2D Drawings)
- `id_ir.prt.zip` (Panasonic's deficient 3D file)

## The Matrix War (19.05mm Conflict)

Based on the forensic data extraction, the **19.05mm key pitch conflict** was a geometric tolerance crisis that threatened the mechanical viability of the top housing (bezel).

**MECHANISM OF FAILURE: ARITHMETIC ACCUMULATION**
The alignment failure resulted from a clash between the Industrial Design (ID) specification and the Vendor's (Silitek) tooling reality.

- **The Delta:** ID specified a **19.00mm** pitch to maintain a tight aesthetic. Silitek’s standard SK-7510 matrix mandated a **19.05mm** pitch.
- **The Accumulation:** A 0.05mm deviation is negligible in isolation. However, across the QWERTY array (approximately 15 keys wide), this error aggregated linearly.
- **The Collision:** The accumulated offset caused the keycaps at the periphery of the array to "walk" out of concentricity with their bezel openings. Instead of floating centered within the housing, the keys drifted until they physically interfered with the rigid plastic webs of the bezel, causing key binding and aesthetic failure.

**RESOLUTION**
The Architect (Norris) executed a **Matrix Arbitration**, forcing a reconciliation of the CAD database to acknowledge the 19.05mm hardware reality while adjusting the bezel geometry to mask the drift, preventing a yield-killing tooling collision.

## The Puffy Corners (Review Data)

Based on the forensic data from the **Cortez Hard Model Review** (June 19, 2000), the "puffy" defects were specific geometric excesses located at the **upper underside corners near the feet** of the unit.

**Defect Profile:**

- **Location:** Upper underside corners, adjacent to the feet.
- **Condition:** "Too puffy," indicating an excess of material volume or a surface curvature that failed to meet the tight aesthetic envelope required by Industrial Design.
- **Corrective Action:** The Architect (Erik Norris) and Jeff Jones (ID) were tasked with an immediate Pro/ENGINEER database reconstruction to tighten these surfaces and eliminate the volumetric bloat.

## The IR Tilt Crisis

Based on the forensic data extraction for the Cortez project, the lack of IR tilt caused a **critical functional failure in the signal path** between the keyboard and the **Galaxy Gateway** receiver.

**The Anatomy of the Signal Failure:**

- **Geometric Deficit:** The initial hard model was designed "entirely flat" (0° tilt), failing to meet the required **3° to 15° vertical tilt** specification necessary for a tabletop device to communicate with a set-top box.
- **Line-of-Sight Blockage:** Without the upward tilt, the infrared beam was directed parallel to the resting surface (e.g., a coffee table) rather than angling upwards toward the receiver, which would typically be positioned on a television or in an A/V rack. This geometry prevented **reliable signal transmission**, effectively rendering the wireless keyboard mute in a real-world living room environment.

**The Fix:**
The Architect (Norris) executed a 28-hour CAD reconstruction to angle the top surface of the housing, mechanically enforcing the required transmission trajectory without altering the Industrial Design footprint.

## The 43-Hour Sprint

The **43-hour sprint** refers to a specific, high-intensity **Pro/ENGINEER database reconstruction** executed by "The Architect" (Erik Norris) between the disastrous Hard Model Review on **June 19, 2000**, and the final file release on **June 27, 2000**.

This effort was a "surgical" rescue operation designed to correct catastrophic ergonomic and functional failures identified in the initial hard model, specifically the lack of infrared (IR) transmission geometry and the "entirely flat" surface profile.

### The Forensic Breakdown (The Billable Hours)

According to the specific status report invoiced on June 27, 2000, the 43 hours were allocated as follows:

- **28 Hours: The IR Tilt Correction (Geometric Enforcement)**
  The initial model was "entirely flat" (0° tilt), which failed to meet the **3°–15°** vertical transmission angle required for the keyboard to communicate with the Galaxy Gateway set-top box. This block of time was dedicated to mechanically angling the primary top surface of the housing to enforce the signal trajectory while maintaining the ID envelope.

- **9 Hours: Organic Surface Lofting (Ergonomic Rescue)**
  Industrial Design (ID) criticized the unit as lacking curvature ("too flat"). This time was spent developing highly organic, lofted surfaces in the left and right "grip areas" to meet the ergonomic requirements defined in the ID sections.

- **6 Hours: Surface Prep & Release**
  Final "ID review," miscellaneous tweaking of edge conditions (fixing "sharp eye edges"), and preparing the surface geometry for export to the prototype vendor.

### The Result

This intervention successfully transformed a "flat," non-functional block into a **manufacturing-ready database** with flawless machined surfaces. The files (`rel_2d_6_27.zip`) were released to the model maker (Val Kasvin at Sputnik) on June 27, ensuring the project met its "Galaxy" technology showcase deadline.

## The Panasonic Data Void

Based on the forensic extraction of the project archives, the **Panasonic Data Void** was a critical interoperability failure that forced a "blind" reconstruction of the mechanical database.

### The Anatomy of the Data Failure

**1. The "Wireframe" Mirage**
Panasonic, operating as the alternate supplier for the reference design, utilized **Catia and I-DEAS** software, creating a hard incompatibility with the project's **Pro/ENGINEER** standard. When pressed for 3D data to validate the mechanical fit, Panasonic exported **IGES** files. These were not usable solid models or surfaces; they were "wireframe" files—essentially digital sketches consisting of lines in space without surface topology or mass.

**2. The Missing Geometry (Navigation Void)**
The extracted data was not only geometrically hollow but also incomplete. The wireframes explicitly failed to include the **navigation keys**. This omission was catastrophic because the navigation cluster required complex, organic surfacing to meet the Industrial Design (ID) ergonomic specifications.

**3. The Workflow Fracture**
The Architect (Erik Norris/Lincicum) determined that the Panasonic data was effectively "dead" geometry. He stated, _"I will not be able to rework their file, because I don't work in Catia or IDEAS"_.

**The Consequence:**
Instead of refining the vendor's mechanical baseline, the engineering team was forced to fork the development. Norris executed a parallel reconstruction of the original Pro/E master file to simulate the vendor's constraints and "paint over" the missing data, artificially enforcing the necessary paint shut-offs and mechanical details without a valid source of truth from the manufacturer.
