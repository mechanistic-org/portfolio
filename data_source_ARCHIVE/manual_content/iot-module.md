
import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** A smart bike is only smart if it can talk to the cloud. The "Sonoma" module was the brain of the Watson e-bike.

The challenge was packaging a cellular modem, GPS, Bluetooth, and main compute board into a compact, bomb-proof enclosure that sat on the rear fender.
*   **RF Performance:** The enclosure had to be RF transparent for LTE/GPS but structurally rigid enough to handle impact.
*   **Thermal:** The cellular radio generated significant heat, but the unit was sealed (IP67) and sat in direct sunlight.
*   **Interconnect:** It had to blind-mate to the bike's harnessing during a "hot swap" battery change.

## Engineering Approach
We designed a sealed "Black Box" (or rather, a white one) using weather-resistant PC/ABS.

*   **RF Window:** We utilized a specific plastic grade that minimized signal attenuation, simulating antenna patterns to ensure connectivity in urban canyons.
*   **Thermal Management:** I integrated a conductive thermal pad strategy to dump heat from the modem shield into the mounting bracket, turning the bike frame itself into a heatsink.
*   **Gasket Design:** We used a custom perimeter gasket compressed by 6 custom security screws to ensure a 5-year watertight seal against pressure washing.

## Impact
This module enabled the "Dockless" capability of the fleet.
*   **Connectivity:** Maintained reliable LTE link even in dense urban environments.
*   **Survival:** Zero water ingress failures reported in pilot deployment.

### Project Artifacts
:::note[Specs]
*   **Comms:** LTE / GPS / BLE
*   **Enclosure:** PC/ABS UV Stabilized
*   **Seal:** Custom Silicone Gasket
:::
