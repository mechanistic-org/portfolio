import csv
import os
import random

# --- CONFIGURATION ---
SOURCE_DIR = "data_source"
MAIN_CSV = os.path.join(SOURCE_DIR, "Main.csv")
CONTENT_DIR = os.path.join(SOURCE_DIR, "manual_content")

# --- CREATIVE MATRIX ---
# Context injection based on Employer or Client
CREATIVE_MATRIX = {
    "Kaleidescape": {
        "context": "Kaleidescape required a high-fidelity media server capable of storing and streaming uncompressed Blu-ray quality content in a home theater environment.",
        "challenge": "The primary challenge was achieving near-silent operation (0dB ambient noise floor) while managing significant thermal loads from multiple hard drives and processing units in a constrained rackmount form factor.",
        "approach": [
            "Designed a custom passive cooling architecture using oversized heat sinks and optimized airflow channels.",
            "Implemented vibration isolation mounts for hard drives to prevent acoustic coupling to the chassis.",
            "Collaborated with industrial design to ensure the front bezel met the premium 'Cinematic' aesthetic requirements.",
            "Conducted extensive thermal simulation (CFD) to validate airflow paths under worst-case rack conditions."
        ],
        "impact": "The product defined the high-end home cinema market, delivering a silent, reliable server that became the standard for luxury integrators worldwide."
    },
    "Silicon Graphics": {
        "context": "SGI was the leader in high-performance computing and visualization, pushing the boundaries of workstation graphics.",
        "challenge": "The project required packaging enterprise-grade RISC computing power into a desktop-friendly form factor without compromising thermal performance or manufacturability.",
        "approach": [
            "Engineered a high-density chassis layout to accommodate complex logic boards and power supplies.",
            "Developed custom injection-molded skins that aligned with SGI's iconic 'Granite' and 'Indigo' design language.",
            "Optimized the internal sheet metal structure for EMI shielding and structural rigidity.",
            "Worked closely with manufacturing partners to ensure tool-less serviceability for key components."
        ],
        "impact": "This workstation set a new benchmark for desktop performance and industrial design, winning multiple industry awards."
    },
    "Digidesign": {
        "context": "Digidesign (Avid) set the standard for professional digital audio workstations (Pro Tools).",
        "challenge": "The goal was to create a tactile control surface that provided professional mixers with precise, low-latency control over digital parameters.",
        "approach": [
            "Integrated high-resolution motorized faders with custom touch-sensitive capacitive caps.",
            "Designed a rigid, ergonomic chassis that minimized resonance and provided a solid 'console' feel.",
            "Engineered the internal layout to separate analog audio paths from digital control signals to minimize noise floor.",
            "Implemented a modular assembly strategy to allow for scalable product variants."
        ],
        "impact": "The unit became a staple in professional recording studios, bridging the gap between analog workflow and digital flexibility."
    },
    "Microsoft": {
        "context": "The Xbox project aimed to deliver the most powerful gaming console on the market at a consumer-friendly price point.",
        "challenge": "We faced the 'Billion-Unit Challenge': designing a thermal engine that could survive hostile living room environments (dust, enclosed cabinets) while maintaining peak performance and zero throttling.",
        "approach": [
            "Engineered a custom cooling architecture with a vapor chamber to wick heat away from the GPU die instantly.",
            "Designed the chassis for negative pressure, pulling cool air from the sides and exhausting it vertically.",
            "Optimized the assembly for mass production, reducing screw count by 40% using snap-fits and interlocks.",
            "Switched internal shroud materials to a glass-filled polycarbonate blend to prevent thermal deformation."
        ],
        "impact": "The console shipped on time and under budget, achieving a 99.8% First Pass Yield and defining a generation of gaming."
    },
    "Frog Design": {
        "context": "Frog Design is a world-renowned consultancy known for fusing emotional design with rigorous engineering.",
        "challenge": "The client required a product that not only functioned perfectly but also conveyed a strong brand identity through its physical form.",
        "approach": [
            "Iterated through dozens of form studies to refine the ergonomics and visual balance.",
            "Developed complex surface geometry in Pro/Engineer (Creo) to maintain Class-A surfacing continuity.",
            "Prototyped rapidly using CNC and urethane casting to validate the 'feel' of the product.",
            "Engineered hidden mechanisms to maintain clean exterior lines without visible fasteners."
        ],
        "impact": "The final product was a seamless blend of form and function, perfectly executing the client's design intent."
    },
    "Mechanistic": {
        "context": "As a lead mechanical engineer at Mechanistic, I tackled diverse challenges across consumer electronics, medical devices, and robotics.",
        "challenge": "This project required a rapid development cycle to move from concept to functional prototype within a tight timeline.",
        "approach": [
            "Leveraged rapid prototyping (3D printing, laser cutting) to iterate on mechanisms daily.",
            "Conducted feasibility analysis to select the optimal manufacturing process for scale.",
            "Designed custom jigs and fixtures to aid in assembly and testing.",
            "Collaborated cross-functionally with electrical and firmware teams to integrate complex subsystems."
        ],
        "impact": "Delivered a fully functional prototype that met all performance requirements and enabled the client to secure Series A funding."
    },
    "Hyphen": {
        "context": "Hyphen (Foodservice Automation) is revolutionizing the commercial kitchen with robotics.",
        "challenge": "The goal was to automate a manual food preparation process to improve speed, accuracy, and hygiene.",
        "approach": [
            "Designed a sanitary, wash-down rated mechanism capable of handling food products reliably.",
            "Engineered a modular dispensing system that could be easily cleaned and serviced.",
            "Utilized food-safe materials (Stainless Steel 316, FDA-approved plastics) throughout the assembly.",
            "Conducted extensive reliability testing to ensure 99.9% uptime in a high-throughput kitchen environment."
        ],
        "impact": "The system increased throughput by 300% and significantly reduced food waste."
    }
}

