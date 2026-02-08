import os
import frontmatter
from pathlib import Path
import sys

TARGET_DIR = Path("src/content/projects")

def audit_schema():
    print(f"🔍  Auditing MDX files in '{TARGET_DIR}' for Law XXXIII Violations...")
    
    files = list(TARGET_DIR.glob("**/*.mdx"))
    violations = []
    
    for file in files:
        try:
            post = frontmatter.load(file)
            slug = post.metadata.get("slug") or file.stem
            
            # Check metrics (Should be Object/Deep)
            if "metrics" in post.metadata:
                m = post.metadata["metrics"]
                if isinstance(m, dict):
                    # Check if keys are unexpectedly simple strings (Narrative) 
                    # Real metrics should be object-like or arrays, not flat narration strings.
                    # But wait, law says `forensic_metrics` is for strings.
                    # `metrics` is for structured data.
                    # So if m['financial'] is a simple string, it's a violation?
                    # The schema says metrics.financial should be an object { costOfGoodsSold: ... }
                    
                    for key, val in m.items():
                        if key in ["financial", "process", "governance", "technical"]:
                            if isinstance(val, str):
                                violations.append(f"❌  {slug}: 'metrics.{key}' is a String. Should be Object (Move to forensic_metrics?).")
                            elif not isinstance(val, (dict, list)) and val is not None:
                                # Allow numbers? Maybe. 
                                pass

            # Check forensic_metrics (Should be Narrative Strings)
            if "forensic_metrics" in post.metadata:
                fm = post.metadata["forensic_metrics"]
                if isinstance(fm, dict):
                    for key, val in fm.items():
                        if isinstance(val, (dict, list)):
                             violations.append(f"❌  {slug}: 'forensic_metrics.{key}' is an Object/Array. Should be String (Move to metrics?).")

        except Exception as e:
            print(f"⚠️  Error reading {file}: {e}")

    if violations:
        print(f"\n🚨  Found {len(violations)} Violations:")
        for v in violations:
            print(v)
        sys.exit(1)
    else:
        print("\n✅  No Schema Violations Found.")

if __name__ == "__main__":
    audit_schema()
