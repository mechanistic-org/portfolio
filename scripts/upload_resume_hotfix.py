import os
import boto3
from dotenv import load_dotenv

# Load env
load_dotenv()

R2_ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
R2_ACCESS_KEY_ID = os.getenv('R2_ACCESS_KEY_ID')
R2_SECRET_ACCESS_KEY = os.getenv('R2_SECRET_ACCESS_KEY')
R2_BUCKET_NAME = os.getenv('R2_BUCKET_NAME')

def upload_resume():
    s3 = boto3.client(
        's3',
        endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name='auto'
    )

    # Local Source (Air Gapped Vault)
    local_path = r"D:\GitHub\eriknorris-assets\R2_STAGING\resume\Erik_Norris_Resume_Current.pdf"
    
    # Remote Target (Matches the Redirect Rule)
    remote_key = "resume/Erik_Norris_Sr_Staff_Forensic_Architect_2026.pdf"

    print(f"🚀 Uploading {local_path}...")
    print(f"🎯 Target: {remote_key}")

    with open(local_path, 'rb') as f:
        s3.put_object(
            Bucket=R2_BUCKET_NAME,
            Key=remote_key,
            Body=f,
            ContentType='application/pdf'
        )

    print("✅ Upload Complete.")

if __name__ == "__main__":
    upload_resume()
