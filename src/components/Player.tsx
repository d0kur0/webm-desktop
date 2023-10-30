import { Box, Button, ButtonGroup, Spinner } from "@hope-ui/solid";
import { AiOutlineCloudDownload } from "solid-icons/ai";
import { FaRegularCopy } from "solid-icons/fa";
import { FaSolidVolumeHigh } from "solid-icons/fa";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "solid-icons/tb";
import { createEffect, createMemo, createSignal, JSX } from "solid-js";
import { ExtendedFile, isFileImage } from "../utils/grabbing";
import { VsDebugPause, VsPlay } from "solid-icons/vs";

function formatSeconds(seconds: number) {
	if (isNaN(seconds)) return "...";
	const minutes = Math.floor(seconds / 60);
	seconds = Math.floor(seconds % 60);
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export function Player(props: { file: ExtendedFile; onNext?: () => void; onPrev?: () => void }) {
	const [getError, setError] = createSignal(false);
	const [getPaused, setPaused] = createSignal(true);
	const [getVolume, setVolume] = createSignal(localStorage.volume !== undefined ? +localStorage.volume : 0.5);
	const [getLoading, setLoading] = createSignal(true);
	const [getDuration, setDuration] = createSignal(0);
	const [getCurrentTime, setCurrentTime] = createSignal(0);

	const isImage = createMemo(() => isFileImage(props.file));

	let videoRef: HTMLVideoElement;

	const togglePaused = () => {
		videoRef.paused ? videoRef.play() : videoRef.pause();
	};

	const handleChangeVolume: JSX.ChangeEventHandler<HTMLInputElement, Event> = (event) => {
		setVolume(+event.target.value);
		localStorage.volume = event.target.value;
	};

	const handleChangeCurrentTime: JSX.EventHandlerUnion<HTMLVideoElement, Event> = (event) => {
		setCurrentTime(event.currentTarget.currentTime);
	};

	const handleChangeDuration: JSX.EventHandlerUnion<HTMLVideoElement, Event> = (event) => {
		setDuration(event.currentTarget.duration);
	};

	const handleRewind: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (event) => {
		setCurrentTime(+event.currentTarget.value);
		videoRef.currentTime = +event.currentTarget.value;
	};

	const handleCopy = async () => {
		await navigator.clipboard.writeText(props.file.url);
	};

	const handleDownload = async () => {
		const response = await fetch(props.file.url);
		const blob = await response.blob();

		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = props.file.url.split("/").pop() || props.file.name;
		link.click();
		link.remove();
	};

	createEffect(() => {
		videoRef && (videoRef.volume = getVolume());
	});

	createEffect(() => {
		console.log(props.file);
		setLoading(true);
	});

	return (
		<Box css={{ height: "100%", backgroundColor: "#000", position: "relative" }}>
			{isImage() || (
				<Box
					autoplay
					loop
					onPlay={() => setPaused(false)}
					onPause={() => setPaused(true)}
					onError={() => setError(true)}
					onCanPlay={() => setLoading(false)}
					onLoadStart={() => setLoading(true)}
					onTimeUpdate={handleChangeCurrentTime}
					onDurationChange={handleChangeDuration}
					as="video"
					ref={videoRef!}
					css={{ height: "100%", width: "100%", maxHeight: "100%" }}
					src={props.file.url}
				/>
			)}

			{isImage() && (
				<Box
					onLoad={() => setLoading(false)}
					onError={() => setError(false)}
					onLoadStart={() => setLoading(true)}
					as="img"
					src={props.file.url}
					css={{ height: "100%", width: "100%", maxHeight: "100%", objectFit: "contain" }}
				/>
			)}

			{getLoading() && (
				<Box css={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
					<Spinner thickness="4px" speed="0.65s" emptyColor="$neutral4" color="$accent10" size="xl" />
				</Box>
			)}

			{getError() && (
				<Box css={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
					Loading failed
				</Box>
			)}

			<Box
				css={{
					py: 16,
					px: 12,
					gap: 24,
					left: 0,
					width: "100%",
					color: "$neutral12",
					bottom: 0,
					display: "flex",
					opacity: "0.8",
					position: "absolute",
					fontSize: "0.9em",
					alignItems: "center",
					backgroundColor: "$neutral1",
				}}
			>
				<ButtonGroup size="sm" variant="outline" colorScheme="accent">
					<Button disabled={isImage()} onClick={togglePaused}>
						{getPaused() ? <VsPlay /> : <VsDebugPause />}
					</Button>
					<Button onClick={props.onPrev}>
						<TbPlayerTrackPrevFilled />
					</Button>
					<Button onClick={props.onNext}>
						<TbPlayerTrackNextFilled />
					</Button>
				</ButtonGroup>

				<Box css={{ fontWeight: "bolder" }}>{formatSeconds(getCurrentTime())}</Box>

				<Box css={{ flex: "1 1 0", display: "flex", alignItems: "center" }}>
					<Box
						min={0}
						max={getDuration()}
						as="input"
						css={{ flex: "1 1 0" }}
						step={0.1}
						type="range"
						value={getCurrentTime()}
						disabled={isImage()}
						onInput={handleRewind}
					/>
				</Box>

				<Box css={{ fontWeight: "bolder" }}>{formatSeconds(getDuration())}</Box>

				<Box css={{ display: "flex", alignItems: "center", gap: 12 }}>
					<Box css={{ fontSize: "1.2em" }}>
						<FaSolidVolumeHigh />
					</Box>

					<Box
						as="input"
						min={0}
						max={1}
						css={{ flex: "1 1 0", width: "80px" }}
						step={0.1}
						type="range"
						value={getVolume()}
						disabled={isImage()}
						onChange={handleChangeVolume}
					/>
				</Box>

				<ButtonGroup size="sm" variant="outline" colorScheme="warning">
					<Button onClick={handleDownload}>
						<AiOutlineCloudDownload />
					</Button>
					<Button onClick={handleCopy}>
						<FaRegularCopy />
					</Button>
				</ButtonGroup>
			</Box>
		</Box>
	);
}
