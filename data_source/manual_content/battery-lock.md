
import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** A micromobility fleet needed a way to secure high-value battery packs against theft while allowing authorized "Swap Teams" to replace them in seconds.

The "Halfdome" project was an electromechanical battery lock designed for severe abuse:
*   **Vibration:** It had to stay locked while bouncing down potholes at 20mph.
*   **Security:** It needed to resist pry attacks and picking.
*   **Environment:** It lived outside, exposed to rain, salt spray, and road grime.

## Engineering Approach
We designed a custom motorized locking dog mechanism rather than a simple solenoid (which can vibrate open).

*   **Gearbox Design:** I engineered a high-reduction spur gear train driven by a small DC motor. This provided massive holding torque to the locking pin without requiring continuous power to stay locked (bi-stable design).
*   **Sealing:** The entire mechanism was housed in a glass-filled nylon enclosure with an ultrasonic weld path, achieving IP67 ingress protection.
*   **Feedback:** Integrated Hall Effect sensors provided closed-loop confirmation of "Locked" and "Unlocked" states to the main vehicle controller.

## Impact
This mechanism became the standard retention system for the fleet.
*   **Reliability:** >10,000 cycle life tested under vibration load.
*   **Security:** The non-backdrivable gear train made forced entry nearly impossible without destroying the latch.

### Project Artifacts
:::note[Specs]
*   **Actuation:** DC Motor + Gearbox
*   **IP Rating:** IP67
*   **Cycle Life:** 10k Cycles
*   **Lock Force:** >500N
:::
