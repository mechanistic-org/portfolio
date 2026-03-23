import os
import sys
import re
import argparse
import warnings

# --- CONFIGURATION ---
SOURCE_DIR = r"D:\GitHub\portfolio-workspace\podcasts"
EXTENSIONS = (".wav", ".mp3", ".m4a")
MODEL_SIZE = "turbo" # "large-v3" is too slow on CPU
MINING_REPORT_PATH = os.path.join(SOURCE_DIR, "mining_report.md")

# --- PATH SETUP ---
# Ensure local ffmpeg is found
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_BIN = os.path.join(SCRIPT_DIR, "bin")
if os.path.exists(FFMPEG_BIN):
    os.environ["PATH"] += os.pathsep + FFMPEG_BIN
    print(f"🔧 Added FFmpeg to PATH: {FFMPEG_BIN}")
else:
    print(f"⚠️  FFmpeg bin not found at: {FFMPEG_BIN}. Assuming global PATH.")

# --- MINING KEYWORDS ---
RED_GOLD_KEYWORDS = [
    "crisis", "failure", "broken", "nightmare", "disaster", 
    "vendor", "supplier", "tolerance", "thermal", "yield",
    "line down", "million", "saving", "solo", "alone",
    "threat", "risk", "lawsuit", "recall", "fire"
]

def load_params():
    parser = argparse.ArgumentParser(description="Transcribe podcasts locally.")
    parser.add_argument("--dry-run", action="store_true", help="Scan files but do not transcribe.")
    parser.add_argument("--force", action="store_true", help="Re-transcribe existing files.")
    parser.add_argument("--model", default=MODEL_SIZE, help="Whisper model to use.")
    parser.add_argument("--source", default=SOURCE_DIR, help="Source directory for audio files.")
    return parser.parse_args()

def clean_transcript(text):
    """
    Strips 'Welcome back' intros and 4th wall breaks.
    """
    # Remove standard podcast intros
    text = re.sub(r"(?i)^.*(welcome back|today we are discussing|diving deep into).*?[\.\!\?]", "", text)
    # Remove "File" references
    text = re.sub(r"(?i)(looking at this|file|dossier|pdf|json)", "record", text)
    return text.strip()

def scan_for_gold(text, filename):
    found = []
    text_lower = text.lower()
    for kw in RED_GOLD_KEYWORDS:
        if kw in text_lower:
            found.append(kw)
    return found

def main():
    args = load_params()
    
    print(f"🎤 Initializing Local Transcriber [{args.model}]...")
    
    # Use the source from args
    target_dir = args.source
    os.makedirs(target_dir, exist_ok=True)
    
    files = [f for f in os.listdir(target_dir) if f.lower().endswith(EXTENSIONS)]
    print(f"📂 Found {len(files)} audio files in {target_dir}")
    
    if args.dry_run:
        print("Dry run complete.")
        return

    # Import heavy libs only after basic checks
    try:
        import whisper
        import torch
    except ImportError:
        print("❌ Missing dependencies. Run: pip install -r scripts/requirements.txt")
        sys.exit(1)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"🚀 Device: {device.upper()}")
    if device == "cpu":
        print("⚠️  Warning: Running on CPU will be slow.")

    print(f"🧠 Loading Model {args.model}...")
    model = whisper.load_model(args.model, device=device)
    
    report_lines = ["# Mining Report: Potential Red Gold\n"]
    
    process_count = 0
    
    for filename in files:
        audio_path = os.path.join(target_dir, filename)
        transcript_path = audio_path + ".transcript.txt"
        
        if os.path.exists(transcript_path) and not args.force:
            print(f"⏭️  Skipping (Exists): {filename}")
            
            # Still scan existing transcripts for the report
            with open(transcript_path, "r", encoding="utf-8") as f:
                content = f.read()
                gold = scan_for_gold(content, filename)
                if gold:
                    report_lines.append(f"- **{filename}**: Found keywords: `{', '.join(gold)}`")
            continue

        print(f"🎧 Transcribing: {filename}...")
        try:
            result = model.transcribe(audio_path)
            raw_text = result["text"]
            
            # Clean
            clean_text = clean_transcript(raw_text)
            
            # Save
            with open(transcript_path, "w", encoding="utf-8") as f:
                f.write(clean_text)
                
            # Mine
            gold = scan_for_gold(clean_text, filename)
            if gold:
                print(f"  💎 Potential Gold: {', '.join(gold)}")
                report_lines.append(f"- **{filename}**: Found keywords: `{', '.join(gold)}`")
            
            print(f"  ✅ Saved: {os.path.basename(transcript_path)}")
            process_count += 1
            
        except Exception as e:
            print(f"  ❌ Failed: {e}")

    # Write Report
    report_path = os.path.join(target_dir, "mining_report.md")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))
    print(f"\n📜 Mining Report saved to: {report_path}")
    print(f"🎉 Complete. Processed {process_count} new files.")

if __name__ == "__main__":
    main()
