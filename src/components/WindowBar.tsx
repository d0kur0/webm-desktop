import { Box, IconButton, useColorMode } from "@hope-ui/solid";
import { VsChromeMinimize } from "solid-icons/vs";
import { CgMinimizeAlt } from "solid-icons/cg";
import { IoClose } from "solid-icons/io";
import { FiMaximize2, FiSun } from "solid-icons/fi";
import { createMemo, createSignal, JSXElement } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { FaSolidMoon } from "solid-icons/fa";
import { RiDevelopmentBugFill } from "solid-icons/ri";
import { RiSystemDashboardLine } from "solid-icons/ri";
import { TbArrowsRandom } from "solid-icons/tb";
import { TbListDetails } from "solid-icons/tb";
import { BsSignIntersectionT } from "solid-icons/bs";
import { AiOutlineReload } from "solid-icons/ai";

const { ipcRenderer } = window.require("electron");

const parentStyles = {
	pl: 0,
	pr: 10,
	top: 0,
	lefT: 0,
	width: "100%",
	zIndex: "200",
	height: "var(--window-header-height)",
	display: "flex",
	position: "fixed",
	useSelect: "none",
	alignItems: "center",
	borderBottom: "1px solid $neutral6",
	backgroundColor: "$background",
};

const iconButtonStyles = {
	scale: "0.8",
	padding: "0",
	borderRadius: "50%",
};

type NavigationLinkProps = {
	href: string;
	icon?: JSXElement;
	children: JSXElement;
};

function NavigationLink(props: NavigationLinkProps) {
	const location = useLocation();
	const navigate = useNavigate();

	const isActive = createMemo(() => location.pathname === props.href);

	const handleClick = () => navigate(props.href);

	return (
		<Box
			onClick={handleClick}
			css={{
				px: 16,
				gap: 5,
				font: "inherit",
				color: isActive() ? "$accent11" : "$neutral11",
				height: "var(--window-header-height)",
				cursor: "pointer",
				display: "flex",
				fontSize: "0.8em",
				borderTop: `2px solid ${isActive() ? "$accent10" : "transparent"}`,
				transition: "0.4s",
				fontWeight: "bolder",
				alignItems: "center",
				backgroundColor: "transparent",

				_focus: {
					outline: "none",
				},
			}}
			as="button"
		>
			{props.icon && <Box css={{ fontSize: "1.2em" }}>{props.icon}</Box>}

			{props.children}
		</Box>
	);
}

export function WindowBar() {
	const { colorMode, toggleColorMode } = useColorMode();

	const [isFullscreen, setIsFullscreen] = createSignal(false);
	const [isDevToolsOpened, setIsDevToolsOpened] = createSignal(false);

	const handleMinimize = () => {
		ipcRenderer.send("window/minimize");
	};

	const handleToggleFullScreen = () => {
		ipcRenderer.send("window/toggleFullscreen");
		setIsFullscreen((v) => !v);
	};

	const handleCloseWindow = () => {
		ipcRenderer.send("window/close");
	};

	const openDevTools = () => {
		setIsDevToolsOpened((v) => !v);
		ipcRenderer.send("debug/openTools");
	};

	return (
		<>
			<Box css={parentStyles}>
				<Box css={{ display: "flex", alignItems: "center", height: "100%" }}>
					<NavigationLink icon={<RiSystemDashboardLine />} href="/">
						Дашборда
					</NavigationLink>
					<NavigationLink icon={<TbArrowsRandom />} href="/shuffle">
						Рандомач
					</NavigationLink>
					<NavigationLink icon={<TbListDetails />} href="/list">
						Списком
					</NavigationLink>
					<NavigationLink icon={<BsSignIntersectionT />} href="/threads">
						Треды
					</NavigationLink>
				</Box>

				<Box css={{ "-webkit-app-region": "drag", flex: "1 1 0", height: "100%" }} />

				<Box css={{ display: "flex", alignItems: "center" }}>
					<IconButton
						css={iconButtonStyles}
						icon={<AiOutlineReload />}
						size="sm"
						variant="dashed"
						onClick={() => location.reload()}
						aria-label="reload"
						colorScheme="success"
					/>

					<IconButton
						css={iconButtonStyles}
						icon={<RiDevelopmentBugFill />}
						size="sm"
						variant="dashed"
						onClick={openDevTools}
						aria-label="open dev tools"
						colorScheme={isDevToolsOpened() ? "warning" : undefined}
					/>

					<IconButton
						mr={24}
						css={iconButtonStyles}
						icon={colorMode() === "dark" ? <FiSun /> : <FaSolidMoon />}
						size="sm"
						variant="dashed"
						onClick={toggleColorMode}
						aria-label="toggle theme"
					/>

					<IconButton
						css={iconButtonStyles}
						size="xs"
						icon={<VsChromeMinimize />}
						onClick={handleMinimize}
						aria-label="minimize"
						colorScheme="success"
					/>

					<IconButton
						css={iconButtonStyles}
						size="xs"
						icon={isFullscreen() ? <CgMinimizeAlt /> : <FiMaximize2 />}
						onClick={handleToggleFullScreen}
						aria-label="toggle full screen"
						colorScheme="warning"
					/>

					<IconButton
						css={iconButtonStyles}
						size="xs"
						icon={<IoClose />}
						onClick={handleCloseWindow}
						aria-label="close window"
						colorScheme="danger"
					/>
				</Box>
			</Box>

			<Box css={{ height: "var(--window-header-height)" }} />
		</>
	);
}
