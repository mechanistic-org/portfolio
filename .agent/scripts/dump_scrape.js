const fs = require("fs");
const path = require("path");

const targetFilesList = [
    "D:/GitHub/mechanistic/src/dfmea_core/data/vault_s_synthesis_v29.json",
    "D:/GitHub/mechanistic/src/dfmea_core/data/vault_f_finance_v28.json",
    "D:/GitHub/mechanistic/src/dfmea_core/data/vault_l_legal_v28.json",
    "D:/GitHub/mechanistic/src/dfmea_core/data/vault_p_physics_v28.json",
    "D:/GitHub/mechanistic/src/components/dfmea/execute/MechanisticAndonViz.tsx",
    "D:/GitHub/mechanistic/src/components/dfmea/execute/DependencyLock.tsx",
    "D:/GitHub/mechanistic/src/components/dfmea/execute/DrawbridgeRoadmap.tsx",
    "D:/GitHub/mechanistic/src/components/dfmea/execute/FormalSow.tsx"
];

let payload = "--- MECHANISTIC LIVE DASHBOARD V29 EXPORT ---\n\n";

for (const file of targetFilesList) {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, "utf-8");
        payload += `\n==============================================\n`;
        payload += `FILE: ${path.basename(file)}\n`;
        payload += `==============================================\n\n`;
        payload += `${content}\n`;
    } else {
        console.log(`[!] Missing File: ${file}`);
    }
}

const outPath = "C:/Users/erik/.gemini/antigravity/brain/fff8a5e9-705f-4d52-a20a-483c6a085350/mo_v29_dashboard_scrape.txt";
fs.writeFileSync(outPath, payload, "utf-8");
console.log(`[+] Dashboard data successfully scraped to: ${outPath}`);
