import os
import shutil
import re
from pathlib import Path

# --- Configuration ---
SOURCE_DIR = Path(r"D:\GitHub\quantum-workspace\digiME_working-copies\digiME")
DEST_DIR = Path(r"D:\GitHub\quantum\public\digiME")

# Extensions to copy as-is
SAFE_EXTENSIONS = {'.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.txt'}

# Extensions to prune (explicitly ignore these, though we whitelist safe ones anyway)
PRUNE_EXTENSIONS = {'.pdf', '.mov', '.zip', '.exe', '.doc', '.ppt', '.pps', '.dir'}

# The base URL the original site used (for regex replacement)
ORIG_BASE_URL = "http://enorris-xp/digiME/"

def setup_directories():
    if DEST_DIR.exists():
        print(f"Cleaning destination: {DEST_DIR}")
        shutil.rmtree(DEST_DIR)
    DEST_DIR.mkdir(parents=True, exist_ok=True)

def copy_assets():
    print("Copying assets...")
    count = 0
    for root, dirs, files in os.walk(SOURCE_DIR):
        # Exclude Connections and Templates from asset copy, we handle them differently or ignore
        if "Connections" in root or "Templates" in root:
            continue
            
        rel_path = Path(root).relative_to(SOURCE_DIR)
        dest_folder = DEST_DIR / rel_path
        
        if not dest_folder.exists():
            dest_folder.mkdir(parents=True, exist_ok=True)
            
        for file in files:
            ext = Path(file).suffix.lower()
            if ext in SAFE_EXTENSIONS:
                src_file = Path(root) / file
                dst_file = dest_folder / file
                shutil.copy2(src_file, dst_file)
                count += 1
    print(f"Copied {count} asset files.")

def parse_menu_file(menu_path):
    """
    Parses a pipe-delimited menu text file.
    Format example:
    .|Best Practices|||||0
    ..|Modeling|gen_mod_guide.php|
    """
    if not menu_path.exists():
        return "<ul><li>Menu not found</li></ul>"
    
    html = '<ul class="digime-tree">'
    lines = menu_path.read_text(encoding='latin-1').splitlines()
    
    current_level = 0
    
    for line in lines:
        if not line.strip(): continue
        parts = line.split('|')
        if len(parts) < 2: continue
        
        dots = parts[0]
        label = parts[1]
        link = parts[2] if len(parts) > 2 else "#"
        
        # Determine level based on dots
        level = dots.count('.')
        
        # Link fixing
        if link and not link.startswith('http'):
            link = link.replace('.php', '.html')
            
        # Structure logic (simplified for flat list with indentation)
        # In a real tree, we'd manage opening/closing ULs. 
        # For this "Lite" port, let's keep it robust:
        padding = (level - 1) * 20
        html += f'<li style="padding-left: {padding}px"><a href="{link}">{label}</a></li>\n'
        
    html += '</ul>'
    return html

