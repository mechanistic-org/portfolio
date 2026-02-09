import os
import boto3
from botocore.exceptions import NoCredentialsError
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(env_path)

# Configuration
R2_ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
R2_ACCESS_KEY_ID = os.getenv('R2_ACCESS_KEY_ID')
R2_SECRET_ACCESS_KEY = os.getenv('R2_SECRET_ACCESS_KEY')
R2_BUCKET_NAME = os.getenv('R2_BUCKET_NAME')

def get_r2_client():
    try:
        return boto3.client(
            's3',
            endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            region_name='auto'
        )
    except Exception as e:
        print(f"❌ Error creating R2 client: {e}")
        return None

def configure_cors():
    s3 = get_r2_client()
    if not s3: return

    cors_configuration = {
        'CORSRules': [{
            'AllowedHeaders': ['*'],
            'AllowedMethods': ['GET', 'HEAD'],
            'AllowedOrigins': [
                'https://eriknorris.com',
                'https://www.eriknorris.com',
                'http://localhost:4321',
                'https://*.eriknorris-com.pages.dev'
            ],
            'ExposeHeaders': ['ETag'],
            'MaxAgeSeconds': 3000
        }]
    }

    print(f"🚀 Configuring CORS for bucket: {R2_BUCKET_NAME}")
    try:
        s3.put_bucket_cors(Bucket=R2_BUCKET_NAME, CORSConfiguration=cors_configuration)
        print("✅ CORS configuration applied successfully.")
    except Exception as e:
        print(f"❌ Failed to apply CORS configuration: {e}")

if __name__ == "__main__":
    configure_cors()
