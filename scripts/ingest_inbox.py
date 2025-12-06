import os
import sys
import glob
import time
from pathlib import Path

# Try to import Google Gen AI SDK
try:
    import google.generativeai as genai
except ImportError:
    print("❌ ERROR: 'google-generativeai' not found.")
    print("👉 Please run: pip install google-generativeai")
    sys.exit(1)

# Configuration
API_KEY = os.environ.get("GEMINI_API_KEY")
INBOX_DIR = Path("data_source/inbox")
OUTPUT_DIR = Path("data_source/manual_content")
PROMPT_PATH = Path("src/content/docs/prompts/UNIVERSAL_INGEST_PROMPT.md")

if not API_KEY:
    print("❌ ERROR: GEMINI_API_KEY environment variable not set.")
    print("👉 Please set it via: $env:GEMINI_API_KEY='your_key_here' (PowerShell)")
    sys.exit(1)

genai.configure(api_key=API_KEY)

def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def get_universal_prompt():
    if not PROMPT_PATH.exists():
        print(f"❌ Error: Prompt file not found at {PROMPT_PATH}")
        sys.exit(1)
    return read_file(PROMPT_PATH)

def process_file(file_path):
    print(f"🔄 Processing: {file_path.name}...")
    
    # 1. Prepare Model
    model = genai.GenerativeModel('gemini-2.5-pro')
    
    # 2. Prepare Input
    input_parts = []
    
    # Add System Prompt
    system_prompt = get_universal_prompt()
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
        print(f"   🏷️  Context Detected: {context_tags}")
        context_instruction = f"CONTEXT INSTRUCTION: The user has tagged this content with {context_tags}. Adjust tone and structure accordingly (e.g., 'technical' = rigorous/dry, 'rant' = filter emotion, 'social' = draft posts)."
        input_parts.append(context_instruction)
    
    # 3. Generate Content
    try:
        print("   🧠 Synthesizing Case Study...")
        response = model.generate_content(input_parts)
        
        # 4. Save Output
        output_path = OUTPUT_DIR / f"{slug}.md"
        
        # Ensure output directory exists
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(response.text)
            
        print(f"   ✅ Saved to: {output_path}")

    except Exception as e:
        print(f"   ❌ Generation failed: {e}")

def main():
    if not INBOX_DIR.exists():
        print(f"Creating inbox directory at {INBOX_DIR}...")
        INBOX_DIR.mkdir(parents=True, exist_ok=True)

    files = list(INBOX_DIR.glob("*"))
    if not files:
        print(f"📭 Inbox is empty at {INBOX_DIR}")
        print("👉 Drop .txt or .mp3 files there to ingest them.")
        return

    print(f"Found {len(files)} files in inbox.")
    
    for file_path in files:
        if file_path.name.startswith("."): continue # Skip hidden files
        process_file(file_path)

if __name__ == "__main__":
    main()
