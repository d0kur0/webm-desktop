import { Box, Heading, Anchor } from "@hope-ui/solid";
import { createMemo, createSignal, For } from "solid-js";
import { useStore } from "@nanostores/solid";
import { $filteredFiles, $media } from "../stores/media";
import { FilePreview } from "../components/FilePreview";
import { debounce } from "@solid-primitives/scheduled";
import { EmptyMessage } from "../components/EmptyMessage";
import { useParams } from "@solidjs/router";
import { FileViewer } from "../components/FileViewer";

const PAGE_LIMIT = 30;

export function List() {
	const media = useStore($media);
	const files = useStore($filteredFiles);

	const [page, setPage] = createSignal(1);

	const { threadId } = useParams();
	const thread = createMemo(() => media().threads.find(t => t.id === +threadId));

	const usedFiles = createMemo(() => {
		if (threadId) {
			return files().filter(({ rootThread }) => rootThread.id === +threadId);
		}

		return files();
	});

	const filesForRender = createMemo(() => usedFiles().slice(0, page() * PAGE_LIMIT));

	const handleRootScroll = debounce((event: Event & { target: HTMLDivElement }) => {
		const infelicity = 100;
		const isReadyForLoad =
			event.target.scrollTop + event.target.scrollHeight + infelicity >
			event.target.scrollHeight;

		isReadyForLoad && setPage(page => page + 1);
	}, 250);

	return (
		<Box
			css={{ p: 16, overflowY: "auto", height: "calc(100vh - 56px)" }}
			onScroll={handleRootScroll as never}
		>
			<FileViewer closable file={filesForRender()[0]} />

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
					gridAutoRows: "210px",
					gridTemplateColumns: "repeat(5, 1fr)",
				}}
			>
				<For fallback={<EmptyMessage>Список пуст</EmptyMessage>} each={filesForRender()}>
					{file => <FilePreview file={file} />}
				</For>
			</Box>
		</Box>
	);
}
