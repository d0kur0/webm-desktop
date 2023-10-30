import { Badge, Box, Button, ButtonGroup, IconButton } from "@hope-ui/solid";
import { useNavigate } from "@solidjs/router";
import { IoClose } from "solid-icons/io";
import { onMount, createMemo, onCleanup, createEffect } from "solid-js";
import { ExtendedFile, isFileImage } from "../utils/grabbing";
import { Player } from "./Player";

const { ipcRenderer } = window.require("electron");

type FileViewerProps = {
	file: ExtendedFile;
	closable?: boolean;
	onClose?(): void;
	fromThread?: boolean;

	onNext?: () => void;
	onPrev?: () => void;
};

export function FileViewer(props: FileViewerProps) {
	const isImage = createMemo(() => isFileImage(props.file));
	const navigate = useNavigate();

	const listener = (event: KeyboardEvent) => {
		event.key === "Escape" && props.onClose?.();
		event.key === "ArrowLeft" && props.onPrev?.();
		event.key === "ArrowRight" && props.onNext?.();
	};

	onMount(() => window.addEventListener("keydown", listener));
	onCleanup(() => window.removeEventListener("keydown", listener));

	const navigateToThread = () => {
		navigate(`/thread/${props.file.rootThread.board}/${props.file.rootThread.id}`);
	};

	createEffect(() => {
		ipcRenderer.send("discord/changeActivity", JSON.parse(JSON.stringify(props.file)));
	});

	return (
		<Box
			css={{
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				zIndex: 144,
				position: "absolute",
				background: "$background",
			}}
		>
			<Box
				css={{
					p: 16,
					height: 52,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Box css={{ color: "$neutral10", display: "flex", flex: "1 1 0", alignItems: "center" }}>
					<Box css={{ flex: "1 1 0", fontSize: "0.8em" }}>
						<Box>
							<Box css={{ display: "flex", gap: 6, alignItems: "center" }}>
								<Badge
									css={{ fontSize: "0.7em" }}
									colorScheme={props.file.rootThread.vendorName === "4chan" ? "success" : "warning"}
								>
									{props.file.rootThread.vendorName}/{props.file.rootThread.board}/
								</Badge>

								<Badge css={{ fontSize: "0.7em" }} colorScheme={isImage() ? "accent" : "info"}>
									{isImage() ? "image" : "video"}
								</Badge>

								{props.file.name.substring(0, 120) || "Файл без имени"}
							</Box>
							<Box>
								<b>thread:</b> {props.file.rootThread.subject?.substring(0, 120)}
							</Box>
						</Box>
					</Box>

					<ButtonGroup size="xs" colorScheme="info" variant="dashed" ml={16}>
						{props.fromThread || <Button onClick={navigateToThread}>Открыть тред</Button>}

						{props.closable && (
							<Box>
								<IconButton
									size="xs"
									icon={<IoClose />}
									variant="outline"
									onClick={props.onClose}
									aria-label="close"
									colorScheme="warning"
								/>
							</Box>
						)}
					</ButtonGroup>
				</Box>
			</Box>

			<Box
				css={{
					height: "calc(100vh - (var(--window-header-height) + 52px))",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Player onNext={props.onNext} onPrev={props.onPrev} file={props.file} />
			</Box>
		</Box>
	);
}
