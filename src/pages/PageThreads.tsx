import { Box, Input, Button, Heading, List, ListItem, Text, Badge } from "@hope-ui/solid";
import { createMemo, createSignal, For } from "solid-js";
import { useStore } from "@nanostores/solid";
import { $threads } from "../stores/media";
import { Link } from "@solidjs/router";

export function PageThreads() {
	const [searchQuery, setSearchQuery] = createSignal("");

	const threads = useStore($threads);

	const filteredThreads = createMemo(() =>
		threads().filter(thread => thread.subject?.toLowerCase().includes(searchQuery().toLowerCase())),
	);

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
				{!!filteredThreads().length && (
					<Text color="$neutral9" fontSize="0.8em" mb={8}>
						Тредов: {filteredThreads().length}
					</Text>
				)}

				<List spacing="$3">
					<For
						each={filteredThreads()}
						fallback={
							<Box
								p={12}
								border="2px dashed $neutral7"
								display="flex"
								borderRadius="8px"
								color="$neutral9"
								alignItems="center"
								justifyContent="center"
							>
								Список тредов пуст
							</Box>
						}
					>
						{thread => {
							const is2ch = thread.url.includes("2ch");

							return (
								<ListItem>
									<Link href={`/thread/${thread.id}`}>
										<Badge colorScheme={is2ch ? "warning" : "success"} mr={8}>
											{is2ch ? "2ch" : "4chan"}
										</Badge>
										{thread.subject?.substring(0, 120) || (
											<Text as="span" color="$neutral9">
												Тред без названия
											</Text>
										)}
									</Link>
								</ListItem>
							);
						}}
					</For>
				</List>
			</Box>
		</Box>
	);
}
