# Room Director [Codename: Sativa] Forensic Report

## I. PROJECT SUMMARY

- **Role:** Principal Architect / Lead Mechanical Engineer
- **Mandate:** Engineer a high-end, touch-sensitive lighting control system ("Room Director") to "transform any room with one touch," effectively replacing standard light switches with complex consumer electronics.
- **Core Achievement:** Navigated catastrophic reliability failures (Chemical/Drop) during EVT/DVT cycles to deliver a complex multi-SKU hardware ecosystem (Sativa, Elvis, Waldo) prior to the 2020 corporate dissolution.

## II. THE ANATOMY OF FAILURE (Heuristic Analysis)

Discovery Heuristics applied to Sativa and Elvis validation data.

### The Trigger (Crisis): The "Wet Hands" & Chemical Failure

During EVT2 reliability testing, units failed the "Wet Hands" simulation (Artificial Sweat ISO 3160-2) and chemical resistance tests (Nail Polish Remover). The chemical agents caused immediate **gloss surface changes and roughness** on the cosmetic housings, threatening the premium finish of the product. Simultaneously, units were failing Micro Drop and standard 1.3m Drop Tests.

### The Intervention (Fix): Operational Triage Directive

Acting as The Architect, I issued a directive to bypass the standard "Stop Ship" protocol for specific cosmetic failures.

- **Directive:** "Please provide a detailed report of 'Wet Hands' failures. For now, this test is still classified as 'information only'. No need to hold for resolution – OK to proceed with FAIL result".
- **Logic:** Decoupled cosmetic surface degradation from functional mechanical integrity to maintain schedule velocity during the critical EVT2>DVT transition.

### The Result (Impact)

The program advanced through the "Valley of Death" (EVT/DVT). While Drop Robustness (Intent B) initially failed, Mechanical Strength (Intent A) passed Thermal Stress and Extreme Force tests. This command decision prevented a line-down scenario, shifting the burden from engineering physics to product management risk acceptance.

## III. GOVERNANCE & RHYTHM

- **The Pulse:** High-velocity sprint cadence managed through "Continuous Tracking" and "EVT1 Validation / EVT2 Dev" cycles. The workload was characterized by a "Solo Mandate," carrying the architectural load for the entire Sativa/Elvis/Waldo product family.
- **The Artifacts:**
  - **Reliability Matrices:** `DVT_Reliability_Test_Reports.pdf`
  - **Issue Trackers:** `Sativa-and-Elvis_MECHANICAL___TEST-related_issue-tracker`
  - **Defect Visuals:** `Packaging_Test_Results_Review.pdf` (Documenting protective film adhesive failures on Waldo units).

## IV. LINKEDIN ARTIFACTS (The Numbers)

- **Orchestrated** the mechanical architecture for 3+ distinct hardware SKUs (Sativa, Elvis, Waldo) under a solo engineering mandate.
- **Directed** reliability testing protocols involving 60+ rapid pull tests and 1.3m drop cycle validations.
- **Mitigated** critical "Wet Hands" chemical resistance failures by reclassifying test criteria to protect EVT2 schedule velocity.
- **Managed** a Bill of Materials (BOM) containing 20+ custom mechanical parts including OLED gaskets, RF shielding, and light guides.
- **Navigated** a 50% Reduction in Force (RIF) corporate restructuring event while maintaining operational continuity.

## V. VISUAL EVIDENCE

- `20170414_drop test.pdf` (Documentation of pendulum and drop impact failures)
- `Crush test_20170419 Regression.pdf` (Visuals of 30kg load deflection testing)
- `Packaging_Test_Results_Review.pdf` (Evidence of adhesive failure/glue residue on Waldo units)

---

## DEEP DIVE: Design & Manufacturing Failure Analysis

**CONTEXT:** The following analysis details the structural, cosmetic, and functional deficiencies identified during the EVT/DVT cycles for the Room Director (Sativa), Extension Switch (Elvis), Base (Bazooka), and Faceplate (Waldo).
**TONE:** Objective, Technical, Root-Cause Focused.

