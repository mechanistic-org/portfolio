
import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** The "Director" was the interactive soul of the room. It needed to feel magical, not like a smartphone glued to a wall.

The challenge was **Haptics**. Touching a glass screen on a wall feels dead. We wanted it to click like a physical button.

## Engineering Approach
We suspended the entire glass display stack on a floating flexure system.
*   **Piezo Actuation:** When the user touched an icon, a piezo actuator fired a calibrated impulse into the glass mass, simulating the "snap" of a mechanical dome.
*   **Deadfront ID:** The OLED panel was bonded behind tinted glass so that when off, it disappeared completely into the black finish.

## Impact
It redefined what a sophisticated switch felt like.
*   **Award Winning:** The interaction design won multiple awards for its tactile realism.

### Project Artifacts
:::note[Specs]
*   **Display:** OLED Touch
*   **Feedback:** Piezo Haptic
*   **Glass:** Chemically Strengthened
:::
