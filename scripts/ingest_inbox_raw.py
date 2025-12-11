import os
import sys
import json
import time
import urllib.request
import urllib.error
from pathlib import Path

# Config
INBOX_DIR = Path("data_source/inbox")
OUTPUT_DIR = Path("data_source/manual_content")
MODEL_NAME = "gemini-flash-latest" # Standard Flash for better rate limits 
BATCH_SIZE = 5 # Resumes per request
Wait_BETWEEN_BATCHES = 5 # Seconds

print("--- CHUNKED INGESTION v2 ---")

# 1. Load Key
env_path = Path(".env")
key = None
if env_path.exists():
    try:
        content = env_path.read_bytes()
        if content.startswith(b'\xef\xbb\xbf'):
            text = content.decode('utf-8-sig')
        else:
            text = content.decode('utf-8')
        for line in text.splitlines():
            line = line.strip()
            if line.startswith("GEMINI_API_KEY") and "=" in line:
                key = line.split("=", 1)[1].strip().strip('"').strip("'")
    except Exception as e:
        print(f"Error reading .env: {e}")

if not key:
    print("FATAL: Key not found in .env")
    sys.exit(1)

# 2. Get Prompt
PROMPT_FILE = Path("src/content/docs/prompts/RESUME_INGEST_PROMPT.md")
if not PROMPT_FILE.exists():
    print(f"FATAL: Prompt not found at {PROMPT_FILE}")
    sys.exit(1)
SYSTEM_PROMPT = PROMPT_FILE.read_text(encoding="utf-8")

def generate_with_retry(payload, url):
    MAX_RETRIES = 5
    for attempt in range(MAX_RETRIES):
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req) as response:
                result = json.load(response)
                try:
                    return result['candidates'][0]['content']['parts'][0]['text']
                except (KeyError, IndexError):
                    return f"Error parsing response: {result}"
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 20 * (attempt + 1)
                print(f"    ⚠️ Rate Limit (429). Retrying in {wait}s...")
                time.sleep(wait)
            else:
                print(f"    HTTP Error {e.code}: {e.read().decode('utf-8')}")
                return None
        except Exception as e:
            print(f"    Error: {e}")
            return None
    return None

# 3. Process Files
files = list(INBOX_DIR.glob("*"))
print(f"Found {len(files)} files.")

for file_path in files:
    if file_path.name.startswith("."): continue
    
    print(f"Processing {file_path.name}...")
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        print(f"  Read failed: {e}")
        continue

    # Split into chunks if it looks like a corpus
    if "## FILESPEC:" in content:
        raw_chunks = content.split("## FILESPEC:")
        # First chunk is usually empty or header, keep it?
        # Re-add delimiter for clarity
        chunks = [f"## FILESPEC:{c}" for c in raw_chunks if c.strip()]
        print(f"  Detected {len(chunks)} resume chunks. running in batches of {BATCH_SIZE}...")
    else:
        chunks = [content]

    # Process Batches
    full_timeline = ""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={key}"

    for i in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[i:i+BATCH_SIZE]
        batch_text = "\n\n".join(batch)
        print(f"  Batch {i//BATCH_SIZE + 1}/{(len(chunks)-1)//BATCH_SIZE + 1} ({len(batch_text)} chars)...")
        
        payload = {
            "contents": [{
                "parts": [{"text": f"{SYSTEM_PROMPT}\n\nINPUT DATA (Batch {i}):\n{batch_text}"}]
            }],
            "generationConfig": {"temperature": 0.2, "maxOutputTokens": 8192}
        }
        
        result = generate_with_retry(payload, url)
        if result:
            full_timeline += f"\n\n## Batch {i//BATCH_SIZE + 1} Results\n{result}"
        
        time.sleep(Wait_BETWEEN_BATCHES)

    # Save
    if full_timeline:
        slug = file_path.stem.split(".")[0]
        output_path = OUTPUT_DIR / f"{slug}_timeline.md"
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        output_path.write_text(full_timeline, encoding="utf-8")
        print(f"  SUCCESS! Saved merged timeline to {output_path}")
