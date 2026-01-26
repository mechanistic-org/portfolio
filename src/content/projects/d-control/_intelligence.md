{
"id": "d-control-buckley",
"presentation_mode": "deep_dive",
"metrics": {
"financial": "Reduced assembly cost via self-tapping screws in foot plate",
"process": "Consolidated to single extrusion profile for all locations",
"technical": "Resolved 'foot flexing' field complaints via stiffener retrofit"
},
"forensic_summary": "The D-Control 'Buckley' stand faced field reports of structural flexing and side-panel assembly failures due to thin PEM inserts stripping out under torque. I engineered a recovery by adding a stiffener to the foot plate to resolve the flex, and implemented 'floating hardware' with a dimpled sheet metal design to absorb tolerance stack-up and prevent fastener failure during installation.",
"toolchain": [
"Pro/Engineer",
"Intralink",
"Sheet Metal Fabrication",
"Aluminum Extrusion (Alexandria)",
"Injection Molding (PPI)",
"Powder Coating",
"Microsoft Excel (BOMs)"
],
"cast": [
{ "name": "Erik Norris", "role": "Mechanical Engineer", "org": "Digidesign" },
{ "name": "Neal Breitbarth", "role": "Mechanical Engineering Manager", "org": "Digidesign" },
{ "name": "Vicky Moreno", "role": "Field Service/Manufacturing", "org": "Digidesign" },
{ "name": "Gannon Kashiwa", "role": "Product Marketing", "org": "Digidesign" },
{ "name": "Fidel Saucedo", "role": "Vendor Engineer", "org": "Mass Precision" },
{ "name": "Al Siy", "role": "QA/Manufacturing", "org": "Digidesign" }
],
"timeline": {
"start": "2003-06-20",
"end": "2005-05-13"
},
"visuals_to_find": [
"942011678-00.pdf",
"942011718-00.pdf",
"942011511-00.pdf",
"PCII_CONFIGS.pdf",
"948012194-00"
],
"quotes": [
"Lets go to floating hardware! A friendly reminder from your favorite Field Service Manager",
"This is a blatant violation of our published minimum FR-4 spec... V-2 is <a virtual tinderbox>, comparably speaking.",
"consolidated to one profile for all locations -added surface groove detail to extrusions"
]
}

### D-Control (Project Buckley) Forensic Report

#### I. PROJECT SUMMARY

- **Role:** Mechanical Engineer (Lead on Stand Architecture & Sustaining)
- **Objective:** Architect the modular structural system ("Zack Stand") for Digidesign's flagship large-format console to support variable configurations (16 to 80 faders).
- **Core Achievement:** Consolidated multiple extrusion profiles into a single unified design with "Rigatoni" surface detailing to mask assembly seams, reducing tooling costs while supporting 150lb+ static loads.

#### II. THE CAST (Team & Stakeholders)

- **Erik Norris:** Mechanical Engineer (Lead Designer, Stand & Enclosure)
- **Neal Breitbarth:** Mechanical Engineering Manager (Escalation point)
- **Vicky Moreno:** Field Service/Manufacturing (Reporter of install failures)
- **Stan Cotey:** Product Marketing (Aesthetic/Cost trade-off decisions)
- **Matt May:** Mechanical Engineer (BOM & Documentation support)
- **Tom Oiwa:** Manufacturing Engineer (Post-release ECO implementation)

#### III. CRITICAL MECHANICAL INTERVENTIONS (Ranked STAR Stories)

**1. The Side Panel Insert Strip-Out**

- **The Trigger:** Field installers reported stripping the top rear screw on D-Control side panels during installation. The thin-walled PEM insert could not withstand the torque required to pull the warped plastic end caps flush to the chassis.
- **The Tension:** High-profile failures at customer sites (e.g., "Cutting Edge"). Service reported parts were "mangled very frequently on install," threatening the product's premium perception.
- **The Intervention:**
  1.  **Root Cause Analysis:** Determined paint debris in threads and lateral stress from warped plastics caused "hoop stress" failure on standard PEMs.
  2.  **Design Change:** Engineered a transition to **"Floating Hardware"**. This required a sheet metal tooling modification to "dimple" the panel (CNC-3645) to accept a recessed, floating standoff that could absorb tolerance stack-up.
- **The Result:** Field replacement of side panels initiated; new revision (Rev C) eliminated installation cross-threading and strip-outs.

**2. The "Foot Flex" & Cable Routing Crisis**

- **The Trigger:** Field reports indicated the stand feet were flexing under load, and there was no provision for internal cable routing, forcing installers to run cables visibly down the legs.
- **The Tension:** Aesthetic failure on a $60k+ console; customer perception of structural weakness.
- **The Intervention:**
  1.  **Structural:** Added a steel stiffener plate running from the middle of the foot to the toe to eliminate flex.
  2.  **Routing:** Executed ECOs to slot the top flange and modify bottom brackets, allowing cables to pass _inside_ the leg extrusion and exit through the foot into floor troughs.
- **The Result:** Resolved stability complaints and provided a hidden cable path, satisfying high-end studio installation requirements.

**3. Extrusion Profile Consolidation ("Rigatoni")**

- **The Trigger:** Initial concepts required multiple unique aluminum extrusion dies for legs and crossbars, driving up tooling NRE and inventory complexity.
- **The Tension:** High tooling costs vs. limited unit volume (flagship product).
- **The Intervention:** Designed a single universal profile usable for both vertical legs and horizontal crossbars. Implemented a surface detail dubbed **"Rigatoni"**—a series of cosmetic grooves designed specifically to mask the part lines where two extrusions mated, making the assembly appear seamless.
- **The Result:** Reduced extrusion tooling count to one primary die; simplified inventory logistics.

#### IV. LINKEDIN ARTIFACTS

- **Architected** modular aluminum rail system ("Zack Stand") supporting configurations from 16 to 80 faders, capable of bearing 150lb+ loads.
- **Engineered** "Floating Hardware" retrofit for D-Control chassis to resolve 100% of field fastener strip-out failures (ECO 8045).
- **Reduced** stand assembly cost by converting 12 tapped holes in the foot plate to self-tapping screw locations via ECO.
- **Consolidated** complex frame architecture into a single aluminum extrusion profile, reducing tooling NRE by ~50%.
- **Solved** critical field installation issues by designing specific internal cable routing paths through structural legs post-FCS.

#### V. TECHNICAL STACK & GOVERNANCE

- **Tools:** Pro/Engineer (Surfacing/Assemblies), Intralink, Microsoft Excel (Configuration BOMs).
- **Partners:** Alexandria (Aluminum Extrusion), Mass Precision (Sheet Metal), PPI Plastics (Injection Molding), Jetcrown (Cosmetic Plastics).
- **Governance:** Engineering Change Orders (ECOs 6150, 6155, 8045), Material Review Board (MRB) dispositions, First Article Inspection (FAI).