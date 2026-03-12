import sys
import subprocess
import os

uid = "2b5f7e6e-c4fc-48f8-b4b3-ea62624fe4aa"
slug = "c24"
cli = r"C:\Users\erik\AppData\Roaming\Python\Python314\Scripts\nlm.exe"

os.makedirs(r"src\content\_raw_nlm", exist_ok=True)

def run_query(prompt_text, output_file):
    print(f"Executing query for {output_file}...")
    my_env = os.environ.copy()
    my_env["PYTHONIOENCODING"] = "utf-8"
    result = subprocess.run([cli, "query", "notebook", uid, prompt_text], capture_output=True, text=True, encoding="utf-8", env=my_env)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(result.stdout)
    if result.stderr:
        print(f"Warnings/Errors for {output_file}:\n{result.stderr}")

# 1. BOLUS
with open(r"public\assets\prompts\BOLUS_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), f"src\\content\\_raw_nlm\\{slug}_bolus.json")

# 2. REPORT
with open(r"public\assets\prompts\REPORT_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), f"src\\content\\_raw_nlm\\{slug}_report.md")

# 3. VIGNETTES
with open(r"public\assets\prompts\VIGNETTES_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), f"src\\content\\_raw_nlm\\{slug}_vignettes.md")

# 4. TEAM
with open(r"public\assets\prompts\TEAM_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), f"src\\content\\_raw_nlm\\{slug}_team.md")

# 5. BOM
with open(r"public\assets\prompts\BOM_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), f"src\\content\\_raw_nlm\\{slug}_parts.md")

# 6. TIMELINE
with open(r"public\assets\prompts\TIMELINE_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), f"src\\content\\_raw_nlm\\{slug}_development_timeline.md")

# 7. Resume (added per hack pack compilation)
with open(r"public\assets\prompts\RESUME_NLM-INPUT.txt", "r", encoding="utf-8") as f:
    run_query(f.read(), f"src\\content\\_raw_nlm\\{slug}_resume.md")

# 8. AUDIO
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
my_env = os.environ.copy()
my_env["PYTHONIOENCODING"] = "utf-8"
audio_result = subprocess.run(audio_cmd, capture_output=True, text=True, encoding="utf-8", env=my_env)
print(f"Audio Task Initiated:\n{audio_result.stdout}")
if audio_result.stderr:
    print(f"Audio Task Warnings/Errors:\n{audio_result.stderr}")
