import {
	Box,
	Input,
	Button,
	Heading,
	List,
	ListIcon,
	ListItem,
	Text,
	Badge,
} from "@hope-ui/solid";
import { createMemo, createSignal, For } from "solid-js";
import { useStore } from "@nanostores/solid";
import { $media } from "../stores/media";
import { Link } from "@solidjs/router";

export function Threads() {
	const [searchQuery, setSearchQuery] = createSignal("");

	const media = useStore($media);

	const threads = createMemo(() =>
		media().threads.filter(
			thread => thread.subject?.toLowerCase().includes(searchQuery().toLowerCase()),
		),
	);

	return (
		<Box p={16} pt={0}>
			<Heading mb={24}>Список тредов</Heading>

			<form onreset={() => setSearchQuery("")} style={{ display: "flex", gap: "12px" }}>
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
				{!!threads().length && (
					<Text color="$neutral9" fontSize="0.8em" mb={8}>
						Тредов: {threads().length}
					</Text>
				)}

				<List spacing="$3">
					<For
						each={threads()}
						fallback={
							<Box
								p={12}
								border="2px dashed $neutral7"
								display="flex"
								borderRadius="8px"
								color="$neutral9"
								alignItems="center"
								justifyContent="center">
								Список тредов пуст
							</Box>
						}>
						{thread => (
							<ListItem>
								<Link href={`/thread/${thread.id}`}>
									<Badge
										colorScheme={thread.vendorName === "2ch" ? "warning" : "success"}
										mr={8}>
										{thread.vendorName}
									</Badge>
									{thread.subject?.substring(0, 120) || (
										<Text as="span" color="$neutral9">
											Тред без названия
										</Text>
									)}
								</Link>
							</ListItem>
						)}
					</For>
				</List>
			</Box>
		</Box>
	);
}
