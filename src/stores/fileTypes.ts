import { action, map, onSet } from "nanostores";
import { $schemaChanged } from "./schema";
import { createCache } from "../utils/cache";

export type AllowedTypes = "webm" | "mp4" | "jpg" | "png" | "gif";

export type FileType = {
	name: AllowedTypes;
	enabled: boolean;
};

export type FileTypes = FileType[];

const initialState: FileTypes = [
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

const cache = createCache<FileTypes>("fileTypes");
const cachedValue = cache.read();

export const $fileTypes = map<FileTypes>(cachedValue || initialState);

onSet($fileTypes, ({ newValue }) => cache.write(newValue));

const toggleTypeEnabled = action($fileTypes, "toggleTypeEnabled", (store, name: AllowedTypes) => {
	store.set(
		store.get().map(type => {
			if (type.name !== name) return type;
			return { ...type, enabled: !type.enabled };
		}),
	);

	$schemaChanged.set(true);
});

export const $fileTypesMutations = { toggleTypeEnabled };
