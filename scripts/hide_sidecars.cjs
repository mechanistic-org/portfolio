const fs = require('fs');
const path = require('path');

const projectsDir = 'D:/GitHub/eriknorris/src/content/projects';
let renameCount = 0;

const projectFolders = fs.readdirSync(projectsDir).filter(f => fs.statSync(path.join(projectsDir, f)).isDirectory());

projectFolders.forEach(folder => {
    const oldPath = path.join(projectsDir, folder, 'data.json');
    const newPath = path.join(projectsDir, folder, '_data.json');

    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        renameCount++;
    }
});

console.log(`Successfully renamed ${renameCount} 'data.json' sidecars to '_data.json' to hide them from Keystatic/Astro validation.`);
