import { fourChannelFactory, twoChannelFactory } from "webm-grabber";
import { atom, map, onSet } from "nanostores";
import { $fileTypes } from "./fileTypes";

const STORAGE_KEY = "schema-cache";

const vendorsMap = {
	"2ch": twoChannelFactory,
	"4chan": fourChannelFactory,
};

export type Vendors = keyof typeof vendorsMap;

export type Board = {
	name: string;
	enabled: boolean;
	description: string;
};

export type SchemaItem = {
	vendor: Vendors;
	boards: Board[];
};

export type Schema = SchemaItem[];

const basedSchema: Schema = [
	{
		vendor: "2ch",
		boards: [
			{ name: "b", description: "Бред", enabled: true },
			{ name: "a", description: "Anime", enabled: true },
		],
	},
	{
		vendor: "4chan",
		boards: [
			{ name: "b", description: "trash", enabled: true },
			{ name: "a", description: "Anime", enabled: true },
		],
	},
];

function readFromCache() {
	const cache = localStorage.getItem(STORAGE_KEY);
	return cache ? (JSON.parse(cache) as Schema) : basedSchema;
}

export const $schema = map<Schema>(readFromCache());
export const $schemaChanged = atom(false);

onSet($schema, ({ newValue }) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
});

export const $schemaActions = {
	resetSchema() {
		localStorage.removeItem(STORAGE_KEY);
		$schema.set(basedSchema);
	},

	toggleBoardEnabled(vendor: string, board: string, enabled?: boolean) {
		$schema.set(
			$schema.get().map(v => {
				if (v.vendor !== vendor) return v;
				return {
					...v,
					boards: v.boards.map(b => {
						if (b.name !== board) return b;
						return { ...b, enabled: enabled !== undefined ? enabled : !b.enabled };
					}),
				};
			}),
		);

		$schemaChanged.set(true);
	},

	getVendor(name: keyof typeof vendorsMap) {
		return vendorsMap[name]({
			requiredFileTypes: $fileTypes
				.get()
				.filter(v => v.enabled)
				.map(v => v.name),
		});
	},
};
