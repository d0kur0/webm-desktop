import { action, atom } from "nanostores";

export type LogRecord = {
	time: Date;
	message: string;
};

export const $logger = atom<LogRecord[]>([]);

const write = action($logger, "write", (store, message: string) => {
	store.set([...store.get(), { time: new Date(), message }]);
});

const clear = action($logger, "clear", store => {
	store.set([]);
});

export const $loggerMutations = { write, clear };
