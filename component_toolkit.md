# Component Toolkit & Inventory

## visual_surfacing (Galleries)

- **`Projects/ProjectGallery.tsx`**: Standard masonry/grid gallery for project assets.
- **`Projects/SharedLayoutGallery.tsx`**: Shared layout variant.
- **`Effect/Scrolly`**: Scrolly-telling visual components (found in `src/components/Scrolly`).

## narrative_surfacing (Text)

- **`Effects/ScrambleText.tsx`**: "Hacker style" text decoding effect.
- **`Effects/ZipperText.tsx`**: Text that unzips/reveals.
- **`Scrolly/TextDeck.astro`**: Text blocks for scrolly-telling.
- **`Starwind/textarea` & `button-group`**: Input/Command surfacing.
- **`Prose`**: Standard Tailwind Typography (via `ForensicDrawer`).

## data_visualization (D3 & SVG)

- **`TeamPipChart.tsx`**: Team composition (Internal/External/Core) using SVG pips.
- **`ConstructionGauge.tsx`**: Circular progress/status gauge.
- **`LivingGantt.tsx`**: D3 Gantt chart for project timelines.
- **`SkillRadarD3.tsx`**: Radar chart for skills.
- **`PhaseDonutD3.tsx`**: Donut chart for project phases.
- **`ResVizSwarm.tsx`**: Force-directed swarm plot.

## interactive_modules (Drawers/HUDs)

- **`Scrolly/ForensicDrawer.tsx`**: Confidental/Case Theory slide-out drawer.
- **`Projects/DossierToggle.tsx`**: The "Access Dossier" button (To be replaced).
- **`Projects/ProjectManifestHUD.astro`**: Heads-Up Display for project metrics (uses `TeamPipChart`).

## registry_nodes (Data)

- **`forensic_registry.json`**: Mechanical/Forensic project data.
- **`system_registry.json`**: Site/System meta-data.
