import {
	Box,
	List,
	ListItem,
	ListIcon,
	Heading,
	Switch,
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
import { $schema, $schemaActions, $schemaChanged } from "../stores/schema";
import { For } from "solid-js";
import { TbHash } from "solid-icons/tb";
import { $fileTypes, $fileTypesActions } from "../stores/fileTypes";
import { $media, fetchMedia } from "../stores/media";
import { FaSolidHashtag } from "solid-icons/fa";
import { $filter } from "../stores/filter";
import { IoClose } from "solid-icons/io";

const switchRootClass = css({
	display: "inline-flex",
	alignItems: "center",
	border: "1px solid $neutral7",
	rounded: "$sm",
	px: "$5",
	py: "$3",
	w: "$full",
	cursor: "pointer",
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
	backgroundColor: "$blackAlpha9",
	borderRadius: "9999px",
	position: "relative",
	boxShadow: "0 2px 10px $colors$blackAlpha7",
	transition: "background-color 250ms",

	_groupChecked: {
		backgroundColor: "$info9",
	},
});

const switchThumbClass = css({
	display: "block",
	width: 20,
	height: 20,
	backgroundColor: "white",
	borderRadius: "9999px",
	boxShadow: "0 0 2px $colors$blackAlpha7",
	transition: "transform 250ms",
	transform: "translate(-4px, -4px)",
	willChange: "transform",

	_checked: {
		transform: "translate(16px, -4px)",
	},
});

export function Main() {
	const media = useStore($media);
	const schema = useStore($schema);
	const filter = useStore($filter);
	const fileTypes = useStore($fileTypes);
	const schemaChanged = useStore($schemaChanged);

	const handleToggleBoard = $schemaActions.toggleBoardEnabled;
	const handleToggleFileType = $fileTypesActions.toggle;
	const handleUpdateFiles = async () => {
		await fetchMedia();
		$schemaChanged.set(false);
	};

	return (
		<Box p={16} css={{ display: "flex", gap: "32px" }}>
			<Box css={{ flex: "1 1 0" }}>
				<Heading>Используемые борды</Heading>

				<Text my={10} fontSize=".9em" color="$neutral9">
					Борды, с которых собирать файлы
				</Text>

				<List spacing="$3" mt={12}>
					<For each={schema()}>
						{({ vendor, boards }) => (
							<>
								<ListItem css={{ fontWeight: "bolder" }}>
									<ListIcon as={BsSignIntersectionSideFill} color="$info9" />
									{vendor}
								</ListItem>

								{boards.map(board => (
									<ListItem>
										<SwitchPrimitive
											checked={board.enabled}
											onChange={() => handleToggleBoard(vendor, board.name)}
											class={switchRootClass()}>
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
								))}
							</>
						)}
					</For>
				</List>

				{schemaChanged() && (
					<Button
						w="$full"
						my={24}
						onClick={handleUpdateFiles}
						variant="dashed"
						colorScheme="warning"
						size="sm">
						Обновить файлы
					</Button>
				)}

				<Heading mt={24}>Используемые типы файлов</Heading>

				<Text my={6} fontSize=".9em" color="$neutral9">
					Расширения файлов для поиска
				</Text>

				<List spacing="$3" mt={12}>
					<For each={fileTypes()}>
						{type => (
							<ListItem>
								<SwitchPrimitive
									checked={type.enabled}
									onChange={() => handleToggleFileType(type.name)}
									class={switchRootClass()}>
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

			<Box css={{ flex: "1 1 0" }}>
				<Heading mb={18} display="flex" justifyContent="space-between">
					<Box>Бан ворды</Box>
					<Button size="xs" onClick={() => prompt("pizda?")}>
						Добавить
					</Button>
				</Heading>

				<Text my={16} fontSize=".9em" color="$neutral9">
					Словарь для исключения тредов и файлов, которые их содержат
				</Text>

				<For
					each={filter()}
					fallback={
						<Text textAlign="center" p={15} border="1px dashed" color="$neutral9" borderColor="$neutral7">
							Список пуст
						</Text>
					}>
					{word => (
						<Box
							my={12}
							px={16}
							py={8}
							borderRadius="6px"
							border="1px dashed"
							borderColor="$neutral7"
							display="flex"
							justifyContent="space-between">
							<Box>{word}</Box>
							<Box>
								<IconButton
									size="xs"
									icon={<IoClose />}
									variant="dashed"
									aria-label="remove"
									colorScheme="danger"
								/>
							</Box>
						</Box>
					)}
				</For>
			</Box>

			<Box css={{ flex: "1 1 0" }}>
				<Heading>Сводка</Heading>

				<List spacing="$3" mt={16}>
					<ListItem>
						<ListIcon as={FaSolidHashtag} color="$success9" />
						Найдено тредов: {media().threads.length}
					</ListItem>
					<ListItem>
						<ListIcon as={FaSolidHashtag} color="$success9" />
						Найдено файлов: {media().files.length}
					</ListItem>
				</List>
			</Box>
		</Box>
	);
}
