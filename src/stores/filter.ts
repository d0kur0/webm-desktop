import { map, onSet } from "nanostores";

const STORAGE_KEY = "filter-cache";

const basedFilters = ["gay", "trap", "трап"];

function readFromCache() {
	const cachedValue = localStorage.getItem(STORAGE_KEY);
	return cachedValue ? JSON.parse(cachedValue) : basedFilters;
}

export const $filter = map<string[]>(readFromCache());

export const $filterActions = {
	add(text: string) {
		$filter.set([...$filter.get(), text]);
	},
	remove(key: number) {
		$filter.set($filter.get().filter((_, k) => k !== key));
	},
};

onSet($filter, ({ newValue }) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
});
