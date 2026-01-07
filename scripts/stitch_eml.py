import os
import email
from email import policy
from email.parser import BytesParser
from datetime import datetime
import re
import glob
import argparse

# CONFIGURATION
# ---------------------------------------------------------------------
# NotebookLM limits
MAX_CHARS_PER_VOLUME = 1_450_000  # Approx 360k tokens (Safety margin)
# ---------------------------------------------------------------------

def strip_html(text):
    # Regex to remove HTML tags
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

def clean_text(text):
    if not text:
        return ""
        
    # 1. Strip HTML tags (Fixes high tag density failures like Vol 009)
    text = strip_html(text)
    
    # 2. Remove excessive newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # 3. Remove control characters (except newline/tab)
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', text)
    
    return text.strip()

def extract_body(msg):
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdispo = str(part.get('Content-Disposition'))
            
            # skip attachments
            if 'attachment' in cdispo:
                continue
            
            if ctype == 'text/plain':
                try:
                    charset = part.get_content_charset() or 'utf-8'
                    body = part.get_payload(decode=True).decode(charset, errors='replace')
                    break
                except:
                    try:
                        body = part.get_payload(decode=True).decode('latin-1', errors='replace')
                    except:
                        pass
                        
            elif ctype == 'text/html':
                # If we only have HTML, we take it but STRIP it later
                try:
                    charset = part.get_content_charset() or 'utf-8'
                    html_body = part.get_payload(decode=True).decode(charset, errors='replace')
                    body = html_body # clean_text will remove tags
                except:
                    pass
    else:
        try:
            charset = msg.get_content_charset() or 'utf-8'
            body = msg.get_payload(decode=True).decode(charset, errors='replace')
        except:
             try:
                body = msg.get_payload(decode=True).decode('latin-1', errors='replace')
             except:
                pass
            
    return clean_text(body)

def get_attachments_list(msg):
    files = []
    for part in msg.walk():
        if part.get_content_maintype() == 'multipart':
            continue
        if part.get('Content-Disposition') is None:
            continue
            
        filename = part.get_filename()
        if filename:
            files.append(filename)
    return ", ".join(files)

def stitch_emails():
    # CLI Argument Parsing
    parser = argparse.ArgumentParser(description="Stitch .eml files into Markdown volumes for NotebookLM.")
    parser.add_argument("source", help="Source directory containing .eml files")
    parser.add_argument("output", nargs="?", help="Output directory (defaults to source/STITCHED)")
    parser.add_argument("--batch-size", type=int, default=500, help="Number of emails per Markdown volume (default: 500)")
    
    args = parser.parse_args()
    
    # CRITICAL: Strip quotes/whitespace
    source_dir = os.path.abspath(str(args.source).strip().strip("'").strip('"'))
    
    if args.output:
        output_dir = os.path.abspath(str(args.output).strip().strip("'").strip('"'))
    else:
        output_dir = os.path.join(source_dir, "STITCHED")

    print(f"--- 🧵 STITCHER V2.4 (Token-Safe) 🧵 ---")
    print(f"Source: {source_dir}")
    print(f"Output: {output_dir}")
    print(f"Batch Limit: {args.batch_size} items")
    print(f"Char Limit:  {MAX_CHARS_PER_VOLUME} chars (~375k tokens)")
    print(f"Protocol:    HTML Strip + Charset Fix + Control Char Scrubber")
    
    if not os.path.exists(source_dir):
        print(f"❌ Source directory not found: {source_dir}")
        return

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    files = glob.glob(os.path.join(source_dir, "*.eml"))
    print(f"Found {len(files)} .eml files.")
    
    if not files:
        print("⚠️ No .eml files found. Check your path.")
        return

    files.sort()

    folder_name = os.path.basename(os.path.normpath(source_dir))
    project_name = folder_name.split('_')[0]
    if not project_name: 
        project_name = "Archive"
        
    print(f"🔹 Detected Project: {project_name}")

    batch_buffer = []
    current_chars = 0
    batch_count = 1
    
    for i, file_path in enumerate(files):
        try:
            with open(file_path, 'rb') as f:
                msg = BytesParser(policy=policy.default).parse(f)

            # Metadata
            subject = msg.get('subject', '(No Subject)')
            sender = msg.get('from', '(Unknown)')
            date_str = msg.get('date', '')
            
            # Simple Date Normalization
            parsed_date = email.utils.parsedate_to_datetime(date_str) if date_str else None
            fmt_date = parsed_date.strftime('%Y-%m-%d %H:%M') if parsed_date else "Unknown Date"

            # Body
            body_text = extract_body(msg)
            
            # Attachments
            attachments = get_attachments_list(msg)
            attach_str = f"**📎 Attachments:** {attachments}\n" if attachments else ""

            # Markdown Block
            md_block = (
                f"## 📧 [{fmt_date}] {subject}\n"
                f"**From:** {sender}\n"
                f"{attach_str}\n"
                f"{body_text}\n"
                f"\n---\n\n"
            )
            
            block_len = len(md_block)
            
            # CHECK: Will adding this block exceed limits?
            # If buffer not empty AND (count hits max OR chars hit max) -> Flush
            if batch_buffer and (len(batch_buffer) >= args.batch_size or (current_chars + block_len) > MAX_CHARS_PER_VOLUME):
                output_filename = os.path.join(output_dir, f"{project_name}_Volume_{batch_count:03d}.md")
                with open(output_filename, 'w', encoding='utf-8') as out_f:
                    out_f.write(f"# {project_name} Archive - Volume {batch_count:03d}\n\n")
                    out_f.writelines(batch_buffer)
                
                reason = "Count Limit" if len(batch_buffer) >= args.batch_size else "Char Limit"
                print(f"✅ Created Vol {batch_count:03d} ({len(batch_buffer)} emails, {current_chars/1000000:.2f} M chars) [{reason}]")
                
                batch_buffer = []
                current_chars = 0
                batch_count += 1

            batch_buffer.append(md_block)
            current_chars += block_len
                
        except Exception as e:
            print(f"⚠️ Error parsing {os.path.basename(file_path)}: {e}")

    # FLUSH REMAINDER
    if batch_buffer:
        output_filename = os.path.join(output_dir, f"{project_name}_Volume_{batch_count:03d}.md")
        with open(output_filename, 'w', encoding='utf-8') as out_f:
            out_f.write(f"# {project_name} Archive - Volume {batch_count:03d}\n\n")
            out_f.writelines(batch_buffer)
        print(f"✅ Created Vol {batch_count:03d} ({len(batch_buffer)} emails, {current_chars/1000000:.2f} M chars) [Final]")

    print(f"\n🎉 DONE. {len(files)} emails stitched into {batch_count} volumes.")

if __name__ == "__main__":
    stitch_emails()
