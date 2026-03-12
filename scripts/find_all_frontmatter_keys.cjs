const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const projectsDir = 'D:/GitHub/eriknorris/src/content/projects';
const projectFolders = fs.readdirSync(projectsDir).filter(f => fs.statSync(path.join(projectsDir, f)).isDirectory());

const keyTally = {};

projectFolders.forEach(folder => {
    const targetFile = path.join(projectsDir, folder, 'index.mdx');
    if (!fs.existsSync(targetFile)) return;

    try {
        const content = fs.readFileSync(targetFile, 'utf8');
        const parsed = matter(content);
        
        Object.keys(parsed.data).forEach(key => {
            if (!keyTally[key]) {
                keyTally[key] = 0;
            }
            keyTally[key]++;
        });
    } catch (e) {
        console.error(`Failed to parse ${folder}:`, e.message);
    }
});

console.log("--- ALL FRONTMATTER KEYS ACROSS 124 PROJECTS ---");
const sortedKeys = Object.keys(keyTally).sort((a, b) => keyTally[b] - keyTally[a]);
sortedKeys.forEach(k => {
    console.log(`${k}: ${keyTally[k]} projects`);
});
