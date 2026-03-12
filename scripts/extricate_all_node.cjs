const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const projectsDir = 'D:/GitHub/eriknorris/src/content/projects';

// STRICT WHITELIST: Only these exact keys are defined in keystatic.config.tsx
// Any key found in an index.mdx that is NOT in this list will be aggressively moved to data.json.
const allowedKeys = [
    'title', 
    'draft', 
    'listed', 
    'targets', 
    'primary_home', 
    'asset_bucket', 
    'heroImage', 
    'description', 
    'industry', 
    'category', 
    'theme', 
    'presentation_mode', 
    'date', 
    'endDate', 
    'duration', 
    'production', 
    'productionScale', 
    'employer', 
    'job_title', 
    'role', 
    'teamSize', 
    'client', 
    'cast', 
    'tags', 
    'tools', 
    'toolIcons', 
    'skillData', 
    'additionalSkills', 
    'gallery', 
    'documents', 
    'cyberspace'
];

let processedCount = 0;
let extractedCount = 0;

const projectFolders = fs.readdirSync(projectsDir).filter(f => fs.statSync(path.join(projectsDir, f)).isDirectory());

projectFolders.forEach(folder => {
    const targetFile = path.join(projectsDir, folder, 'index.mdx');
    const sidecarFile = path.join(projectsDir, folder, '_data.json');

    if (!fs.existsSync(targetFile)) return;

    processedCount++;
    const content = fs.readFileSync(targetFile, 'utf8');
    const parsed = matter(content);
    const data = parsed.data;
    
    let hasExtractedAnything = false;
    let extracted = {};

    // Load existing sidecar if it exists to merge data, rather than overwrite
    if (fs.existsSync(sidecarFile)) {
        try {
            extracted = JSON.parse(fs.readFileSync(sidecarFile, 'utf8'));
        } catch (e) {
            console.error(`Error parsing existing data.json for ${folder}:`, e);
        }
    }

    // Check EVERY key in the current frontmatter
    Object.keys(data).forEach(key => {
        if (!allowedKeys.includes(key)) {
            // It's an illegal Keystatic key. Move it to the sidecar.
            extracted[key] = data[key];
            delete data[key];
            hasExtractedAnything = true;
        }
    });

    if (hasExtractedAnything) {
        // Write the merged data back to the JSON Sidecar
        if (Object.keys(extracted).length > 0) {
            fs.writeFileSync(sidecarFile, JSON.stringify(extracted, null, 2), 'utf8');
        }
        
        // Write the strictly compliant frontmatter back to the MDX
        const newMdx = matter.stringify(parsed.content, data);
        fs.writeFileSync(targetFile, newMdx, 'utf8');
        extractedCount++;
        console.log(`[Extracted Legacy Keys] -> ${folder}`);
    }
});

console.log(`\n[SUCCESS] Whitelist Sweep Complete. Processed ${processedCount} projects. Stripped strict-breaking keys from ${extractedCount} MDX frontmatters.`);
