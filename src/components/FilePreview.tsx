import { Box, Spinner } from "@hope-ui/solid";
import { createEffect, createMemo, createSignal } from "solid-js";
import { ExtendedFile, isFileImage } from "../utils/grabbing";
import { JSX } from "solid-js";

type FilePreviewProps = {
	file: ExtendedFile;
	onOpen?(): void;
	fromThread?: boolean;
};

const centerPositionStyles = {
	top: "50%",
	left: "50%",
	position: "absolute",
	transform: "translate(-50%, -50%)",
};

const mediaElementStyles: JSX.CSSProperties = {
	width: "100%",
	height: "100%",
	position: "absolute",
	top: 0,
	left: 0,
	"object-fit": "cover",
};

const badgeStyles = {
	display: "block",
	backgroundColor: "rgba(54,54,54,0.87)",
	padding: "2px 5px",
	borderRadius: 5,
	fontWeight: "bolder",
	fontSize: "0.6em",
};

export function FilePreview(props: FilePreviewProps) {
	const [isInViewport, setIsInViewport] = createSignal(true);

	const isImage = createMemo(() => isFileImage(props.file));

	const width = createMemo(() => props.file.width);
	const height = createMemo(() => props.file.height);

	const [isLoading, setIsLoading] = createSignal(true);
	const [isLoadingFailed, setIsLoadingFailed] = createSignal(false);

	let rootRef: HTMLDivElement;

	createEffect(() => {
		if (!rootRef) return;

		const options = {
			root: null,
			rootMargin: "0px",
		};

		const observer = new IntersectionObserver(([element]) => {
			setIsInViewport(element.isIntersecting);
		}, options);

		observer.observe(rootRef);

		return () => observer.disconnect();
	});

	return (
		<Box
			ref={rootRef!}
			css={{ "aspect-ratio": `${width()}/${height()}`, padding: "10px" }}
			onClick={props.onOpen}
		>
			<Box
				css={{
					width: "100%",
					height: "100%",
					cursor: "pointer",
					position: "relative",
				}}
			>
				{isInViewport() && (
					<>
						<Box css={{ position: "absolute", top: 3, left: 3, zIndex: 12, display: "flex", gap: 6 }}>
							<Box css={badgeStyles}>{isImage() ? "image" : "video"}</Box>
							{props.fromThread || (
								<>
									<Box css={badgeStyles}>/{props.file.rootThread.board}/</Box>
									<Box css={badgeStyles}>{props.file.rootThread.vendorName}</Box>
								</>
							)}
						</Box>

						<Box
							css={{
								gap: 6,
								left: 0,
								bottom: 3,
								zIndex: 12,
								display: "flex",
								position: "absolute",
								maxWidth: "100%",
							}}
						>
							<Box css={{ width: "100%", maxWidth: "100%", overflow: "hidden", padding: "0 5px" }}>
								<Box
									css={{
										...badgeStyles,
										width: "99%",
										overflow: "hidden",
										whiteSpace: "nowrap",
										textOverflow: "ellipsis",
									}}
								>
									{props.file.name}
								</Box>
							</Box>
						</Box>

						{isImage() && (
							<img
								src={props.file.url}
								alt="preview image"
								style={mediaElementStyles}
								onLoad={() => setIsLoading(false)}
								onError={() => setIsLoadingFailed(true)}
							/>
						)}

						{isImage() || (
							<video
								src={`${props.file.url}#t=0.1`}
								style={mediaElementStyles}
								preload="metadata"
								onError={() => setIsLoadingFailed(true)}
								onLoadedData={() => setIsLoading(false)}
							/>
						)}

						{isLoading() && (
							<Box css={centerPositionStyles}>
								<Spinner />
							</Box>
						)}

						{isLoadingFailed() && <Box css={centerPositionStyles}>Loading failed</Box>}
					</>
				)}
			</Box>
		</Box>
	);
}
