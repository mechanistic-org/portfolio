import os
import re

def extract_component_data(file_context: str) -> dict:
    """Extracts strict Component bounds and their associative TypeScript Props via explicit regex evaluation."""
    # Find explicit export function or const geometry
    comp_match = re.search(r"export\s+(?:const|function|default\s+function)\s+([A-Z]\w+)", file_context)
    component_name = comp_match.group(1) if comp_match else "UnknownComponent"
    
    # Aggressively trap the multiline interface boundaries
    prop_match = re.search(r"(?:interface|type)\s+Props\s*=?\s*{(.*?)}", file_context, re.DOTALL)
    props = prop_match.group(1).strip() if prop_match else "None (Static Geometry)"
    
    # Compress the internal prop arrays to save critical LLM Token bandwidth
    props = re.sub(r"\s+", " ", props)
    return {"name": component_name, "props": props}

def execute_recon_sweep(target_dir: str, registry_output: str):
    print("==================================================")
    print("  NODE 0: ALGORITHMIC RECON CRAWLER ENGAGED       ")
    print("==================================================")
    
    os.makedirs(os.path.dirname(registry_output), exist_ok=True)
    
    results = []
    print(f"-> Sweeping physical architecture boundaries at: {target_dir}")
    
    for root, _, files in os.walk(target_dir):
        for file in files:
            if file.endswith((".tsx", ".astro")) and not file.endswith(".test.tsx"):
                file_path = os.path.join(root, file)
                # Ensure the LLM imports the correct abstract mapping
                rel_path = os.path.relpath(file_path, target_dir)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = extract_component_data(f.read())
                        if data["name"] != "UnknownComponent":
                            out_path = rel_path.replace(os.sep, '/')
                            results.append(f"### `{data['name']}`\n- **Import:** `import {data['name']} from '@components/{out_path}'`\n- **TS Props:** `{data['props']}`\n")
                except Exception as e:
                    print(f"[RECON ERROR] Structural break parsing {rel_path}: {e}")
                    
    print(f"-> Extraction complete. {len(results)} exact nodes mathematically trapped.")
    
    with open(registry_output, "w", encoding="utf-8") as out:
        out.write("# Portfolio Architecture Map (Node 0 FastMCP Registry)\n\n")
        out.write("This explicit mapping defines the exact geometric constraints required for Spoke UI generative loops. " 
                  "Swarms MUST organically extract Prop arrays from this layout BEFORE hallucinating `<Component>` bindings.\n\n")
        out.write("---\n\n".join(results))
        
    print(f"-> SUCCESS: Telemetry payload formally locked into Hub registry at: {registry_output}")

if __name__ == "__main__":
    components_dir = r"d:\GitHub\portfolio\src\components"
    registry_hub = r"d:\GitHub\global_agent\registry\portfolio\ARCHITECTURE_INDEX.md"
    
    if not os.path.exists(components_dir):
        print(f"[FATAL] Target framework {components_dir} was physically absent from the host architecture.")
    else:
        execute_recon_sweep(components_dir, registry_hub)
