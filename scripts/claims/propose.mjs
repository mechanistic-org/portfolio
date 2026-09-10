// Turn edited claim data into a review candidate. This command never accepts a claim.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { approvalDigest, canonical, projectPackage, claimBlock, affectedConsumers } from "./contract.mjs";
const canon = process.env.CANON_ROOT;
const id = process.argv[process.argv.indexOf("--id") + 1];
if (!canon || !process.argv.includes("--id") || !id) throw new Error("Usage: CANON_ROOT=<checkout> node scripts/claims/propose.mjs --id <claim-id>");
const registryPath = path.join(canon,"claims/project-claims.json");
const registry = JSON.parse(fs.readFileSync(registryPath,"utf8"));
const record = registry.claims.find((claim)=>claim.id===id);
if(!record) throw new Error(`Unknown claim: ${id}`);
if(record.review.digest===approvalDigest(record)) throw new Error("No changed assertion to propose");
record.revision += 1;
record.review = {status:"proposed",receipt:null,basis:"Edited assertion; prior acceptance invalidated. Exact candidate review required."};
record.review.digest=approvalDigest(record);
for(const use of registry.consumers.filter((use)=>use.id===id)) use.revision=record.revision;
const bundle=projectPackage(registry);
const output=bundle.claims.find((claim)=>claim.id===id);
let file, content;
if(output.variants["case-study"]) {
	file=path.join(canon,"entities/projects",record.project,`${record.project}.md`);
	content=fs.readFileSync(file,"utf8").replace(/\r\n/g,"\n");
	const start=`{/* shared-claim:${id}:start */}`, end=`{/* shared-claim:${id}:end */}`;
	const begin=content.indexOf(start), finish=content.indexOf(end);
	if(begin<0 || finish<begin || content.indexOf(start,begin+1)>=0) throw new Error("Missing or ambiguous project claim block");
	content=content.slice(0,begin)+claimBlock(id,output.variants["case-study"].text)+content.slice(finish+end.length);
}
// Public projection is a separate validation step; evidence errors remain blocking.
if(file) fs.writeFileSync(file,content);
fs.writeFileSync(registryPath,canonical(registry));
console.log(`Review required for ${id} revision ${record.revision}:\n${affectedConsumers(registry,[id]).join("\n")}`);
execFileSync(process.execPath,[fileURLToPath(new URL("./check.mjs",import.meta.url)),"--write"],{stdio:"inherit",env:process.env});
