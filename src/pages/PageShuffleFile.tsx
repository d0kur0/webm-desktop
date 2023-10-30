import { useStore } from "@nanostores/solid";
import { $filteredFiles } from "../stores/media";
import { createMemo, createSignal } from "solid-js";
import { FileViewer } from "../components/FileViewer";

export function PageShuffleFile() {
	const files = useStore($filteredFiles);
	const shuffledFiles = createMemo(() => files().toSorted(() => Math.random() - 0.5));

	const [getOpenedFileIndex, setOpenedFileIndex] = createSignal<number>(0);
	const openedFile = createMemo(() => shuffledFiles()[getOpenedFileIndex()!]);

	const handlePrev = () => {
		setOpenedFileIndex((v) => (v - 1 < 0 ? v : v - 1));
	};

	const handleNext = () => {
		setOpenedFileIndex((v) => (shuffledFiles().length < v + 1 ? v : v + 1));
	};

	return <FileViewer file={openedFile()!} onPrev={handlePrev} onNext={handleNext} fromThread={false} />;
}
