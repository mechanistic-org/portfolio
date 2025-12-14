
import sys
import os

# Add local lib to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))

try:
    from onshape import OnshapeClient
except ImportError as e:
    print(f"FAILED: Could not import onshape client: {e}")
    sys.exit(1)

def probe():
    print("--- Onshape API Probe ---")
    
    # 1. Check Credentials
    ak = os.environ.get("ONSHAPE_ACCESS_KEY")
    sk = os.environ.get("ONSHAPE_SECRET_KEY")
    
    if not ak or not sk:
        print("RESULT: MISSING_KEYS")
        print("Details: ONSHAPE_ACCESS_KEY or ONSHAPE_SECRET_KEY not found in environment.")
        print("Answer: We cannot use the API without credentials, even for public docs.")
        return

    print("Credentials: FOUND (Keys present)")

    # 2. Target Document (from User Prompt)
    # https://cad.onshape.com/documents/76a65e12b9edeb12c5bbcdc3/w/fffb293495c84de3a0bcb6d1/e/1f200cdfffc48ca7280d6e4d
    did = "76a65e12b9edeb12c5bbcdc3"
    wid = "fffb293495c84de3a0bcb6d1"
    eid = "1f200cdfffc48ca7280d6e4d"

    client = OnshapeClient()
    
    print(f"Probing Document: {did}...")
    
    # 3. Test Call: Get Document Metadata
    # Endpoint: /api/documents/{did}
    try:
        res = client.request("GET", f"/api/documents/{did}")
        print(f"Status Code: {res.status_code}")
        
        if res.status_code == 200:
            data = res.json()
            name = data.get('name')
            public = data.get('public', False)
            print(f"RESULT: SUCCESS")
            print(f"Document Name: {name}")
            print(f"Is Public: {public}")
        else:
            print(f"RESULT: FAILED")
            print(f"Response: {res.text}")
            
    except Exception as e:
        print(f"RESULT: ERROR")
        print(f"Exception: {e}")

if __name__ == "__main__":
    probe()
