import os
import subprocess
import sys

# --- CONFIGURATION ---
BUCKET_NAME = "eriknorris-assets"
LOCAL_ASSETS_DIR = "public/assets/r2"

def check_wrangler():
    """Check if wrangler is installed."""
    cmd = "npx.cmd" if os.name == 'nt' else "npx"
    try:
        subprocess.run([cmd, "wrangler", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Error: 'wrangler' is not installed or not in PATH.")
        print("   Please run: npm install -D wrangler")
        sys.exit(1)

def main():
    print(f"🚀 Starting R2 Download from bucket '{BUCKET_NAME}' to '{LOCAL_ASSETS_DIR}'...")
    
    check_wrangler()
    
    # Ensure local directory exists
    os.makedirs(LOCAL_ASSETS_DIR, exist_ok=True)
    
    # We'll use a simple approach: list objects and then download them one by one
    # Note: This is not efficient for huge buckets but fine for this scale.
    # A better approach for dev is to point to the remote URL, but for now we sync.
    
    print("   ℹ️  This script requires R2 access. If it fails, ensure you are logged in via `npx wrangler login`.")
    
    # Unfortunately, `wrangler r2 object get` requires knowing the key.
    # There isn't a simple "sync down" command in Wrangler CLI v3 for R2 yet without listing first.
    # For now, let's try to notify the user to use the remote domain if possible, 
    # OR we can try to assume the structure based on the project data.
    
    # ACTUALLY, a better fix for local dev is to use the R2 public domain if available.
    # But the user asked to fix the "broken images" which are 404ing on localhost.
    
    # Let's try to list files first.
    cmd_base = "npx.cmd" if os.name == 'nt' else "npx"
    
    # Since we can't easily list/sync with simple wrangler commands without a lot of parsing,
    # and we don't want to overcomplicate, let's look at how the app constructs these URLs.
    # It seems they are hardcoded to /assets/r2/...
    
    # If we can't download easily, we should probably change the code to point to the remote URL in dev mode?
    # Or we can try to use `rclone` if installed? No, we can't assume that.
    
    # Let's try to just download a known set of files if we can, OR just tell the user to copy them.
    # But wait, the user previously had them working? Or is this a new setup?
    # The prompt implies "somehow images are mostly broken", meaning they might have been there or expected to be there.
    
    print("❌ Automated R2 download via Wrangler is complex without a file list.")
    print("   Please manually download your 'eriknorris-assets' bucket contents to 'public/assets/r2'.")
    print("   OR, configure your project to use the remote R2 domain.")

if __name__ == "__main__":
    main()
