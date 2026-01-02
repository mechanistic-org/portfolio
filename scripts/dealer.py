import os
import sys
import shutil
import math
import subprocess

BATCH_SIZE = 500

def deal_cards(source_folder):
    if not os.path.isdir(source_folder):
        print(f"Error: {source_folder} is not a directory.")
        return

    # 1. Gather all files
    all_files = [f for f in os.listdir(source_folder) if os.path.isfile(os.path.join(source_folder, f))]
    total_files = len(all_files)
    
    if total_files == 0:
        print("No files to deal.")
        return

    num_batches = math.ceil(total_files / BATCH_SIZE)
    print(f"♠️  The Dealer is shuffling {total_files} files into {num_batches} batches...")

    # 2. Sort for consistency
    all_files.sort()

    # 3. Deal them out
    script_dir = os.path.dirname(os.path.abspath(__file__))
    stitcher_path = os.path.join(script_dir, "stitcher.py")

    for i in range(num_batches):
        batch_num = i + 1
        batch_folder_name = f"Batch_{batch_num:03d}"
        batch_folder_path = os.path.join(source_folder, batch_folder_name)

        # Create Batch Folder
        if not os.path.exists(batch_folder_path):
            os.makedirs(batch_folder_path)

        # Calculate slice
        start_idx = i * BATCH_SIZE
        end_idx = min((i + 1) * BATCH_SIZE, total_files)
        batch_files = all_files[start_idx:end_idx]

        print(f"   dealing {len(batch_files)} cards to {batch_folder_name}...", end="")

        # MOVE files (DESTRUCTIVE/CLEANING MODE)
        for filename in batch_files:
            src = os.path.join(source_folder, filename)
            dst = os.path.join(batch_folder_path, filename)
            try:
                shutil.move(src, dst)
            except Exception as e:
                print(f"Error moving {filename}: {e}")

        print(" Done.")

        # 4. Trigger The Stitcher immediately
        print(f"   🧵 Stitching {batch_folder_name}...")
        try:
            subprocess.run(["python", stitcher_path, batch_folder_path], check=True)
        except subprocess.CalledProcessError as e:
            print(f"   ❌ Stitcher failed for {batch_folder_name}: {e}")

    print("\n✅ The Dealer has left the table.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python dealer.py <absolute_folder_path>")
    else:
        deal_cards(sys.argv[1])
