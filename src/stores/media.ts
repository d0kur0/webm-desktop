import { action, computed, map, onMount, onSet } from "nanostores";
import { $schema } from "./schema";
import { Files, Thread, VendorMethods } from "webm-grabber";
import { $excludeRules } from "./excludeRules";
import { CACHE_TTL, createCache } from "../utils/cache";
import {
	clearFilesByExclude,
	clearThreadsByExclude,
	getVendor,
	unpackThreadsFromFiles,
} from "../utils/grabbing";
import { $loggerMutations } from "./logger";

const MAX_QUEUE_SIZE = 30;

type FilesStore = {
	files: Files;
	loading: boolean;
	fromCache: boolean;
};

type ThreadsWithVendor = (Thread & { vendor: VendorMethods })[];

const cache = createCache<Files>("media", CACHE_TTL.ONE_HOUR);
const [files, fromCache, cacheExpired] = cache.read([]);

export const $files = map<FilesStore>({
	files,
	fromCache,
	loading: cacheExpired,
});

onMount($files, () => {
	cacheExpired && fetch().catch(console.error);
});

onSet($files, ({ newValue }) => cache.write(newValue.files));

const fetch = action($files, "fetchMedia", async () => {
	const schema = $schema.get();
	$files.setKey("loading", true);

	const threadsMap = await Promise.all(
		schema.map(async schemaItem => {
			$loggerMutations.write(`Получение тредов от ${schemaItem.vendor}`);

			const threads: ThreadsWithVendor = [];

			for (const board of schemaItem.boards) {
				if (!board.enabled) continue;

				const vendor = getVendor(schemaItem.vendor);
				const threadsResponse = await vendor.fetchThreads(board.name);

				threads.push(
					...threadsResponse.map(thread => ({
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
	const threads = clearThreadsByExclude(threadsMap.flat(), $excludeRules.get()) as ThreadsWithVendor;

	const fetchPartial = async (): Promise<void> => {
		const threadsPart = threads.splice(0, MAX_QUEUE_SIZE);
		if (!threadsPart.length) return;

		const filesPartMap = await Promise.all(
			threadsPart.map(({ vendor, ...thread }) => {
				$loggerMutations.write(`Получение файлов из треда: ${thread.id}`);
				return vendor.fetchFiles(thread);
			}),
		);

		files.push(...filesPartMap.flat());
		return fetchPartial();
	};

	await fetchPartial();

	$loggerMutations.clear();

	$files.setKey("files", files);
	$files.setKey("loading", false);
});

export const $mediaMutations = { fetch };

export const $filteredFiles = computed([$files, $excludeRules], (media, exclude) => {
	return clearFilesByExclude(media.files, exclude);
});

export const $threads = computed([$files, $excludeRules], ({ files }, exclude) => {
	return clearThreadsByExclude(unpackThreadsFromFiles(files), exclude);
});
