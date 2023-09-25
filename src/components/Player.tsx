import { File } from "webm-grabber";
import { Badge, Box, Button, CloseButton, css, Spinner } from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";
import { IconClose } from "@hope-ui/solid/dist/components/icons/IconClose";
import { IoClose } from "solid-icons/io";

type PlayerProps = {
	file: File;
	onNext?(): void;
	onPrevious?(): void;
};

const overlayStyles = css({
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	display: "flex",
	position: "absolute",
	alignItems: "center",
	borderRadius: "8px",
	justifyContent: "center",
	backgroundColor: "$neutral2",
});

const IMAGE_TYPES = ["png", "jpg", "webp", "gif", "jpeg"];

export function Player(props: PlayerProps) {
	const fileExtension = createMemo(() => props.file.url.split("/").pop() || "");

	const is2ch = props.file.rootThread.url.includes("2ch");
	const isImage = IMAGE_TYPES.includes(fileExtension());

	const [isLoading, setIsLoading] = createSignal(true);
	const [isLoadingFailed, setIsLoadingFailed] = createSignal(false);
	const [isOverlayOpened, setIsOverlayOpened] = createSignal(false);

	return (
		<>
			{isOverlayOpened() && <PlayerOverlay file={props.file} />}

			<Box onClick={() => setIsOverlayOpened(true)} position="relative" overflow="hidden">
				<img
					onerror={() => setIsLoadingFailed(true)}
					onLoad={() => setIsLoading(false)}
					style={{
						width: "100%",
						height: "100%",
						"object-fit": "cover",
						"border-radius": "8px",
					}}
					alt="preview image"
					src={isImage ? props.file.url : props.file.previewUrl}
				/>

				{isLoading() && (
					<Box class={overlayStyles()}>
						<Spinner />
					</Box>
				)}

				{isLoadingFailed() && <Box class={overlayStyles()}>Loading failed</Box>}

				{isLoading() || (
					<>
						<Box position="absolute" top="5px" left="5px" display="flex" gap="8px">
							<Badge colorScheme={isImage ? "neutral" : "primary"} fontSize="0.5rem">
								{isImage ? "Image" : "Video"}
							</Badge>

							<Badge colorScheme={is2ch ? "warning" : "success"} fontSize="0.5rem">
								{is2ch ? "2ch" : "4chan"}
							</Badge>

							<Badge colorScheme="accent" fontSize="0.5rem">
								{props.file.name}
							</Badge>
						</Box>

						<Box position="absolute" bottom="0px" left="5px">
							<Badge colorScheme="info" fontSize="0.5rem">
								{props.file.rootThread.subject}
							</Badge>
						</Box>
					</>
				)}
			</Box>
		</>
	);
}

type PlayerOverlayProps = {
	file: File;
};

function PlayerOverlay(props: PlayerOverlayProps) {
	const fileExtension = createMemo(() => props.file.url.split("/").pop() || "");
	const isImage = IMAGE_TYPES.includes(fileExtension());

	return (
		<Box
			css={{
				p: 16,
				pt: 0,
				top: 52,
				left: 0,
				width: "100%",
				height: "calc(100vh - 52px)",
				zIndex: "144",
				position: "fixed",
				backgroundColor: "$background",
			}}>
			<Button
				size="sm"
				colorScheme="danger"
				css={{ position: "absolute", top: 3, right: 16 }}>
				<IoClose />
			</Button>

			{isImage && <img src={props.file.url} alt={props.file.name} />}

			{isImage || (
				<video
					src={props.file.url}
					style={{ height: "100%" }}
					poster={props.file.previewUrl}
					controls
				/>
			)}
		</Box>
	);
}
