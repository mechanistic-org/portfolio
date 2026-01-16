import { atom } from "nanostores";

export const isDossierOpen = atom(false);

export function toggleDossier() {
	isDossierOpen.set(!isDossierOpen.get());
}

export function setDossierOpen(isOpen: boolean) {
	isDossierOpen.set(isOpen);
}
