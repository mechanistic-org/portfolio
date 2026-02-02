import { atom } from "nanostores";

export const isDossierOpen = atom(false);

export function toggleDossier() {
	isDossierOpen.set(!isDossierOpen.get());
}

export function setDossierOpen(isOpen: boolean) {
	isDossierOpen.set(isOpen);
}

export const isTeamOpen = atom(false);

export function setTeamOpen(isOpen: boolean) {
	isTeamOpen.set(isOpen);
}
