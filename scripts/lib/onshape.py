import os
import base64
import hashlib
import hmac
import json
import logging
import random
import string
import time
import urllib.parse
import requests

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class OnshapeClient:
    def __init__(self, access_key=None, secret_key=None, base_url="https://cad.onshape.com"):
        self.access_key = access_key or os.environ.get("ONSHAPE_ACCESS_KEY")
        self.secret_key = secret_key or os.environ.get("ONSHAPE_SECRET_KEY")
        self.base_url = base_url

        if not self.access_key or not self.secret_key:
            raise ValueError("Onshape API keys must be provided or set in environment variables (ONSHAPE_ACCESS_KEY, ONSHAPE_SECRET_KEY).")

    def _make_nonce(self):
        chars = string.ascii_letters + string.digits
        return "".join(random.choice(chars) for _ in range(25))

    def _make_auth_headers(self, method, path, query_args={}, content_type="application/json"):
        nonce = self._make_nonce()
        date_header = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime())
        
        # Parse query string if necessary logic is needed, but for now simple works
        query_string = urllib.parse.urlencode(query_args, safe='/')
        
        # Path should be the full path part of the URL (e.g. /api/documents/...)
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

        auth_header = f"On {self.access_key}:HmacSHA256:{signature}"

        return {
            "Date": date_header,
            "On-Nonce": nonce,
            "Authorization": auth_header,
            "Content-Type": content_type,
            "Accept": "application/json" # Generally acceptable
        }

    def request(self, method, endpoint, query_params={}, body=None):
        url = f"{self.base_url}{endpoint}"
        
        # Manually serialize to ensure we control the body and headers exactly
        data = None
        if body is not None:
             data = json.dumps(body)
        
        headers = self._make_auth_headers(method, url, query_params)
        
        response = requests.request(
            method,
            url,
            headers=headers,
            params=query_params,
            data=data
        )

        # For probing purposes, we log errors but might not always raise immediately 
        # so we can see the 401/403 bodies. But for standard library usage, we should check status.
        if response.status_code >= 400:
             logger.error(f"API Request Failed: {response.status_code} - {response.text}")
             # response.raise_for_status() 
        
        return response

    def parse_document_url(self, url):
        """Extracts did, wid, eid from a standard Onshape URL."""
        parsed = urllib.parse.urlparse(url)
        path_parts = parsed.path.split('/')
        
        # Typically: /documents/{did}/w/{wid}/e/{eid} OR /documents/d/{did}/w/{wid}/e/{eid}
        try:
             # Split path by slashes
             parts = path_parts
             # Filter empty strings
             parts = [p for p in parts if p]
             
             if 'd' in parts:
                 did_idx = parts.index('d') + 1
             elif 'documents' in parts:
                 did_idx = parts.index('documents') + 1
             else:
                 raise ValueError("Document ID (d or documents) not found")

             if 'w' in parts:
                 wid_idx = parts.index('w') + 1
             else:
                 raise ValueError("Workspace ID (w) not found in URL")
                 
             if 'e' in parts:
                 eid_idx = parts.index('e') + 1
             else:
                 raise ValueError("Element ID (e) not found in URL")
                 
             return parts[did_idx], parts[wid_idx], parts[eid_idx]
        except (ValueError, IndexError) as e:
            raise ValueError(f"Could not parse Document, Workspace, and Element IDs from URL: {url}. Error: {e}")

    def get_current_units(self, did, wid):
        """Retrieves the current workspace units."""
        # Endpoint structure with /d/
        endpoint = f"/api/documents/d/{did}/w/{wid}/settings/units"
        return self.request("GET", endpoint).json()

    def set_workspace_units(self, did, wid, length_unit="METER"):
        """Sets the workspace length unit."""
        endpoint = f"/api/documents/d/{did}/w/{wid}/settings/units"
        
        current = self.get_current_units(did, wid)
        # Note: current might be None/error if GET failed.
        # Assuming happy path for now or that caller handles it.
        
        new_settings = current.copy() if current else {}
        new_settings['lengthUnits'] = length_unit
        
        return self.request("POST", endpoint, body=new_settings).json()

    def export_parasolid(self, did, wid, eid, output_path):
        """Exports the given element as Parasolid (.x_t)."""
        endpoint = f"/api/translations/d/{did}/w/{wid}"
        
        payload = {
            "formatName": "PARASOLID",
            "storeInDocument": False,
            "elementIds": [eid],
            "destinationName": os.path.basename(output_path)
        }
        
        logger.info("Requesting translation...")
        response = self.request("POST", endpoint, body=payload)
        data = response.json()
        
        # Check if ID exists (it might not on error)
        translation_id = data.get('id')
        if not translation_id:
            raise Exception(f"Failed to start translation: {data}")

        logger.info(f"Translation started (ID: {translation_id}). Polling for completion...")
        status_endpoint = f"/api/translations/{translation_id}"
        
        while True:
            res = self.request("GET", status_endpoint)
            status_data = res.json()
            state = status_data.get('requestState')
            
            if state == 'FAILED':
                raise Exception(f"Export failed: {status_data.get('failureReason')}")
            elif state == 'DONE':
                break
            time.sleep(2)
            
        result_external_id = status_data.get('resultExternalIds')[0]
        logger.info("Downloading file...")
        download_endpoint = f"/api/documents/d/{did}/externaldata/{result_external_id}"
        
        file_res = self.request("GET", download_endpoint)
        
        with open(output_path, 'wb') as f:
            f.write(file_res.content)
            
        logger.info(f"Saved to {output_path}")
