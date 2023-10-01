import { File, Files, fourChannelFactory, Thread, Threads, twoChannelFactory } from "webm-grabber";
import { ExcludeRulesStore } from "../stores/excludeRules";
import { $fileTypes } from "../stores/fileTypes";

export const IMAGE_TYPES = ["png", "jpg", "webp", "gif", "jpeg"];

export const VENDORS_MAP = {
	"2ch": twoChannelFactory,
	"4chan": fourChannelFactory,
};

export type Vendors = keyof typeof VENDORS_MAP;

export function isFileImage(file: File) {
	const fileExtension = file.url.split("/").pop()?.split(".").pop() || "";
	return IMAGE_TYPES.includes(fileExtension);
}

export function getVendorName(file: File): "2ch" | "4chan" {
	const is2ch = file.rootThread.url.includes("2ch");
	return is2ch ? "2ch" : "4chan";
}

export function compareThreads(t1: Thread, t2: Thread) {
	return t1.url === t2.url;
}

export function unpackThreadsFromFiles(files: Files) {
	const normalizeRules = [/<[^>]*>?/gm, "&gt;", "&lt;"];
	const normalizeByRules = (input: string) => {
		return normalizeRules.reduce<string>((acc, rule) => acc.replaceAll(rule, ""), input);
	};

	return files.reduce((threads, { rootThread }) => {
		const hasThread = threads.find(thread => compareThreads(thread, rootThread));
		hasThread ||
			threads.push({
				...rootThread,
				subject: normalizeByRules(rootThread.subject || ""),
			});
		return threads;
	}, [] as Threads);
}

export function clearThreadsByExclude(
	threads: Threads,
	{ words, threads: excludedThreads }: ExcludeRulesStore,
) {
	const filterByWords = (thread: Thread) => {
		return !words.some(v => thread.subject?.toLowerCase().includes(v.toLowerCase()));
	};

	const filterByThreadIds = ({ id, board }: Thread) => {
		return !excludedThreads.some(simpleThread => simpleThread.id === id && simpleThread.board === board);
	};

	return threads.filter(filterByWords).filter(filterByThreadIds);
}

export function clearFilesByExclude(files: Files, { words }: ExcludeRulesStore) {
	return files.filter(
		file =>
			![file.name, file.rootThread.subject || ""].some(v =>
				words.some(w => v?.toLowerCase().includes(w?.toLowerCase())),
			),
	);
}

export function getVendor(name: keyof typeof VENDORS_MAP) {
	return VENDORS_MAP[name]({
		requiredFileTypes: $fileTypes
			.get()
			.filter(v => v.enabled)
			.map(v => v.name),
	});
}
