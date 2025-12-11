import os
import google.generativeai as genai

key = os.environ.get("GEMINI_API_KEY")

print(f"--- DEBUG AUTH ---")
if key:
    print(f"Key found: {key[:4]}...{key[-4:]} (Length: {len(key)})")
    genai.configure(api_key=key)
    try:
        print("Listing available models...")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f" - {m.name}")
    except Exception as e:
        print(f"Listing failed: {e}")
else:
    print("FATAL: GEMINI_API_KEY not found in os.environ")
