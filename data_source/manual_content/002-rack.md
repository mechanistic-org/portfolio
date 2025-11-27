## The Design Challenge

The **002 Rack** represented a significant shift in Pro Audio interfaces. The goal was to pack the processing power of the 003 Console into a **2U Rackmount** form factor without compromising thermal performance or analog signal integrity.

This wasn't just a "re-packaging" job; it required a ground-up mechanical redesign to solve three critical constraints:

1.  **Thermal Density:** Dissipating 45W in a sealed 2U chassis without fans (silent operation required for recording studios).
2.  **EMI Shielding:** Isolating the high-voltage power supply from the sensitive mic preamps.
3.  **Manufacturing Cost:** Reducing the sheet metal BOM count by **15%** vs. the predecessor.

---

### Mechanical Architecture

We moved away from the traditional "Motherboard + Daughterboard" stack and utilized a **Single-Plane Architecture**. This allowed us to use the chassis bottom as a primary heatsink.

<div class="grid md:grid-cols-2 gap-8 my-12 items-center">
  <div class="rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
    <img src="https://assets.eriknorris.com/002-rack/hero.png" alt="Exploded View" class="w-full h-auto object-cover" />
    <div class="bg-neutral-950 p-2 text-xs text-center text-neutral-500 font-mono">FIG 1: CHASSIS EXPLODED VIEW</div>
  </div>
  <div>
    <h4 class="text-lg font-bold text-white mb-2">Key Design Decisions</h4>
    <ul class="space-y-2 text-sm text-neutral-300">
      <li>• <strong>0.8mm SECC Steel:</strong> Chosen for optimal balance of EMI shielding and stiffness.</li>
      <li>• <strong>Custom Extrusion:</strong> The front panel is a single piece of anodized aluminum, acting as a structural beam.</li>
      <li>• <strong>Floating Mounts:</strong> The transformer is isolated on rubber bushings to prevent 60Hz hum transfer.</li>
    </ul>
  </div>
</div>

> **Engineering Note:** "The hardest part wasn't the heat—it was the *vibration*. Tour buses rattle equipment to death. We had to reinforce the PCB standoffs three times before passing the drop test."

---

### Validation & Testing

We utilized **Finite Element Analysis (FEA)** to predict thermal hotspots, but nothing beats real-world destruction. Below is footage from the "Shake Table" test at the manufacturing facility in Dongguan.

<div class="my-12 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
  <YouTube id="dQw4w9WgXcQ" />
</div>

### The Result

The unit shipped on time and became the industry standard for mobile recording rigs, selling over **50,000 units** in the first year.

### Interactive Assembly

Explore the final chassis assembly below. Note the rear I/O density and the cooling vents on the top lip.

<ModelViewer src="https://assets.eriknorris.com/002-rack/model.glb" alt="002 Rack Assembly" />