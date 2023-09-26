import { File } from "webm-grabber";
import { Badge, Box, css, Spinner } from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";
import { getVendorName, IMAGE_TYPES, isFileImage } from "../stores/media";

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

const badgeStyles = {
	fontSize: "0.5rem",
};

function stringLengthLimiter(string: string, maxLength = 36) {
	return `${string.substring(0, maxLength)}${string.length > maxLength ? "..." : ""}`;
}

export function FilePreview(props: FilePreviewProps) {
	const isImage = isFileImage(props.file);
	const vendorNameOfFile = getVendorName(props.file);

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
						<Badge colorScheme={isImage ? "neutral" : "primary"} css={badgeStyles}>
							{isImage ? "Image" : "Video"}
						</Badge>

						<Badge
							colorScheme={vendorNameOfFile ? "warning" : "success"}
							css={badgeStyles}
						>
							{vendorNameOfFile}
						</Badge>

						<Badge colorScheme="accent" css={badgeStyles}>
							{props.file.name}
						</Badge>
					</Box>

					<Box css={{ position: "absolute", bottom: 5, left: 5 }}>
						<Badge colorScheme="info" css={badgeStyles}>
							{stringLengthLimiter(props.file.rootThread.subject || "")}
						</Badge>
					</Box>
				</>
			)}
		</button>
	);
}
