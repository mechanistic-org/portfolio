
import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** Streaming services were promising 4K, but the bitrates were crushed. Kaleidescape wanted to deliver **Bit-Perfect** true 4K HDR to luxury home theaters.

The "Strato" (Project Sundance) was the first player designed from the silicon up for the Kaleidescape Movie Store.
*   **Security:** We had to implement the "Secure Video Path" hardware DRM required by Hollywood studios to allow early-window 4K downloads.
*   **Thermal Density:** The SoC ran hot. We needed a silent, fanless cooling solution for the 1U chassis that could sit in a rack or a living room.

## Engineering Approach
I designed the thermal core and chassis architecture.
*   **Gravity Casting:** To achieve the premium feel and thermal mass, we used a gravity-cast aluminum faceplate that acted as a front-end heatsink.
*   **EMI Shielding:** With 4K/60Hz signals, HDMI EMI is a nightmare. I engineered a custom stamped shielding cage that wrapped the mainboard without choking airflow.

## Impact
Strato remains the gold standard for high-end cinema playback.
*   **Visuals:** Delivers 100Mbps video locally (vs 15mbps streaming).

### Project Artifacts
:::note[Specs]
*   **Res:** 4K HDR @ 60fps
*   **Audio:** Atmos / DTS:X
*   **Storage:** 6TB - 12TB
:::
