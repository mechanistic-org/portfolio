import re

with open('src/content/projects/c24/index.mdx', 'r', encoding='utf-8') as f:
    text = f.read()

# fix bom quantity
text = re.sub(r'(\n  vendor: [^\n]+)', r'\1\n  quantity: 1', text)

# fix teamSize
text = text.replace('teamSize: INT 21', 'teamSize: 21')

# fix duration, teamRole, and audio_url
target = 'endDate: 2007-11-20 00:00:00+00:00\n'
replacement = target + 'duration: "2.3 Years"\nteamRole: "Mechanical & ID Lead"\naudio_url: /assets/r2/c24/c24-briefing.m4a\n'
text = text.replace(target, replacement)

with open('src/content/projects/c24/index.mdx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated c24/index.mdx successfully')
