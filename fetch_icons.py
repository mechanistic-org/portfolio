import os
import urllib.request

ICONS = {
    "vscode": "visualstudiocode",
    "github": "github",
    "cloudflare": "cloudflare",
    "python": "python",
    "astro": "astro",
    "react": "react",
    "tailwind": "tailwindcss",
    "gemini": "googlegemini",
    "google": "google",
    "npm": "npm",
    "node": "nodedotjs",
    "typescript": "typescript",
    "namecheap": "namecheap"
}

OUTPUT_DIR = "public/assets/icons"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def fetch_icon(name, slug):
    url = f"https://cdn.simpleicons.org/{slug}/white"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = response.read()
            with open(f"{OUTPUT_DIR}/{name}.svg", "wb") as f:
                f.write(data)
            print(f"✅ Fetched {name}")
    except Exception as e:
        print(f"❌ Failed {name}: {e}")

if __name__ == "__main__":
    print("⬇️  Fetching Icons...")
    for name, slug in ICONS.items():
        fetch_icon(name, slug)
