import os
import boto3
from botocore.exceptions import NoCredentialsError
from dotenv import load_dotenv
import mimetypes

# Load environment variables
load_dotenv()

# Configuration
R2_ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
R2_ACCESS_KEY_ID = os.getenv('R2_ACCESS_KEY_ID')
R2_SECRET_ACCESS_KEY = os.getenv('R2_SECRET_ACCESS_KEY')
R2_BUCKET_NAME = os.getenv('R2_BUCKET_NAME')
STAGING_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'quantum-assets', 'R2_STAGING')

def get_r2_client():
    try:
        return boto3.client(
            's3',
            endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY
        )
    except Exception as e:
        print(f"❌ Error creating R2 client: {e}")
        return None

def sync_assets():
    if not all([R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME]):
        print("❌ Missing R2 credentials in .env file.")
        return

    s3 = get_r2_client()
    if not s3: return

    print(f"🚀 Starting sync from {STAGING_DIR} to R2 bucket '{R2_BUCKET_NAME}'...")
    
    uploaded_count = 0
    skipped_count = 0
    error_count = 0

    for root, dirs, files in os.walk(STAGING_DIR):
        for file in files:
            local_path = os.path.join(root, file)
            relative_path = os.path.relpath(local_path, STAGING_DIR)
            s3_key = relative_path.replace('\\', '/') # Ensure forward slashes

            # Determine Content-Type
            content_type, _ = mimetypes.guess_type(local_path)
            if not content_type:
                content_type = 'application/octet-stream'
            # Force SVG content type if needed
            if file.lower().endswith('.svg'):
                content_type = 'image/svg+xml'

            try:
                # Check if file exists and is newer
                try:
                    metadata = s3.head_object(Bucket=R2_BUCKET_NAME, Key=s3_key)
                    remote_size = metadata['ContentLength']
                    local_size = os.path.getsize(local_path)
                    
                    # Simple check: if size matches, skip (can be improved with ETag/LastModified)
                    if remote_size == local_size:
                        # print(f"⏭️  Skipping {s3_key} (already exists)")
                        skipped_count += 1
                        continue
                except:
                    # File doesn't exist, proceed to upload
                    pass

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
                print(f"❌ Failed to upload {s3_key}: {e}")
                error_count += 1

    print(f"\n✅ Sync Complete.")
    print(f"   Uploaded: {uploaded_count}")
    print(f"   Skipped:  {skipped_count}")
    print(f"   Errors:   {error_count}")

if __name__ == "__main__":
    sync_assets()
