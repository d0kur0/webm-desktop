import { action, atom, map, onMount } from "nanostores";
import { $schema, $schemaActions } from "./schema";
import { Files, Thread, VendorMethods, Threads } from "webm-grabber";

const STORAGE_KEY = "media-cache";
const MAX_QUEUE_SIZE = 30;
const CACHE_LIFETIME_SECONDS = 3600;

type Media = {
	files: Files;
	threads: Threads;
	loading: boolean;
	fromCache: boolean;
};

type MediaCache = {
	files: Files;
	threads: Threads;
	updatedAt: string;
};

const emptyCache = {
	files: [],
	updatedAt: getTimestamp() + CACHE_LIFETIME_SECONDS * 2,
};

function getTimestamp() {
	return Math.floor(Date.now() / 1000);
}

const serializedCache = localStorage.getItem(STORAGE_KEY);
const cache: MediaCache = serializedCache !== null ? JSON.parse(serializedCache) : emptyCache;
const isCacheExpired = Number(cache.updatedAt) - getTimestamp() > CACHE_LIFETIME_SECONDS;

export const $media = map<Media>({
	files: isCacheExpired ? [] : cache.files,
	threads: isCacheExpired ? [] : cache.threads,
	loading: isCacheExpired,
	fromCache: !isCacheExpired,
});

export const $status = atom<string | null>(null);

export const fetchMedia = action($media, "fetchMedia", async () => {
	const schema = $schema.get();
	$media.setKey("loading", true);

	const threadsMap = await Promise.all(
		schema.map(async v => {
			$status.set(`fetchThreads from ${v.vendor}`);

			const threads: (Thread & { vendor: VendorMethods })[] = [];

			for (const board of v.boards) {
				const vendor = $schemaActions.getVendor(v.vendor);
				threads.push(...(await vendor.fetchThreads(board.name)).map(q => ({ ...q, vendor })));
			}

			return threads;
		}),
	);

	const files: Files = [];
	const threads = threadsMap.flat();
	const sourceThreads = [...threads];
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
	$media.setKey("threads", sourceThreads);

	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			files,
			threads: sourceThreads,
			updatedAt: getTimestamp(),
		}),
	);
});

onMount($media, () => {
	$media.get().fromCache || fetchMedia().catch(console.error);
});
