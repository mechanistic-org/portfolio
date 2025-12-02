import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** The launch of the next-generation Xbox required a console capable of massive performance in a constrained, consumer-friendly form factor.

We faced a **"Billion-Unit Challenge"**: designing a thermal engine that could survive the varied and often hostile environments of living room entertainment centers (dust, enclosed cabinets) while maintaining peak performance. The mandate was clear: **Zero Throttling. Zero Noise. Zero Returns.**

## Engineering Approach
We engineered a custom cooling architecture and optimized the assembly for mass production to meet the 250W TDP requirement.

*   **Vapor Chamber:** Implemented a custom copper vapor chamber—technology typically reserved for server blades—to wick heat away from the GPU die instantly.
*   **Convection Cooling:** Designed the chassis for negative pressure, pulling cool air from the sides and exhausting it vertically to mimic and aid natural convection.
*   **Material Engineering:** Switched the internal shroud material from standard ABS to a glass-filled polycarbonate blend after EVT testing revealed thermal deformation risks.
*   **DFM (Design for Manufacturing):** Reduced the screw count by 40% using snap-fits and interlocks, and implemented "poka-yoke" mechanisms to prevent assembly errors at the factory.

<div class="grid md:grid-cols-2 gap-8 my-12 items-center">
  <div class="rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
    <div class="bg-neutral-900 h-64 flex items-center justify-center text-neutral-500">
        [PLACEHOLDER: EXPLODED VIEW DIAGRAM]
    </div>
    <div class="bg-neutral-950 p-2 text-xs text-center text-neutral-500 font-mono">FIG 1: THERMAL CORE</div>
  </div>
  <div>
    <h4 class="text-lg font-bold text-white mb-2">Key Metrics</h4>
    <ul class="space-y-2 text-sm text-neutral-300">
      <li><strong>TDP:</strong> 250W Dissipation Capacity</li>
      <li><strong>Acoustics:</strong> < 35dB at Full Load</li>
      <li><strong>Yield:</strong> 99.8% First Pass Yield</li>
    </ul>
  </div>
</div>

## Impact
The project was a masterclass in precision engineering at scale, defining a generation of gaming with its silent, powerful performance.

*   **Production:** Achieved a factory output rate of **1.5 units per second** at peak.
*   **Quality:** Maintained a 99.8% First Pass Yield.
*   **Legacy:** The console shipped on time and under budget.

### Project Artifacts
<ModelViewer src="{{MODEL_URL}}" alt="WebTV Unit" />
