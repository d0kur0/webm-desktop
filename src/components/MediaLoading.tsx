import { Box, Spinner } from "@hope-ui/solid";
import { useStore } from "@nanostores/solid";
import { $logger } from "../stores/logger";
import { createMemo, For } from "solid-js";

const parentStyles = {
	height: "calc(100vh - var(--window-header-height))",
	display: "flex",
	alignItems: "center",
	flexDirection: "column",
	justifyContent: "center",
};

const logsContainerStyles = {
	px: 16,
	py: 8,
	width: 500,
	height: 200,
	fontSize: "0.7em",
	overflowY: "auto",
	borderRadius: 8,
	backgroundColor: "$neutral3",
};

export function MediaLoading() {
	const logs = useStore($logger);
	const reversedLogs = createMemo(() => logs().toReversed());

	return (
		<Box css={parentStyles}>
			<Box>
				<Spinner thickness="4px" speed="0.65s" emptyColor="$neutral4" color="$info10" size="xl" />
			</Box>

			<Box mt={12}>Обновление списка тредов и файлов</Box>

			<Box mt={24} css={logsContainerStyles}>
				<For each={reversedLogs()}>
					{(log) => (
						<Box css={{ display: "flex", gap: 12 }}>
							<Box css={{ flex: "1 1 0" }}>{log.message}</Box>
							<Box css={{ color: "$neutral10" }}>[{log.time.toLocaleTimeString()}]</Box>
						</Box>
					)}
				</For>
			</Box>
		</Box>
	);
}
