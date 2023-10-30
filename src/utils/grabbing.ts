import { File, fourChannelFactory, Thread, twoChannelFactory } from "webm-grabber";
import { ExcludeRulesStore } from "../stores/excludeRules";
import { $fileTypes } from "../stores/fileTypes";

export type ExtendedThread = Thread & { vendorName: Vendors; countFiles: number };
export type ExtendedThreads = ExtendedThread[];
export type ExtendedFile = Omit<File, "rootThread"> & { rootThread: ExtendedThread };
export type ExtendedFiles = ExtendedFile[];

export const IMAGE_TYPES = ["png", "jpg", "webp", "gif", "jpeg"];

export const VENDORS_MAP = {
	"2ch": twoChannelFactory,
	"4chan": fourChannelFactory,
};

export type Vendors = keyof typeof VENDORS_MAP;

export function isFileImage(file: ExtendedFile) {
	const fileExtension = file.url.split("/").pop()?.split(".").pop() || "";
	return IMAGE_TYPES.includes(fileExtension);
}

export function compareThreads(t1: ExtendedThread, t2: ExtendedThread) {
	return t1.url === t2.url;
}

export function unpackThreadsFromFiles(files: ExtendedFiles) {
	const normalizeRules = [/<[^>]*>?/gm, "&gt;", "&lt;"];
	const normalizeByRules = (input: string) => {
		return normalizeRules.reduce<string>((acc, rule) => acc.replaceAll(rule, ""), input);
	};

	return files.reduce<ExtendedThreads>((threads, { rootThread }) => {
		const threadId = threads.findIndex((thread) => compareThreads(thread, rootThread));
		const hasThread = !!~threadId;

		hasThread && (threads[threadId].countFiles += 1);

		hasThread ||
			threads.push({
				...rootThread,
				subject: normalizeByRules(rootThread.subject || ""),
				countFiles: 1,
			});
		return threads;
	}, []);
}

export function clearThreadsByExclude(
	threads: ExtendedThreads,
	{ words, threads: excludedThreads }: ExcludeRulesStore,
) {
	const filterByWords = (thread: ExtendedThread) => {
		return !words.some((v) => thread.subject?.toLowerCase().includes(v.toLowerCase()));
	};

	const filterByThreadIds = ({ id, board }: ExtendedThread) => {
		return !excludedThreads.some((simpleThread) => simpleThread.id === id && simpleThread.board === board);
	};

	return threads.filter(filterByWords).filter(filterByThreadIds);
}

export function clearFilesByExclude(files: ExtendedFiles, { words }: ExcludeRulesStore) {
	return files.filter(
		(file) =>
			![file.name, file.rootThread.subject || ""].some((v) =>
				words.some((w) => v?.toLowerCase().includes(w?.toLowerCase())),
			),
	);
}

export function getVendorInstance(name: keyof typeof VENDORS_MAP) {
	return VENDORS_MAP[name]({
		requiredFileTypes: $fileTypes
			.get()
			.filter((v) => v.enabled)
			.map((v) => v.name),
	});
}
