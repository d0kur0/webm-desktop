import { action, map, onSet } from "nanostores";
import { createCache } from "../utils/cache";
import { Thread } from "webm-grabber";

const basedWordsForExclude = ["gay", "trap", "трап"];

const initialState = { words: basedWordsForExclude, threads: [] };

export type SimplifiedThread = Pick<Thread, "board" | "id">;

export type ExcludeRulesStore = {
	words: string[];
	threads: SimplifiedThread[];
};

const cache = createCache<ExcludeRulesStore>("exclude");
const cachedValue = cache.read();

export const $excludeRules = map<ExcludeRulesStore>(cachedValue || initialState);

onSet($excludeRules, ({ newValue }) => cache.write(newValue));

const addWord = action($excludeRules, "addWord", (store, word: string) => {
	const { words } = store.get();
	store.setKey("words", [...words, word]);
});

const removeWordByKey = action($excludeRules, "removeWordByKey", (store, wordKey: number) => {
	const { words } = store.get();
	store.setKey(
		"words",
		words.filter((_, key) => key !== wordKey),
	);
});

const addThread = action($excludeRules, "addThread", (store, thread: SimplifiedThread) => {
	const { threads } = store.get();
	store.setKey("threads", [...threads, thread]);
});

const removeThreadByKey = action($excludeRules, "removeThreadByKey", (store, threadKey: number) => {
	const { threads } = store.get();
	store.setKey(
		"threads",
		threads.filter((_, key) => key !== threadKey),
	);
});

export const $excludeRulesMutations = { addWord, removeWordByKey, addThread, removeThreadByKey };
