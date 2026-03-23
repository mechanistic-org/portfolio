const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const projectsDir = 'D:/GitHub/portfolio/src/content/projects';

// The exact allowed taxonomy values from V31 specification
const VALID_VALS = {
    targets: ["main", "mech", "play"],
    primary_home: ["main", "mech", "play"],
    asset_bucket: ["main", "mech", "play"],
    industry: ["consumer_electronics", "pro_audio", "consumer_appliance", "automation"],
    category: ["consumer_electronics", "mobile_device", "wearable_ar", "home_entertainment", "smart_home", "appliance", "enterprise_hardware", "medical_device", "computing", "control_surface", "input_device", "module_subsystem"],
    theme: ["hyphen", "dark", "light", "space", "hyperspace"],
    presentation_mode: ["standard", "deep_dive", "flagship", "notebook"],
    production: ["discovery", "definition", "concept", "prototype", "validation", "production"],
    productionScale: ["one_off", "limited", "series", "mass", "global"],
    employer: ["digidesign", "mechanistic", "kaleidescape", "noon", "hyphen", "silicon_graphics", "frogdesign", "ep_technologies", "avegant", "erik_norris", "Self-Employed"],
    role: ["mechanical_engineer", "industrial_designer", "software_engineer", "project_lead", "consultant", "other"],
    client: ["microsoft", "webtv", "ultimatetv", "frogdesign"],
    tags: ["Forensics", "Tolerance Analysis", "DFM_DFA", "Root Cause Analysis", "Thermal", "Mechanism", "Cost_Down", "Leadership", "Crisis", "Yield"],
    tools: ["pro_engineer", "windchill", "solidworks", "cad", "other", "onshape", "ptc_creo", "adobe_creative_suite", "blender", "keyshot", "thermal_simulation", "autocad"],
    cyberspace_type: ["standard", "filmstrip", "sequence", "parallax", "gallery", "media", "model", "swarm", "thermal", "conspiracy", "comparator", "void"],
    cyberspace_align: ["center", "left", "right"]
};

// Defaults for required string selects if invalid
const DEFAULTS = {
    industry: "consumer_electronics",
    category: "consumer_electronics",
    theme: "hyperspace",
    presentation_mode: "standard",
    production: "discovery",
    productionScale: "one_off",
    employer: "mechanistic",
    role: "mechanical_engineer",
    primary_home: "main",
    asset_bucket: "main"
};

let cleanedCount = 0;

const projectFolders = fs.readdirSync(projectsDir).filter(f => fs.statSync(path.join(projectsDir, f)).isDirectory());

projectFolders.forEach(folder => {
    const targetFile = path.join(projectsDir, folder, 'index.mdx');
    if (!fs.existsSync(targetFile)) return;

    let modified = false;
    const content = fs.readFileSync(targetFile, 'utf8');
    const parsed = matter(content);
    const data = parsed.data;

    // Helper to sanitize arrays
    const sanitizeArray = (key, validArr) => {
        if (data[key] && Array.isArray(data[key])) {
            const originalLength = data[key].length;
            data[key] = data[key].filter(val => validArr.includes(val));
            if (data[key].length !== originalLength) modified = true;
        }
    };

    // Helper to sanitize enums
    const sanitizeSelect = (key, validArr, def) => {
        if (data[key]) {
            if (!validArr.includes(data[key])) {
                data[key] = def;
                modified = true;
            }
        }
    };

    sanitizeArray('targets', VALID_VALS.targets);
    sanitizeSelect('primary_home', VALID_VALS.primary_home, DEFAULTS.primary_home);
    sanitizeSelect('asset_bucket', VALID_VALS.asset_bucket, DEFAULTS.asset_bucket);
    sanitizeSelect('industry', VALID_VALS.industry, DEFAULTS.industry);
    sanitizeSelect('category', VALID_VALS.category, DEFAULTS.category);
    sanitizeSelect('theme', VALID_VALS.theme, DEFAULTS.theme);
    sanitizeSelect('presentation_mode', VALID_VALS.presentation_mode, DEFAULTS.presentation_mode);
    sanitizeSelect('production', VALID_VALS.production, DEFAULTS.production);
    sanitizeSelect('productionScale', VALID_VALS.productionScale, DEFAULTS.productionScale);
    sanitizeSelect('employer', VALID_VALS.employer, DEFAULTS.employer);
    sanitizeSelect('role', VALID_VALS.role, DEFAULTS.role);
    
    sanitizeArray('client', VALID_VALS.client);
    sanitizeArray('tags', VALID_VALS.tags);
    sanitizeArray('tools', VALID_VALS.tools);

    // Deep check cyberspace stickies type and align
    if (data.cyberspace && data.cyberspace.stickies && Array.isArray(data.cyberspace.stickies)) {
        data.cyberspace.stickies.forEach(sticky => {
            if (sticky.type && !VALID_VALS.cyberspace_type.includes(sticky.type)) {
                sticky.type = "void"; // fallback
                modified = true;
            }
            if (!sticky.type) {
                sticky.type = "void"; // ensure it's required
                modified = true;
            }
            if (sticky.align && !VALID_VALS.cyberspace_align.includes(sticky.align)) {
                sticky.align = "center";
                modified = true;
            }
        });
    }

    if (modified) {
        const newMdx = matter.stringify(parsed.content, data);
        fs.writeFileSync(targetFile, newMdx, 'utf8');
        cleanedCount++;
    }
});

console.log(`Successfully forced strict taxonomy on ${cleanedCount} legacy projects. Keystatic arrays and enums are now pure.`);
