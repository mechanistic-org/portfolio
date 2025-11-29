import os
import subprocess
import sys

# --- CONFIGURATION ---
# ⚠️ UPDATE THIS WITH YOUR ACTUAL BUCKET NAME
BUCKET_NAME = "eriknorris-assets" 
STAGING_DIR = "R2_STAGING"

def check_wrangler():
    """Check if wrangler is installed and authenticated."""
    cmd = "npx.cmd" if os.name == 'nt' else "npx"
    try:
        subprocess.run([cmd, "wrangler", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Error: 'wrangler' is not installed or not in PATH.")
        print("   Please run: npm install -D wrangler")
        sys.exit(1)

def sync_file(local_path, remote_key):
    """Upload a single file to R2."""
    print(f"   ⬆️  Uploading: {remote_key}...")
    cmd_base = "npx.cmd" if os.name == 'nt' else "npx"
    try:
        # Using 'wrangler r2 object put'
        # Syntax: wrangler r2 object put <bucket>/<key> --file <path>
        cmd = [
            cmd_base, "wrangler", "r2", "object", "put",
            f"{BUCKET_NAME}/{remote_key}",
            "--file", local_path
        ]
        # Suppress output unless error
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Failed to upload {remote_key}")
        print(f"      Error: {e.stderr.decode().strip()}")
        return False

def main():
    print(f"🚀 Starting R2 Sync from '{STAGING_DIR}' to bucket '{BUCKET_NAME}'...")
    
    check_wrangler()
    
    if not os.path.exists(STAGING_DIR):
        print(f"❌ Error: Staging directory '{STAGING_DIR}' not found.")
        sys.exit(1)

    success_count = 0
    fail_count = 0
    
    # Walk through the staging directory
    for root, dirs, files in os.walk(STAGING_DIR):
        for file in files:
            local_path = os.path.join(root, file)
            
            # Calculate remote key (relative path from STAGING_DIR)
            # e.g. R2_STAGING/project-1/hero.jpg -> project-1/hero.jpg
            rel_path = os.path.relpath(local_path, STAGING_DIR)
            # Ensure forward slashes for R2 keys
            remote_key = rel_path.replace(os.sep, "/")
            
            if sync_file(local_path, remote_key):
                success_count += 1
            else:
                fail_count += 1

    print("\n✨ Sync Complete!")
    print(f"   ✅ Uploaded: {success_count}")
    if fail_count > 0:
        print(f"   ❌ Failed:   {fail_count}")
        sys.exit(1)

if __name__ == "__main__":
    # Allow overriding bucket name via arg
    if len(sys.argv) > 1:
        BUCKET_NAME = sys.argv[1]
    
    main()
