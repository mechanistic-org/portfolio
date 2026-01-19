import os
import zipfile
import urllib.request
import shutil
import sys

FFMPEG_URL = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
INSTALL_DIR = os.path.join(os.path.dirname(__file__), "bin")
FFMPEG_EXE = os.path.join(INSTALL_DIR, "ffmpeg.exe")

def setup_ffmpeg():
    if os.path.exists(FFMPEG_EXE):
        print(f"✅ FFmpeg already exists at: {FFMPEG_EXE}")
        return

    print(f"⬇️  Downloading FFmpeg from {FFMPEG_URL}...")
    zip_path = "ffmpeg.zip"
    
    # User-Agent needed often for direct downloads
    opener = urllib.request.build_opener()
    opener.addheaders = [('User-agent', 'Mozilla/5.0')]
    urllib.request.install_opener(opener)
    
    try:
        urllib.request.urlretrieve(FFMPEG_URL, zip_path)
    except Exception as e:
        print(f"❌ Download failed: {e}")
        return

    print("📦 Extracting...", end="")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        # The zip usually contains a root folder like 'ffmpeg-6.0-essentials_build/'
        # We need to find bin/ffmpeg.exe inside it.
        extract_root = "ffmpeg_temp"
        zip_ref.extractall(extract_root)
        
        # Find ffmpeg.exe
        found = False
        for root, dirs, files in os.walk(extract_root):
            if "ffmpeg.exe" in files:
                source = os.path.join(root, "ffmpeg.exe")
                os.makedirs(INSTALL_DIR, exist_ok=True)
                shutil.move(source, FFMPEG_EXE)
                print(f"\n✅ Installed to {FFMPEG_EXE}")
                found = True
                break
        
        if not found:
            print("\n❌ Could not find ffmpeg.exe in the downloaded archive.")

    # Cleanup
    if os.path.exists(zip_path):
        os.remove(zip_path)
    if os.path.exists("ffmpeg_temp"):
        shutil.rmtree("ffmpeg_temp")

if __name__ == "__main__":
    setup_ffmpeg()
