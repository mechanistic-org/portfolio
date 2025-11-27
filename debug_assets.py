import os
import glob

PROJECTS_DIR = "src/content/projects"
STAGING_DIR = "R2_STAGING"

def check_status():
    print("🕵️  ASSET DIAGNOSTIC REPORT\n")
    
    # 1. Scan Staging
    if not os.path.exists(STAGING_DIR):
        print(f"❌ Critical: {STAGING_DIR} folder not found in root!")
        return

    print(f"📂 Scanning {STAGING_DIR}...")
    local_projects = [d for d in os.listdir(STAGING_DIR) if os.path.isdir(os.path.join(STAGING_DIR, d))]
    print(f"   Found {len(local_projects)} local project folders.\n")

    # 2. Check specific problematic projects
    targets = ["002-rack", "backsplash", "cinema-one"]
    
    for slug in targets:
        print(f"--- Checking: {slug} ---")
        
        # A. Check Local File
        local_path = os.path.join(STAGING_DIR, slug)
        has_png = os.path.exists(os.path.join(local_path, "hero.png"))
        has_jpg = os.path.exists(os.path.join(local_path, "hero.jpg"))
        
        if has_png: print(f"   ✅ Local: Found hero.png")
        elif has_jpg: print(f"   ✅ Local: Found hero.jpg")
        else: print(f"   ❌ Local: No hero image found in {local_path}")

        # B. Check Generated MDX
        mdx_path = os.path.join(PROJECTS_DIR, f"{slug}.mdx")
        if os.path.exists(mdx_path):
            with open(mdx_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Extract heroImage line
            for line in content.splitlines():
                if "heroImage:" in line:
                    print(f"   📄 MDX Config: {line.strip()}")
                    if "assets.eriknorris.com" in line:
                        print("   🟢 Script wrote R2 Link")
                    else:
                        print("   🔴 Script wrote Placeholder (Why? Check local file name/ext)")
        else:
            print(f"   ❌ MDX File missing!")
        print("")

if __name__ == "__main__":
    check_status()