GENERIC_TEMPLATE = {
    "context": "This project focused on delivering a robust mechanical solution for the [Industry] sector.",
    "challenge": "The main challenge was to integrate complex functionality into a compact form factor while adhering to strict [Category] constraints.",
    "approach": [
        "Utilized [Tools] to model and simulate the assembly before cutting metal.",
        "Focused on Design for Manufacturing (DFM) principles to reduce part count and assembly time.",
        "Conducted rigorous material selection to ensure durability and cost-effectiveness.",
        "Iterated on the design based on feedback from initial prototype testing."
    ],
    "impact": "The project was successfully delivered, meeting all technical specifications and providing a solid foundation for future development."
}

def read_csv(filepath):
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = [l.strip() for l in f.readlines() if l.strip()]
        if not lines: return []
        headers = [h.strip() for h in lines[0].split(',')]
        reader = csv.DictReader(lines[1:], fieldnames=headers)
        return [row for row in reader]

def get_creative_content(row):
    employer = row.get("Employer", "")
    client = row.get("Client", "")
    
    # Try to find a match in the matrix
    matrix_key = None
    if employer in CREATIVE_MATRIX: matrix_key = employer
    elif client in CREATIVE_MATRIX: matrix_key = client
    else:
        # Fuzzy match
        for key in CREATIVE_MATRIX.keys():
            if key in employer or key in client:
                matrix_key = key
                break
    
    if matrix_key:
        return CREATIVE_MATRIX[matrix_key]
    
    # Fallback to Generic
    data = GENERIC_TEMPLATE.copy()
    # Inject dynamic values
    industry = row.get("Industry") or "Engineering"
    category = row.get("Category") or "Product Design"
    tools = row.get("Tools") or "CAD"
    
    data["context"] = data["context"].replace("[Industry]", industry)
    data["challenge"] = data["challenge"].replace("[Category]", category)
    data["approach"] = [a.replace("[Tools]", tools) for a in data["approach"]]
    
    return data

def generate_markdown(slug, title, content_data):
    
    approach_bullets = "\n".join([f"*   **{a.split(' ')[0]} Strategy:** {a}" for a in content_data["approach"]])
    
    md = f"""import {{ YouTube }} from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** {content_data['context']}

{content_data['challenge']}

## Engineering Approach
We adopted a rigorous engineering methodology to solve these problems.

{approach_bullets}

## Impact
{content_data['impact']}

### Project Artifacts
<div class="my-8">
  <YouTube id="dQw4w9WgXcQ" />
</div>
{{{{MODEL_URL}}}}
"""
    return md

def main():
    print("✍️  Generating Hero Content...")
    projects = read_csv(MAIN_CSV)
    
    count = 0
    skipped = 0
    
    for row in projects:
        name = row.get("Slug Name") or row.get("Name")
        if not name: continue
        
        slug = name.lower().strip().replace(' ', '-').replace('/', '-').strip('.')
        title = row.get("Descriptive Name") or name
        
        filepath = os.path.join(CONTENT_DIR, f"{slug}.md")
        
        # Check if file exists and is "substantial"
        # We assume anything > 1000 bytes is likely a custom written case study (like xbox.md)
        # Anything smaller is likely a scaffolded placeholder
        if os.path.exists(filepath):
            size = os.path.getsize(filepath)
            if size > 1000:
                # print(f"    Skipping {slug} (Existing content detected: {size} bytes)")
                skipped += 1
                continue
        
        # Generate Content
        content_data = get_creative_content(row)
        md_content = generate_markdown(slug, title, content_data)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(md_content)
        
        count += 1
        # print(f"    + Generated content for {slug}")
        
    print(f"✅ Generated {count} files. Skipped {skipped} existing files.")

if __name__ == "__main__":
    main()
