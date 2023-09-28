import { Box, Button, ButtonGroup, ButtonProps, IconButton, notificationService } from "@hope-ui/solid";
import { useNavigate } from "@solidjs/router";
import { IoClose } from "solid-icons/io";
import { File } from "webm-grabber";
import { $filterActions } from "../stores/filter";
import { isFileImage } from "../stores/media";
import { createMemo, onMount } from "solid-js";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "solid-icons/tb";

type FileViewerProps = {
	file: File;
	onClose?(): void;
	closable?: boolean;
};

export function FileViewer(props: FileViewerProps) {
	const isImage = createMemo(() => isFileImage(props.file));
	const navigate = useNavigate();

	const handleHideThread = () => {
		props.file.rootThread.subject && $filterActions.add(props.file.rootThread.subject);

		notificationService.show({
			title: "Сабж треда добавлен в бан ворды, все файлы скрыты",
			status: "success",
		});

		props.onClose?.();
	};

	const navigateToThread = () => {
		navigate(`/thread/${props.file.rootThread.id}`);
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
				<Box css={{ color: "$neutral9", display: "flex" }}>
					<Box>{props.file.name || "Файл без имени"}</Box>

					<ButtonGroup size="xs" colorScheme="info" variant="dashed" ml={16}>
						<Button onClick={navigateToThread}>Открыть тред</Button>
						<Button onClick={handleHideThread}>Добавить тред в бан ворды</Button>
					</ButtonGroup>
				</Box>
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
			</Box>

			<Box css={{ height: "calc(100vh - 106px)", display: "flex", flexDirection: "column" }}>
				<Box
					css={{
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Box
						css={{
							width: "100%",
							height: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{isImage() && <ImagePlayer file={props.file} />}
						{isImage() || <VideoPlayer file={props.file} />}
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

type PlayerProps = {
	file: File;
	onNext?(): void;
	onPrev?(): void;
};

function ImagePlayer(props: PlayerProps) {
	return (
		<Box
			css={{
				position: "relative",
				width: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Box
				css={{
					height: "calc(100vh - 104px)",
				}}
				as="img"
				src={props.file.url}
				alt={props.file.name}
			/>

			<Box
				css={{
					gap: 2,
					left: 10,
					bottom: 10,
					display: "flex",
					position: "absolute",
					alignItems: "center",
				}}
			>
				<CustomPlayerButton onClick={props.onPrev}>
					<TbPlayerTrackPrevFilled />
				</CustomPlayerButton>
				<CustomPlayerButton onClick={props.onNext}>
					<TbPlayerTrackNextFilled />
				</CustomPlayerButton>
			</Box>
		</Box>
	);
}

function VideoPlayer(props: PlayerProps) {
	let videoRef: HTMLVideoElement;

	const handleVolumeChange = () => {
		localStorage.videoVolume = videoRef.volume;
	};

	const handleTimeUpdate = () => {
		videoRef.removeAttribute("controls");
		videoRef.setAttribute("controls", "");
	};

	onMount(() => {
		videoRef && (videoRef.volume = +localStorage.videoVolume || 0.5);
	});

	return (
		<Box css={{ width: "100%", height: "100%", position: "relative" }}>
			<Box
				as="video"
				ref={(el: HTMLVideoElement) => (videoRef = el)}
				css={{
					width: "100%",
					height: "calc(100vh - 104px)",
				}}
				src={props.file.url}
				poster={props.file.previewUrl}
				autoplay
				controls
				onTimeUpdate={handleTimeUpdate}
				onVolumeChange={handleVolumeChange}
			/>

			<Box
				css={{
					gap: 2,
					left: 130,
					bottom: 30,
					display: "flex",
					position: "absolute",
					alignItems: "center",
				}}
			>
				<CustomPlayerButton onClick={props.onPrev}>
					<TbPlayerTrackPrevFilled />
				</CustomPlayerButton>
				<CustomPlayerButton onClick={props.onNext}>
					<TbPlayerTrackNextFilled />
				</CustomPlayerButton>
			</Box>
		</Box>
	);
}

function CustomPlayerButton(props: ButtonProps) {
	return (
		<Box
			{...props}
			as="button"
			css={{
				color: "#fff",
				width: 36,
				cursor: "pointer",
				height: 36,
				margin: 0,
				border: "none",
				display: "flex",
				padding: 0,
				lineHeight: 0,
				transition: "0.3s",
				alignItems: "center",
				borderRadius: "100%",
				justifyContent: "center",
				backgroundColor: "transparent",

				_hover: {
					backgroundColor: "#1A1B1E",
				},
			}}
		/>
	);
}
