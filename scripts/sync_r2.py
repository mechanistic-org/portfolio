import os
import boto3
from botocore.exceptions import NoCredentialsError
from dotenv import load_dotenv
import mimetypes

# Load environment variables
# Explicitly look for .env in the project root (one level up from scripts/)
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(env_path)

# Configuration
R2_ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
R2_ACCESS_KEY_ID = os.getenv('R2_ACCESS_KEY_ID')
R2_SECRET_ACCESS_KEY = os.getenv('R2_SECRET_ACCESS_KEY')
R2_BUCKET_NAME = os.getenv('R2_BUCKET_NAME')

# Path to staging directory (Sibling Repo: quantum-assets)
# Script is in: /scripts/
# We go up two levels: ../../quantum-assets/R2_STAGING
STAGING_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '..', 'eriknorris-assets', 'R2_STAGING')

def get_r2_client():
    try:
        return boto3.client(
            's3',
            endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            region_name='auto' # <--- CRITICAL FIX: Required for R2 to accept signatures sometimes
        )
    except Exception as e:
        print(f"❌ Error creating R2 client: {e}")
        return None

import argparse

def get_remote_files(s3, bucket_name):
    """
    Returns a set of all keys in the bucket.
    """
    print("📋 Fetching remote file list...")
    paginator = s3.get_paginator('list_objects_v2')
    remote_keys = set()
    try:
        for page in paginator.paginate(Bucket=bucket_name):
            if 'Contents' in page:
                for obj in page['Contents']:
                    remote_keys.add(obj['Key'])
    except Exception as e:
        print(f"❌ Error fetching remote list: {e}")
        return None
    return remote_keys

def sync_assets():
    parser = argparse.ArgumentParser(description="Sync assets to Cloudflare R2")
    parser.add_argument('--prune', action='store_true', help="Delete remote files that do not exist locally")
    parser.add_argument('--dry-run', action='store_true', help="Show what would happen without making changes")
    args = parser.parse_args()

    if not all([R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME]):
        print("❌ Missing R2 credentials in .env file.")
        return

    s3 = get_r2_client()
    if not s3: return

    # Normalize path
    staging_path = os.path.normpath(STAGING_DIR)

    action_label = "Syncing (Mirror)" if args.prune else "Syncing (Additive)"
    if args.dry_run: action_label += " [DRY RUN]"
    
    print(f"🚀 Starting {action_label}")
    print(f"   Source: {staging_path}")
    print(f"   Target: {R2_BUCKET_NAME}")
    
    if not os.path.exists(staging_path):
        print(f"❌ Error: Staging directory '{staging_path}' not found.")
        print("   Ensure the 'quantum-assets' repo is cloned as a sibling to 'quantum'.")
        return

    uploaded_count = 0
    skipped_count = 0
    deleted_count = 0
    error_count = 0
    
    local_files_set = set()

    # --- 1. UPLOAD & UPDATE ---
    for root, dirs, files in os.walk(staging_path):
        for file in files:
            local_path = os.path.join(root, file)
            relative_path = os.path.relpath(local_path, staging_path)
            s3_key = relative_path.replace('\\', '/') # Ensure forward slashes
            local_files_set.add(s3_key)

            # Determine Content-Type
            content_type, _ = mimetypes.guess_type(local_path)
            if not content_type:
                content_type = 'application/octet-stream'
            if file.lower().endswith('.svg'):
                content_type = 'image/svg+xml'

            try:
                # Check for existing
                should_upload = True
                try:
                    metadata = s3.head_object(Bucket=R2_BUCKET_NAME, Key=s3_key)
                    remote_size = metadata['ContentLength']
                    local_size = os.path.getsize(local_path)
                    
                    if remote_size == local_size:
                        skipped_count += 1
                        should_upload = False
                except:
                    # File doesn't exist, proceed
                    pass

                if should_upload:
                    if args.dry_run:
                        print(f"📝 [DRY RUN] Would upload: {s3_key} ({content_type})")
                        uploaded_count += 1
                    else:
                        print(f"⬆️  Uploading {s3_key} ({content_type})...")
                        with open(local_path, 'rb') as data:
                            s3.put_object(
                                Bucket=R2_BUCKET_NAME,
                                Key=s3_key,
                                Body=data,
                                ContentType=content_type
                            )
                        uploaded_count += 1

            except Exception as e:
                print(f"❌ Failed to process {s3_key}: {e}")
                error_count += 1
    
    # --- 2. PRUNE (If requested) ---
    if args.prune:
        remote_files = get_remote_files(s3, R2_BUCKET_NAME)
        if remote_files:
            orphans = remote_files - local_files_set
            
            if orphans:
                print(f"\n🗑️  Found {len(orphans)} orphaned files in R2...")
                for key in orphans:
                    if args.dry_run:
                        print(f"📝 [DRY RUN] Would delete: {key}")
                        deleted_count += 1
                    else:
                        print(f"🔥 Deleting: {key}")
                        try:
                            s3.delete_object(Bucket=R2_BUCKET_NAME, Key=key)
                            deleted_count += 1
                        except Exception as e:
                            print(f"❌ Failed to delete {key}: {e}")
                            error_count += 1
            else:
                print("\n✨ No orphaned files found.")

    print(f"\n✅ {action_label} Complete.")
    print(f"   Uploaded: {uploaded_count}")
    print(f"   Skipped:  {skipped_count}")
    if args.prune:
        print(f"   Deleted:  {deleted_count}")
    print(f"   Errors:   {error_count}")

if __name__ == "__main__":
    sync_assets()
