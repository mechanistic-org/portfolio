import win32com.client
import os
import re
from pathlib import Path
import datetime

# --- CONFIGURATION ---
TARGET_ROOT = r"D:\GitHub\eriknorris-workspace\digi_ALL_emails_working-copy\ALL_emails_as-of_2026_01_01"
MIN_SIZE_KB = 5  # Filter small icons/signatures (<5KB)
ALLOWED_EXTS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.zip', '.7z', '.rar']

def sanitize(text):
    """Remove illegal chars and shorten."""
    if not text: return "Unknown"
    # Replace illegal chars with underscore
    clean = re.sub(r'[\\/*?:"<>|]', '_', str(text))
    # Replace whitespace with single space
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean[:50] # Truncate to avoid path length issues

def harvest_outlook():
    print("--- 🚜 THE HARVESTER V1 🚜 ---")
    
    # 1. Setup Target
    target_dir = Path(TARGET_ROOT)
    if not target_dir.exists():
        print(f"Creating Clean Room: {target_dir}")
        target_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
    except Exception as e:
        print(f"CRITICAL: Outlook not found. {e}")
        return

    stats = {'emails': 0, 'attachments': 0, 'skipped_small': 0, 'errors': 0}

    # 2. Iterate Stores
    for store in outlook.Stores:
        try:
            root = store.GetRootFolder()
            print(f"\n📂 SCANNING STORE: {root.Name}")
            
            # Recurse
            stack = [root]
            while stack:
                folder = stack.pop()
                
                # Add subfolders to stack
                try: 
                    for sub in folder.Folders: stack.append(sub)
                except: pass

                # Process Items
                try:
                    items = folder.Items
                    if items.Count == 0: continue
                    
                    # Sort by Date for predictable logs
                    try: items.Sort("[ReceivedTime]", True)
                    except: pass # Some folders don't support sorting
                    
                    print(f"   Processing {folder.Name} ({items.Count} items)...")
                    
                    for item in items:
                        stats['emails'] += 1
                        
                        try:
                            # Check for attachments early
                            if item.Attachments.Count == 0: continue
                            
                            # Extract Metadata
                            try:
                                rcv_time = item.ReceivedTime
                                date_str = rcv_time.strftime("%Y-%m-%d")
                            except:
                                date_str = "0000-00-00"
                                
                            subject = sanitize(item.Subject)
                            sender = sanitize(getattr(item, "SenderName", "Unknown"))
                            
                            # Process Attachments
                            for att in item.Attachments:
                                # Size Check
                                size_kb = att.Size / 1024
                                if size_kb < MIN_SIZE_KB:
                                    stats['skipped_small'] += 1
                                    continue
                                    
                                # Ext Check
                                ext = Path(att.FileName).suffix.lower()
                                if ext not in ALLOWED_EXTS: continue

                                # Construct "Vectored" Filename
                                # Format: YYYY-MM-DD_Subject_Sender_FileName.ext
                                safe_fname = sanitize(Path(att.FileName).stem)
                                new_name = f"{date_str}_{subject}_{sender}_{safe_fname}{ext}"
                                
                                # Handle Duplicates
                                out_path = target_dir / new_name
                                dup_count = 1
                                while out_path.exists():
                                    out_path = target_dir / f"{date_str}_{subject}_{sender}_{safe_fname}_{dup_count}{ext}"
                                    dup_count += 1
                                    
                                # SAVE
                                try:
                                    att.SaveAsFile(str(out_path))
                                    print(f"      [SAVE] {new_name}")
                                    stats['attachments'] += 1
                                except Exception as save_err:
                                    print(f"      [ERR-SAVE] {save_err}")
                                    stats['errors'] += 1

                        except Exception as e:
                            # print(f"      [SKIP-ITEM] {e}") 
                            pass # Skip item on error (usually permission or non-mail item)

                except Exception as e:
                    print(f"   [LOCK] Skipping folder {folder.Name}")

        except Exception as e:
            print(f"   [ERR-STORE] {e}")

    print("-" * 40)
    print("--- 🌾 HARVEST COMPLETE 🌾 ---")
    print(f"Title: {stats['emails']} scanned")
    print(f"Saved: {stats['attachments']} attachments")
    print(f"Small Skipped: {stats['skipped_small']}")
    print(f"Errors: {stats['errors']}")
    print(f"Location: {TARGET_ROOT}")

if __name__ == "__main__":
    harvest_outlook()
