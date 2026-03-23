import os
import re
import frontmatter

CONTENT_DIR = r"d:\GitHub\portfolio\src\content\projects"

def migrate_file(filepath):
    try:
        post = frontmatter.load(filepath)
        changed = False

        # 1. Migrate War Stories -> Scars
        if 'scars' in post.metadata:
            print(f"Migrating scars -> scars in {filepath}")
            post.metadata['scars'] = post.metadata.pop('scars')
            changed = True

        # 1.5 Migrate Metrics.War_Stories -> Scars (or remove if duplicate)
        if 'metrics' in post.metadata and isinstance(post.metadata['metrics'], dict):
            if 'scars' in post.metadata['metrics']:
                ws = post.metadata['metrics'].pop('scars')
                print(f"Removed metrics.scars in {filepath}")
                changed = True
                # Optional: Add to scars if not present? 
                # Assuming duplicates or legacy garbage for now.

        # 2. Migrate Complexity Vector (Array -> Object)
        if 'complexity_vector' in post.metadata:
            cv = post.metadata['complexity_vector']
            
            # Case A: Complexity Vector is an Array (Legacy) -> Convert to Object
            if isinstance(cv, list):
                print(f"Migrating complexity_vector Array -> Object in {filepath}")
                # Enforce string type for values
                cleaned_metrics = []
                for item in cv:
                    if isinstance(item, dict):
                        item['value'] = str(item.get('value', ''))
                        cleaned_metrics.append(item)
                
                new_cv = {
                    'legacy_metrics': cleaned_metrics,
                    'part_count_growth': [],
                    'process_density': [],
                    'tooling_chain': [],
                    'supply_chain_nodes': []
                }
                post.metadata['complexity_vector'] = new_cv
                changed = True

            # Case B: Complexity Vector is already an Object (V2.1) -> Check legacy_metrics for non-strings
            elif isinstance(cv, dict):
                if 'legacy_metrics' in cv and isinstance(cv['legacy_metrics'], list):
                    metrics_changed = False
                    for item in cv['legacy_metrics']:
                        if isinstance(item, dict) and 'value' in item:
                             if not isinstance(item['value'], str):
                                 item['value'] = str(item['value'])
                                 metrics_changed = True
                    if metrics_changed:
                        print(f"Fixed non-string values in legacy_metrics in {filepath}")
                        changed = True
        
        # 3. Rename 'isomorphics' array items if needed?
        # Current schema: label, hardware_point, software_point, principle.
        # Check integrity? No, just structure.

        if changed:
            with open(filepath, 'wb') as f:
                frontmatter.dump(post, f)
            print(f"Saved {filepath}")

    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    print("Starting migration...")
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith(".md") or file.endswith(".mdx"):
                migrate_file(os.path.join(root, file))
    print("Migration complete.")

if __name__ == "__main__":
    main()
