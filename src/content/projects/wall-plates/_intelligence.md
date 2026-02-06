# Forensic Intelligence: Wall Plates (Waldo)

> **ID:** project_noon_home_waldo_wall_plate_chassis
> **Mode:** Deep Dive
> **Status:** Hydrated (Manual Bolus Injection)

## Metrics (The Triple Constraints)

- **Financial:** Managed tooling costs for multi-gang configurations (2-gang/4-gang), aiming for <$100 system cost targets.
- **Process:** Reduced chassis tooling lead-time to 6 weeks for EVT1 delivery.
- **Governance:** Rigorous 'Tolerance Stackup' reviews (Sources 5-13) and JIRA tracking (WAL-XX) for 'Zero to Zero' fitment.

## Forensic Summary (Trigger -> Intervention -> Result)

**TRIGGER:** The stamped SPCC steel chassis suffered 'pillowing' deformation due to aggressive 'large square dimples' in the tooling, consuming Z-axis tolerance and preventing the 'Slide-Lock' mechanism from engaging. Concurrently, the Wall Plate exhibited '0mm clearance' interference with the Bazooka module and 'Jiggling' due to loose snap fits.

**INTERVENTION:** The Architect mandated a tooling modification to 'minimize to round pip' to eliminate stress concentrations and flatten the mating surface. He orchestrated a forensic tolerance analysis enforcing '+/- 0.05mm' precision on snap features and adding 'local pads for snap tuning' to secure the assembly.

**RESULT:** Eliminated chassis warping, achieved 'Zero to Zero' flushness, and standardized the aesthetic with 'Satin VDI 15' to match the premium modules.

## Toolchain

- Creo (CAD modeling)
- Excel (Tolerance Stackups: Colorado_Tolerance_Stackups_Fx.pdf)
- Proto Labs (CNC/Rapid Prototyping)
- FIH (Manufacturing/DFM)
- JIRA (Issue Tracking: WAL-15, WAL-22)

## Cast

- **Erik Norris** (Head of ME / The Architect) - Locoroll (Noon Home)
- **Colin Davis** (Stack Engineer) - Function Engineering
- **Will** (ME Lead) - Locoroll
- **Kelvin** (Manufacturing Engineer) - FIH

## Visuals to Find

- `SAT-ELV_misc.pdf` (Redlines of 'Square dimples too pillowed' and 'round pip' fix)
- `Colorado_Tolerance_Stackups_Fx.pdf` (Diagrams showing '0mm!' clearance risk)
- `SPEC_color.pdf` (Waldo CMF: Satin VDI 15 and Black Zinc Chassis)
- `20170306Waldochassis(4-gang).pdf` (Protolabs CNC quote)

## Raw Evidence (Quotes)

> "Square dimples too pillowed ...deformation at slide-lock - minimize to round pip."
> "Stop rib will just barely (0mm!) clear top edge of Bazooka."
> "Design should be revised so only single tab acts as 'stop' in Y."
