import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
const receipt=JSON.parse(fs.readFileSync(path.join(root,'src/data/biography-projection.json'),'utf8'));
const copy=JSON.parse(fs.readFileSync(path.join(root,'src/data/biography-intros.json'),'utf8'));
if(JSON.stringify(Object.keys(copy).sort())!==JSON.stringify(Object.keys(receipt.blocks).sort()))throw Error('Biography block coverage changed. Reconcile through bio:project.');
for(const [id,text]of Object.entries(copy)){if(digest(text)!==receipt.blocks[id])throw Error(`Biography copy drift: ${id}. Edit the registered private source and run bio:project.`);}
for(const [file,hash]of Object.entries(receipt.styles)){if(digest(fs.readFileSync(path.join(root,file)))!==hash)throw Error(`Biography style drift: ${file}. Review the common style and update all three projections.`);}
console.log(`Biography projection valid: ${Object.keys(copy).length} copy blocks and shared style. Private source freshness is checked by bio:check.`);
