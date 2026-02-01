Orpheus / Ksystem-120 Forensic Report
I. PROJECT SUMMARY
• Role: Senior Mechanical Design Engineer.
• Mandate: Execute the mechanical design and manufacturing ramp of the "Mini System" (Orpheus/Ksystem-120), a high-density A/V server intended for rack or shelf deployment, bridging the gap between legacy servers and new low-cost players,.
• Core Achievement: Salvaged the "Pilot Build" (50 units) and "Production" (300 units) by identifying and remediating critical interference issues (Lid Weldment, PCB Flex) and driving vendor transition from Mass Precision to Sanmina,,,.
II. THE ANATOMY OF FAILURE (Heuristic Analysis)
Thermal & Mechanical Crisis
• The PCB Fracture: During assembly, the sheer density of cabling and tolerance stack-up caused the main Player PCB to flex, shearing off BGA components and breaking traces. This resulted in permanent board damage and "Gennum" communication failures,.
• The Thermal Hang: Early units suffered "hard hangs" every 50 minutes. Root cause traced to missing thermal paste on the CPU during assembly at Meritronics/Sanmina and interference from custom heatsink clips,.
• Interference (The Lid): A weldment on the top cover (520-1066-00) was out of spec, pressing down on the drive cage. This compressed the assembly so severely that the KDISK cartridges could not be inserted or removed, and the lid could not seat,.
Quality & Supply Chain Friction
• The "Glow" Debacle: The front panel LED array produced "blobby," inconsistent light diffusion. The PCB was too close to the bezel. I had to coordinate a re-design involving low-profile LEDs, bleeder resistors, and physically spacing the PCB back 3-6mm using standoffs to achieve uniformity,,,.
• Sanmina/Plant 4 Incompetence: The metal enclosure vendor (Sanmina Plant 4) delivered parts with punching flash remnants, incorrect masking lines, and formed flanges that blocked assembly. I was forced to issue deviations to keep the line moving while rejecting non-compliant metal,,.
• Fastener Failure: The initial design used extruded/tapped holes for 6-32 screws. The sheet metal (501-1092-00) was too thin, causing stripped threads during assembly. I engineered a transition to clinch nuts (PEMs) via ECO 789 to guarantee torque retention,,.
The Fix
• ECO 789 (Sheetmetal DFx): Replaced tapped extrusions with clinch nuts (PEMs) for plenum and feet attachment to prevent stripping.
• ECO 817 (Sheetmetal DFx): Comprehensive sheet metal update to correct tolerance stack-ups, grounding paths (wiping fingers), and fan tray misalignments,,.
• Heatsink Redesign: Transitioned to a custom machined heatsink (326-1010-00) with specific rubber feet to ensure proper pressure without board damage,.
III. GOVERNANCE & RHYTHM
• The Pulse: The project was managed through "Weekly Mechanical / ID Meetings" and high-frequency "War Room" coordination between Waterloo (EE/SW) and Sunnyvale (ME/Ops). I served as the central filter for all CAD deliverables from the ID firm (Argyle) before release to the CM (Sanmina),.
• The Artifacts:
◦ MCT (Mechanical Change Tracking): A master spreadsheet I maintained to track every feature change across revisions (e.g., "MCT-ECN-001"), enforcing revision control on a chaotic prototype cycle,.
◦ FAIRs (First Article Inspection Reports): I mandated and reviewed detailed inspection reports for every metal and plastic component to catch vendor deviations,.
◦ BOMs (Bill of Materials): Constantly scrubbed 801-level BOMs to sync fasteners, gaskets, and foam with rapidly changing sheet metal revisions,.
IV. LINKEDIN ARTIFACTS (The Numbers)

1. Directed the manufacturing transfer of the Orpheus enclosure to Sanmina Guadalajara, resolving 3 critical stop-ship interference issues during the Pilot phase,.
2. Engineered a cost-reduction strategy for the CPU thermal solution, negotiating unit price down from $9.63 to $9.25 while improving reliability.
3. Executed a rapid-turn 50-unit pilot build, coordinating material logistics between 4 vendors (Mass, Prompt, EAR, Kontron) to meet strict launch deadlines,.
4. Identified and Eliminated a 0.005" tolerance stack-up error in the fan tray assembly that prevented proper lid closure, averting a production yield crisis.
5. Released over 20 unique sheet metal and plastic components via ECO to support the Ksystem-120 launch, achieving FCC Class B compliance through iterative EMI shielding improvements,.
   V. VISUAL EVIDENCE
   • 03_Engineering_FAIs.pdf: Inspection data sheets proving the rigorous FA process (e.g., 502-1052-00).
   • 03_Engineering_metal-parts.pdf: "MCT-ECN-001" spreadsheet detailing specific geometry changes (e.g., "relo cable tie bridge form").
   • glow_12_29_08.pdf: Analysis of the LED PCB spacing required to fix the "blobby" light leak issue.
   • to_mass_07_31_08.zip: Evidence of the constant data hand-off to vendors for rapid prototyping.
   • 501-1092-00_REV_3.pdf: The base chassis drawing, central to the tolerance stack-up analysis.
