export enum CACHE_TTL {
	UNLIMITED,
	ONE_HOUR = 3600,
	ONE_DAY = 86400,
}

export type CacheStruct<T> = {
	data: T;
	updatedAt: number;
};

export function getTimestamp() {
	return Math.floor(Date.now() / 1000);
}

type ReadResult<T> = [T, boolean, boolean];

export function createCache<T>(cacheKey: string, TTL: CACHE_TTL = CACHE_TTL.UNLIMITED) {
	return {
		read(fallback: T): ReadResult<T> {
			const cacheValue = localStorage.getItem(cacheKey);

			if (cacheValue === null) {
				return [fallback, false, false];
			}

			const cachedStruct = JSON.parse(cacheValue) as CacheStruct<T>;
			const isCacheExpired = getTimestamp() - TTL > cachedStruct.updatedAt;

			return [cachedStruct.data, true, isCacheExpired];
		},
		write(value: T) {
			const cacheStruct: CacheStruct<T> = {
				data: value,
				updatedAt: getTimestamp(),
			};

			localStorage.setItem(cacheKey, JSON.stringify(cacheStruct));
		},
	};
}
