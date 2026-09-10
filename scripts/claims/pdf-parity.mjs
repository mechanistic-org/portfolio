import fs from "node:fs";
import path from "node:path";
import { SOURCE_INPUTS } from "../resume_source.mjs";
import { digest } from "./contract.mjs";

export function verifyPDFCandidate(root,receiptFile) {
	if(!receiptFile) throw new Error("CLAIMS_PDF_RECEIPT must identify the exact reviewed resume PDF receipt");
	const receipt=JSON.parse(fs.readFileSync(receiptFile,"utf8"));
	for(const name of SOURCE_INPUTS) {
		if(receipt.source.inputs[name]!==digest(fs.readFileSync(path.join(root,name)))) throw new Error(`Stale resume PDF: ${name}`);
	}
	const pdf=receiptFile.replace(/\.receipt\.json$/,"");
	if(pdf===receiptFile || digest(fs.readFileSync(pdf))!==receipt.sha256) throw new Error("Resume PDF bytes do not match receipt");
	return receipt;
}
