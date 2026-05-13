import os
import re

# Configuration
SOURCE_DIR = "src/content/prompts"
PROTOCOL_PATH = "src/content/docs/meta/AUDIO_PROTOCOL.md"
OUTPUT_DIR = "public/assets/prompts"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def strip_frontmatter(content):
    """Removes YAML frontmatter (between --- and ---)."""
    return re.sub(r"^---\n.*?\n---\n", "", content, flags=re.DOTALL).strip()

def get_audio_protocol():
    """Reads and strips frontmatter from AUDIO_PROTOCOL."""
    raw = read_file(PROTOCOL_PATH)
    return strip_frontmatter(raw)

def compile_prompt(prompt_dir_name, output_filename, inject_protocol=True):
    """Butters the bread: Merges Protocol + Prompt into one file."""
    prompt_path = os.path.join(SOURCE_DIR, prompt_dir_name, "index.mdx")
    
    if not os.path.exists(prompt_path):
        print(f"Skipping {prompt_dir_name}: File not found.")
        return

    print(f"Compiling {prompt_dir_name}...")
    
    # 1. Read Prompt & Strip Frontmatter
    raw_prompt = read_file(prompt_path)
    clean_prompt = strip_frontmatter(raw_prompt)

    # 2. Prepare content stack
    final_content = []
    
    if inject_protocol:
        # Just inject the protocol directly. No borders.
        final_content.append(get_audio_protocol())
        final_content.append("\n\n")

    final_content.append(clean_prompt)

    # 3. Write to Dist
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(final_content))
    
    print(f" -> Generated: {output_path}")

def main():
    print("--- Starting Hack Pack Compilation (Decoupled Mode) ---")
    
    # Compile Podcast (NEEDS Protocol for Phonetics)
    compile_prompt("notebook-podcast", "PODCAST_NLM-INPUT.txt", inject_protocol=True)
    
    # Compile Resume (Text Only - NO Protocol)
    # Rationale: Resume generation is text-based; phonetic rules are noise that cause leakage.
    compile_prompt("notebook-resume", "RESUME_NLM-INPUT.txt", inject_protocol=False)
    
    # Compile Bolus (JSON Only - NO Protocol)
    compile_prompt("notebook-bolus", "BOLUS_NLM-INPUT.txt", inject_protocol=False)

    # Compile Metrics (JSON Only - NO Protocol)
    compile_prompt("notebook-metrics", "METRICS_NLM-INPUT.txt", inject_protocol=False)

    # Compile Report (Markdown Report - NO Protocol)
    compile_prompt("notebook-report", "REPORT_NLM-INPUT.txt", inject_protocol=False)

    # Compile Sidecar Components (JSON & MD - NO Protocol)
    compile_prompt("notebook-team", "TEAM_NLM-INPUT.txt", inject_protocol=False)
    compile_prompt("notebook-bom", "BOM_NLM-INPUT.txt", inject_protocol=False)
    compile_prompt("notebook-timeline", "TIMELINE_NLM-INPUT.txt", inject_protocol=False)
    compile_prompt("notebook-vignettes", "VIGNETTES_NLM-INPUT.txt", inject_protocol=False)

    print("--- Compilation Complete. Files ready in public/assets/prompts ---")

if __name__ == "__main__":
    main()
