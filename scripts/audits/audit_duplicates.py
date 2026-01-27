
import os
from pathlib import Path

# Config
PROJECTS_DIR = r"src/content/projects"
REPORT_FILE = r"src/content/docs/audits/2026-01-11_DUPLICATE_CONTENT_AUDIT.md"

def get_stats(file_path):
    """Returns dict of stats for a file."""
    if not file_path.exists():
        return None
    
    stat = file_path.stat()
    content = file_path.read_text(encoding='utf-8', errors='ignore')
    
    # Heuristics
    is_scaffold = "Auto-generated scaffold" in content
    has_zero_stats = "Strategy: 0, Design: 0" in content
    lines = len(content.splitlines())
    
    return {
        "size": stat.st_size,
        "lines": lines,
        "is_scaffold": is_scaffold,
        "has_zero_stats": has_zero_stats,
        "content_preview": content[:100].replace('\n', ' ')
    }

def audit():
    base_path = Path(os.getcwd()) / PROJECTS_DIR
    flat_files = sorted([f for f in base_path.glob("*.mdx") if f.is_file()])
    
    report_lines = []
    report_lines.append("# Global Duplicate Content Audit")
    report_lines.append(f"**Date:** 2026-01-11")
    report_lines.append(f"**Total Duplicates Scanned:** {len(flat_files)}\n")
    
    report_lines.append("| Slug | Status | Old (Flat) | New (Folder) | Verdict |")
    report_lines.append("| :--- | :--- | :--- | :--- | :--- |")

    safe_count = 0
    risk_count = 0
    
    for flat_path in flat_files:
        slug = flat_path.stem
        folder_path = base_path / slug / "index.mdx"
        
        flat_stats = get_stats(flat_path)
        folder_stats = get_stats(folder_path)
        
        if not folder_stats:
            report_lines.append(f"| `{slug}` | **ORPHAN** | {flat_stats['size']}b | N/A | ⚠️ **KEEP** (No Folder) |")
            risk_count += 1
            continue

        # Comparison Logic
        # CASE 1: Folder is bigger and Flat is Scaffold -> SAFE
        if folder_stats['size'] > flat_stats['size'] and flat_stats['is_scaffold']:
            verdict = "✅ **SAFE PURGE**"
            safe_count += 1
        
        # CASE 2: Folder is bigger but Flat is NOT explicit scaffold -> REVIEW
        elif folder_stats['size'] > flat_stats['size'] and not flat_stats['is_scaffold']:
             # It might be real content
             verdict = "👀 **REVIEW** (New is bigger, but Old not scaffold)"
             risk_count += 1

        # CASE 3: Flat is bigger -> DANGER
        elif flat_stats['size'] > folder_stats['size']:
            diff = flat_stats['size'] - folder_stats['size']
            verdict = f"🔴 **DATA LOSS RISK** (Old is +{diff}b)"
            risk_count += 1
        
        # CASE 4: Equal -> DUPLICATE
        else:
             verdict = "🟡 **IDENTICAL**"
             safe_count += 1

        row = f"| `{slug}` | DUPLICATE | {flat_stats['size']}b ({'Scaffold' if flat_stats['is_scaffold'] else 'Custom'}) | {folder_stats['size']}b | {verdict} |"
        report_lines.append(row)

    # Summary
    summary = f"\n**Summary:**\n- Safe to Purge: {safe_count}\n- Risks/ Orphans: {risk_count}\n\n"
    report_lines.insert(3, summary)

    # write report
    out_path = Path(os.getcwd()) / REPORT_FILE
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(report_lines), encoding='utf-8')
    
    print(f"Audit Complete. Report saved to: {REPORT_FILE}")
    print(summary)

if __name__ == "__main__":
    audit()
