import { Box, Heading, Anchor } from "@hope-ui/solid";
import { createMemo, createSignal, For } from "solid-js";
import { useStore } from "@nanostores/solid";
import { $filteredFiles, $threads } from "../stores/media";
import { FilePreview } from "../components/FilePreview";
import { debounce } from "@solid-primitives/scheduled";
import { Empty } from "../components/Empty";
import { useParams } from "@solidjs/router";
import { File } from "webm-grabber";
import { FileViewer } from "../components/FileViewer";

const PAGE_LIMIT = 30;

export function PageListFiles() {
	const files = useStore($filteredFiles);
	const threads = useStore($threads);

	const [openedFile, setOpenedFile] = createSignal<File | null>(null);

	const [page, setPage] = createSignal(1);

	const { threadId } = useParams();
	const thread = createMemo(() => threads().find(t => t.id === +threadId));

	const usedFiles = createMemo(() => {
		if (!threadId) return files();
		return files().filter(({ rootThread }) => rootThread.id === +threadId);
	});

	const filesForRender = createMemo(() => usedFiles().slice(0, page() * PAGE_LIMIT));

	const handleRootScroll = debounce((event: Event & { target: HTMLDivElement }) => {
		const isReadyForLoad = event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight;
		isReadyForLoad && setPage(page => page + 1);
	}, 250);

	return (
		<Box
			css={{ p: 16, overflowY: "auto", height: "calc(100vh - 56px)" }}
			onScroll={handleRootScroll as never}
		>
			{openedFile() && (
				<FileViewer
					file={openedFile()!}
					closable
					onClose={() => setOpenedFile(null)}
					fromThread={!!thread()}
				/>
			)}

			<Heading mb={12}>{threadId ? thread()?.subject : "Список файлов"}</Heading>

			{threadId && (
				<Box css={{ mb: 16, mt: "-10px", color: "$neutral9", fontSize: "0.8em" }}>
					<Box>Файлов в треде: {usedFiles().length}</Box>
					<Box>
						<Anchor external href={thread()?.url}>
							Открыть источник
						</Anchor>
					</Box>
				</Box>
			)}

			<Box
				css={{
					gap: 25,
					display: "grid",
					gridAutoRows: "15vw",
					gridTemplateColumns: "repeat(5, 1fr)",
				}}
			>
				<For fallback={<Empty>Список пуст</Empty>} each={filesForRender()}>
					{file => <FilePreview onOpen={() => setOpenedFile(file)} file={file} />}
				</For>
			</Box>
		</Box>
	);
}
