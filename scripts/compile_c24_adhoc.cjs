const fs = require('fs');
const path = require('path');

const DATA_PATH = 'D:/GitHub/portfolio/src/content/projects/c24/data.json';
const MDX_PATH = 'D:/GitHub/portfolio/src/content/projects/c24/index.mdx';
const RAW_DIR = 'D:/GitHub/portfolio/src/content/_raw_nlm';

const TEAM_FILE = path.join(RAW_DIR, 'c24_team.md');
const TIMELINE_FILE = path.join(RAW_DIR, 'c24_development_timeline.md');
const ADHOC_FILE = path.join(RAW_DIR, 'c24_adhoc.md');

function cleanNlmJson(filepath) {
    if (!fs.existsSync(filepath)) return null;
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Clean NLM Markdown escaping
    content = content.replace(/&nbsp;/g, ' ');
    content = content.replace(/\\_/g, '_');
    content = content.replace(/\\\[/g, '[');
    content = content.replace(/\\\]/g, ']');
    content = content.replace(/\\\\"/g, '\\"'); // Fix double-escaped quotes from NLM
    
    // Also NLM sometimes escapes quotes inside strings.
    // Node's eval handles standard double quotes perfectly.
    
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    
    let jsonStr = match[0];
    
    try {
        // eval is safe here and way more lenient than JSON.parse (allows trailing commas, unquoted keys, etc)
        const obj = eval('(' + jsonStr + ')');
        return obj;
    } catch (e) {
        console.error('Failed to parse ' + filepath, e);
        return null;
    }
}

function main() {
    const sidecar = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    
    // Team
    const teamData = cleanNlmJson(TEAM_FILE);
    if (teamData) {
        const rootKey = Object.keys(teamData)[0];
        const subKey = Object.keys(teamData[rootKey])[0];
        const castArray = teamData[rootKey][subKey];
        
        if (!sidecar.cast) sidecar.cast = [];
        const existingNames = new Set(sidecar.cast.map(c => c.name));
        
        for (const member of castArray) {
            if (!existingNames.has(member.name)) {
                sidecar.cast.push(member);
            }
        }
        console.log(`Injected ${castArray.length} Team Members into data.json`);
    }

    // Timeline
    const timelineData = cleanNlmJson(TIMELINE_FILE);
    if (timelineData) {
        const rootKey = Object.keys(timelineData)[0];
        const events = timelineData[rootKey];
        
        if (!sidecar.timeline) sidecar.timeline = [];
        const existingDates = new Set(sidecar.timeline.map(e => e.date));
        
        for (const evt of events) {
            if (!existingDates.has(evt.date)) {
                if (evt.event && !evt.title) {
                    evt.title = evt.event;
                    delete evt.event;
                }
                sidecar.timeline.push(evt);
            }
        }
        console.log(`Injected ${events.length} Timeline Events into data.json`);
    }
    
    fs.writeFileSync(DATA_PATH, JSON.stringify(sidecar, null, 2), 'utf8');
    console.log('Successfully updated C24 data.json sidecar');

    // Adhoc Notes
    if (fs.existsSync(ADHOC_FILE)) {
        const adhocNotes = fs.readFileSync(ADHOC_FILE, 'utf8').trim();
        let mdxContent = fs.readFileSync(MDX_PATH, 'utf8');
        
        if (!mdxContent.includes('<AdHocDossier>') && !mdxContent.includes('C24 Curtis Forensic Report')) {
            mdxContent += `\n\n\n## Ad-Hoc Forensic Notes\n\n${adhocNotes}\n`;
            fs.writeFileSync(MDX_PATH, mdxContent, 'utf8');
            console.log('Successfully appended c24_adhoc.md to the bottom of index.mdx body');
        } else {
            console.log('Ad-hoc notes already seem present in index.mdx');
        }
    }
}

main();
