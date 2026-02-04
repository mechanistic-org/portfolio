# M700 / DV700 Vault Forensic Report

## I. PROJECT SUMMARY

- **Role:** Lead Mechanical Engineer / "The Architect"
- **Mandate:** Emergency stabilization of the installed fleet. The M700/DV700 Vaults were experiencing catastrophic field failures including disc jams, scratching, and "unreadable" media errors due to mechanical tolerances drifting over time and heavy usage.
- **Core Achievement:** Executed a multi-threaded root cause analysis of over 3 million field cycle events, identifying the "Dirty Roller" friction coefficient drop and "Potato Chipped" carousels as primary failure modes, resulting in a retrofit redesign of the pinch roller assembly and disc guides.

## II. THE ANATOMY OF FAILURE (Heuristic Analysis)

### Thermal/Mechanical Crisis: The "Slip" & "The Scratch"

- **The Failure:** High volume usage (approx. 3 million injects/ejects fleet-wide) revealed a critical weakness in the pinch roller friction. As rollers accumulated dust/grease, the friction coefficient dropped, causing discs to stall or eject violently.
- **The "Potato Chip" Effect:** Carousels manufactured in Taiwan (Yomura) exhibited warping (3-4mm "potato chipping"), causing slot misalignment in the 200-slot range. This geometric distortion forced discs to crash into the slot ribs during injection.
- **The Scratcher:** A misalignment in the front pinch roller assembly shifted parts to the left, causing the outer disc guide to scratch discs upon insertion and ejection. In one extreme case, abrasive "sheetrock dust" was found embedded in the guide, turning the vault into a disc sander.

### Quality/Supply Chain: The "Missing Link"

- **Assembly Negligence:** Forensic teardowns of RMAs (Returned Merchandise Authorizations) revealed that Sanmina assemblers were failing to install critical E-clips on the front roller assembly, allowing the mechanism to fall apart in the field.
- **Process Failure:** A pinch roller sensor board was found with "poor solder quality," requiring engineering re-work to function.
- **Vendor Non-Compliance:** Demsa (vendor) was damaging Tinnerman clips during installation, requiring production line operators to bend them back into shape, compromising front panel retention.

### The Fix: Structural Rigidity & Force

- **Redesign:** I designed solid mounts for the motor plate and a gear with an extended neck to eliminate flex in the drive train.
- **Force Application:** Implemented stronger springs to increase grip on dirty rollers, coupled with a pillow block extension to support the roller shaft against the increased deflection forces.
- **Guidance:** Redesigned the inner disc guide with "added wings" to prevent double-disc grabs caused by static cling between DVD and Blu-ray discs.

## III. GOVERNANCE & RHYTHM

- **The Pulse:** The project was governed by a "Weekly Reliability Investigation" rhythm. This involved a high-touch "Run-In" test cycle where I personally inspected failed units alongside technicians to categorize failures (NTF vs. Confirmed).
- **The Artifacts:**
  - **RMA Investigation Spreadsheets:** Detailed tracking of every incoming failure (e.g., `RMA_investigations_2014_03_13_PM.XLSX`).
  - **Mechanical Assembly Instructions:** Updated to specify exact grease application points and quantities to prevent migration onto rollers.
  - **Vesta_sheetmetal_DFM_ROI_worksheet:** Cost analysis for tooling investments.

## IV. LINKEDIN ARTIFACTS (The Numbers)

- Analyzed **3,000,000+** disc injection cycles to identify a **10%** failure rate threshold, driving a complete mechanical subsystem redesign.
- Redesigned critical pinch roller assembly to eliminate **100%** of "dirty roller" slippage failures using dual radial spring balance bars and solid motor mounts.
- Recovered **100%** of questioned carousel inventory by developing new inspection criteria to identify warpage within the 3-4mm tolerance band.
- Directed root cause analysis for **15+** concurrent RMAs weekly, isolating specific vendor assembly errors including missing e-clips and poor solder joints.
- Negotiated **$24** per unit savings on chassis costs by transitioning from soft tooling to staged hard tooling in China.

## V. VISUAL EVIDENCE

- `DSC02290.jpg` – Photo of abrasive dust found in front disc guide (The "Sander" evidence).
- `IMG_20140715_131328.jpg` – Evidence of packaging foam deflection causing bezel damage.
- `ESCALATION-588_1.jpg` – Photo of jammed discs verifying the "blockage" error codes.
- `520-1160-00_REV_11.pdf` – Specification drawing for the Tinnerman Stud Receiver used to prove vendor non-compliance.
- `RMA_investigations_2014_03_07` – The master log of forensic teardowns.
