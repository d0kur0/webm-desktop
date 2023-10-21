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

export function createCache<T>(cacheKey: string, TTL: CACHE_TTL = CACHE_TTL.UNLIMITED) {
	let EXPIRED = false;

	return {
		get EXPIRED() {
			return EXPIRED;
		},

		read(): T | null {
			const cacheValue = localStorage.getItem(cacheKey);

			if (cacheValue === null) {
				return null;
			}

			const cachedStruct = JSON.parse(cacheValue) as CacheStruct<T>;
			const isCacheExpired =
				TTL === CACHE_TTL.UNLIMITED ? false : getTimestamp() - TTL > cachedStruct.updatedAt;

			EXPIRED = isCacheExpired;

			if (isCacheExpired) {
				return null;
			}

			return cachedStruct.data;
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
