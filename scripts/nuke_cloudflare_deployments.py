import urllib.request
import urllib.error
import urllib.parse
import json
import argparse
import sys
import time

def cloudflare_request(method, url, api_token, data=None):
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }
    
    encoded_data = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 204: # No Content
                return True
            return json.load(response)
    except urllib.error.HTTPError as e:
        error_body = ""
        try:
            error_body = e.read().decode()
        except:
            pass
        if "8000034" in error_body or "active production deployment" in error_body:
            # Safely ignore the active production deployment error
            return False
        print(f"❌ HTTP Error {e.code}: {e.reason}")
        print(f"   Body: {error_body}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Clean up Cloudflare Pages Deployments")
    parser.add_argument("--account-id", required=True, help="Cloudflare Account ID")
    parser.add_argument("--project-name", required=True, help="Project Name (e.g. eriknorris)")
    parser.add_argument("--api-token", required=True, help="API Token with Pages:Edit permissions")
    parser.add_argument("--delete-project", action="store_true", help="Delete project after clearing deployments")
    
    args = parser.parse_args()
    
    account_id = args.account_id
    project_name = args.project_name
    api_token = args.api_token
    
    base_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects/{project_name}"
    
    print(f"🔍 Targeting Project: {project_name} ({account_id})")
    
    # 1. Fetch Deployments Loop
    while True:
        print("📥 Fetching deployments...")
        deployments_url = f"{base_url}/deployments?per_page=25&sort_by=created_on&sort_order=asc" # Delete oldest first? Or does it matter?
        # Actually, Cloudflare limits concurrent deletions. Batching is key.
        
        resp = cloudflare_request("GET", deployments_url, api_token)
        if not resp or not resp.get("result"):
            print("✅ No more deployments found.")
            break
            
        deployments = resp["result"]
        print(f"⚠️  Found {len(deployments)} deployments. Deleting...")
        
        deleted_any = False
        for dep in deployments:
            dep_id = dep["id"]

            print(f"   🗑️  Deleting {dep_id}...", end="", flush=True)
            delete_url = f"{base_url}/deployments/{dep_id}"
            
            # Using force=true might be needed? Docs don't specify force for deployments.
            deleted = cloudflare_request("DELETE", delete_url, api_token)
            if deleted is True:
                deleted_any = True
                print(" Done.")
            elif deleted is False:
                print(" Skipped (Active Prod).")
            else:
                # Fallback if DELETE returns a JSON payload instead of 204
                deleted_any = True
                print(" Done.")
            
            # Rate limit protection (1200/5min usually, but let's be safe)
            time.sleep(0.5) 
            
        if not deleted_any:
            print("⚠️  No deployments could be deleted in this batch. Exiting loop.")
            break
            
    # 2. Delete Project
    if args.delete_project:
        print(f"☢️  Deleting Project '{project_name}'...")
        cloudflare_request("DELETE", base_url, api_token)
        print("✅ Project Deleted.")
    else:
        print("ℹ️  Deployments cleared. Project remains.")

if __name__ == "__main__":
    main()
