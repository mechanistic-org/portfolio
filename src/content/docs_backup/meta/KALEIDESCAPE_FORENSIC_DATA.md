# Kaleidescape Forensic Intel (Recovered 2026-01-06)

_Source: NotebookLM "Sequential Protocol" via Stitched Email Archive_

## 1. The Hardware Ecosystem (Map)

### Orpheus Family (Mini System)

- **Orpheus (KSYSTEM-120/100):** Mini System (Player+Server).
  - **Mechanics:** CRS (Zinc/G30) chassis. Plastic bezel (polycarbonate).
  - **Drives:** 4x 2.5" HDD (KDISK-M).
  - **Crisis:** "Hammered Lid" (Tolerance fail).
- **Odie:** Cost-reduced Orpheus (No EAZ/Component).
- **Morpheus:** DS version (Blanked rear panel).

### Mercury Family (Mini Player)

- **Mercury (KPLAYER-300):** 1080p Mini Player.
  - **Mechanics:** Plastic enclosure (Cycloy/Lexan) with conductive EMI paint.
  - **Crisis:** "Chewed Edge" Texture (Paint vs Mold).
- **Mars:** Main board platform.
- **Pinata:** Variant with extra audio/RS232.

### Apollo Family (1080p Player)

- **Apollo (KPLAYER-6000):** 1U Rack Player (Sheet Metal).
- **Ares:** Successor ("New Apollo"). Zinc/CRS chassis. Zoran TL10.

### Cinema One Family

- **Macduff:** Cinema One (2nd Gen). Metal base, plastic top.
  - **Crisis:** "Flow Mark" Rejection (Yomura).
- **Stratus:** Cinema One Alto (Playback only).

### Vault Family

- **Vesta (M700):** Disc Vault (Loader + Player). 5U.
  - **Crisis:** "Vanishing Discs" (Static cling, dirty rollers).
- **Janus (DV700):** Disc Vault (Loader only).

### Next Gen / Concepts

- **Sundance:** 4-Disk Server (Consumer). Metal base, plastic face.
- **Ocean:** 4K Server (K0509).
- **Gosford:** 4K Player (STiH318).
- **Titan / Hydra:** Server variants.

---

## 2. The War Stories (Engineering Crises)

### The Vault: "Vanishing Discs" & "Butter Knife" Eject

- **Issue:** Discs sticking together (static) or inserted backward, bypassing sensors.
- **Fix:**
  - **Hard:** Redesigned pinch roller (double springs, solid mounts to stop deflection).
  - **Soft:** "Blind Eject" firmware routine.
  - **Field:** "Butter Knife" required to clear EMI gaskets hanging into slot.

### Orpheus: The "Hammered" Lid

- **Issue:** Top covers (Sanmina) were 3mm too wide and weldments were off. Crushed the drive cage.
- **Fix:** Greg Curry physically **hammered** them into shape for EMI testing. Manufacturing had to modify weld fixtures.

### Orpheus: "Thumb of God" (Thermal)

- **Issue:** Thermal adhesive thickness varied (0.3mm), causing 20°C delta on CPU. Hard hangs.
- **Fix:** Switched to PCM (Phase Change Material) + heavy spring-loaded clips (mechanical redesign).

### Orpheus: The "Bending Board"

- **Issue:** PCB flexed when screwed down, fracturing BGA solder joints (Gennum chip).
- **Fix:** Redesigned rear sheet metal wall for rigidity + added 4 mounting screws.

### Cinema One: Shipping Damage (The "G-Force")

- **Issue:** Foam packaging compressed, allowing unit to accelerate inside box. ODDs sheared off mounts.
- **Fix:** Redesigned foam density and fillers.

### M500: The Flaming SATA Cable

- **Issue:** Vendor swapped Gold Plating for "Gold Flash". Connector overheated and melted/charred.
- **Fix:** Emergency purge and vendor switch (YC Cable).

---

## 3. Quality Standards ("Pixel Perfect")

- **"Rust" Perception (Mass Precision):** Rejected internal brackets with "black spots" even though funcationally fine. "User will think it's rust."
- **"Smudge Mark" Paint (Yomura):** Rejected 1,200 parts with flow marks. Rejected the "spot paint" fix because it looked like a smudge. Forced Mold Flow Analysis re-tooling.
- **"Chewed Edge" Texture (Steman):** Rejected painted texture which looked "chewed" at edges. Forced texture into the hard tool steel.
- **"Short Screw" (North State):** Scrapped 3,400 screws for being 0.03" too short. Line down situation accepted rather than compromise.
- **"Loose Bag" (Stratasys):** Formal reprimand for shipping expensive prototypes loose in bags without cardboard backers.

---

## 4. Biography / Leadership

- **Windchill (PDM):** Rescued IP from external consultants/chaotic folders. Managed server hardware and data migration.
- **Hard Tooling Transformation:** Transitioned company from soft-tool (US) to hard-tool (Asia) injection molding.
- **Global Liaison:** "Translator" between Waterloo design team and Asian vendors (Steman, Yomura). On-site T1 inspections in Taipei.

---

## 5. The Orbit (The Cast)

### Internal: Kaleidescape

- **Engineering Lead:** Erik Norris (Design Authority)
- **Management:** Richard Lane (VP Eng), John Lio (VP Ops), Michael Clader (Dir Mfg)
- **Hardware Team:** Rob Wudrick (PM), Nathan Forster (Thermal), Greg Curry (PCB), Orion Bruckman (EE), Andrzej Kocan (Power)
- **Supply Chain:** Amiee Rooney (Mgr), Rob Kuiper (Dir), Sandra Twist (NPI)
- **Founders:** Cheena Srinivasan, Michael Malcolm

### External: The Vendor Ecosystem

- **Plastics (Taiwan):** Yomura (Roger Lee, Grat Wu), Steman (Weddy Wang)
- **Sheet Metal (US):** Mass Precision (Ed Stegall, Fidel Saucedo), Prompt Precision (Ken Eddleman)
- **Prototyping:** Solid Concepts (Peter Imler), Protogenic (Angie Whitten)
- **Electronics:** Kontron (Jenette Carlson - Motherboards), Pactech (Cables - Failed), YC Cable (Cables - Fixed)
- **Design Partners:** Argyle Design (Gabe Cohn, Jonathan Burke)
- **Tools:** NxRev (Nils Wydler - Windchill Implementation)

---

## 6. STAR Metrics (The Wins)

### Cost Reduction (The Bank)

- **$56.70/unit:** Savings moving KPLAYER-6000 chassis from soft tooling (Prompt) to hard tooling (Weddy).
- **50% Reduction:** Orpheus CPU heatsink cost reduced ($7.12 -> $3.61) by switching vendors.
- **$0.97/unit:** Savings on Vesta springs via production fourslide tooling.
- **$1,500:** Negotiated discount on Windchill consulting.

### Quality & Waste (The Cost of Quality)

- **3,400 Screws:** Scrapped due to being 0.03" too short (North State Fasteners).
- **33% Failure Rate:** 204 Macduff top covers rejected for "Flow Marks."
- **20°C Delta:** Thermal penalty of using adhesive vs Phase Change Material (Orpheus).

### Tooling Budgets (The Capital)

- **$98,750:** Plastic tooling budget for Sundance (Yomura).
- **$14,000:** Total budget for Windchill PDM implementation (Server + Consulting).
- **$26,000:** Hard tooling cost for Ares chassis (Steman).
