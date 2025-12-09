import os
import sys
import json
import logging
import requests
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib.onshape import OnshapeClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('ProbeV10')

def main():
    if len(sys.argv) < 2:
        print("Usage: python probe_onshape.py <url>")
        sys.exit(1)

    url = sys.argv[1]
    client = OnshapeClient()
    did, wid, eid = client.parse_document_url(url)

    # Endpoint for Copy Document:
    # POST /api/documents/{did}/copy
    endpoint = f"/api/documents/{did}/copy"
    
    payload = {
        "newName": "Probe_Copy_Signature_Test",
        "isPublic": False
    }
    
    logger.info(f"Attempting COPY (POST) to {endpoint}")
    
    try:
        res = client.request("POST", endpoint, body=payload)
        logger.info(f"COPY Status: {res.status_code}")
        
        if res.status_code == 200:
             logger.info("SUCCESS: Signature Fix Worked! We can now POST.")
             new_doc = res.json()
             logger.info(f"New Doc ID: {new_doc.get('id')}")
        else:
             logger.warning(f"COPY Failed: {res.status_code}")
             logger.warning(res.text)
             
    except Exception as e:
        logger.error(f"COPY Error: {e}")

if __name__ == "__main__":
    main()
