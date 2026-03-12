const fs = require('fs');
const path = require('path');

const projectsDir = 'D:/GitHub/eriknorris/src/content/projects';
const rawNlmDir = 'D:/GitHub/eriknorris/src/content/_raw_nlm';

// Ensure the target directory exists
if (!fs.existsSync(rawNlmDir)) {
    fs.mkdirSync(rawNlmDir, { recursive: true });
}

let movedCount = 0;

const projectFolders = fs.readdirSync(projectsDir).filter(f => fs.statSync(path.join(projectsDir, f)).isDirectory());

projectFolders.forEach(folder => {
    // Check for both data.json and _data.json just in case
    const oldPath1 = path.join(projectsDir, folder, '_data.json');
    const oldPath2 = path.join(projectsDir, folder, 'data.json');
    const newPath = path.join(rawNlmDir, `${folder}.json`);

    let sourcePath = null;
    if (fs.existsSync(oldPath1)) sourcePath = oldPath1;
    else if (fs.existsSync(oldPath2)) sourcePath = oldPath2;

    if (sourcePath) {
        fs.renameSync(sourcePath, newPath);
        movedCount++;
    }
});

console.log(`Successfully moved ${movedCount} sidecars to ${rawNlmDir} to completely decouple them from Keystatic.`);
