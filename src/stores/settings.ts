import { atom } from "nanostores";

export const $hoverPreview = atom(localStorage.disableHoverPreview === undefined ? true : false);

export const $hoverPreviewActions = {
	toggle() {
		const enabled = $hoverPreview.get();

		enabled
			? localStorage.setItem("disableHoverPreview", "true")
			: localStorage.removeItem("disableHoverPreview");

		$hoverPreview.set(!enabled);
	},
};
