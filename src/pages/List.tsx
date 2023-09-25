import { Box, Heading, AspectRatio } from "@hope-ui/solid";
import { createMemo, createSignal, For } from "solid-js";
import { useStore } from "@nanostores/solid";
import { $media } from "../stores/media";
import { Player } from "../components/Player";
import { debounce } from "@solid-primitives/scheduled";

const PAGE_LIMIT = 24;

export function List() {
	const media = useStore($media);
	const [page, setPage] = createSignal(1);

	const files = createMemo(() => media().files.slice(0, page() * PAGE_LIMIT));

	const handleRootScroll = debounce((event: Event & { target: HTMLDivElement }) => {
		const infelicity = 100;
		const isReadyForLoad =
			event.target.scrollTop + event.target.scrollHeight + infelicity >
			event.target.scrollHeight;

		isReadyForLoad && setPage(page => page + 1);
	}, 250);

	return (
		<Box
			p={16}
			pt={0}
			onScroll={handleRootScroll as never}
			overflowY="auto"
			height="calc(100vh - 52px)">
			<Heading mb={12}>Список файлов</Heading>

			<Box
				display="grid"
				gridAutoRows="260px"
				gridTemplateColumns="repeat(4, 1fr)"
				gap="25px">
				<For
					fallback={
						<Box
							p={12}
							border="2px dashed $neutral7"
							display="flex"
							borderRadius="8px"
							color="$neutral9"
							alignItems="center"
							justifyContent="center">
							Список пуст
						</Box>
					}
					each={files()}>
					{file => <Player file={file} />}
				</For>
			</Box>
		</Box>
	);
}
