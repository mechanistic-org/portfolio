
import sys
import os
import re
from pathlib import Path

# Add local lib to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))

try:
    from onshape import OnshapeClient
except ImportError as e:
    print(f"FAILED: Could not import onshape client: {e}")
    sys.exit(1)

def harvest():
    print("--- 🦖 The Harvest: Extracting Fossils ---")
    
    # Target Document "EN"
    did = "76a65e12b9edeb12c5bbcdc3"
    wid = "fffb293495c84de3a0bcb6d1"
    
    # Destination
    dest_dir = Path("src/assets/history")
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    client = OnshapeClient()
    
    # 1. Get All Elements
    print("Fetching Element List...")
    res = client.request("GET", f"/api/documents/d/{did}/w/{wid}/elements")
    if res.status_code != 200:
        print(f"Failed to fetch elements: {res.status_code}")
        return

    elements = res.json()
    
    # 2. Filter for "EN_*" Part Studios
    # Regex: EN_ followed by digits, optional suffix
    pattern = re.compile(r"^EN_(\d+)(.*)$", re.IGNORECASE)
    
    targets = []
    for e in elements:
        if e['elementType'] == 'PARTSTUDIO':
            match = pattern.match(e['name'])
            if match:
                # We prioritize the "main" ones, but we'll grab everything matching EN_##
                # Sort key: Integer of the first group
                num = int(match.group(1))
                targets.append({
                    'name': e['name'],
                    'id': e['id'],
                    'sort': num
                })

    # Sort by version number
    targets.sort(key=lambda x: x['sort'])
    
    print(f"Found {len(targets)} Fossils: {[t['name'] for t in targets]}")
    
    # 3. Download Thumbnails
    for t in targets:
        name = t['name']
        eid = t['id']
        filename = f"{name}.png"
        filepath = dest_dir / filename
        
        if filepath.exists():
            print(f"Skipping {name} (Exists)")
            continue
            
        print(f"Extracting {name}...")
        
        # Thumbnail Endpoint (600x600 is good for details)
        url = f"/api/thumbnails/d/{did}/w/{wid}/e/{eid}?sz=600x600"
        
        try:
            # The API returns a JSON list of sizes if not using a specific direct-download header or endpoint variant
            # We see it returns {"sizes": [{"href": ...}]}
            meta_res = client.request("GET", url, query_params={'sz': '600x600'})
            
            if meta_res.status_code == 200:
                try:
                    data = meta_res.json()
                    # It might be a list or object with 'sizes'
                    # Based on cat output: { "sizes": [ { "href": "..." } ] }
                    if 'sizes' in data and len(data['sizes']) > 0:
                        # Get the href of the first available size (usually the requested one)
                        # We might need to filter for the best size if multiple return
                        img_url = data['sizes'][0]['href']
                        
                        # Now fetch the actual image
                        # Note: The href is a full URL, but we need to sign it if it's private? 
                        # Or use the client to request the path relative to base?
                        # The HREF includes the base url. We validly need to strip it or just use requests directly (but signed headers might be needed).
                        # Actually, Onshape hrefs in API usually need the same auth headers.
                        
                        # Let's extract the path from the href
                        # href: https://cad.onshape.com/api/thumbnails/...
                        from urllib.parse import urlparse
                        parsed = urlparse(img_url)
                        path = parsed.path + "?" + parsed.query
                        
                        # Request with 'Accept: image/*' explicitly to avoid 406
                        real_img_res = client.request("GET", path, headers={'Accept': 'image/*'})
                        
                        if real_img_res.status_code == 200 or real_img_res.status_code == 307:
                            with open(filepath, 'wb') as f:
                                f.write(real_img_res.content)
                            print(f"  -> Saved {filename} ({len(real_img_res.content)} bytes)")
                        else:
                            print(f"  -> Failed to fetch image blob: {real_img_res.status_code}")
                    else:
                        print(f"  -> No sizes found in response")
                except ValueError:
                    # It wasn't JSON, maybe it WAS the image (if 307 redirect happened automatically?)
                    # But we saw it was JSON.
                    print("  -> Response was not JSON, maybe direct image?")
            else:
                print(f"  -> Failed: {meta_res.status_code}")
                
        except Exception as e:
            print(f"  -> Error: {e}")

    print("\nHarvest Complete. 🦖")

if __name__ == "__main__":
    harvest()
