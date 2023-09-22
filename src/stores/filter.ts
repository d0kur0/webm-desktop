import { map } from "nanostores";

export const $filter = map<string[]>(["nigger", "gay"]);

export const $filterActions = {
	add(text: string) {
		$filter.set([...$filter.get(), text]);
	},
	remove(key: number) {
		$filter.set($filter.get().filter((_, k) => k !== key));
	},
};
