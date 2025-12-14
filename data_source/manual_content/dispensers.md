
import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** The Makeline needed hands. The Dispeners were those hands.

The problem was universality. A single robotic module had to dispense ingredients ranging from water-thin dressings to chunky guacamole, pulled pork, and sticky rice.
*   **Precision:** +/- 2g repeatability across all textures.
*   **Sanitary:** NSF-8, IP69K washdown, tool-less disassembly for cleaning.
*   **Smart:** Each dispenser needed to be an intelligent edge node, knowing its own calibration, fill level, and wear state.

## Engineering Approach
We developed "Gen 2" as a fully self-contained mechatronic brick.

*   **Universal Agnostic Pumping:** We engineered a quick-change pump interface that accepted different pump heads (Gear, Lobe, Auger) depending on the ingredient rheology, all driven by the same core motorbox.
*   **The "Smart Brick":** Embedded STM32 microcontroller handled the closed-loop motion profile locally. The dispenser didn't just receive "Turn ON" commands; it received "Dispense 45 grams of Guacamole" and handled the acceleration curves to prevent splashing.
*   **Hygienic Design:** The entire fluid path was isolated from the electromechanical core. The motor coupled magnetically or via sealed spline, ensuring zero risk of food ingress into the chassis.

## Impact
This was the high-volume enabler.
*   **Speed:** <3 second cycle time per shot.
*   **Uptime:** Hot-swappable in 5 seconds. If a pump jammed, the operator just pulled it and clicked in a fresh one.

### Project Artifacts
:::note[Technical Specs]
*   **Accuracy:** +/- 2g
*   **Rating:** IP69K
*   **Comms:** CANOpen (Smart Node)
*   **Power:** 48V BLDC
:::
