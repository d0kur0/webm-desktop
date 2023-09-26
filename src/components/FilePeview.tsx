import { File } from "webm-grabber";
import { Badge, Box, css, Spinner } from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";

type FilePreviewProps = {
	file: File;
	onOpen?(): void;
};

const overlayStyles = css({
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	display: "flex",
	position: "absolute",
	alignItems: "center",
	borderRadius: "6px",
	justifyContent: "center",
	backgroundColor: "$neutral2",
});

const badgeStyles = css({
	fontSize: "0.5rem",
});

const IMAGE_TYPES = ["png", "jpg", "webp", "gif", "jpeg"];

function stringLengthLimiter(string: string, maxLength = 36) {
	return `${string.substring(0, maxLength)}${string.length > maxLength ? "..." : ""}`;
}

export function FilePreview(props: FilePreviewProps) {
	const fileExtension = createMemo(() => props.file.url.split("/").pop() || "");

	const is2ch = props.file.rootThread.url.includes("2ch");
	const isImage = IMAGE_TYPES.includes(fileExtension());

	const [isLoading, setIsLoading] = createSignal(true);
	const [isLoadingFailed, setIsLoadingFailed] = createSignal(false);

	return (
		<button
			style={{
				cursor: "pointer",
				position: "relative",
				overflow: "hidden",
				"border-radius": "6px",
			}}
			onClick={props.onOpen}
		>
			<img
				alt="preview image"
				src={isImage ? props.file.url : props.file.previewUrl}
				onLoad={() => setIsLoading(false)}
				onerror={() => setIsLoadingFailed(true)}
				style={{
					width: "100%",
					height: "100%",
					"object-fit": "cover",
				}}
			/>

			{isLoading() && (
				<Box class={overlayStyles()}>
					<Spinner />
				</Box>
			)}

			{isLoadingFailed() && <Box class={overlayStyles()}>Loading failed</Box>}

			{isLoading() || (
				<>
					<Box css={{ position: "absolute", top: 5, left: 5, display: "flex", gap: 8 }}>
						<Badge colorScheme={isImage ? "neutral" : "primary"} class={badgeStyles()}>
							{isImage ? "Image" : "Video"}
						</Badge>

						<Badge colorScheme={is2ch ? "warning" : "success"} class={badgeStyles()}>
							{is2ch ? "2ch" : "4chan"}
						</Badge>

						<Badge colorScheme="accent" class={badgeStyles()}>
							{props.file.name}
						</Badge>
					</Box>

					<Box css={{ position: "absolute", bottom: 0, left: 5 }}>
						<Badge colorScheme="info" class={badgeStyles()}>
							{stringLengthLimiter(props.file.rootThread.subject || "")}
						</Badge>
					</Box>
				</>
			)}
		</button>
	);
}
