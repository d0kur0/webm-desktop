import {
	Box,
	Button,
	ButtonGroup,
	IconButton,
	SystemStyleObject,
	useColorMode,
} from "@hope-ui/solid";
import { VsChromeMinimize } from "solid-icons/vs";
import { CgMinimizeAlt } from "solid-icons/cg";
import { IoClose } from "solid-icons/io";
import { FiMaximize2, FiSun } from "solid-icons/fi";
import { createSignal, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { FaSolidMoon } from "solid-icons/fa";
import { RiDevelopmentBugFill } from "solid-icons/ri";

const { ipcRenderer } = require("electron");

const css: SystemStyleObject = {
	scale: "0.8",
	padding: "0",
	borderRadius: "50%",
};

const initialPages = [
	{
		href: "/",
		title: "Дашборда",
		active: true,
	},
	{
		href: "/shuffle",
		title: "Рандомач",
		active: false,
	},
	{
		href: "/list",
		title: "Списком",
		active: false,
	},
	{
		href: "/threads",
		title: "Треды",
		active: false,
	},
];

export function WindowBar() {
	const { colorMode, toggleColorMode } = useColorMode();
	const navigate = useNavigate();

	const [isFullscreen, setIsFullscreen] = createSignal(false);
	const [isDevToolsOpened, setIsDevToolsOpened] = createSignal(false);

	const handleMinimize = () => {
		ipcRenderer.send("window/minimize");
	};

	const handleToggleFullScreen = () => {
		ipcRenderer.send("window/toggleFullscreen");
		setIsFullscreen(v => !v);
	};

	const handleCloseWindow = () => {
		ipcRenderer.send("window/close");
	};

	const [pages, setPages] = createSignal(initialPages);

	const handleGotoPage = (index: number) => {
		setPages(pages => pages.map((page, key) => ({ ...page, active: index === key })));
		const { href } = pages()[index];
		href && navigate(href);
	};

	const openDevTools = () => {
		setIsDevToolsOpened(v => !v);
		ipcRenderer.send("debug/openTools");
	};

	return (
		<>
			<Box
				css={{
					top: "0",
					lefT: "0",
					width: "100%",
					zIndex: "200",
					height: "52px",
					display: "flex",
					padding: "0 15px",
					position: "fixed",
					useSelect: "none",
					alignItems: "center",
					backgroundColor: "$background",
				}}>
				<ButtonGroup variant="outline" spacing="$2" display="flex" alignItems="center">
					<For each={pages()}>
						{({ title, active }, index) => (
							<Button
								variant="outline"
								onClick={() => handleGotoPage(index())}
								colorScheme={active ? "info" : undefined}
								size="xs">
								{title}
							</Button>
						)}
					</For>
				</ButtonGroup>

				<Box css={{ "-webkit-app-region": "drag", flex: "1 1 0", height: "100%" }} />

				<Box css={{ display: "flex", alignItems: "center" }}>
					<IconButton
						colorScheme={isDevToolsOpened() ? "warning" : undefined}
						css={css}
						variant="dashed"
						icon={<RiDevelopmentBugFill />}
						size="sm"
						aria-label="open dev tools"
						onClick={openDevTools}
					/>

					<IconButton
						css={css}
						variant="dashed"
						icon={colorMode() === "dark" ? <FiSun /> : <FaSolidMoon />}
						size="sm"
						mr={24}
						aria-label="toggle theme"
						onClick={toggleColorMode}
					/>

					<IconButton
						css={css}
						size="xs"
						icon={<VsChromeMinimize />}
						onClick={handleMinimize}
						aria-label="minimize"
						colorScheme="success"
					/>

					<IconButton
						css={css}
						size="xs"
						icon={isFullscreen() ? <CgMinimizeAlt /> : <FiMaximize2 />}
						onClick={handleToggleFullScreen}
						aria-label="toggle full screen"
						colorScheme="warning"
					/>

					<IconButton
						css={css}
						size="xs"
						icon={<IoClose />}
						onClick={handleCloseWindow}
						aria-label="close window"
						colorScheme="danger"
					/>
				</Box>
			</Box>

			<Box css={{ height: "52px" }}></Box>
		</>
	);
}