### I. CRITICAL RELIABILITY FAILURES (The "Stop Ship" Risks)

#### 1. The "Wet Hands" Ingress Failure (Chemical Resistance)

- **Crisis:** During DVT, units failed the "Wet Hands" simulation (Artificial Sweat) and chemical resistance tests. Exposure to these agents caused immediate gloss surface changes, roughness, and oxidization on the Bazooka metal contacts.
- **Impact:** Threatened the premium "Satin" finish and electrical safety.
- **Resolution:** Command override. The Architect (Erik Norris) directed the team to classify the test as "information only" and proceed with a FAIL result to preserve schedule velocity.

#### 2. The "Floating Cap" Delamination (Elvis)

- **Crisis:** The "Elvis" extension switch exhibited a catastrophic "Plastic cap floating" failure mode where the top cosmetic cap separated from the housing.
- **Root Cause:** A dual failure of chemistry and geometry.
  - **Chemistry:** The pressure-sensitive adhesive (PSA) was insufficient for the load.
  - **Geometry:** A 0.1mm CAD mismatch existed between the internal adhesive pocket and the mating part, preventing proper contact.
- **Intervention:** Switched from PSA to structural glue (requiring new fixturing) and corrected the steel tool geometry.

#### 3. Structural Dissolution (Drop & Crush Tests)

- **Drop Test:** Sativa and Elvis units suffered catastrophic disassembly during 1.3m drop tests. Failures included front housing/back cover separation, broken internal bosses, and cracked LCMs (Liquid Crystal Modules).
- **Crush Test:** Units failed to withstand compressive loads, resulting in adhesive gap separation and housing detachment.
- **Micro Drop:** Repeated low-height drops caused internal battery rattling due to adhesive failure.

### II. COSMETIC & YIELD PATHOLOGY

#### 1. The "Glass Yield" Crisis (Sativa)

- **Defect:** High reject rates for the Sativa Cover Glass (Lens).
  - **Edge Light Leakage:** 90% failure rate due to imperfect masking profiles.
  - **Scratches:** 15% failure rate caused by collision between 3D glass parts during tray loading/transport.
  - **Logo Defects:** 25% failure rate in printing the logo on the curved 3D glass surface.

#### 2. Adhesive Residue (Waldo)

- **Defect:** Protective films applied to Waldo faceplates left stubborn glue residue upon removal, and in some cases, the film floated or bubbled before reaching the customer. This created an immediate "out of box" cosmetic failure.

#### 3. Plating & Finish Degradation

- **Bazooka:** Black Zinc plating chipped away after multiple installation cycles, revealing the raw steel underneath.
- **Anodization:** "Bronze" anodized parts suffered from target mismatches (dL\* -4.24), leading to 100% rejection of specific lots.
- **Paint Adhesion:** Front housing paint peeled off during thermal stress and abrasion tests.

### III. MECHANICAL & ASSEMBLY CONFLICTS

#### 1. The "Label Lift" Debacle

- **Issue:** The main rear labels on Sativa/Elvis units lifted at the edges due to stiffness and weak adhesive (3M 467).
- **Fix:** Required an Engineering Change Order (ECO) to upgrade to 3M 9453LE (high-strength adhesive) and modify the label geometry to remove the Serial Number notch which acted as a stress concentrator.

#### 2. Tolerance Stack-up & Fitment

- **Interference:** The "Bazooka" base and "Waldo" faceplate exhibited "wiggle" and "zero-to-zero" interference issues, making installation difficult or leaving unsightly gaps.
- **Stamping Limits:** The Waldo chassis design contained sharp corners and hook gaps (<2mm) that were impossible to manufacture via progressive die stamping, forcing DFM (Design for Manufacturing) geometry relaxations.

#### 3. Electromechanical Dissonance

- **Buzzing:** Bazooka units produced audible buzzing noise.
- **Shock Hazard:** Electric shock risk identified when inserting the switch module into the base.
- **Key Feel:** The main switch button suffered from "jamming" and poor tactile feel (cheap sound) due to friction and interference, requiring the application of dry lubricant and grease.

