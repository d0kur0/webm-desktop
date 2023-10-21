import { Box, Button, ButtonGroup, IconButton, Spinner } from "@hope-ui/solid";
import { useNavigate } from "@solidjs/router";
import { IoClose } from "solid-icons/io";
import { onMount, createMemo, createSignal, onCleanup } from "solid-js";
import { ExtendedFile, isFileImage } from "../utils/grabbing";

type FileViewerProps = {
	file: ExtendedFile;
	closable?: boolean;
	onClose?(): void;
	fromThread?: boolean;

	onNext?: () => void;
	onPrev?: () => void;
};

const centerPositionStyles = {
	top: "50%",
	left: "50%",
	zIndex: 1233,
	position: "absolute",
	transform: "translate(-50%, -50%)",
};

export function FileViewer(props: FileViewerProps) {
	const isImage = createMemo(() => isFileImage(props.file));
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = createSignal(true);
	const [isLoadingFailed, setIsLoadingFailed] = createSignal(false);

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
				<Box css={{ color: "$neutral9", display: "flex", flex: "1 1 0" }}>
					<Box css={{ flex: "1 1 0" }}>{props.file.name || "Файл без имени"}</Box>

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

			<Box css={{ height: "calc(100vh - 156px)", display: "flex", flexDirection: "column" }}>
				<Box
					css={{
						height: "100%",
						display: "flex",
						position: "relative",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{isLoading() && (
						<Box css={centerPositionStyles}>
							<Spinner />
						</Box>
					)}

					{isLoadingFailed() && <Box css={centerPositionStyles}>Loading failed</Box>}

					<Box
						css={{
							width: "100%",
							height: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{isImage() && (
							<Box
								as="img"
								css={{ height: "100%" }}
								src={props.file.url}
								alt={props.file.name}
								onLoad={() => setIsLoading(false)}
								onError={() => setIsLoadingFailed(true)}
							/>
						)}

						{isImage() || (
							<Box
								as="video"
								css={{ height: "100%", width: "100%" }}
								src={props.file.url}
								loop
								autoplay
								controls
								preload="metadata"
								onError={() => setIsLoadingFailed(true)}
								onLoadedData={() => setIsLoading(false)}
							/>
						)}
					</Box>
				</Box>
			</Box>

			<Box css={{ p: 16, display: "flex", alignItems: "center", gap: 12 }}>
				<ButtonGroup colorScheme="accent" size="xs">
					<Button onClick={props.onPrev}>prev</Button>
					<Button onClick={props.onNext}>next</Button>
				</ButtonGroup>
			</Box>
		</Box>
	);
}
