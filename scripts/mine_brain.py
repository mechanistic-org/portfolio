import os
import shutil
import datetime
import re
from pathlib import Path

# Config
SOURCE_DIR = Path(r"C:\Users\erik\.gemini\antigravity\brain")
TARGET_DIR = Path(r"d:\GitHub\quantum\data_source\mined_assets")
INDEX_FILE = TARGET_DIR / "INDEX.md"

def mine_images():
    if not SOURCE_DIR.exists():
        print(f"Error: Source directory {SOURCE_DIR} does not exist.")
        return

    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    
    found_count = 0
    copied_count = 0
    
    index_content = ["# Mined Assets Index\n\n| Date | Source ID | Original Name | Mined File |", "|---|---|---|---|"]
    
    print(f"Scanning {SOURCE_DIR}...")
    
    # Walk through the brain
    for root, dirs, files in os.walk(SOURCE_DIR):
        for file in files:
            if file.startswith("uploaded_image") and file.endswith(".png"):
                found_count += 1
                source_path = Path(root) / file
                conversation_id = Path(root).name
                
                # Extract timestamp from filename
                # Formats: uploaded_image_0_1765218128189.png or uploaded_image_1765213100943.png
                match = re.search(r"(\d{13})", file)
                if match:
                    timestamp_ms = int(match.group(1))
                    date_obj = datetime.datetime.fromtimestamp(timestamp_ms / 1000.0)
                    date_str = date_obj.strftime("%Y-%m-%d")
                    time_str = date_obj.strftime("%H%M")
                else:
                    # Fallback to file mtime if no timestamp in name
                    timestamp_ms = source_path.stat().st_mtime
                    date_obj = datetime.datetime.fromtimestamp(timestamp_ms)
                    date_str = date_obj.strftime("%Y-%m-%d")
                    time_str = "0000"

                # Define new filename
                # {YYYY-MM-DD}_{ConversationID}_{OriginalName}
                # Shorten Conversation ID for readability? No, keep it for linking.
                new_filename = f"{date_str}_{conversation_id[:8]}_{file}"
                target_path = TARGET_DIR / new_filename
                
                # Copy
                if not target_path.exists():
                    shutil.copy2(source_path, target_path)
                    copied_count += 1
                    # Add to index
                    index_content.append(f"| {date_str} | `{conversation_id}` | `{file}` | `[{new_filename}]({new_filename})` |")
                else:
                    # Skip or overwrite? Skip for speed, log it.
                    pass 

    # Write Index
    if copied_count > 0:
        with open(INDEX_FILE, "w", encoding="utf-8") as f:
            f.write("\n".join(index_content))
            
    print(f"Mining complete.")
    print(f"Found: {found_count} images.")
    print(f"Copied: {copied_count} new images to {TARGET_DIR}.")
    print(f"Index written to {INDEX_FILE}.")

if __name__ == "__main__":
    mine_images()