def parse_page_content(php_file):
    # --- Special Case: Synthetic Content for Easter Eggs ---
    if php_file.name == "login.php":
        return {
            'title': "Security Access",
            'breadcrumb': "Authorized Personnel Only",
            'pageNav': "",
            'content': """
                <div class="feature">
                    <h3>Restricted Access</h3>
                    <p>Enter your Digidesign Engineering credentials to access the secure archives.</p>
                    <div style="background: #eef; padding: 20px; border: 1px solid #99c; width: 300px;">
                        <form onsubmit="window.location.href='top_secret.html'; return false;">
                            <p><strong>Username:</strong><br><input type="text" name="user" style="width: 100%"></p>
                            <p><strong>Password:</strong><br><input type="password" name="pass" style="width: 100%"></p>
                            <p style="text-align: right; margin-top: 10px;"><input type="submit" value="Authenticate"></p>
                        </form>
                    </div>
                </div>
            """
        }
    
    if php_file.name == "top_secret.php":
        return {
            'title': "TOP SECRET // CLASSIFIED",
            'breadcrumb': "EYES ONLY",
            'pageNav': "",
            'content': """
                <div class="feature">
                    <h3><span style="color: red; background: yellow;">>> TOP SECRET ARCHIVE <<</span></h3>
                    <p><strong>SUBJECT:</strong> Time Portal Stability</p>
                    <p>If you are reading this, the quantum tunnel to 2006 is stable.</p>
                    <p>
                        The "Ghost Ship" architecture relies on a static port of the original PHP source.
                        Heavy assets (PDFs) were jettisoned to ensure transit through the event horizon.
                    </p>
                    <p><em>Welcome back, Commander.</em></p>
                    <br>
                    <h4>System Status:</h4>
                    <ul>
                        <li>HTML Core: <span style="color: green">ONLINE</span></li>
                        <li>Database: <span style="color: red">OFFLINE</span></li>
                        <li>Asset Pipeline: <span style="color: green">OPTIMIZED</span></li>
                    </ul>
                </div>
            """
        }

    """
    Extracts content from a PHP file using the Dreamweaver instance markers.
    """
    text = php_file.read_text(encoding='latin-1', errors='replace')

    # Extract Title
    title_match = re.search(r'<!-- InstanceBeginEditable name="doctitle" -->(.*?)<!-- InstanceEndEditable -->', text, re.DOTALL)
    title = title_match.group(1).strip() if title_match else "digiME"
    
    # Extract Breadcrumb
    crumb_match = re.search(r'<!-- InstanceBeginEditable name="breadCrumb" -->(.*?)<!-- InstanceEndEditable -->', text, re.DOTALL)
    breadcrumb = crumb_match.group(1).strip() if crumb_match else ""
    
    # Extract Main Content
    content_match = re.search(r'<!-- InstanceBeginEditable name="content" -->(.*?)<!-- InstanceEndEditable -->', text, re.DOTALL)
    content = content_match.group(1).strip() if content_match else "<p>No content found.</p>"
    
    # Find Menu Definitions in PHP code
    # Example: $mid->setMenuStructureFile('proe_bp.txt'); ... parseStructureForMenu('treemenu1');
    menus = {}
    
    # scan for menu assignments
    # We look for blocks like: setMenuStructureFile('X'); ... parseStructureForMenu('Y');
    # This is a bit loose, but should work for this specific site structure
    
    # Python's finding logic:
    # 1. Find all `setMenuStructureFile('filename')`
    # 2. Assume they map to treemenu1, treemenu2, etc in order of appearance? 
    # Let's peek at the file again. Yes, they seem sequential in the `pageNav` div.
    
    # Alternative: The PHP file contains a `pageNav` editable region. 
    # The SIMPLEST way is to just grab that region, but it contains PHP code.
    # We need to *execute* the intent of that PHP code.
    
    # Let's extract the `pageNav` region first
    nav_match = re.search(r'<!-- InstanceBeginEditable name="pageNav" -->(.*?)<!-- InstanceEndEditable -->', text, re.DOTALL)
    if nav_match:
        nav_block = nav_match.group(1)
        # Find all menu files referenced
        menu_files = re.findall(r"setMenuStructureFile\('([^']+)'\)", nav_block)
        
        # We need to place them into the "boxes".
        # The HTML structure is usually <div class="normalbox">...PHP...</div>
        # Regex to find these boxes is hard.
        
        # Strategy: Replace the PHP block with the parsed HTML.
        # The PHP block looks like: <?php ... print $mid->newTreeMenu('treemenu1'); ?>
        
        def replace_menu_php(match):
            block = match.group(0)
            file_match = re.search(r"setMenuStructureFile\('([^']+)'\)", block)
            if file_match:
                m_file = file_match.group(1)
                # Resolve path relative to the PHP file being processed
                m_path = php_file.parent / m_file
                return parse_menu_file(m_path)
            return ""

        nav_html = re.sub(r'<\?php.*?\?>', replace_menu_php, nav_block, flags=re.DOTALL)
        menus['pageNav'] = nav_html
    else:
        menus['pageNav'] = ""
        
    return {
        'title': title,
        'breadcrumb': breadcrumb,
        'content': content,
        'pageNav': menus['pageNav']
    }

