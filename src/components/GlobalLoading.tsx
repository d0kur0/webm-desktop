import { Box, Spinner } from "@hope-ui/solid";
import { useStore } from "@nanostores/solid";
import { $status } from "../stores/media";

export function GlobalLoading() {
	const status = useStore($status);

	return (
		<Box
			css={{
				height: "calc(100vh - 52px)",
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				justifyContent: "center",
			}}>
			<Box>
				<Spinner thickness="4px" speed="0.65s" emptyColor="$neutral4" color="$info10" size="xl" />
			</Box>

			<Box mt={12}>Обновление списка тредов и файлов</Box>

			<Box my={12} fontSize="0.9em" color="$neutral9">
				Получение тредов с 4chan - долгий процесс
			</Box>

			<Box mt={12} css={{ fontSize: "0.7em" }}>
				state: {status()}
			</Box>
		</Box>
	);
}
