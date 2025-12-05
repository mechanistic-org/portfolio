import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** Hyphen (Foodservice Automation) is revolutionizing the commercial kitchen with robotics.

The objective was to design a high-throughput automated dispensing module for the "Makeline" platform. The system needed to handle viscous fluids (sauces, dressings) with 99.9% volumetric accuracy while meeting strict NSF/ANSI sanitation standards.

## Engineering Approach
We adopted a "Sanitary-First" design philosophy, prioritizing wash-down capability and tool-less disassembly.

*   **IP69K Wash-Down Architecture:** Engineered the entire electromechanical assembly to withstand high-pressure, high-temperature wash-down cycles. Utilized double-sealed bearings and potted electronics.
*   **Hygienic Material Selection:** Exclusively used **316 Stainless Steel** and FDA-approved Acetals (POM) for all food-contact surfaces to prevent corrosion and bacterial growth.
*   **Volumetric Precision:** Implemented a custom positive-displacement pump mechanism driven by a closed-loop stepper motor, achieving +/- 0.5g dispensing accuracy.
*   **Tool-Less Serviceability:** Designed quick-release cam levers for the hopper and pump assembly, reducing daily cleaning time from 20 minutes to &lt;3 minutes per unit.

## Impact
The "Backsplash" module became a core component of the Makeline v1.
*   **Throughput:** Increased line speed by **300%** compared to manual assembly.
*   **Waste Reduction:** Reduced food waste by **15%** through precise portion control.
*   **Reliability:** Achieved **10,000+ cycles** Mean Time Between Failure (MTBF) in accelerated life testing.

### Project Artifacts
<div class="my-8">
  <YouTube id="dQw4w9WgXcQ" />
</div>
{{MODEL_URL}}
