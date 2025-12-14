
import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** Noon Home wanted to overlay professional-grade lighting control onto existing residential wiring without centralized panels.

The "Base" was the Trojan Horse. To the user, it was just a light switch. To the system, it was the central server.
*   **Density:** We had to pack a sophisticated Linux computer, Wi-Fi/Bluetooth/Thread radios, and a 600W dimming circuit into a standard single-gang electrical box.
*   **Thermals:** Dissipating heat from the high-voltage dimmer and the CPU without visible vents (which would ruin the aesthetic).

## Engineering Approach
I architected the thermal stack and mechanical enclosure.
*   **The "Chiropractor" Install:** The unit snapped into a separate "Baseplate" that handled the high-voltage wiring, allowing safe installation of the logic unit later.
*   **Thermal Mass:** The aluminum bezel wasn't just decoration; it was the primary heatsink, conductively coupled to the triacs to wick heat out to the room air.

## Impact
The Base enabled the "Noon Experience" without a hub.
*   **Invisible Tech:** It hid a quad-core processor on the wall without looking like a gadget.

### Project Artifacts
:::note[Specs]
*   **OS:** Linux
*   **Power:** 120V / 600W
*   **Comms:** Wi-Fi / BT / Thread
:::
