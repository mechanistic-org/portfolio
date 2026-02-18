
import os
import re

def fix_mdx_files():
    root_dir = "src/content"
    # Matches < followed by a digit, capturing the digit.
    # Negative lookbehind to avoid double-escaping (e.g. don't match &lt; or \<)
    # But checking for &lt; is hard with simple regex if looking only at <.
    # We look for < immediately followed by digit.
    # If it's \&lt;, the < is not there.
    # If it's \<, we want to skip.
    
    # Regex:
    # (?<!\\)  : Not preceded by backslash
    # <        : Literal <
    # (?=\d)   : Lookahead for digit (to handle the replacement correctly without consuming?) 
    # pro-tip: just match <(\d) and replace with &lt;\1
    
    pattern = re.compile(r'(?<!\\)<(\d)')
    
    count = 0
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".mdx") or filename.endswith(".md"):
                filepath = os.path.join(dirpath, filename)
                
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content, n = pattern.subn(r'&lt;\1', content)
                
                if n > 0:
                    print(f"Fixed {n} issues in {filepath}")
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    count += n
                    
    print(f"Total fixes applied: {count}")

if __name__ == "__main__":
    fix_mdx_files()
