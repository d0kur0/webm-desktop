import {
	Box,
	Heading,
	Anchor,
	Tooltip,
	Button,
	ButtonGroup,
	notificationService,
	Switch,
} from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";
import { useStore } from "@nanostores/solid";
import { $filteredFiles, $threads } from "../stores/media";
import { debounce } from "@solid-primitives/scheduled";
import { useParams } from "@solidjs/router";
import { FileViewer } from "../components/FileViewer";
import { createMasonryBreakpoints, Mason } from "solid-mason";
import { FilePreview } from "../components/FilePreview";
import { ImBlocked, ImEyeBlocked } from "solid-icons/im";
import { $excludeRulesMutations } from "../stores/excludeRules";
import { $hoverPreview, $hoverPreviewActions } from "../stores/settings";

const PAGE_LIMIT = 70;

export function PageListFiles() {
	const { board, threadId } = useParams();
	const hoverPreview = useStore($hoverPreview);

	const files = useStore($filteredFiles);
	const threads = useStore($threads);

	const [page, setPage] = createSignal(1);
	const [getOpenedFileIndex, setOpenedFileIndex] = createSignal<number | null>(null);

	const thread = createMemo(() => threads().find((t) => t.id === +threadId && t.board === board));

	const usedFiles = createMemo(() => {
		if (!threadId) return files();
		return files().filter(({ rootThread }) => rootThread.id === +threadId);
	});

	const openedFile = createMemo(() => usedFiles()[getOpenedFileIndex()!]);

	const filesForRender = createMemo(() => usedFiles().slice(0, page() * PAGE_LIMIT));

	const handleRootScroll = debounce((event: Event & { target: HTMLDivElement }) => {
		const isReadyForLoad = event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight;
		isReadyForLoad && setPage((page) => page + 1);
	}, 250);

	const breakpoints = createMasonryBreakpoints(() => [
		{ query: "(min-width: 1536px)", columns: 6 },
		{ query: "(min-width: 1280px) and (max-width: 1536px)", columns: 5 },
		{ query: "(min-width: 1024px) and (max-width: 1280px)", columns: 4 },
		{ query: "(min-width: 768px) and (max-width: 1024px)", columns: 3 },
		{ query: "(max-width: 768px)", columns: 2 },
	]);

	const handlePrev = () => {
		setOpenedFileIndex((v) => (v !== null ? (v - 1 < 0 ? v : v - 1) : v));
	};

	const handleNext = () => {
		setOpenedFileIndex((v) => (v !== null ? (usedFiles().length < v + 1 ? v : v + 1) : v));
	};

	const handleAddToExcludeThreads = () => {
		const threadInfo = thread();
		if (!threadInfo) return;

		$excludeRulesMutations.addThread({ id: threadInfo.id, board: threadInfo.board });

		notificationService.show({
			title: "Добавлено в исключения",
			description: "Тред и его файлы скрыты",
		});
	};

	const handleAddToExcludeWords = () => {
		const threadInfo = thread();

		if (!threadInfo?.subject) {
			return notificationService.show({
				title: "Ошибка",
				status: "danger",
				description: "Тред невозможно добавить в бан-ворды, нет сабжа, попробуй скрыть по ID",
			});
		}

		$excludeRulesMutations.addWord(threadInfo.subject);

		notificationService.show({
			title: "Добавлено в бан ворды",
			description: "Все треды и файлы с этим набором слов скрыты",
		});
	};

	return (
		<Box
			css={{ p: 16, overflowY: "auto", height: "calc(100vh - 56px)" }}
			onScroll={handleRootScroll as never}
		>
			{getOpenedFileIndex() !== null && (
				<FileViewer
					file={openedFile()!}
					onClose={() => setOpenedFileIndex(null)}
					onPrev={handlePrev}
					onNext={handleNext}
					closable
					fromThread={!!thread()}
				/>
			)}

			<Heading
				css={{
					mb: 12,
					display: "flex",
					overflow: "hidden",
					alignItems: "top",
					whiteSpace: "nowrap",
					textOverflow: "ellipsis",
				}}
			>
				<Box css={{ flex: "1 1 0" }}>{threadId ? thread()?.subject : "Список файлов"}</Box>
				<Box css={{ mb: 12, display: "flex", alignItems: "center", gap: 6 }}>
					<Switch
						size="sm"
						checked={hoverPreview()}
						onChange={$hoverPreviewActions.toggle}
						colorScheme="accent"
					>
						Live preview
					</Switch>
				</Box>
			</Heading>

			{threadId && (
				<Box css={{ mb: 16, mt: "-10px", color: "$neutral9", fontSize: "0.8em", display: "flex" }}>
					<Box css={{ flex: "1 1 0" }}>
						<Box>Файлов в треде: {usedFiles().length}</Box>
						<Box>
							<Anchor external href={thread()?.url}>
								Открыть источник
							</Anchor>
						</Box>
					</Box>
					<Box>
						<ButtonGroup size="sm" variant="dashed" colorScheme="warning">
							<Tooltip withArrow label="Исключить тред по ID">
								<Button onClick={handleAddToExcludeThreads}>
									<ImEyeBlocked />
								</Button>
							</Tooltip>

							<Tooltip withArrow label="Добавить тред в бан ворды">
								<Button onClick={handleAddToExcludeWords}>
									<ImBlocked />
								</Button>
							</Tooltip>
						</ButtonGroup>
					</Box>
				</Box>
			)}

			<Mason style={{ margin: "0 -10px" }} as="div" items={filesForRender()} columns={breakpoints()}>
				{(file, index) => (
					<FilePreview fromThread={!!thread()} onOpen={() => setOpenedFileIndex(index)} file={file} />
				)}
			</Mason>
		</Box>
	);
}
