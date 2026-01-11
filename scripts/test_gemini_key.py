import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ API Key not found in environment.")
    exit(1)

print(f"Testing Key: {api_key[:5]}...")

try:
    genai.configure(api_key=api_key)
    
    # Models to test
    models_to_try = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash', 
        'gemini-2.5-flash'
    ]
    
    # Check what the user has configured in .env and test that FIRST
    env_model = os.getenv("GEMINI_MODEL")
    if env_model:
        print(f"👉 Testing Configured Model from .env: {env_model}")
        models_to_try.insert(0, env_model)
    else:
        print("⚠️  No GEMINI_MODEL found in .env (IDE might be using default)")
    
    success = False
    for model_name in models_to_try:
        print(f"Attempting model: {model_name}")
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hello, can you hear me?")
            print(f"✅ API Call Successful with {model_name}!")
            print(f"Response: {response.text}")
            success = True
            break
        except Exception as inner_e:
            print(f"   Failed with {model_name}: {inner_e}")
            
    if not success:
        print("❌ All specific model attempts failed.")
        
        print("\n--- Diagnostic: Listing All Available Models ---")
        try:
            found_any = False
            for m in genai.list_models():
                print(f" - Found: {m.name} ({m.supported_generation_methods})")
                found_any = True
            if not found_any:
                print("⚠️  No models found. This usually means the API Service is disabled in Google Workspace Admin.")
        except Exception as e:
            print(f"❌ Failed to list models: {e}")

except Exception as e:
    print(f"❌ Configuration/Global Error: {e}")
