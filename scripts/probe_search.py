import win32com.client
import os

SEARCH_TERM = "Kaleidescape"

def probe_search():
    print(f"--- 🕵️ SEARCH PROBE: '{SEARCH_TERM}' 🕵️ ---")
    
    try:
        outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
    except Exception as e:
        print(f"CRITICAL: Outlook connection failed. {e}")
        return

    stores = outlook.Stores
    total_matches = 0
    scanned_items = 0

    for store in stores:
        try:
            root = store.GetRootFolder()
            print(f"\n📂 STORE: {root.Name}")
            
            # Recursive Walker
            stack = [root]
            while stack:
                folder = stack.pop()
                
                # Add subfolders
                try: 
                    for sub in folder.Folders: stack.append(sub)
                except: pass

                # SKIP NOISE
                if folder.Name in ["Conversation History", "Sync Issues", "Junk Email", "Deleted Items"]:
                    continue

                try:
                    items = folder.Items
                    count = items.Count
                    if count == 0: continue
                    
                    # DASL Search (Faster than iteration)
                    # Searching Subject and Body for the term
                    # Note: "ci_phrasematch_looser" is keyword search
                    
                    # For safety/speed, let's Start with SUBJECT filter only to verify speed
                    # Filtering 15k items for Body text might slow down without Indexing
                    
                    filter_str = f"@SQL=\"urn:schemas:httpmail:subject\" LIKE '%{SEARCH_TERM}%'"
                    
                    try:
                        filtered_items = items.Restrict(filter_str)
                        match_count = filtered_items.Count
                        
                        if match_count > 0:
                            print(f"   found {match_count} matches in '{folder.Name}'")
                            total_matches += match_count
                            
                        scanned_items += count
                        
                    except Exception as e:
                        # Fallback or error (some folders don't support SQL restrict)
                        pass

                except:
                    pass
        except:
            print(f"   [ACCESS DENIED] {store.DisplayName}")

    print("\n" + "="*40)
    print(f"🔎 SEARCH COMPLETE: '{SEARCH_TERM}'")
    print(f"📚 Total Items Scanned (approx): {scanned_items}")
    print(f"🎯 Total Matches Found: {total_matches}")

if __name__ == "__main__":
    probe_search()
