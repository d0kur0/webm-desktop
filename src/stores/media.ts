import { action, atom, computed, map, onMount } from "nanostores";
import { $schema, $schemaActions } from "./schema";
import { File, Files, Thread, Threads, VendorMethods } from "webm-grabber";
import { $filter } from "./filter";

export const IMAGE_TYPES = ["png", "jpg", "webp", "gif", "jpeg"];

export function isFileImage(file: File) {
	const fileExtension = file.url.split("/").pop()?.split(".").pop() || "";
	return IMAGE_TYPES.includes(fileExtension);
}

export function getVendorName(file: File): "2ch" | "4chan" {
	const is2ch = file.rootThread.url.includes("2ch");
	return is2ch ? "2ch" : "4chan";
}

const STORAGE_KEY = "media-cache";
const MAX_QUEUE_SIZE = 30;
const CACHE_LIFETIME_SECONDS = 3600;

type Media = {
	files: Files;
	loading: boolean;
	fromCache: boolean;
};

type MediaCache = {
	files: Files;
	updatedAt: string;
};

type ThreadsWithVendor = (Thread & { vendor: VendorMethods })[];

const emptyCache = {
	files: [],
	updatedAt: getTimestamp() - CACHE_LIFETIME_SECONDS * 2,
};

function getTimestamp() {
	return Math.floor(Date.now() / 1000);
}

const serializedCache = localStorage.getItem(STORAGE_KEY);
const cache: MediaCache = serializedCache ? JSON.parse(serializedCache) : emptyCache;
const isCacheExpired = getTimestamp() - CACHE_LIFETIME_SECONDS > +cache.updatedAt;

function unpackThreadsFromFiles(files: Files) {
	return files.reduce((threads, { rootThread }) => {
		threads.find(v => v.id === rootThread.id) ||
			threads.push({
				...rootThread,
				subject: rootThread.subject
					?.replaceAll(/<[^>]*>?/gm, "")
					?.replaceAll("&gt;", "")
					?.replaceAll("&lt;", ""),
			});
		return threads;
	}, [] as Threads);
}

function cleanupThreadsByFilter(threads: Threads) {
	return threads.filter(
		thread => !$filter.get().some(v => thread.subject?.toLowerCase().includes(v.toLowerCase())),
	);
}

const initialFiles = isCacheExpired ? [] : cache.files;

export const $media = map<Media>({
	files: initialFiles,
	loading: isCacheExpired,
	fromCache: !isCacheExpired,
});

export const $status = atom<string | null>(null);

export const fetchMedia = action($media, "fetchMedia", async () => {
	const schema = $schema.get();
	$media.setKey("loading", true);

	const threadsMap = await Promise.all(
		schema.map(async schemaItem => {
			$status.set(`fetchThreads from ${schemaItem.vendor}`);

			const threads: ThreadsWithVendor = [];

			for (const board of schemaItem.boards) {
				if (!board.enabled) continue;
				const vendor = $schemaActions.getVendor(schemaItem.vendor);

				threads.push(
					...(await vendor.fetchThreads(board.name)).map(thread => ({
						...thread,
						vendor,
						vendorName: schemaItem.vendor,
					})),
				);
			}

			return threads;
		}),
	);

	const files: Files = [];
	const threads = cleanupThreadsByFilter(threadsMap.flat()) as ThreadsWithVendor;
	const initialThreadsCount = threads.length;

	const fetchPartial = async (): Promise<void> => {
		const threadsPart = threads.splice(0, MAX_QUEUE_SIZE);
		if (!threadsPart.length) return;

		$status.set(`fetchFiles of threads: ${initialThreadsCount - threads.length}/${initialThreadsCount}`);

		const filesPartMap = await Promise.all(
			threadsPart.map(({ vendor, ...thread }) => vendor.fetchFiles(thread)),
		);

		files.push(...filesPartMap.flat());
		return fetchPartial();
	};

	await fetchPartial();

	$status.set(null);

	$media.setKey("files", files);
	$media.setKey("loading", false);

	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			files: files,
			updatedAt: getTimestamp(),
		}),
	);
});

onMount($media, () => {
	$media.get().fromCache || fetchMedia().catch(console.error);
});

export const $filteredFiles = computed([$media, $filter], (media, filter) => {
	return media.files.filter(
		file =>
			![file.name, file.rootThread.subject || ""].some(v =>
				filter.some(w => v?.toLowerCase().includes(w?.toLowerCase())),
			),
	);
});

export const $threads = computed($media, ({ files }) =>
	cleanupThreadsByFilter(unpackThreadsFromFiles(files)),
);
