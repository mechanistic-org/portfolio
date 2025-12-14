
import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** Lyft (Bay Wheels) needed a next-gen shared e-bike that could survive the urban jungle.

The "Watson" project wasn't just a bike; it was public infrastructure.
*   **Vandalism:** Parts had to be theft-proof (security torx, hidden fasteners).
*   **Durability:** The frame and fairings had to withstand being knocked over, kicked, and exposed to UV/Salt for 5 years.
*   **Integration:** It needed to house a massive battery and a complex IOT suite without looking like a science experiment.

## Engineering Approach
I led the mechanical design of the rear "Fender" assembly—the structural spine of the bike's electronics.

*   **Structural Plastic:** We used a glass-filled nylon chassis that acted as both the rear fender and the mounting point for the heavy IOT module and locking mechanism. This replaced traditional bent sheet metal with a rigid, injection-molded unibody.
*   **Cable Management:** I designed internal routing channels to protect the high-voltage motor cables and sensitive data lines from wire-cutters.
*   **Serviceability:** While secure against the public, the design allowed authorized field mechanics to swap the entire rear assembly in <3 minutes using specialized tooling.

## Impact
This bike powers the Bay Wheels fleet (and others) today.
*   **Fleet Uptime:** The ruggedized design significantly reduced vandalism-related downtime.
*   **Assembly Time:** The modular fender reduced final assembly tech time by 20%.

### Project Artifacts
:::note[Specs]
*   **Material:** Glass-Filled Nylon
*   **Rating:** IP67
*   **Fleet:** Lyft / Bay Wheels
:::
