
import sys
import os
import json

# Add local lib to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))

try:
    from onshape import OnshapeClient
except ImportError as e:
    print(f"FAILED: Could not import onshape client: {e}")
    sys.exit(1)

def inspect():
    # Target (from Prompt)
    did = "76a65e12b9edeb12c5bbcdc3"
    wid = "fffb293495c84de3a0bcb6d1"
    
    # Check keys
    if not os.environ.get("ONSHAPE_ACCESS_KEY"):
        print("Error: Missing Keys")
        return

    client = OnshapeClient()
    print(f"Inspecting Document: {did} (Workspace: {wid})")
    
    # Get Elements
    endpoint = f"/api/documents/d/{did}/w/{wid}/elements"
    res = client.request("GET", endpoint)
    
    if res.status_code != 200:
        print(f"Failed to get elements: {res.status_code}")
        print(res.text)
        return

    elements = res.json()
    
    # Sort by index/name if possible, but default order is usually creation or internal ID
    # We'll just print them as returned, which often matches tab order
    
    print(f"--- Document Content ({len(elements)} items) ---")
    
    # Group by type for easier reading
    by_type = {}
    for e in elements:
        etype = e.get('elementType', 'Unknown')
        if etype not in by_type:
            by_type[etype] = []
        by_type[etype].append(e)

    for etype, items in by_type.items():
        print(f"\n[{etype}]")
        for item in items:
            name = item['name']
            eid = item['id']
            # Highlight if it matches the user's specific link
            marker = " <--- LINK TARGET" if eid == "1f200cdfffc48ca7280d6e4d" else ""
            print(f"  - {name} {marker}")

if __name__ == "__main__":
    inspect()
