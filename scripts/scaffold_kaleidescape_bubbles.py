import os
import json

# Define the Master Path
MASTER_ROOT = r"D:\GitHub\eriknorris-workspace\R2_MASTER"

# Define the Bubble Scaffolding
# Structure: { Slug: { FolderName: DeckContent } }
SCAFFOLD = {
    "ksystem-120": {
        "01_hammered_lid": "# The Hammered Lid\n\n## The Crisis\nSanmina Plant 4 delivered pilot build lids (PN 520-1066-00) that were 3mm too wide due to a weldment error. \n\n## The Fix\nWe physically hammered them with wooden blocks to pass EMI testing.",
        "02_thumb_of_god": "# The Thumb of God\n\n## The Crisis\nThermal adhesive variations caused 20°C temperature spikes in the CPU.\n\n## The Fix\nSwitched to Phase Change Material (PCM) and heavy spring-loaded clips (50psi) to guarantee contact."
    },
    "kplayer-6000": {
        "01_56_dollar_savings": "# $56.70 Savings\n\n## The Mandate\nReduce BOM cost without compromising the premium aesthetic.\n\n## The Win\nTransitioned chassis fabrication from US Soft Tooling ($84.62) to Asian Hard Tooling ($27.92)."
    },
    "kplayer-300": {
        "01_chewed_edge": "# The Chewed Edge\n\n## The Crisis\nConductive EMI paint (Electrodag 550) filled the texture on plastic housings, ruining the finish.\n\n## The Fix\nForced Steman to EDM the texture directly into the hard tool steel.",
        "02_tooling_avoidance": "# Tooling Avoidance\n\n## The Win\nSaved $5,400 in EMI shield tooling costs by validating prototype tooling for initial ramp."
    },
    "m700": {
        "01_vanishing_discs": "# Vanishing Discs\n\n## The Crisis\nStatic electricity and sensor blindness caused discs to disappear inside the vault.\n\n## The Fix\nRedesigned the pinch roller assembly with solid mounts and double-strength springs.",
        "02_butter_knife": "# The Butter Knife Protocol\n\n## The Issue\nEMI gaskets deformed into the slot path.\n\n## The Workaround\nDealers had to use a specific shim (butter knife) to clear the obstruction."
    },
    "cinema-one": {
        "01_flow_mark_reject": "# Flow Mark Rejection\n\n## The Stand\nRejected 204 top covers (33%) from Yomura due to cosmetic flow marks.\n\n## The Standard\nEstablished Apple-tier quality expectations for the mid-market product.",
        "02_g_force": "# The G-Force Fix\n\n## The Crisis\nUnits were shearing off ODD mounts during shipping.\n\n## The Fix\nRedesigned packaging density to decouple the unit from drop impacts."
    },
    "m500": {
        "01_flaming_sata": "# Flaming SATA Cable\n\n## The Crisis\nVendor (Pactech) substituted Gold Flash for Gold Plating, causing cables to melt/burn.\n\n## The Rescue\nEmergency switch to YC Cable in <48 hours."
    }
}

DEFAULT_CONFIG = {
    "layout": "masonry",
    "columns": 5,
    "scattered": True
}

def scaffold():
    print("🏗️  Scaffolding Kaleidescape Bubbles...")
    
    for slug, bubbles in SCAFFOLD.items():
        slug_path = os.path.join(MASTER_ROOT, slug, "bubbles")
        
        # Ensure project/bubbles dir exists
        if not os.path.exists(slug_path):
            try:
                os.makedirs(slug_path)
                print(f"Created Root: {slug_path}")
            except FileExistsError:
                pass

        for folder_name, deck_md in bubbles.items():
            bubble_path = os.path.join(slug_path, folder_name)
            
            # Create Bubble Folder
            if not os.path.exists(bubble_path):
                os.makedirs(bubble_path)
                print(f"  + Created Bubble: {folder_name}")
            
            # Write Deck.md
            deck_path = os.path.join(bubble_path, "deck.md")
            if not os.path.exists(deck_path):
                with open(deck_path, "w", encoding="utf-8") as f:
                    f.write(deck_md)
                print(f"    - Injected Narrative: {folder_name}")

            # Write Config.json
            config_path = os.path.join(bubble_path, "config.json")
            if not os.path.exists(config_path):
                with open(config_path, "w", encoding="utf-8") as f:
                    json.dump(DEFAULT_CONFIG, f, indent=4)
                print(f"    - Injected Config: {folder_name}")

    print("✅ Scaffolding Complete.")

if __name__ == "__main__":
    scaffold()
