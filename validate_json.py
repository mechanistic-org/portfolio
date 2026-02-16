import json
import re

def validate_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the big JSON block
    # We know it starts around line 103 and ends around 311
    # Let's try to extract it by matching { ... } with balanced braces if possible
    # But for a quick check, let's use the decoder technique from hydrate_content.py
    decoder = json.JSONDecoder()
    pos = 0
    while pos < len(content):
        match = re.search(r'\{', content[pos:])
        if not match:
            break
        start = pos + match.start()
        try:
            obj, end = decoder.raw_decode(content, start)
            print(f"FOUND VALID JSON from {start} to {start+end}")
            pos = start + end
            # check the content of the found json
            if isinstance(obj, dict) and "events" in obj:
                print("Found events object.")
                print(f"Events count: {len(obj['events'])}")
                
        except json.JSONDecodeError as e:
            # This is where we want to know details!
            # However, raw_decode might just fail if it's not valid JSON start
            # or if it hits an error inside.
            # If it hits an error inside, it raises JSONDecodeError.
            # We want to capture that.
            print(f"JSONDecodeError at start {start}: {e}")
            # Try to print context
            context_start = max(0, start)
            context_end = min(len(content), start + 200)
            print(f"Context: {content[context_start:context_end]!r}")
            pos = start + 1

validate_json('notebook_dumps/webtv-elmer.txt')
