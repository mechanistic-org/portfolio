import os
import sys
import json
import logging
import base64
import hashlib
import hmac
import random
import string
import time
import urllib.parse
import requests

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('ProbePaths')

class PathClient:
    def __init__(self):
        self.access_key = os.environ.get("ONSHAPE_ACCESS_KEY")
        self.secret_key = os.environ.get("ONSHAPE_SECRET_KEY")
        self.base_url = "https://cad.onshape.com"

    def _make_nonce(self):
        chars = string.ascii_letters + string.digits
        return "".join(random.choice(chars) for _ in range(25))

    def _make_auth_headers(self, method, path, query_args={}, content_type="application/json"):
        nonce = self._make_nonce()
        date_header = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime())
        query_string = urllib.parse.urlencode(query_args, safe='/')
        url_path = urllib.parse.urlparse(path).path

        hmac_string = (
            f"{method}\n"
            f"{nonce}\n"
            f"{date_header}\n"
            f"{content_type}\n"
            f"{url_path}\n"
            f"{query_string}\n"
        ).lower().strip()
        
        signature = base64.b64encode(
            hmac.new(self.secret_key.encode('utf-8'), hmac_string.encode('utf-8'), digestmod=hashlib.sha256).digest()
        ).decode('utf-8')

        return {
            "Date": date_header,
            "On-Nonce": nonce,
            "Authorization": f"On {self.access_key}:HmacSHA256:{signature}",
            "Content-Type": content_type,
            "Accept": "application/json"
        }

    def request(self, method, endpoint, body=None):
        url = f"{self.base_url}{endpoint}"
        data = json.dumps(body) if body else None
        headers = self._make_auth_headers(method, url)
        
        logger.info(f"Testing {method} {endpoint} ...")
        res = requests.request(method, url, headers=headers, data=data, allow_redirects=False)
        
        if res.status_code == 200:
            logger.info(f"SUCCESS: {res.status_code}")
            return True
        else:
            logger.info(f"FAILED: {res.status_code}")
            return False

    def parse_document_url(self, url):
        parsed = urllib.parse.urlparse(url)
        path = parsed.path
        parts = [p for p in path.split('/') if p]
        if 'd' in parts: did = parts[parts.index('d')+1]
        elif 'documents' in parts: did = parts[parts.index('documents')+1]
        else: return None, None, None
        if 'w' in parts: wid = parts[parts.index('w')+1]
        else: wid = None
        if 'e' in parts: eid = parts[parts.index('e')+1]
        else: eid = None
        return did, wid, eid

def main():
    if len(sys.argv) < 2:
        print("Usage: python probe_paths.py <url>")
        sys.exit(1)

    url = sys.argv[1]
    client = PathClient()
    did, wid, eid = client.parse_document_url(url)
    
    # Payload for Copy
    copy_payload = {"newName": "Path_Test_Copy", "isPublic": False}
    
    # 1. Test Copy WITH /d/
    client.request("POST", f"/api/documents/d/{did}/copy", body=copy_payload)
    
    # 2. Test Copy WITHOUT /d/
    client.request("POST", f"/api/documents/{did}/copy", body=copy_payload)
    
    # 3. Test Export WITH /d/ for Translation (Translations endpoint)
    # Payload for Export
    export_payload = {
        "formatName": "PARASOLID",
        "storeInDocument": False,
        "elementIds": [eid],
        "destinationName": "PathTest.x_t"
    }
    client.request("POST", f"/api/translations/d/{did}/w/{wid}", body=export_payload)

if __name__ == "__main__":
    main()
