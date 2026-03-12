import asyncio
import argparse
import json
import os
import sys
import requests
from pathlib import Path

def get_env_var(key):
    # Try actual env first
    val = os.environ.get(key)
    if val: return val
    # Fallback to local .env
    env_path = Path('.env')
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith(f"{key}="):
                    return line.split('=', 1)[1].strip().strip('"').strip("'")
    return None

def get_github_token():
    # First try .env
    val = get_env_var('GITHUB_TOKEN') or get_env_var('GITHUB_PAT')
    if val: return val
    
    # Next try traversing the mcp_config.json
    try:
        # Check standard config locations
        mcp_paths = ['mcp_config.json', r'C:\Users\erik\.gemini\antigravity\mcp_config.json']
        for p in mcp_paths:
            if Path(p).exists():
                with open(p, 'r') as f:
                    conf = json.load(f)
                    gh_pat = conf.get('mcpServers', {}).get('github', {}).get('args', [])[0]
                    if gh_pat.startswith("--personal-access-token="):
                        return gh_pat.split('=')[1]
    except Exception:
        pass
    
    return None

async def query_gemini(persona_name, persona_prompt, full_context, api_key):
    print(f"   💬 [{persona_name}] Analyzing...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "systemInstruction": {"parts": [{"text": persona_prompt}]},
        "contents": [{"parts": [{"text": full_context}]}],
        "generationConfig": {"temperature": 0.4}
    }
    
    response = await asyncio.to_thread(requests.post, url, headers=headers, json=payload)
    if response.status_code != 200:
        return f"**{persona_name} Error:** API failed - {response.text}"
    
    try:
        j = response.json()
        return j["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        return f"**{persona_name} Error:** Failed to parse response."

async def run_stage(stage, project_context, current_thread, gemini_key):
    print(f"\n🚀 Executing Stage {stage['step']}: {stage['name']}")
    
    # We provide the original issue text + the compounding thread of previous stages
    full_context = f"PRIMARY CONTEXT (GITHUB ISSUE):\n{project_context}\n\n"
    if current_thread:
        full_context += f"COMPOUNDING CASCADE (PREVIOUS JUDGMENTS FROM YOUR PEERS):\n{current_thread}\n\n"
        full_context += "Evaluate the primary context AND the judgments of your peers. Validate or reject their assumptions based on your strict domain."

    tasks = []
    for persona in stage['personas']:
        tasks.append(query_gemini(persona['name'], persona['role_prompt'], full_context, gemini_key))
    
    results = await asyncio.gather(*tasks)
    
    stage_output = f"### Stage {stage['step']}: {stage['name']}\n\n"
    for persona, result in zip(stage['personas'], results):
        stage_output += f"#### {persona['name']}'s Forensic Analysis\n{result}\n\n"
        
    return stage_output

async def main():
    parser = argparse.ArgumentParser(description="Trigger the Agent Swarm Cascade on a GitHub Issue.")
    parser.add_argument("--issue", type=int, help="GitHub Issue Number")
    parser.add_argument("--local-path", help="Path to a local file or directory to read as context")
    parser.add_argument("--swarm", required=True, help="Name of the swarm configuration (e.g., mechanistic)")
    parser.add_argument("--repo", default="eriknorris/eriknorris", help="Target GitHub repository")
    args = parser.parse_args()
    
    if not args.issue and not args.local_path:
        parser.error("Must provide either --issue or --local-path")

    # 1. Fetch Credentials
    gemini_key = get_env_var("GEMINI_API_KEY")
    
    if not gemini_key:
        print("❌ Error: GEMINI_API_KEY missing from .env")
        sys.exit(1)

    # 2. Load Swarm Config
    config_path = Path(f".agent/swarms/{args.swarm}.json")
    if not config_path.exists():
        print(f"❌ Error: Swarm configuration '{args.swarm}' not found at {config_path}")
        sys.exit(1)
        
    with open(config_path, 'r', encoding='utf-8') as f:
        swarm_config = json.load(f)
        
    print(f"🧠 Loaded Swarm: {swarm_config['name']} - {swarm_config.get('description', '')}")

    # 3. Target Acquisition (Fetch Context)
    project_context = ""
    headers = {}
    if args.issue:
        github_token = get_github_token()
        if not github_token:
            print("❌ Error: GitHub Token missing from .env or mcp_config.json")
            sys.exit(1)
        print(f"📥 Fetching Issue #{args.issue} from {args.repo}...")
        headers = {"Authorization": f"Bearer {github_token}", "Accept": "application/vnd.github.v3+json"}
        issue_url = f"https://api.github.com/repos/{args.repo}/issues/{args.issue}"
        
        resp = requests.get(issue_url, headers=headers)
        if resp.status_code != 200:
            print(f"❌ Failed to fetch issue: {resp.status_code} - {resp.text}")
            sys.exit(1)
            
        issue_data = resp.json()
        project_context = f"# {issue_data['title']}\n\n{issue_data['body']}"
    else:
        target_path = Path(args.local_path)
        if not target_path.exists():
            print(f"❌ Error: Local path '{args.local_path}' not found.")
            sys.exit(1)
            
        print(f"📥 Reading local context from {target_path}...")
        if target_path.is_file():
            with open(target_path, 'r', encoding='utf-8') as f:
                content = f.read()
            project_context = f"# Local File Context: {target_path.name}\n\n{content}"
        else:
            exts = {'.txt', '.md', '.json', '.js', '.ts', '.tsx', '.astro', '.py', '.html', '.css', '.mdx'}
            blocks = []
            for filepath in target_path.rglob('*'):
                if filepath.is_file() and filepath.suffix in exts:
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            text = f.read()
                        blocks.append(f"### File: {filepath.relative_to(target_path)}\n```\n{text}\n```")
                    except Exception:
                        pass
            project_context = f"# Local Directory Context: {target_path.name}\n\n" + "\n\n".join(blocks)
    
    # 4. The Compounding Cascade
    cascading_thread = ""
    
    for stage in swarm_config['stages']:
        stage_result = await run_stage(stage, project_context, cascading_thread, gemini_key)
        cascading_thread += stage_result + "\n"

    # 5. Extract Final Synthesis
    print("\n📝 Compiling Executive Summary...")
    final_payload = f"## 👔 The Virtual C-Suite Cascade: `{swarm_config['name']}`\n\n"
    final_payload += cascading_thread
    
    # 6. Post Output
    if args.issue:
        print(f"📤 Posting synthesis to Issue #{args.issue}...")
        comments_url = f"https://api.github.com/repos/{args.repo}/issues/{args.issue}/comments"
        post_resp = requests.post(comments_url, headers=headers, json={"body": final_payload})
        
        if post_resp.status_code == 201:
            print("✅ Cascade Complete. Findings injected onto GitHub Issue.")
        else:
            print(f"❌ Failed to post comment: {post_resp.status_code} - {post_resp.text}")
    else:
        output_file = Path("swarm_output.md")
        if Path(args.local_path).is_dir():
            output_file = Path(args.local_path) / "swarm_output.md"
            
        print(f"📤 Writing synthesis to {output_file}...")
        with open(output_file, "w", encoding='utf-8') as f:
            f.write(final_payload)
        print("✅ Cascade Complete. Findings saved locally.")

if __name__ == "__main__":
    asyncio.run(main())
