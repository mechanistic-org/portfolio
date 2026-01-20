import os
import frontmatter
import glob

# Paths
PROJECTS_DIR = r"D:\GitHub\eriknorris\src\content\projects"
STAGING_DIR = r"D:\GitHub\eriknorris-assets\R2_STAGING"

def repair_project(mdx_path):
    try:
        post = frontmatter.load(mdx_path)
        filename_slug = os.path.splitext(os.path.basename(mdx_path))[0]
        # Handle index.mdx case
        if filename_slug == "index":
            filename_slug = os.path.basename(os.path.dirname(mdx_path))
            
        current_slug = post.metadata.get('slug', filename_slug)
        changed = False

        # 1. Ensure Slug Exists
        if 'slug' not in post.metadata:
            print(f"[{current_slug}] Missing slug. Adding '{filename_slug}'.")
            post.metadata['slug'] = filename_slug
            current_slug = filename_slug
            changed = True
        
        # 2. Check and Fix Hero Image
        hero_image = post.metadata.get('heroImage', '')
        
        # If hero is missing, placeholder, or looks legacy
        if not hero_image or "placeholder" in hero_image or "abstract.jpg" in hero_image:
            # Look for assets in Staging
            # Pattern: [slug]-hero-01-xl.webp
            # We check XL first, then LG
            candidates = [
                f"{current_slug}-hero-01-xl.webp",
                f"{current_slug}-hero-01-lg.webp",
                f"{current_slug}-hero-01.png" # Fallback to raw if logic requires (though we prefer webp)
            ]
            
            staging_project_path = os.path.join(STAGING_DIR, current_slug)
            
            found_asset = None
            if os.path.exists(staging_project_path):
                for candidate in candidates:
                    candidate_path = os.path.join(staging_project_path, candidate)
                    if os.path.exists(candidate_path):
                        found_asset = candidate
                        break
            
            if found_asset:
                # Construct R2 Path: /assets/r2/[slug]/[filename]
                new_hero = f"/assets/r2/{current_slug}/{found_asset}"
                if hero_image != new_hero:
                    print(f"[{current_slug}] Updating Hero: {hero_image} -> {new_hero}")
                    post.metadata['heroImage'] = new_hero
                    changed = True
            else:
                # print(f"[{current_slug}] No hero asset found in staging.")
                pass

        if changed:
            # write back
            with open(mdx_path, 'wb') as f:
                frontmatter.dump(post, f)
            print(f"[{current_slug}] SAVED.")
            
    except Exception as e:
        print(f"Error processing {mdx_path}: {e}")

def main():
    print("--- LINK REPAIR UTILITY ---")
    # Scan all MDX in subfolders (e.g. acer-aspire/index.mdx)
    for root, dirs, files in os.walk(PROJECTS_DIR):
        for file in files:
            if file.endswith(".mdx"):
                repair_project(os.path.join(root, file))

if __name__ == "__main__":
    main()
