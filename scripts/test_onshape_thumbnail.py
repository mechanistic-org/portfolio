
import sys
import os
import json

sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))
try:
    from onshape import OnshapeClient
except ImportError:
    sys.exit(1)

def test_thumbs():
    # EN Document
    did = "76a65e12b9edeb12c5bbcdc3"
    wid = "fffb293495c84de3a0bcb6d1"
    
    # We found these elements in the previous inspection
    # Let's pick a few "Fossils" to test
    # Note: We need EIDs. I'll use the 'inspect_onshape_doc.py' logic to get EIDs first
    
    client = OnshapeClient()
    
    # 1. Get Elements to find IDs for 'EN_1', 'EN_7', 'EN_15_3'
    print("Fetching Element List...")
    list_res = client.request("GET", f"/api/documents/d/{did}/w/{wid}/elements")
    elements = list_res.json()
    
    targets = ['EN_1', 'EN_7', 'EN_15_3']
    target_map = {}
    
    for e in elements:
        if e['name'] in targets:
            target_map[e['name']] = e['id']
            
    print(f"Targets Identified: {target_map}")
    
    # 2. Request Thumbnails (s=500 for decent quality)
    print("\nTesting Thumbnails...")
    for name, eid in target_map.items():
        # Endpoint: /api/thumbnails/d/{did}/w/{wid}/e/{eid} ?? 
        # Actually it's often /api/partstudios/d/../e/../shadedviews
        # Or simpler: /api/thumbnails/d/{did}/w/{wid}/e/{eid}?sz=300x300
        
        # Let's try the modern thumbnail endpoint
        endpoint = f"/api/thumbnails/d/d/{did}/w/{wid}/e/{eid}"
        # Note: Onshape API is quirky with 'd/d/'. Let's try standard path.
         # api/thumbnails also supports /api/thumbnails/{size}/...
        
        # Correct pattern for element thumbnail:
        # GET /api/thumbnails/d/{d}/w/{w}/e/{e}?sz=600x600
        
        url = f"/api/thumbnails/d/{did}/w/{wid}/e/{eid}?sz=600x600"
        
        # We won't download content, just check if it returns 200/307
        res = client.request("GET", url, query_params={'sz': '600x600'})
        
        print(f"[{name}] Status: {res.status_code}")
        if res.status_code == 200:
             print("  -> Direct Image Data")
        elif res.status_code == 307:
             print("  -> Redirect to Blob")
        else:
             print(f"  -> Failed: {res.text[:100]}")

if __name__ == "__main__":
    test_thumbs()
