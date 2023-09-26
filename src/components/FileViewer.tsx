import { Box } from "@hope-ui/solid";
import { File } from "webm-grabber";

type FileViewerProps = {
	file: File;
};

export function FileViewer({ file }: FileViewerProps) {
	return <Box css={{ position: "fixed", top: 0, left: 0 }}>123</Box>;
}
