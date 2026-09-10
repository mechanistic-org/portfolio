import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { resolveClaim, renderRecord } from "../../src/lib/project-claims.mjs";
import { approvalDigest, canonical, digest, projectPackage, validateConsumers, verifyEvidence, affectedConsumers, checkProjectBlocks, claimBlock } from "../../scripts/claims/contract.mjs";
import { verifyPDFCandidate } from "../../scripts/claims/pdf-parity.mjs";
import { SOURCE_INPUTS } from "../../scripts/resume_source.mjs";

function fixture() {
	const claim = { id:"sc48-rise", project:"sc48", revision:1, status:"active", outcome:"observed", attribution:"Mechanical team test", scope:"Comparable 4U configurations", publicationAllowed:true,
		statement:"At left R69, the rise differs by {{rise}}°C between the 4U configurations; ambient conditions also differed.",
		facts:{rise:{value:9.9,precision:1,unit:"C",kind:"rise difference",scope:"left R69; 4U 8.5 versus 12 V"}},
		variants:{method:{title:"Thermal comparison",text:"{{statement}}"},resume:{title:"Thermal comparison",text:"{{statement}}"},"case-study":{title:"Thermal comparison",text:"{{statement}}"}},
		href:"/projects/sc48/#shared-sc48-rise", sources:[{id:"evidence:LK-test",sha256:digest("primary bytes"),locator:"Table, 4U rows"}], review:{status:"proposed",receipt:null} };
	claim.review.digest = approvalDigest(claim);
	return {schema:1,claims:[claim],consumers:[{id:claim.id,project:"sc48",revision:1,surface:"method",path:"method:thermal"},{id:claim.id,project:"sc48",revision:1,surface:"resume",path:"resume:audio"}]};
}
test("a wrong project, stale revision, removed claim or unavailable variant cannot render", () => {
	const registry=fixture(), bundle=projectPackage(registry), ref=registry.consumers[0];
	for(const changed of [{...ref,project:"c24"},{...ref,revision:2},{...ref,id:"missing"},{...ref,surface:"colophon"}]) assert.throws(()=>resolveClaim(bundle,changed));
	bundle.claims[0].status="withdrawn";
	assert.throws(()=>resolveClaim(bundle,ref),/Unavailable/);
	assert.throws(()=>validateConsumers(registry,bundle),/Invalid consumer/);
});
test("ambient substitution, production-rate reinterpretation, rounding and deleted qualifiers invalidate review", () => {
	for(const mutate of [
		(c)=>c.facts.rise.kind="ambient temperature",
		(c)=>c.facts.rise.scope="production population",
		(c)=>c.facts.rise.precision=0,
		(c)=>c.statement=c.statement.replace("; ambient conditions also differed", ""),
		(c)=>c.sources[0].sha256="b".repeat(64),
		(c)=>c.attribution="Sole designer",
	]) { const r=fixture(); mutate(r.claims[0]); assert.throws(()=>projectPackage(r),/Changed assertion needs review/); }
});
test("every variant retains the complete assertion; estimates and cohort limits cannot be dropped by a renderer", () => {
	const r=fixture();
	r.claims[0].variants.resume.text="Improved cooling by 9.9 C.";
	assert.throws(()=>renderRecord(r.claims[0]),/Complete assertion required/);
	assert.match(resolveClaim(projectPackage(fixture()),fixture().consumers[0]).text,/ambient conditions also differed/);
});
test("reviewed candidate is renderable but proposed wording cannot pass the release gate", () => {
	const r=fixture();
	projectPackage(r);
	assert.throws(()=>projectPackage(r,{release:true}),/Exact approval pending/);
	r.claims[0].review.status="accepted";
	assert.throws(()=>projectPackage(r,{release:true}),/Exact approval pending/);
	r.claims[0].review.receipt="operator exact candidate receipt";
	projectPackage(r,{release:true});
});
test("public projection is deterministic and excludes private custody fields", () => {
	const r=fixture();
	r.claims[0].review.privateNote="PRIVATE_CLIENT_NOTE";
	const bytes=canonical(projectPackage(r));
	assert.equal(bytes,canonical(projectPackage(r)));
	assert.doesNotMatch(bytes,/PRIVATE_CLIENT_NOTE|LK-test|sha256|locator|review/);
	assert.deepEqual(Object.keys(JSON.parse(bytes)).sort(),["claims","schema"]);
});
test("support changes identify downstream consumers; an evidence rename with identical bytes remains valid", () => {
	const root=fs.mkdtempSync(path.join(os.tmpdir(),"claims-evidence-"));
	try {
		fs.mkdirSync(path.join(root,"registry"));
		const r=fixture(), index=path.join(root,"registry/evidence.jsonl");
		fs.writeFileSync(path.join(root,"renamed.md"),"primary bytes");
		fs.writeFileSync(index,JSON.stringify({id:"LK-test",path:"renamed.md",sha256:digest("primary bytes")}));
		verifyEvidence(r,root);
		fs.writeFileSync(index,JSON.stringify({id:"LK-test",path:"renamed.md",sha256:digest("changed bytes")}));
		assert.throws(()=>verifyEvidence(r,root),/method:thermal[\s\S]*resume:audio/);
		assert.equal(affectedConsumers(r,["sc48-rise"]).length,2);
	} finally { fs.rmSync(root,{recursive:true,force:true}); }
});
test("project assertion or anchor drift fails without invalidating unrelated page edits", () => {
	const root=fs.mkdtempSync(path.join(os.tmpdir(),"claims-project-"));
	try {
		const dir=path.join(root,"entities/projects/sc48");fs.mkdirSync(dir,{recursive:true});
		const r=fixture(), b=projectPackage(r), file=path.join(dir,"sc48.md");
		const block='<span id="shared-sc48-rise"></span>\n'+claimBlock("sc48-rise",b.claims[0].variants["case-study"].text);
		fs.writeFileSync(file,"Unrelated editorial change.\n"+block);checkProjectBlocks(r,b,root);
		fs.writeFileSync(file,block.replace("9.9","22.6"));assert.throws(()=>checkProjectBlocks(r,b,root),/Project assertion drift/);
		fs.writeFileSync(file,block.replace('id="shared-sc48-rise"','id="removed"'));assert.throws(()=>checkProjectBlocks(r,b,root),/Project assertion drift/);
	} finally {fs.rmSync(root,{recursive:true,force:true});}
});
test("a changed shared assertion invalidates an otherwise identical resume PDF receipt", () => {
	const root=fs.mkdtempSync(path.join(os.tmpdir(),"claims-pdf-"));
	try {
		const inputs={};
		for(const name of SOURCE_INPUTS) { const file=path.join(root,name); fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,"version one");inputs[name]=digest("version one"); }
		const pdf=path.join(root,"candidate.pdf"), receipt=pdf+".receipt.json";
		fs.writeFileSync(pdf,"test PDF bytes");fs.writeFileSync(receipt,JSON.stringify({source:{inputs},sha256:digest("test PDF bytes")}));
		verifyPDFCandidate(root,receipt);
		fs.writeFileSync(path.join(root,"src/data/project-claims.json"),"version two");
		assert.throws(()=>verifyPDFCandidate(root,receipt),/Stale resume PDF: src\/data\/project-claims.json/);
	} finally {fs.rmSync(root,{recursive:true,force:true});}
});
