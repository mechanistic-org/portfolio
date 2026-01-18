
import os
import boto3
from dotenv import load_dotenv

# Load env from root
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(env_path)

R2_ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
R2_ACCESS_KEY_ID = os.getenv('R2_ACCESS_KEY_ID')
R2_SECRET_ACCESS_KEY = os.getenv('R2_SECRET_ACCESS_KEY')
R2_BUCKET_NAME = os.getenv('R2_BUCKET_NAME')

def upload_resume_patch():
    print(f"🚀 Patching Resume in Bucket: {R2_BUCKET_NAME}")
    
    s3 = boto3.client(
        's3',
        endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name='auto'
    )

    # Local Source
    local_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'assets', 'resume')
    filename = 'Erik_Norris_Sr_Staff_Forensic_Architect_2026.pdf'
    local_path = os.path.join(local_dir, filename)

    if not os.path.exists(local_path):
        print(f"❌ Error: Source file not found: {local_path}")
        return

    # Targets
    targets = [
        f"resume/{filename}"          # New Canonical Only
    ]

    with open(local_path, 'rb') as data:
        file_content = data.read()

    for key in targets:
        print(f"⬆️  Uploading to: {key}...")
        try:
            s3.put_object(
                Bucket=R2_BUCKET_NAME,
                Key=key,
                Body=file_content,
                ContentType='application/pdf'
            )
            print(f"✅ Success: {key}")
        except Exception as e:
            print(f"❌ Failed: {key} - {e}")

if __name__ == "__main__":
    upload_resume_patch()
