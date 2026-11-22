import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

// Review/export and explicit local supporting-copy projection. No deploy or network calls.
const repo = fs.realpathSync(fileURLToPath(new URL('../', import.meta.url)));
const command = process.argv[2] || 'status';
if (!['check','status','export','preview','serve','linkedin','resume','project','reconcile','test'].includes(command))
  throw new Error('Use check, status, reconcile, test, export, preview, serve, linkedin, resume or project.');
let configured = process.env.BIO_CONTENT_ROOT;
if (!configured) {
  try { configured = execFileSync('git',['-C',repo,'config','--get','bio.contentSource'],{encoding:'utf8'}).trim(); }
  catch { /* Explicit fallback below. */ }
}
const candidates = configured ? [path.resolve(repo,configured)] : [
  path.join(repo,'authoring/biography'),
  path.resolve(repo,'../moreplay/authoring/biography'),
];
const source = candidates.find(p => fs.existsSync(path.join(p,'inventory.json')));
if (!source) throw new Error('Private biography source unavailable. Set BIO_CONTENT_ROOT or git config bio.contentSource to the private package. See docs/biography-workflow.md.');
let roles=[];
const canonical=path.join(repo,'src/config/resume_master.ts');
if(fs.existsSync(canonical)) {
  const {resumeMaster}=await import(pathToFileURL(canonical));
  roles=resumeMaster.career.map(r=>({id:r.id,title:r.canonicalTitle,period:r.period}));
}
const supportingFile=path.join(repo,'src/data/biography-intros.json');
const supportingCopy=fs.existsSync(supportingFile) ? JSON.parse(fs.readFileSync(supportingFile,'utf8')) : {};
const stylePath=path.join(repo,'src/styles/biography-intros.css');
const supportingStyle=fs.existsSync(stylePath)?crypto.createHash('sha256').update(fs.readFileSync(stylePath)).digest('hex'):null;
const python=process.env.BIO_PYTHON || 'python';
const result=spawnSync(python,['-B',path.join(source,'cli.py'),command,'--repo',repo],{
  stdio:['pipe','inherit','inherit'],input:JSON.stringify({roles,supportingCopy,supportingStyle}),shell:false,
});
if(result.error) throw result.error;
process.exitCode=result.status ?? 1;
