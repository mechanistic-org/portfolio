import fs from "node:fs";
import path from "node:path";
import { parse } from "parse5";
import { fileURLToPath } from "node:url";
import { resolveClaim } from "../../src/lib/project-claims.mjs";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const bundle=JSON.parse(fs.readFileSync(path.join(root,"src/data/project-claims.json"),"utf8"));
const uses=JSON.parse(fs.readFileSync(path.join(root,"src/data/claim-consumers.json"),"utf8"));
const normalize=(text)=>text.replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g," ").trim();
function visible(node) {
	if(["script","style","template"].includes(node.tagName)) return "";
	if(node.nodeName==="#text") return node.value;
	return (node.childNodes??[]).map(visible).join(" ");
}
function ids(node,result=new Set()) {
	for(const attr of node.attrs??[]) if(attr.name==="id") result.add(attr.value);
	for(const child of node.childNodes??[]) ids(child,result);
	return result;
}
const pages=new Map();
function page(route) {
	if(!pages.has(route)) pages.set(route,parse(fs.readFileSync(path.join(root,"dist",route,"index.html"),"utf8")));
	return pages.get(route);
}
for(const use of uses) {
	const claim=resolveClaim(bundle,use);
	const route=({method:"how-i-work",resume:"resume",colophon:"colophon"})[use.surface]??`projects/${use.project}`;
	if(!normalize(visible(page(route))).includes(normalize(claim.text))) throw new Error(`Built claim mismatch: ${use.path}`);
	const url=new URL(claim.href,"https://eriknorris.com");
	if(!ids(page(url.pathname.replace(/^\/+|\/+$/g,""))).has(url.hash.slice(1))) throw new Error(`Missing built evidence anchor: ${use.path}`);
}
const resume=JSON.parse(fs.readFileSync(path.join(root,"dist/resume.json"),"utf8"));
for(const use of uses.filter((use)=>use.surface==="resume")) {
	if(!resume.work.some((entry)=>entry.highlights.includes(resolveClaim(bundle,use).text))) throw new Error(`JSON resume drift: ${use.path}`);
}
const colophon=visible(page("colophon"));
if(/The Collaboration Log|MOMA IS CALLING|THAT IS THE SOUND OF COMPETENCE/.test(colophon)) throw new Error("Retired satire wall still renders");
console.log(`Built claims: ${uses.length} visible statements and evidence anchors verified; JSON resume agrees; satire wall retired.`);
