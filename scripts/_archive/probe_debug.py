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
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger('DeepProbe')

class DebugClient:
    def __init__(self, access_key=None, secret_key=None, base_url="https://cad.onshape.com"):
        self.access_key = access_key or os.environ.get("ONSHAPE_ACCESS_KEY")
        self.secret_key = secret_key or os.environ.get("ONSHAPE_SECRET_KEY")
        self.base_url = base_url

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
        
        logger.info(f"--- STRING TO SIGN ---\n{hmac_string}\n----------------------")

        signature = base64.b64encode(
            hmac.new(self.secret_key.encode('utf-8'), hmac_string.encode('utf-8'), digestmod=hashlib.sha256).digest()
        ).decode('utf-8')

        auth_header = f"On {self.access_key}:HmacSHA256:{signature}"

        return {
            "Date": date_header,
            "On-Nonce": nonce,
            "Authorization": auth_header,
            "Content-Type": content_type,
            "Accept": "application/json"
        }

    def request(self, method, endpoint, query_params={}, body=None):
        url = f"{self.base_url}{endpoint}"
        
        data = None
        if body is not None:
             data = json.dumps(body) # Default formatting
        
        headers = self._make_auth_headers(method, url, query_params)
        
        logger.info(f"Request: {method} {url}")
        logger.info(f"Headers: {json.dumps(headers, indent=2)}")
        if data: logger.info(f"Body: {data}")

        # DISABLE REDIRECTS to check for 307
        response = requests.request(
            method,
            url,
            headers=headers,
            params=query_params,
            data=data,
            allow_redirects=False 
        )
        
        logger.info(f"Response Code: {response.status_code}")
        logger.info(f"Response Headers: {response.headers}")
        
        if response.status_code >= 300 and response.status_code < 400:
             logger.info(f"REDIRECT DETECTED to: {response.headers.get('Location')}")
        
        if response.status_code >= 400:
             logger.error(f"Error Body: {response.text}")
             
        return response

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
        print("Usage: python probe_debug.py <url>")
        sys.exit(1)

    url = sys.argv[1]
    client = DebugClient()
    did, wid, eid = client.parse_document_url(url)
    
    # 1. Sanity Check: Get User Session (Should always work)
    logger.info("=== TEST 1: GET /api/users/session ===")
    client.request("GET", "/api/users/session")
    
    # 2. Test Copy (POST)
    logger.info("\n=== TEST 2: POST /api/documents/{did}/copy ===")
    endpoint = f"/api/documents/{did}/copy"
    payload = {"newName": "Debug_Copy", "isPublic": False}
    client.request("POST", endpoint, body=payload)

if __name__ == "__main__":
    main()
