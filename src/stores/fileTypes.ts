import { map, onSet } from "nanostores";
import { $schemaChanged } from "./schema";

const STORAGE_KEY = "file-types-cache";

export type AllowedTypes = "webm" | "mp4" | "jpg" | "png" | "gif";

export type FileType = {
	name: AllowedTypes;
	enabled: boolean;
};

export type FileTypes = FileType[];

const basedTypes: FileTypes = [
	{
		name: "webm",
		enabled: true,
	},
	{
		name: "mp4",
		enabled: true,
	},
	{
		name: "jpg",
		enabled: false,
	},
	{
		name: "png",
		enabled: true,
	},
	{
		name: "gif",
		enabled: true,
	},
];

function readFromCache() {
	const cache = localStorage.getItem(STORAGE_KEY);
	return cache ? (JSON.parse(cache) as FileTypes) : basedTypes;
}

export const $fileTypes = map<FileTypes>(readFromCache());

onSet($fileTypes, ({ newValue }) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
});

export const $fileTypesActions = {
	toggle(name: AllowedTypes) {
		$fileTypes.set(
			$fileTypes.get().map(type => {
				if (type.name !== name) return type;
				return { ...type, enabled: !type.enabled };
			}),
		);

		$schemaChanged.set(true);
	},
};
