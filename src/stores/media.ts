import { action, computed, map, onMount, onSet } from "nanostores";
import { $schema } from "./schema";
import { VendorMethods } from "webm-grabber";
import { $excludeRules } from "./excludeRules";
import { CACHE_TTL, createCache } from "../utils/cache";
import {
	clearFilesByExclude,
	clearThreadsByExclude,
	compareThreads,
	ExtendedFiles,
	ExtendedThread,
	getVendorInstance,
	unpackThreadsFromFiles,
} from "../utils/grabbing";
import { $loggerMutations } from "./logger";

const MAX_QUEUE_SIZE = 30;

type FilesStore = {
	files: ExtendedFiles;
	loading: boolean;
	fromCache: boolean;
};

type ThreadsWithVendor = (ExtendedThread & { vendor: VendorMethods })[];

const cache = createCache<ExtendedFiles>("media", CACHE_TTL.ONE_HOUR);
const cachedValue = cache.read();
const isCacheEmpty = !cachedValue;

export const $files = map<FilesStore>({
	files: cachedValue || [],
	loading: isCacheEmpty,
	fromCache: !isCacheEmpty,
});

onMount($files, () => {
	isCacheEmpty && fetch().catch(console.error);
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

				const vendor = getVendorInstance(schemaItem.vendor);
				const threadsResponse = await vendor.fetchThreads(board.name);

				threads.push(
					...threadsResponse.map(thread => ({
						...thread,
						vendor,
						countFiles: 0,
						vendorName: schemaItem.vendor,
					})),
				);
			}

			return threads;
		}),
	);

	const files: ExtendedFiles = [];
	const threads = clearThreadsByExclude(threadsMap.flat(), $excludeRules.get()) as ThreadsWithVendor;

	const fetchPartial = async (): Promise<void> => {
		const threadsPart = threads.splice(0, MAX_QUEUE_SIZE);
		if (!threadsPart.length) return;

		const filesPartMap = await Promise.all(
			threadsPart.map(async ({ vendor, vendorName, ...thread }) => {
				$loggerMutations.write(`Получение файлов из треда: ${thread.id}`);
				const files = await vendor.fetchFiles(thread);
				return files.map(file => ({
					...file,
					rootThread: { ...file.rootThread, vendorName, countFiles: 0 },
				}));
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

const countFiles = action($files, "countFiles", (_, thread: ExtendedThread) => {
	const { files } = $files.get();
	return files.reduce((acc, f) => acc + +compareThreads(f.rootThread, thread), 0);
});

export const $mediaMutations = { fetch, countFiles };

export const $filteredFiles = computed([$files, $excludeRules], (media, exclude) => {
	return clearFilesByExclude(media.files, exclude);
});

export const $threads = computed([$files, $excludeRules], ({ files }, exclude) => {
	return clearThreadsByExclude(unpackThreadsFromFiles(files), exclude);
});
