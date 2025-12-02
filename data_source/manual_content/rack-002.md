import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** The Pro Audio market demanded the processing power of the flagship 003 Console in a compact, silent form factor for mobile recording rigs.

Existing solutions were either underpowered or too loud for studio environments. The core engineering challenge was to pack **45W of thermal dissipation** into a sealed 2U chassis without using fans, while maintaining strict analog signal integrity in a high-EMI environment. We needed a "Library Quiet" solution that could also survive the rigors of tour bus travel.

## Engineering Approach
I led the mechanical architecture redesign, moving away from a traditional stacked-board layout to a **Single-Plane Architecture**. This decision allowed us to utilize the chassis bottom as a primary heatsink, coupling the power supply and DSP engine directly to the steel skin.

*   **Structural Design:** Engineered a custom anodized aluminum front panel that acts as a structural beam, increasing chassis stiffness by 40% to pass drop tests.
*   **Vibration Isolation:** Designed a floating mount system for the transformer using custom rubber bushings to eliminate 60Hz hum transfer to the chassis.
*   **EMI Containment:** Selected 0.8mm SECC steel for the optimal balance of magnetic shielding and cost, reducing the sheet metal BOM count by 15%.

<div class="grid md:grid-cols-2 gap-8 my-12 items-center">
  <div class="rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
    <img src="https://assets.eriknorris.com/002-rack/hero.png" alt="Exploded View" class="w-full h-auto object-cover" />
    <div class="bg-neutral-950 p-2 text-xs text-center text-neutral-500 font-mono">FIG 1: CHASSIS EXPLODED VIEW</div>
  </div>
  <div>
    <h4 class="text-lg font-bold text-white mb-2">Validation</h4>
    <ul class="space-y-2 text-sm text-neutral-300">
      <li><strong>FEA:</strong> Thermal simulation predicted hotspots within 2°C of actuals.</li>
      <li><strong>Shake Table:</strong> Verified structural integrity under 1G random vibration.</li>
    </ul>
  </div>
</div>

## Impact
The 002 Rack launched on time and became the industry standard for mobile recording.

*   **Sales:** Sold over **50,000 units** in the first year.
*   **Reliability:** Achieved a field failure rate of &lt;0.5%.
*   **Legacy:** The thermal architecture became the reference design for the next two generations of Avid interfaces.

### Project Artifacts
<div class="my-12 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
  <YouTube id="dQw4w9WgXcQ" />
</div>

<ModelViewer src="https://assets.eriknorris.com/rack-002/model.glb" alt="002 Rack Assembly" />