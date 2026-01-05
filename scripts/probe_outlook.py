import win32com.client
import os

def probe_v2():
    print("--- 🛸 OUTLOOK PROBE V2: ATTACHMENT HUNTER 🛸 ---")
    
    try:
        outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
    except Exception as e:
        print(f"CRITICAL: Outlook connection failed. {e}")
        return

    stores = outlook.Stores
    print(f"Targeting {stores.Count} Stores...\n")

    found_attachments = 0
    
    for store in stores:
        # info on store type
        # 1=Exchange, 2=PST (usually)
        try:
            root = store.GetRootFolder()
            
            # Skip likely system stores if they are empty or irrelevant?
            # actually better to just try them all but be quiet about failures
            
            print(f"📂 STORE: {root.Name} (Path: {getattr(store, 'FilePath', 'Server/Cloud')})")
            
            # Walk the folders (Recursive-lite: 2 levels deep)
            folders_to_check = []
            try:
                for f in root.Folders:
                    folders_to_check.append(f)
                    try:
                        for sub in f.Folders: folders_to_check.append(sub)
                    except: pass
            except: 
                print("   [ACCESS DENIED] Root folder locked.")
                continue

            for folder in folders_to_check:
                # SKIP SYSTEM NOISE
                if folder.Name in ["Conversation History", "Sync Issues", "Outbox", "Junk Email", "Drafts"]:
                    continue
                    
                try:
                    count = folder.Items.Count
                    if count == 0: continue
                    
                    # Look for Attachments
                    print(f"   🔎 Scanning {folder.Name} ({count} items)...")
                    
                    # Sort to get recent items
                    items = folder.Items
                    try: items.Sort("[ReceivedTime]", True)
                    except: pass
                    
                    found_in_folder = 0
                    # Check first 50 items for attachments
                    for i in range(1, min(51, count + 1)):
                        item = items[i]
                        try:
                            if item.Attachments.Count > 0:
                                # FOUND ONE!
                                subject = getattr(item, "Subject", "No Subject")
                                received = getattr(item, "ReceivedTime", "Unknown")
                                
                                print(f"      ✅ MATCH: '{subject}' ({received})")
                                for att in item.Attachments:
                                    print(f"         📎 ATTACH: {att.FileName} ({int(att.Size/1024)} KB)")
                                
                                found_in_folder += 1
                                found_attachments += 1
                                
                                # Limit sample size per folder
                                if found_in_folder >= 3: break
                        except: pass
                        
                    if found_in_folder > 0:
                        print("      (Folder verified. Moving to next...)")

                except Exception as e:
                    # Silent fail on specific restricted folders
                    pass

        except Exception as e:
            print(f"   [STORE ERROR] {e}")

    print("\n" + "="*40)
    if found_attachments > 0:
        print(f"🎉 SUCCESS: Found {found_attachments} accessible attachments in sample.")
        print("    System Check: PASSED. We can harvest these.")
    else:
        print("⚠️ WARNING: No attachments found in sample scan.")
        print("    Check if Archives are mounted/visible in Outlook sidebar.")

if __name__ == "__main__":
    probe_v2()
