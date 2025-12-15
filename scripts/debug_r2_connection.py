import os
import boto3
from dotenv import load_dotenv

# Explicitly load .env from root
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(env_path)

print(f"--- R2 Connection Debugger ---")
print(f"Loading .env from: {env_path}")
print(f"File exists: {os.path.exists(env_path)}")

account_id = os.getenv('R2_ACCOUNT_ID')
access_key = os.getenv('R2_ACCESS_KEY_ID')
secret_key = os.getenv('R2_SECRET_ACCESS_KEY')
bucket_name = os.getenv('R2_BUCKET_NAME')

print(f"R2_ACCOUNT_ID: {account_id}")
print(f"R2_ACCESS_KEY_ID: {access_key[:4]}... (Masked)" if access_key else "MISSING")
print(f"R2_SECRET_ACCESS_KEY: {secret_key[:4]}... (Masked)" if secret_key else "MISSING")
print(f"R2_BUCKET_NAME: {bucket_name}")

if not all([account_id, access_key, secret_key]):
    print("❌ CRITICAL: Missing environment variables.")
    exit(1)

print("\n--- Attempting Boto3 Connection (No Region) ---")
try:
    s3 = boto3.client(
        's3',
        endpoint_url=f'https://{account_id}.r2.cloudflarestorage.com',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key
    )
    resp = s3.list_buckets()
    print("✅ SUCCESS! Connected and listed buckets:")
    for b in resp['Buckets']:
        print(f"  - {b['Name']}")
except Exception as e:
    print(f"❌ FAILURE (No Region): {e}")

print("\n--- Attempting Boto3 Connection (Region='auto') ---")
try:
    s3 = boto3.client(
        's3',
        endpoint_url=f'https://{account_id}.r2.cloudflarestorage.com',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name='auto'  # <-- Trying this fix
    )
    resp = s3.list_buckets()
    print("✅ SUCCESS! Connected with region='auto' and listed buckets:")
    for b in resp['Buckets']:
        print(f"  - {b['Name']}")
except Exception as e:
    print(f"❌ FAILURE (Region='auto'): {e}")
