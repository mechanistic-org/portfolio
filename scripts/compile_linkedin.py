
import re
import os

# Unicode Math Sans Bold Map
def to_bold(text):
    normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    bold   = "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"
    trans = str.maketrans(normal, bold)
    return text.translate(trans)

def compile_linkedin():
    # Read the TS file primarily as text
    with open(r"src/config/linkedin_master.ts", "r", encoding="utf-8") as f:
        content = f.read()

    # Extract the "About" section (between backticks)
    tagline_match = re.search(r'tagline:\s*"(.*?)"', content)
    about_match = re.search(r'about:\s*`([^`]*)`', content, re.DOTALL)
    experience_match = re.search(r'experience:\s*\[(.*)\]', content, re.DOTALL)

    final_output = []

    if tagline_match:
        tagline = tagline_match.group(1).strip()
        final_output.append("=== HEADLINE (TAGLINE) ===")
        final_output.append(tagline)
        final_output.append("\n" + "="*40 + "\n")

    if about_match:
        about_text = about_match.group(1).strip()
        # Convert **Bold** to Unicode
        about_text = re.sub(r'\*\*(.*?)\*\*', lambda m: to_bold(m.group(1)), about_text)
        
        final_output.append("=== LINKEDIN ABOUT SECTION (COPY BELOW) ===")
        final_output.append(about_text)
        final_output.append("\n" + "="*40 + "\n")

    # This regex is a bit brittle for a full TS parse, but robust enough for this specific file structure
    # We will manually clean the experience array roughly
    if experience_match:
        final_output.append("=== EXPERIENCE SECTIONS (COPY INDIVIDUALLY) ===")
        
        # Split by objects roughly
        blobs = content.split("company:")
        for blob in blobs[1:]: # Skip preamble
            # Extract Company
            comp_m = re.search(r'"(.*?)"', blob)
            company = comp_m.group(1) if comp_m else "UNKNOWN"
            
            # Extract Blurb
            blurb_m = re.search(r'blurb:\s*`([^`]*)`', blob, re.DOTALL)
            if blurb_m:
                 blurb = blurb_m.group(1).strip()
                 # Unicode Convert
                 blurb = re.sub(r'\*\*(.*?)\*\*', lambda m: to_bold(m.group(1)), blurb)
                 
                 final_output.append(f"--- {company} ---")
                 final_output.append(blurb)
                 final_output.append("\n")

    # [STANDARDIZED] Write to root prompts/
    output_path = r"prompts/LINKEDIN_READY.txt"
    
    # Ensure dir exists (though we just made it via command)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(final_output))

    print(f"Compilation Complete. Ready at {output_path}")

if __name__ == "__main__":
    compile_linkedin()
