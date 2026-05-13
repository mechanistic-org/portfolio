import os
import json

raw_dir = r"src\content\_raw_nlm"
files = [
    "c24_bolus.json",
    "c24_metrics.json",
    "c24_development_timeline.md",
    "c24_team.md",
    "c24_parts.md",
    "c24_report.md",
    "c24_vignettes.md",
    "c24_resume.md"
]

output_file = os.path.join(raw_dir, "c24.txt")

with open(output_file, "w", encoding="utf-8") as out_f:
    for filename in files:
        filepath = os.path.join(raw_dir, filename)
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as in_f:
                try:
                    data = json.load(in_f)
                    answer_str = data.get("value", {}).get("answer", "")
                    if answer_str:
                        # Convert to dict if possible
                        try:
                            # Parse answer_str as JSON, mutate it, serialize back.
                            import re
                            answer_data = json.loads(answer_str)
                            if "forensic_summary" in answer_data and isinstance(answer_data["forensic_summary"], str):
                                sum_str = answer_data["forensic_summary"]
                                # Find TRIGGER, INTERVENTION, RESULT
                                # It might have multiple triggers. Let's just grab the whole string for each section
                                trigger = ""
                                intervention = ""
                                result = ""
                                
                                m_trigger = re.search(r'TRIGGER[^:]*:(.*?)(?=(-> INTERVENTION|INTERVENTION|-> RESULT|RESULT|$))', sum_str, re.IGNORECASE | re.DOTALL)
                                m_intervention = re.search(r'INTERVENTION[^:]*:(.*?)(?=(-> RESULT|RESULT|$))', sum_str, re.IGNORECASE | re.DOTALL)
                                m_result = re.search(r'RESULT[^:]*:(.*)', sum_str, re.IGNORECASE | re.DOTALL)
                                
                                if m_trigger: trigger = m_trigger.group(1).strip()
                                if m_intervention: intervention = m_intervention.group(1).strip()
                                if m_result: result = m_result.group(1).strip()
                                
                                if trigger or intervention or result:
                                    answer_data["forensic_summary"] = {
                                        "trigger": trigger,
                                        "intervention": intervention,
                                        "result": result
                                    }
                            
                            # Replace any arbitrary timeline keys with 'timeline'
                            keys = list(answer_data.keys())
                            for k in keys:
                                if k.endswith("_development_timeline"):
                                    answer_data["timeline"] = answer_data.pop(k)

                            answer_str = json.dumps(answer_data, indent=2)
                        except json.JSONDecodeError:
                            # It's Markdown! Is it vignettes?
                            if filename == "c24_vignettes.md":
                                import re
                                scars = []
                                # Parse markdown vignettes into a JSON array of objects
                                # Format: ### [Title]\n1. **The Problem/Trigger:** [Text]\n2. **The Engineering Intervention:** [Text]\n3. **The Hard Numbers/Impact:** [Text]
                                blocks = re.split(r'###\s+', answer_str)[1:]
                                for block in blocks:
                                    lines = block.strip().split('\n')
                                    title = lines[0].strip()
                                    desc = " ".join(lines[1:]).strip()
                                    # Very naive structure
                                    scars.append({
                                        "title": title,
                                        "description": desc,
                                        "type": "scars"
                                    })
                                if scars:
                                    answer_str = json.dumps({"scars": scars}, indent=2)
                        
                        out_f.write(answer_str)
                        out_f.write("\n\nrun\n\n")
                    else:
                        print(f"Warning: No 'answer' field in {filename}")
                except Exception as e:
                    print(f"Error parsing {filename}: {e}")
        else:
            print(f"File not found: {filename}")

print(f"Successfully compiled {output_file}")