def build_html_page(rel_path, data):
    # Calculate depth to fix relative links (e.g. css/images)
    depth = len(Path(rel_path).parents) - 1
    root_prefix = "../" * depth if depth > 0 else "./"
    
    # --- Link Fixing Logic ---
    def fix_links(text):
        # 1. Fix PHP to HTML
        text = re.sub(r'href="([^"]+)\.php"', r'href="\1.html"', text)
        
        # 2. Fix Absolute Paths
        text = text.replace('http://enorris-xp/digiME/', root_prefix)
        
        # 3. Retro 404 Redirect for Pruned Files
        # Regex to find hrefs ending in pruned extensions
        # We need to be careful not to break the regex.
        for ext in PRUNE_EXTENSIONS:
            # Case insensitive replace for extensions
            # href="anything.pdf" -> href="root_prefix/404.html"
            # We use a lambda to insert the root prefix dynamically
            pattern = re.compile(f'href="([^"]+{re.escape(ext)})"', re.IGNORECASE)
            text = pattern.sub(f'href="{root_prefix}404.html"', text)
            
        # 4. Fix UNC Paths (e.g. \\brutus)
        # These are internal network paths from 2006, definitely dead.
        text = re.sub(r'href="(\\\\[^"]+)"', f'href="{root_prefix}404.html"', text)
            
        return text

    content = fix_links(data['content'])
    breadcrumb = fix_links(data['breadcrumb'])
    nav = fix_links(data['pageNav'])
    
    # --- Special Case: Login Hijack ---
    if "login.html" in str(rel_path).replace('.php', '.html'):
        # Inject onsubmit handler to form
        content = content.replace('<form ', '<form onsubmit="window.location.href=\'top_secret.html\'; return false;" ')
    
    # CSS Path
    css_path = f"{root_prefix}images/emx_nav_left.css"
    
    # Template
    clean_title = data['title'].replace('<title>', '').replace('</title>', '').strip()
    template = f"""<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>{clean_title}</title>
<link rel="stylesheet" href="{css_path}" type="text/css">
<style>
/* DigiME Lite Port Overrides */
body {{ background-image: url({root_prefix}images/bg_grad_180.jpg); }}
.digime-tree {{ list-style: none; padding: 0; margin: 0; }}
.digime-tree li {{ margin-bottom: 4px; }}
.digime-tree a {{ text-decoration: none; color: #003366; }}
.digime-tree a:hover {{ text-decoration: underline; }}
.normalbox {{ margin-bottom: 15px; background: #eee; padding: 5px; border: 1px solid #ccc; }}
</style>
</head>
<body>
<div id="masthead">
<h1 id="siteName">digiME (Lite Port)</h1>
<div id="globalNav">
<div id="globalLink">
<a href="{root_prefix}index.html">digiME</a>
<a href="{root_prefix}dept/dept.html">Department</a>
<a href="{root_prefix}user_auth_php_start/login.html">Projects</a>
<a href="{root_prefix}library/library.html">Library</a>
<a href="{root_prefix}proe/proe.html">Pro/ENGINEER</a>
<a href="{root_prefix}proi/proi.html">Pro/INTRALINK</a>
<a href="{root_prefix}links/links.html">Links</a>
</div>
</div>
</div>

<div id="pagecell1">
<div id="breadCrumb">
{breadcrumb}
</div>

<div id="pageName">
<h2>{data['title']}</h2>
</div>

<div id="pageNav">
{nav}
</div>

<div id="content">
{content}
</div>

<div id="siteInfo">
&copy; 2006 Digidesign Mechanical Engineering | <a href="/">Return Home</a>
</div>
</div>
</body>
</html>
"""
    return template

def execute_port():
    print("Starting digiME Port...")
    
    # 1. Setup
    setup_directories()
    
    # 2. Assets
    copy_assets()
    
    # 3. Process Pages
    for root, dirs, files in os.walk(SOURCE_DIR):
        for file in files:
            if file.endswith('.php'):
                src_file = Path(root) / file
                
                # Skip Templates/Connections/Lib
                if "Templates" in src_file.parts or "Connections" in src_file.parts or "lib" in src_file.parts:
                    continue
                    
                print(f"Processing: {src_file.name}")
                
                try:
                    data = parse_page_content(src_file)
                    
                    rel_path = src_file.relative_to(SOURCE_DIR)
                    dest_file = DEST_DIR / rel_path.with_suffix('.html')
                    
                    html = build_html_page(rel_path, data)
                    
                    dest_file.parent.mkdir(parents=True, exist_ok=True)
                    dest_file.write_text(html, encoding='utf-8')
                except Exception as e:
                    print(f"FAILED to process {src_file.name}: {e}")

if __name__ == "__main__":
    execute_port()