### IV. FIELD FAILURE (Post-Launch)

**AMOLED Burn-In**

- **Latent Defect:** Long-term users reported image retention on the 1.45-inch AMOLED display. The static text elements (e.g., scene names) caused uneven degradation of the organic diodes, a limitation of the display technology selected for a device with always-on elements.

---

## DEEP DIVE: The "Dead Front" & Invisible Sensor Architecture

**CONTEXT:** Subject: Optical Integration & "Dead Front" Esthetics (Sativa). Objective: Deconstruct the engineering methods used to hide the AMOLED display and Time-of-Flight (ToF) sensor behind a monolithic black surface.

### I. THE "DEAD FRONT" DOCTRINE (AMOLED Integration)

The mandate was absolute: the Room Director must vanish into the wall. It could not look like a "screen" when inactive; it had to look like a piece of polished onyx.

#### 1. The Component Choice: 1.45" AMOLED

- **The Spec:** 1.45-inch Active-Matrix Organic Light-Emitting Diode (AMOLED).
- **The Physics:** Unlike LCDs, which require a backlight (creating a "gray glowing rectangle" in the dark), AMOLED pixels generate their own light. When off, they are chemically black. This was the foundational requirement for the "Dead Front" aesthetic, ensuring the active display area blended perfectly with the inactive bezel.

#### 2. The "Blue Window" Crisis (SAT-102)

- **The Failure:** Early EVT units failed the aesthetic check. The AMOLED panel, when off, reflected a distinct "blue" hue compared to the deep black back-painted glass bezel. The "display window is too obvious," destroying the monolithic illusion.
- **The Intervention:** The team directed the glass vendor (Biel) to manufacture **"Tinted prototypes"**. By tinting the cover glass or the OCA (Optically Clear Adhesive), they neutralized the blue reflection of the OLED panel, forcing it to match the black masking ink.

#### 3. The Glass Stack (Corning 2320)

- **Material:** Corning 2320 (Ionized), 1.00mm thick.
- **Finish:** "Mirror Polish" with an Oleophobic Coating (anti-fingerprint).
- **Process:** The glass was "Back painted black" everywhere except the View Area (VA) and sensor windows. This back-painting created the frame, while the tint matched the hole.

### II. THE "GHOST SENSOR" (Hiding the ToF)

The Time-of-Flight (ToF) sensor (ST Micro VL53L0X) was critical for the "Approach" wake-up feature, but its raw components (emitter/receiver lenses) were visually obtrusive.

#### 1. The "Exposed Guts" Failure (SAT-103)

- **The Trigger:** Validation revealed that the ToF sensor components were visible through the cover glass. The report noted: "Sensor windows stand out". The internal metallic/silicon components caught the light, creating visible "eyes" on the smooth black face.

#### 2. The "IR Plastic" Camouflage

- **The Fix:** Engineering implemented a material intervention: **"Add IR plastic in between glass and 'TOF'"**.
- **The Physics:** This "IR plastic" acts as a band-pass filter. It appears opaque black to the human eye (blocking visible light reflection from the sensor internals) but remains transparent to the 940nm Infrared light used by the ToF sensor.
- **Result:** The sensor became invisible to the user ("Ghost Sensor"), yet maintained its functional range to detect user approach.

### III. THE ASSEMBLY STACK-UP

The final optical sandwich required sub-millimeter precision to maintain the "Dead Front" illusion without compromising yield:

1. **Cover Glass:** 1.0mm Corning 2320 (Mirror Polish + Back Paint).
2. **OCA Layer:** 0.10mm - 0.175mm Optically Clear Adhesive.
3. **Camouflage:** IR Plastic insert over the ToF sensor.
4. **Display:** 1.45" AMOLED Panel (Bonded).
5. **Structure:** Magnesium/Polycarbonate mid-frame to hold the stack rigid against the 30kg Crush Test.
