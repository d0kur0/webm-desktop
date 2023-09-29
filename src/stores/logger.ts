import { action, atom } from "nanostores";

export type LogRecord = {
	time: Date;
	message: string;
};

export const $logger = atom<LogRecord[]>([]);

export const $loggerWrite = action($logger, "write", (store, message: string) => {
	store.set([...store.get(), { time: new Date(), message }]);
});

export const $loggerClear = action($logger, "clear", store => {
	store.set([]);
});
