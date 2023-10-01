import {
	Box,
	List,
	ListItem,
	ListIcon,
	Heading,
	Input,
	SwitchPrimitive,
	css,
	Text,
	VStack,
	SwitchPrimitiveThumb,
	Button,
	IconButton,
} from "@hope-ui/solid";
import { BsSignIntersectionSideFill } from "solid-icons/bs";
import { useStore } from "@nanostores/solid";
import { $schema, $schemaChanged, $schemaMutations } from "../stores/schema";
import { For } from "solid-js";
import { $fileTypes, $fileTypesMutations } from "../stores/fileTypes";
import { $mediaMutations, $filteredFiles, $threads } from "../stores/media";
import { FaSolidHashtag } from "solid-icons/fa";
import { $excludeRules, $excludeRulesMutations } from "../stores/excludeRules";
import { IoClose } from "solid-icons/io";
import { Empty } from "../components/Empty";

const switchRootClass = css({
	w: "$full",
	px: "$5",
	py: "$3",
	border: "1px solid $neutral7",
	cursor: "pointer",
	display: "inline-flex",
	rounded: "$sm",
	alignItems: "center",
	userSelect: "none",
	transition: "box-shadow 250ms",

	_focus: {
		borderColor: "$primary7",
		shadow: "0 0 0 3px $colors$primary5",
	},
});

const switchControlClass = css({
	all: "unset",
	width: 34,
	height: 12,
	position: "relative",
	boxShadow: "0 2px 10px $colors$blackAlpha7",
	transition: "background-color 250ms",
	borderRadius: "9999px",
	backgroundColor: "$blackAlpha9",

	_groupChecked: {
		backgroundColor: "$info9",
	},
});

const switchThumbClass = css({
	display: "block",
	width: 20,
	height: 20,
	boxShadow: "0 0 2px $colors$blackAlpha7",
	transform: "translate(-4px, -4px)",
	transition: "transform 250ms",
	willChange: "transform",
	borderRadius: "9999px",
	backgroundColor: "white",

	_checked: {
		transform: "translate(16px, -4px)",
	},
});

export function PageDashBoard() {
	const files = useStore($filteredFiles);
	const exclude = useStore($excludeRules);
	const schema = useStore($schema);
	const threads = useStore($threads);
	const fileTypes = useStore($fileTypes);
	const schemaChanged = useStore($schemaChanged);

	const handleToggleBoard = $schemaMutations.toggleBoardEnabled;
	const handleToggleFileType = $fileTypesMutations.toggleTypeEnabled;

	const handleUpdateFiles = async () => {
		await $mediaMutations.fetch();
		$schemaChanged.set(false);
	};

	const handleAddFilterWord = (event: SubmitEvent) => {
		event.preventDefault();
		const target = event.currentTarget as HTMLFormElement;
		const formData = new FormData(target);
		const word = formData.get("word");
		if (!word) return;
		$excludeRulesMutations.addWord(word.toString());
		target.reset();
	};

	const handleRemoveExcludeWord = (index: number) => {
		$excludeRulesMutations.removeWordByKey(index);
	};

	return (
		<Box css={{ p: 16, display: "flex", gap: 32 }}>
			<Box css={{ flex: "2 1 0" }}>
				<Heading css={{ display: "flex" }}>
					<Box css={{ flex: "1 1 0" }}>Используемые борды</Box>
					{schemaChanged() && (
						<Text css={{ color: "$neutral10", fontSize: "0.8em", mr: 12 }}>Схема была изменена</Text>
					)}
					<Button size="xs" onClick={handleUpdateFiles} variant="dashed" colorScheme="warning">
						Обновить файлы
					</Button>
				</Heading>

				<Text css={{ my: 10, fontSize: "0.9em", color: "$neutral9" }}>Борды, с которых собирать файлы</Text>

				<Box css={{ display: "flex", gap: 30, mt: 8 }}>
					<For each={schema()}>
						{({ vendor, boards }) => (
							<Box css={{ flex: "1 1 0" }}>
								<Box css={{ fontWeight: "bolder" }}>
									<ListIcon as={BsSignIntersectionSideFill} color="$info9" />
									{vendor}
								</Box>

								<List spacing="$3" css={{ mt: 12 }}>
									<For each={boards}>
										{board => (
											<ListItem>
												<SwitchPrimitive
													class={switchRootClass()}
													checked={board.enabled}
													onChange={() => handleToggleBoard(vendor, board.name)}
												>
													<VStack w="$full" alignItems="flex-start">
														<Text size="sm" fontWeight="$semibold">
															/{board.name}/
														</Text>
														<Text size="xs" color="$neutral11">
															{board.description}
														</Text>
													</VStack>
													<Box class={switchControlClass()}>
														<SwitchPrimitiveThumb class={switchThumbClass()} />
													</Box>
												</SwitchPrimitive>
											</ListItem>
										)}
									</For>
								</List>
							</Box>
						)}
					</For>
				</Box>
			</Box>

			<Box css={{ flex: "1 1 0" }}>
				<Heading mb={18} display="flex" justifyContent="space-between">
					<Box>Бан ворды</Box>
					<Box>
						<form
							style={{ display: "flex", "align-items": "center", gap: "8px" }}
							onSubmit={handleAddFilterWord}
						>
							<Input required name="word" placeholder="Write here..." size="xs" />
							<Button type="submit" colorScheme="accent" size="xs">
								Добавить
							</Button>
						</form>
					</Box>
				</Heading>

				<Text my={8} fontSize=".9em" color="$neutral9">
					Словарь для исключения тредов и файлов, которые их содержат
				</Text>

				<For each={exclude().words} fallback={<Empty>Список пуст</Empty>}>
					{(word, index) => (
						<Box
							my={12}
							px={16}
							py={8}
							border="1px dashed"
							display="flex"
							borderColor="$neutral7"
							borderRadius="6px"
							justifyContent="space-between"
						>
							<Box>{word}</Box>
							<Box>
								<IconButton
									size="xs"
									icon={<IoClose />}
									onClick={() => handleRemoveExcludeWord(index())}
									variant="dashed"
									aria-label="remove"
									colorScheme="danger"
								/>
							</Box>
						</Box>
					)}
				</For>

				<Heading>Сводка</Heading>

				<List spacing="$3" mt={16}>
					<ListItem>
						<ListIcon as={FaSolidHashtag} color="$success9" />
						Найдено тредов: {threads().length}
					</ListItem>
					<ListItem>
						<ListIcon as={FaSolidHashtag} color="$success9" />
						Найдено файлов: {files().length}
					</ListItem>
				</List>

				<Heading mt={24}>Используемые типы файлов</Heading>

				<Text css={{ my: 10, fontSize: "0.9em", color: "$neutral9" }}>Расширения файлов для поиска</Text>

				<List spacing="$3" mt={12}>
					<For each={fileTypes()}>
						{type => (
							<ListItem>
								<SwitchPrimitive
									checked={type.enabled}
									onChange={() => handleToggleFileType(type.name)}
									class={switchRootClass()}
								>
									<VStack w="$full" alignItems="flex-start">
										<Text size="sm" fontWeight="$semibold">
											{type.name}
										</Text>
									</VStack>
									<Box class={switchControlClass()}>
										<SwitchPrimitiveThumb class={switchThumbClass()} />
									</Box>
								</SwitchPrimitive>
							</ListItem>
						)}
					</For>
				</List>
			</Box>
		</Box>
	);
}
