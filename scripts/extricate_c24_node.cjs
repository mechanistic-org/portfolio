const fs = require('fs');
const matter = require('gray-matter');

const targetFile = 'D:/GitHub/eriknorris/src/content/projects/c24/index.mdx';
const sidecarFile = 'D:/GitHub/eriknorris/src/content/projects/c24/data.json';

const content = fs.readFileSync(targetFile, 'utf8');
const parsed = matter(content);

const data = parsed.data;

const keysToExtract = ['bom', 'cast', 'timeline', 'scars', 'metrics', 'forensic_summary', 'toolchain', 'complexity_vector'];
const extracted = {};

keysToExtract.forEach(k => {
    if (data[k] !== undefined) {
        extracted[k] = data[k];
        delete data[k];
    }
});

// Write to JSON
fs.writeFileSync(sidecarFile, JSON.stringify(extracted, null, 2), 'utf8');

// Write back to MDX
const newMdx = matter.stringify(parsed.content, data);
fs.writeFileSync(targetFile, newMdx, 'utf8');

console.log('Successfully extracted frontmatter to data.json and updated index.mdx');
