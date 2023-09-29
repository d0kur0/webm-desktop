import { action, map, onSet } from "nanostores";
import { createCache } from "../utils/cache";

const basedExcludeWords = ["gay", "trap", "трап"];

export type ExcludeStore = {
	words: string[];
	threadIds: number[];
};

const cache = createCache<ExcludeStore>("exclude");
const [cachedExcludes] = cache.read({ words: basedExcludeWords, threadIds: [] });

export const $exclude = map<ExcludeStore>(cachedExcludes);

onSet($exclude, ({ newValue }) => cache.write(newValue));

export const $excludeAddWord = action($exclude, "addWord", (store, word: string) => {
	const { words } = store.get();
	store.setKey("words", [...words, word]);
});

export const $excludeRemoveWord = action($exclude, "addWord", (store, wordKey: number) => {
	const { words } = store.get();
	store.setKey(
		"words",
		words.filter((_, key) => key !== wordKey),
	);
});

export const $excludeAddThreadId = action($exclude, "addThreadId", (store, threadId: number) => {
	const { threadIds } = store.get();
	store.setKey("threadIds", [...threadIds, threadId]);
});

export const $excludeRemoveThreadId = action($exclude, "addThreadId", (store, threadId: number) => {
	const { threadIds } = store.get();
	store.setKey(
		"threadIds",
		threadIds.filter(id => id !== threadId),
	);
});
