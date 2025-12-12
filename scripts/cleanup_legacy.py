import subprocess
import os
import sys

# Legacy files to delete (the "Green" versions)
FILES_TO_DELETE = [
    "dreamjob/dreamjob-hero-01.jpg",
    "dreamjob/dreamjob-iso-01.jpg",
    "dreamjob/dreamjob-ortho-01.png",
    "dreamjob/dreamjob-detail-01.jpg",
    "dreamjob/dreamjob-context-01.png",
    "dreamjob/dreamjob-prototype-01.png",
    "dreamjob/dreamjob-assembly-01.png",
    "dreamjob/dreamjob-teardown-01.png",
    "dreamjob/dreamjob-test-01.png",
    "dreamjob/dreamjob-schematic-01.jpg",
    "dreamjob/dreamjob-exploded-01.png",
    "dreamjob/dreamjob-cutaway-01.jpg",
    "dreamjob/dreamjob-diagram-01.png",
    "dreamjob/dreamjob-render-01.png",
    "dreamjob/dreamjob-ui-01.png",
    "dreamjob/dreamjob-wireframe-01.png",
    "dreamjob/dreamjob-arch-01.png"
]

BUCKET_NAME = "projects"

def main():
    print(f"🗑️  Cleaning up {len(FILES_TO_DELETE)} legacy files from bucket '{BUCKET_NAME}'...")
    
    cmd_base = "npx.cmd" if os.name == 'nt' else "npx"
    
    success_count = 0
    fail_count = 0

    for file_key in FILES_TO_DELETE:
        print(f"   🔥 Deleting: {file_key}...", end="", flush=True)
        try:
            # wrangler r2 object delete <bucket>/<key>
            cmd = [cmd_base, "wrangler", "r2", "object", "delete", f"{BUCKET_NAME}/{file_key}"]
            
            # Run silently
            subprocess.check_call(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(" ✅")
            success_count += 1
        except subprocess.CalledProcessError:
            print(" ❌ Failed")
            fail_count += 1
            
    print("\n✨ Cleanup Complete!")
    print(f"   ✅ Deleted: {success_count}")
    print(f"   ❌ Failed:  {fail_count}")

if __name__ == "__main__":
    main()
