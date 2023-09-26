import {
	Box,
	Button,
	ButtonGroup,
	IconButton,
	notificationService,
} from "@hope-ui/solid";
import { useNavigate } from "@solidjs/router";
import { IoClose } from "solid-icons/io";
import { File } from "webm-grabber";
import { $filterActions } from "../stores/filter";
import { createMemo } from "solid-js";
import { isFileImage } from "../stores/media";

type FileViewerProps = {
	file: File;
	onClose?(): void;
	closable?: boolean;
};

export function FileViewer({ file, closable, ...props }: FileViewerProps) {
	const isImage = isFileImage(file);
	const navigate = useNavigate();

	const handleHideThread = () => {
		file.rootThread.subject && $filterActions.add(file.rootThread.subject);

		notificationService.show({
			title: "Сабж треда добавлен в бан ворды",
			status: "success",
		});
	};

	const navigateToThread = () => {
		navigate(`/thread/${file.rootThread.id}`);
	};

	return (
		<Box
			css={{
				px: 16,
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
					height: 52,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Box css={{ color: "$neutral9", display: "flex" }}>
					<Box>{file.name || "Файл без имени"}</Box>

					<ButtonGroup size="xs" colorScheme="info" variant="dashed" ml={16}>
						<Button onClick={navigateToThread}>Открыть тред</Button>
						<Button onClick={handleHideThread}>Добавить тред в бан ворды</Button>
					</ButtonGroup>
				</Box>
				{closable && (
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

			<Box
				css={{ height: "calc(100vh - 106px)", display: "flex", flexDirection: "column" }}
			>
				<Box
					css={{
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{isImage && (
						<Box
							css={{
								width: "100%",
								height: "calc(100vh - 176px)",
							}}
							as="img"
							src={file.url}
							alt={file.name}
						/>
					)}
					{isImage || (
						<Box
							css={{
								height: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Box
								as="video"
								css={{
									width: "100%",
									height: "calc(100vh - 176px)",
								}}
								src={file.url}
								poster={file.previewUrl}
								controls
							/>
						</Box>
					)}
				</Box>
				<Box css={{ py: 24 }}>Her pizda e6lan</Box>
			</Box>
		</Box>
	);
}
