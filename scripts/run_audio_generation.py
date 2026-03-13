import sys
import subprocess
import codecs

# Ensure console output uses utf-8
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())
sys.stderr = codecs.getwriter("utf-8")(sys.stderr.detach())

uid = "b8f893fe-234c-44ca-9d92-8fff6f82e53d"
cli = r"C:\Users\erik\AppData\Roaming\Python\Python314\Scripts\nlm.exe"

print("Triggering PODCAST_NLM-INPUT Audio Generation...")
with open(r"public\assets\prompts\PODCAST_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    podcast_prompt = f.read()

# Crucial: Use --length short and pass the exact prompt via --focus
audio_cmd = [
    cli, "audio", "create", uid, 
    "--length", "short", 
    "--focus", podcast_prompt, 
    "-y"
]
audio_result = subprocess.run(audio_cmd, capture_output=True, text=True, encoding="utf-8")
print(f"Audio Task Initiated:\n{audio_result.stdout}")
if audio_result.stderr:
    print(f"Audio Task Warnings/Errors:\n{audio_result.stderr}")
