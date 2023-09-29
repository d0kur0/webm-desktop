import { action, computed, map, onMount, onSet } from "nanostores";
import { $schema } from "./schema";
import { Files, Thread, VendorMethods } from "webm-grabber";
import { $exclude } from "./exclude";
import { CACHE_TTL, createCache } from "../utils/cache";
import { $loggerClear, $loggerWrite } from "./logger";
import {
	clearFilesByExclude,
	clearThreadsByExclude,
	getVendor,
	unpackThreadsFromFiles,
} from "../utils/grabbing";

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
	const { fromCache } = $files.get();
	fromCache || $filesFetch().catch(console.error);
});

onSet($files, ({ newValue }) => cache.write(newValue.files));

export const $filesFetch = action($files, "fetchMedia", async () => {
	const schema = $schema.get();
	$files.setKey("loading", true);

	const threadsMap = await Promise.all(
		schema.map(async schemaItem => {
			$loggerWrite(`Получение тредов от ${schemaItem.vendor}`);

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
	const threads = clearThreadsByExclude(threadsMap.flat(), $exclude.get()) as ThreadsWithVendor;

	const fetchPartial = async (): Promise<void> => {
		const threadsPart = threads.splice(0, MAX_QUEUE_SIZE);
		if (!threadsPart.length) return;

		const filesPartMap = await Promise.all(
			threadsPart.map(({ vendor, ...thread }) => {
				$loggerWrite(`Получение файлов из треда: ${thread.id}`);
				return vendor.fetchFiles(thread);
			}),
		);

		files.push(...filesPartMap.flat());
		return fetchPartial();
	};

	await fetchPartial();

	$loggerClear();

	$files.setKey("files", files);
	$files.setKey("loading", false);
});

export const $filteredFiles = computed([$files, $exclude], (media, exclude) => {
	return clearFilesByExclude(media.files, exclude);
});

export const $threads = computed([$files, $exclude], ({ files }, exclude) => {
	return clearThreadsByExclude(unpackThreadsFromFiles(files), exclude);
});
