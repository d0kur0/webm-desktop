import { action, atom, map, onSet } from "nanostores";

import { createCache } from "../utils/cache";
import { Vendors } from "../utils/grabbing";

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

const initialState: Schema = [
	{
		vendor: "2ch",
		boards: [
			{ name: "b", description: "Бред", enabled: false },
			{ name: "a", description: "Anime", enabled: true },
			{ name: "fag", description: "Фагготрия", enabled: false },
			{ name: "gacha", description: "Гача-игры", enabled: true },
			{ name: "gg", description: "Хорошие девушки", enabled: false },
			{ name: "ma", description: "Манга", enabled: true },
			{ name: "fet", description: "Фетиш", enabled: false },
			{ name: "e", description: "Extreme Porn", enabled: false },
			{ name: "hc", description: "HardCore", enabled: false },
			{ name: "media", description: "Анимация", enabled: false },
			{ name: "nf", description: "NeuroFap", enabled: false },
			{ name: "mu", description: "Music", enabled: true },
			{ name: "hc", description: "Hentai", enabled: false },
			{ name: "fur", description: "Furry", enabled: false },
			{ name: "mlp", description: "MLP", enabled: false },
		],
	},
	{
		vendor: "4chan",
		boards: [
			{ name: "a", description: "Anime & Manga", enabled: false },
			{ name: "c", description: "Anime/Cute", enabled: false },
			{ name: "w", description: "Anime/Wallpapers", enabled: false },
			{ name: "m", description: "Mecha", enabled: false },
			{ name: "cgl", description: "Cosplay & EGL", enabled: false },
			{ name: "cm", description: "Cute/Male", enabled: false },
			{ name: "f", description: "Flash", enabled: false },
			{ name: "n", description: "Transportation", enabled: false },
			{ name: "jp", description: "Otaku Culture", enabled: false },
			{ name: "vt", description: "Virtual YouTubers", enabled: false },
			{ name: "v", description: "Video Games", enabled: false },
			{ name: "vg", description: "Video Game Generals", enabled: false },
			{ name: "vm", description: "Video Games/Multiplayer", enabled: false },
			{ name: "vmg", description: "Video Games/Mobile", enabled: false },
			{ name: "vp", description: "Pokémon", enabled: false },
			{ name: "vr", description: "Retro Games", enabled: false },
			{ name: "vrpg", description: "Video Games/RPG", enabled: false },
			{ name: "vst", description: "Video Games/Strategy", enabled: false },
			{ name: "co", description: "Comics & Cartoons", enabled: false },
			{ name: "g", description: "Technology", enabled: false },
			{ name: "tv", description: "Television & Film", enabled: false },
			{ name: "k", description: "Weapons", enabled: false },
			{ name: "o", description: "Auto", enabled: false },
			{ name: "an", description: "Animals & Nature", enabled: false },
			{ name: "tg", description: "Traditional Games", enabled: false },
			{ name: "sp", description: "Sports", enabled: false },
			{ name: "xs", description: "Extreme Sports", enabled: false },
			{ name: "pw", description: "Professional Wrestling", enabled: false },
			{ name: "sci", description: "Science & Math", enabled: false },
			{ name: "his", description: "History & Humanities", enabled: false },
			{ name: "int", description: "International", enabled: false },
			{ name: "out", description: "Outdoors", enabled: false },
			{ name: "toy", description: "Toys", enabled: false },
			{ name: "i", description: "Oekaki", enabled: false },
			{ name: "po", description: "Papercraft & Origami", enabled: false },
			{ name: "p", description: "Photography", enabled: false },
			{ name: "ck", description: "Food & Cooking", enabled: false },
			{ name: "ic", description: "Artwork/Critique", enabled: false },
			{ name: "wg", description: "Wallpapers/General", enabled: false },
			{ name: "lit", description: "Literature", enabled: false },
			{ name: "mu", description: "Music", enabled: false },
			{ name: "fa", description: "Fashion", enabled: false },
			{ name: "3", description: "3DCG", enabled: false },
			{ name: "gd", description: "Graphic Design", enabled: false },
			{ name: "diy", description: "Do-It-Yourself", enabled: false },
			{ name: "wsg", description: "Worksafe GIF", enabled: false },
			{ name: "qst", description: "Quests", enabled: false },
			{ name: "biz", description: "Business & Finance", enabled: false },
			{ name: "trv", description: "Travel", enabled: false },
			{ name: "fit", description: "Fitness", enabled: false },
			{ name: "x", description: "Paranormal", enabled: false },
			{ name: "adv", description: "Advice", enabled: false },
			{ name: "lgbt", description: "LGBT", enabled: false },
			{ name: "mlp", description: "Pony", enabled: false },
			{ name: "news", description: "Current News", enabled: false },
			{ name: "wsr", description: "Worksafe Requests", enabled: false },
			{ name: "vip", description: "Very Important Posts", enabled: false },
			{ name: "b", description: "Random", enabled: false },
			{ name: "r9k", description: "ROBOT9001", enabled: false },
			{ name: "pol", description: "Politically Incorrect", enabled: false },
			{ name: "bant", description: "International/Random", enabled: false },
			{ name: "soc", description: "Cams & Meetups", enabled: false },
			{ name: "s4s", description: "Shit 4chan Says", enabled: false },
			{ name: "s", description: "Sexy Beautiful Women", enabled: false },
			{ name: "hc", description: "Hardcore", enabled: false },
			{ name: "hm", description: "Handsome Men", enabled: false },
			{ name: "h", description: "Hentai", enabled: false },
			{ name: "e", description: "Ecchi", enabled: false },
			{ name: "u", description: "Yuri", enabled: false },
			{ name: "d", description: "Hentai/Alternative", enabled: false },
			{ name: "y", description: "Yaoi", enabled: false },
			{ name: "t", description: "Torrents", enabled: false },
			{ name: "hr", description: "High Resolution", enabled: false },
			{ name: "gif", description: "Adult GIF", enabled: false },
			{ name: "aco", description: "Adult Cartoons", enabled: false },
			{ name: "r", description: "Adult Requests", enabled: false },
		],
	},
];

const cache = createCache<Schema>("schema");
const cachedValue = cache.read();

export const $schema = map<Schema>(cachedValue || initialState);
export const $schemaChanged = atom(false);

onSet($schema, ({ newValue }) => cache.write(newValue));

const reset = action($schema, "reset", (store) => {
	store.set(initialState);
});

const toggleBoardEnabled = action(
	$schema,
	"toggleBoardEnabled",
	(store, vendor: Vendors, boardName: string, enabled?: boolean) => {
		$schema.set(
			$schema.get().map((schemaItem) => {
				if (schemaItem.vendor !== vendor) return schemaItem;

				return {
					...schemaItem,
					boards: schemaItem.boards.map((board) => {
						if (board.name !== boardName) return board;
						return { ...board, enabled: enabled !== undefined ? enabled : !board.enabled };
					}),
				};
			}),
		);

		$schemaChanged.set(true);
	},
);

export const $schemaMutations = { reset, toggleBoardEnabled };
