import os
import sys
import glob
import time
from pathlib import Path

# Try to import Google Gen AI SDK
try:
    import google.generativeai as genai
except ImportError:
    print("ERROR: 'google-generativeai' not found.")
    print("Please run: pip install google-generativeai")
    sys.exit(1)

# Configuration
PROMPT_PATH_UNIVERSAL = Path("src/content/docs/prompts/UNIVERSAL_INGEST_PROMPT.md")
PROMPT_PATH_RESUME = Path("src/content/docs/prompts/RESUME_INGEST_PROMPT.md")

INBOX_DIR = Path("data_source/inbox")
OUTPUT_DIR = Path("data_source/manual_content")

def load_env():
    env_path = Path(".env")
    if env_path.exists():
        print(f"Loading .env from {env_path.absolute()}")
        with open(env_path, "r", encoding="utf-8-sig") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    if not os.environ.get(key):
                        os.environ[key] = value.strip('"').strip("'")

load_env()
API_KEY = os.environ.get("GEMINI_API_KEY")

def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def get_prompt(context_tags):
    if "resume" in context_tags:
        target = PROMPT_PATH_RESUME
        print(f"   Using Prompt: RESUME ({target})")
    else:
        target = PROMPT_PATH_UNIVERSAL
        print(f"   Using Prompt: UNIVERSAL ({target})")

    if not target.exists():
        print(f"Error: Prompt file not found at {target}")
        sys.exit(1)
    return read_file(target)

def process_file(file_path):
    print(f"Processing: {file_path.name}...")
    
    # Parse Filename early to get context
    parts = file_path.name.split('.')
    slug = parts[0]
    context_tags = []
    if len(parts) > 2:
        context_tags = parts[1:-1]

    # 1. Prepare Model
    model = genai.GenerativeModel('gemini-2.5-pro')
    
    # 2. Prepare Input
    input_parts = []
    
    # Add System Prompt (Dynamic)
    system_prompt = get_prompt(context_tags)
    input_parts.append(system_prompt)
    
    # Add User Content
    file_ext = file_path.suffix.lower()
    
    if file_ext in ['.txt', '.md', '.csv']:
        text_content = read_file(file_path)
        input_parts.append(f"Input Text:\n{text_content}")
    elif file_ext in ['.mp3', '.wav', '.m4a', '.ogg']:
        print(f"   🎧 Uploading Audio to Gemini...")
        audio_file = genai.upload_file(path=file_path)
        
        # Wait for processing
        while audio_file.state.name == "PROCESSING":
            print('.', end='', flush=True)
            time.sleep(2)
            audio_file = genai.get_file(audio_file.name)
            
        if audio_file.state.name == "FAILED":
            print(f"❌ Audio upload failed for {file_path.name}")
            return

        input_parts.append(audio_file)
        input_parts.append("This is an audio transcript or brain dump. Please process it according to the instructions.")
    else:
        print(f"⚠️ Skipping unsupported file type: {file_path.name}")
        return

    # Parse Smart Filename
    parts = file_path.name.split('.')
    slug = parts[0]
    
    context_tags = []
    if len(parts) > 2:
        context_tags = parts[1:-1]
        print(f"   Context Detected: {context_tags}")
        context_instruction = f"CONTEXT INSTRUCTION: The user has tagged this content with {context_tags}. Adjust tone and structure accordingly (e.g., 'technical' = rigorous/dry, 'rant' = filter emotion, 'social' = draft posts)."
        input_parts.append(context_instruction)
    
    # 3. Generate Content
    try:
        print("   Synthesizing Case Study...")
        response = model.generate_content(input_parts)
        
        # 4. Save Output
        output_path = OUTPUT_DIR / f"{slug}.md"
        
        # Ensure output directory exists
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(response.text)
            
        print(f"   Saved to: {output_path}")

    except Exception as e:
        print(f"   Generation failed: {e}")

def main():
    if not INBOX_DIR.exists():
        print(f"Creating inbox directory at {INBOX_DIR}...")
        INBOX_DIR.mkdir(parents=True, exist_ok=True)

    files = list(INBOX_DIR.glob("*"))
    if not files:
        print(f"Inbox is empty at {INBOX_DIR}")
        print("Drop .txt or .mp3 files there to ingest them.")
        return

    print(f"Found {len(files)} files in inbox.")
    
    for file_path in files:
        if file_path.name.startswith("."): continue # Skip hidden files
        process_file(file_path)

if __name__ == "__main__":
    main()
