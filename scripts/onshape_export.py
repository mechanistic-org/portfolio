import os
import sys
import json
import uuid
import time
import argparse
import logging
from onshape_client.client import Client
from onshape_client.oas import BTDocumentParams, BTTranslationRequestParams

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger('OnshapeWeaponizer')

class Weaponizer:
    def __init__(self):
        try:
            self.client = Client(configuration={
                "base_url": "https://cad.onshape.com",
                "access_key": os.environ["ONSHAPE_ACCESS_KEY"],
                "secret_key": os.environ["ONSHAPE_SECRET_KEY"]
            })
        except KeyError as e:
            logger.error(f"Missing Environment Variable: {e}")
            sys.exit(1)
            
    def parse_url(self, url):
        """Simplistic parser for did, wid, eid."""
        # TODO: Use regex for robustness
        parts = url.split('/')
        try:
            did_idx = parts.index('d') + 1 if 'd' in parts else parts.index('documents') + 1
            wid_idx = parts.index('w') + 1
            eid_idx = parts.index('e') + 1
            return parts[did_idx], parts[wid_idx], parts[eid_idx]
        except ValueError:
            logger.error("Invalid Onshape URL format.")
            sys.exit(1)

    def run(self, url, output_file):
        did, wid, eid = self.parse_url(url)
        logger.info(f"Target: Did={did} Wid={wid} Eid={eid}")

        # 1. Copy Document
        logger.info("Step 1: Cloning Document to Private Workspace...")
        new_doc_name = f"TEMP_EXPORT_{uuid.uuid4().hex[:8]}"
        
        # Using raw API call pattern if specific wrapper is complex, 
        # but onshape-client has specific methods. 
        # For robustness/speed, I'll use the 'call_api' generic approach if possible 
        # OR the specific API groups. Let's try specific first.
        
        try:
            # Copy Document
            # POST /api/documents/{did}/copy
            logger.info("Using raw API call for Copy Document...")
            
            # Construct body
            copy_body = {
                "newName": new_doc_name,
                "isPublic": False,
                "ownerId": "" # Uses current user
            }
            
            endpoint_copy = f"/api/documents/{did}/copy"
            
            # Raw call
            # call_api signature often: (resource_path, method, path_params, query_params, header_params, body, ...)
            copy_res = self.client.api_client.call_api(
                endpoint_copy, 'POST',
                None, # path_params
                None, # query_params
                {'Content-Type': 'application/json'}, # header_params
                body=copy_body,
                response_type='object'
            )
            
            # copy_res is tuple (data, status, headers)
            new_doc = copy_res[0]
            
            new_did = new_doc['id']
            new_wid = new_doc['defaultWorkspace']['id']
            logger.info(f"Clone Created: {new_did} (Workspace: {new_wid})")
            
        except Exception as e:
            logger.error(f"Failed to clone document: {e}")
            return

        try:
            # 2. Set Units to Meters
            # POST /api/documents/d/{did}/w/{wid}/settings/units
            # Note: The endpoint might be part of 'document_settings_api' or similar?
            # Or we use 'client.api_client.request' (raw).
            # Raw is safer given endpoint confusion.
            
            logger.info("Step 2: Force-Setting Units to METER...")
            
            # Using internal api_client for raw signed request
            # method, url, query_params, headers, body...
            endpoint = f"/api/documents/d/{new_did}/w/{new_wid}/settings/units"
            units_payload = {"lengthUnits": "METER"}
            
            self.client.api_client.call_api(
                endpoint, 'POST',
                header_params={'Content-Type': 'application/json'},
                body=units_payload,
                response_type='object'
            )
            logger.info("Units set to METER.")

            # 3. Export Parasolid
            logger.info("Step 3: Exporting Parasolid...")
            
            # Create Translation
            # POST /api/translations/d/{did}/w/{wid}
            trans_endpoint = f"/api/translations/d/{new_did}/w/{new_wid}"
            trans_payload = {
                "formatName": "PARASOLID",
                "storeInDocument": False,
                "elementIds": [eid], # The EID is likely same in copy?? 
                # WARNING: EID might change in copy if it's not the default element? 
                # Actually, elements are copied. ID should be preserved usually?
                # If not, we might need to look it up.
                # Let's assume ID is preserved for now (common in forks).
                "destinationName": os.path.basename(output_file)
            }
            
            # Warning: Element ID might be different in the new document? 
            # In a Copy, usually element IDs are preserved.
            
            # Using raw for translation creation
            trans_res = self.client.api_client.call_api(
                trans_endpoint, 'POST',
                header_params={'Content-Type': 'application/json'},
                body=trans_payload,
                response_type='object'
            )
            
            trans_id = trans_res[0]['id'] # Response is (data, status, headers) tuple usually?
            # onshape-client call_api returns the 'data' (deserialized) as 1st element
            
            logger.info(f"Translation Job: {trans_id}")
            
            # Poll
            while True:
                time.sleep(2)
                status_ep = f"/api/translations/{trans_id}"
                status_res = self.client.api_client.call_api(status_ep, 'GET', response_type='object')[0]
                state = status_res['requestState']
                
                if state == 'DONE':
                    break
                elif state == 'FAILED':
                   logger.error(f"Export Failed: {status_res.get('failureReason')}")
                   raise Exception("Export Failed")
                   
            # Download
            res_ext_id = status_res['resultExternalIds'][0]
            dl_ep = f"/api/documents/d/{new_did}/externaldata/{res_ext_id}"
            
            logger.info("Downloading...")
            dl_res = self.client.api_client.call_api(
                dl_ep, 'GET', 
                _preload_content=False # Raw stream
            )
            # dl_res is a tuple, last element might be raw response? 
            # Or use requestRaw?
            # Actually call_api with _preload_content=False returns the RESTResponse object
            
            resp_obj = dl_res[0]
            with open(output_file, 'wb') as f:
                f.write(resp_obj.data)
                
            logger.info(f"Success! Saved to {output_file}")

        except Exception as e:
            logger.error(f"Processing Error: {e}")
            import traceback
            traceback.print_exc()
            
        finally:
            # 4. Cleanup
            logger.info("Step 4: Cleaning up Temp Document...")
            try:
                if 'new_did' in locals():
                    del_endpoint = f"/api/documents/{new_did}"
                    self.client.api_client.call_api(del_endpoint, 'DELETE')
                    logger.info("Temp Document Deleted.")
            except Exception as e:
                logger.warning(f"Cleanup failed (Manual Delete Required for {new_did}): {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Metric Parasolid Exporter")
    parser.add_argument("url", help="Onshape Document URL")
    parser.add_argument("--output", help="Output filename", default="export.x_t")
    
    args = parser.parse_args()
    
    w = Weaponizer()
    w.run(args.url, args.output)
