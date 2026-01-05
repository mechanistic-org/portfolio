import win32com.client

def probe_fast():
    print("--- ⚡ FAST PROBE (STORES ONLY) ⚡ ---")
    try:
        outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
        stores = outlook.Stores
        print(f"Detected {stores.Count} Connected Stores (Archives/PSTs):")
        print("-" * 40)
        
        for i, store in enumerate(stores, 1):
            try:
                name = store.DisplayName
                path = getattr(store, 'FilePath', 'Server/Cloud')
                print(f"{i}. {name}")
                print(f"   path: {path}")
            except Exception as e:
                print(f"{i}. [ERROR READING STORE] {e}")
                
        print("-" * 40)
        print("Done.")
        
    except Exception as e:
        print(f"CRITICAL: {e}")

if __name__ == "__main__":
    probe_fast()
