import {
	Box,
	Input,
	Button,
	Heading,
	Text,
	Tag,
	ButtonGroup,
	Tooltip,
	notificationService,
} from "@hope-ui/solid";
import { createEffect, createMemo, createSignal, For } from "solid-js";
import { useStore } from "@nanostores/solid";
import { $threads } from "../stores/media";
import { Empty } from "../components/Empty";
import { ExtendedThread } from "../utils/grabbing";
import { useNavigate } from "@solidjs/router";
import { ImEyeBlocked } from "solid-icons/im";
import { ImBlocked } from "solid-icons/im";
import { $excludeRulesMutations } from "../stores/excludeRules";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";

type ThreadCard = {
	thread: ExtendedThread;
};

function ThreadCard(props: ThreadCard) {
	const navigate = useNavigate();

	const navigateToThread = () => {
		navigate(`/thread/${props.thread.board}/${props.thread.id}`);
	};

	const handleAddToExcludeThreads = () => {
		$excludeRulesMutations.addThread({ id: props.thread.id, board: props.thread.board });

		notificationService.show({
			title: "Добавлено в исключения",
			description: "Тред и его файлы скрыты",
		});
	};

	const handleAddToExcludeWords = () => {
		if (!props.thread.subject) return;

		$excludeRulesMutations.addWord(props.thread.subject);

		notificationService.show({
			title: "Добавлено в бан ворды",
			description: "Все треды и файлы с этим набором слов скрыты",
		});
	};

	return (
		<Box
			css={{
				gap: 12,
				display: "flex",
				alignItems: "center",
			}}
		>
			<Box>
				<Tag size="sm" colorScheme={props.thread.vendorName === "2ch" ? "warning" : "success"}>
					{props.thread.vendorName}
				</Tag>
			</Box>

			<Box
				as="button"
				css={{
					borderRadius: 5,
					py: 8,
					px: 16,
					flex: "1 1 0",
					color: "$neutral11",
					cursor: "pointer",
					overflow: "hidden",
					textAlign: "left",
					whiteSpace: "nowrap",
					textOverflow: "ellipsis",
					backgroundColor: "$neutral2",
				}}
				onClick={navigateToThread}
			>
				{props.thread.subject || <Text color="$neutral8">Тред без имени</Text>}
			</Box>

			<Tag css={{ width: 40 }}>{props.thread.countFiles}</Tag>

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
	);
}

const LIMIT = 20;

export function PageThreads() {
	const [searchQuery, setSearchQuery] = createSignal("");
	const [getPage, setPage] = createSignal(1);

	const threads = useStore($threads);

	const threadsForRender = createMemo(() =>
		threads()
			.filter((thread) => thread.subject?.toLowerCase().includes(searchQuery().toLowerCase()))
			.slice(0, getPage() * LIMIT),
	);

	let loadMoreRef: HTMLDivElement;

	const visible = createVisibilityObserver({ threshold: 0.8 })(() => loadMoreRef);

	createEffect(() => {
		visible() && setPage((v) => v + 1);
	});

	return (
		<Box p={16}>
			<Heading mb={24}>Список тредов</Heading>

			<form onReset={() => setSearchQuery("")} style={{ display: "flex", gap: "12px" }}>
				<Input
					size="sm"
					value={searchQuery()}
					width={300}
					onInput={({ currentTarget }) => setSearchQuery(currentTarget.value)}
					placeholder="Поиск тредов"
				/>
				<Button type="reset" size="sm" colorScheme="warning" variant="dashed">
					Сбросить
				</Button>
			</form>

			<Box mt={24}>
				{!!threadsForRender().length && (
					<Text color="$neutral9" fontSize="0.8em" mb={8}>
						Тредов: {threadsForRender().length}
					</Text>
				)}

				<Box css={{ display: "flex", flexDirection: "column", gap: 12 }}>
					<For each={threadsForRender()} fallback={<Empty>Список тредов пуст</Empty>}>
						{(thread) => <ThreadCard thread={thread} />}
					</For>

					<div ref={loadMoreRef!} />
				</Box>
			</Box>
		</Box>
	);
}
