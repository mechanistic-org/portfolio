import boto3
import argparse
import sys
from botocore.config import Config

def main():
    parser = argparse.ArgumentParser(description="Clean up Cloudflare R2 Buckets by emptying and/or deleting them.")
    parser.add_argument("--account-id", required=True, help="Cloudflare Account ID")
    parser.add_argument("--access-key", required=True, help="R2 Access Key ID")
    parser.add_argument("--secret-key", required=True, help="R2 Secret Access Key")
    parser.add_argument("--bucket", required=True, help="Target Bucket Name (e.g., projects)")
    parser.add_argument("--delete-bucket", action="store_true", help="Delete the bucket entirely after emptying it")
    
    args = parser.parse_args()

    s3 = boto3.resource('s3',
        endpoint_url=f"https://{args.account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=args.access_key,
        aws_secret_access_key=args.secret_key,
        config=Config(signature_version='s3v4')
    )

    bucket = s3.Bucket(args.bucket)
    
    print(f"🔍 Targeting R2 Bucket: {args.bucket}")
    
    # Check if bucket exists
    try:
        s3.meta.client.head_bucket(Bucket=args.bucket)
    except Exception as e:
        print(f"❌ Error accessing bucket '{args.bucket}'. Ensure it exists and credentials are correct.")
        print(e)
        sys.exit(1)

    # 1. Empty the bucket
    print("🗑️  Emptying bucket... This may take a while if there are many objects.")
    try:
        # bucket.objects.all().delete() is the fastest way to batch delete in boto3
        bucket.objects.all().delete()
        print("✅ Bucket emptied successfully.")
    except Exception as e:
        print(f"❌ Failed to empty bucket: {e}")
        sys.exit(1)

    # 2. Delete the bucket (optional)
    if args.delete_bucket:
        print(f"☢️  Deleting bucket '{args.bucket}'...")
        try:
            bucket.delete()
            print("✅ Bucket deleted successfully.")
        except Exception as e:
            print(f"❌ Failed to delete bucket: {e}")
            sys.exit(1)
    else:
        print(f"ℹ️  Bucket '{args.bucket}' has been emptied, but the bucket itself was retained.")

if __name__ == "__main__":
    main()
