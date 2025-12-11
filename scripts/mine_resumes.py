import os
import hashlib
import re
from pathlib import Path
from datetime import datetime
import shutil

# --- Configuration ---
SOURCE_DIR = r"D:\GitHub\quantum-workspace\resume_ingest_resistance-is-futile"
OUTPUT_FILE = r"D:\GitHub\quantum\data_source\mined_assets\RESUME_CORPUS.md"
INDEX_FILE = r"D:\GitHub\quantum\data_source\mined_assets\RESUME_INDEX.md"

# Attempt imports
try:
    import pypdf
except ImportError:
    pypdf = None

try:
    from docx import Document
except ImportError:
    Document = None

print(f"--- RESUME MINER v1.0 ---")
print(f"Source: {SOURCE_DIR}")
print(f"pypdf: {'INSTALLED' if pypdf else 'MISSING'}")
print(f"python-docx: {'INSTALLED' if Document else 'MISSING'}")

def get_file_hash(file_path):
    """Generates MD5 hash of file content for deduplication."""
    hasher = hashlib.md5()
    with open(file_path, 'rb') as f:
        buf = f.read()
        hasher.update(buf)
    return hasher.hexdigest()

def extract_text_pypdf(file_path):
    if not pypdf: return "[ERROR: pypdf not installed]"
    text = ""
    try:
        reader = pypdf.PdfReader(file_path)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    except Exception as e:
        return f"[ERROR extracting PDF: {e}]"
    return text

def extract_text_docx(file_path):
    if not Document: return "[ERROR: python-docx not installed]"
    try:
        doc = Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        return f"[ERROR extracting DOCX: {e}]"
    return "[ERROR: conversion failed]"

def extract_text_doc(file_path):
    # .doc is binary OLE. Hard to parse without antiword/win32com.
    # We will log it as requiring manual conversion for now.
    return "[WARNING: Legacy .doc file. Cannot extract text natively without 'antiword'.]"

def scan_and_mine():
    seen_hashes = {}
    entries = []
    
    source_path = Path(SOURCE_DIR)
    
    if not source_path.exists():
        print(f"CRITICAL: Source path not found: {source_path}")
        return

    print("Scanning...")
    
    for file_path in source_path.rglob("*"):
        if file_path.is_file():
            ext = file_path.suffix.lower()
            if ext not in ['.pdf', '.docx', '.doc', '.txt']:
                continue
                
            # Deduplicate exact binary matches
            file_hash = get_file_hash(file_path)
            if file_hash in seen_hashes:
                # print(f"Duplicate found: {file_path.name} == {seen_hashes[file_hash]}")
                continue
            seen_hashes[file_hash] = file_path.name
            
            # Extract
            content = ""
            if ext == '.pdf':
                content = extract_text_pypdf(file_path)
            elif ext == '.docx':
                content = extract_text_docx(file_path)
            elif ext == '.doc':
                content = extract_text_doc(file_path)
            elif ext == '.txt':
                try:
                    content = file_path.read_text(encoding='utf-8', errors='ignore')
                except:
                    content = "[Read Error]"

            # Clean content
            content = re.sub(r'\n\s*\n', '\n\n', content) # Compress newlines
            
            entries.append({
                'path': str(file_path),
                'name': file_path.name,
                'ext': ext,
                'mtime': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
                'content': content
            })

    # Write Corpus
    print(f"Writing corpus to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(f"# UNIVERSAL RESUME CORPUS\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n")
        f.write(f"Total Unique Files: {len(entries)}\n\n")
        
        for entry in entries:
            f.write(f"## FILESPEC: {entry['name']}\n")
            f.write(f"Path: {entry['path']}\n")
            f.write(f"Date: {entry['mtime']}\n")
            f.write(f"Hash: {hashlib.md5(entry['content'].encode('utf-8')).hexdigest()}\n")
            f.write(f"---\n")
            f.write(f"{entry['content']}\n")
            f.write(f"\n<END_FILE>\n\n")

    print(f"Done. Processed {len(entries)} files.")

if __name__ == "__main__":
    scan_and_mine()
