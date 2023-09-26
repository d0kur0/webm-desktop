import { Box } from "@hope-ui/solid";
import { JSXElement } from "solid-js";

type EmptyMessageProps = {
	children: JSXElement;
};

export function EmptyMessage({ children }: EmptyMessageProps) {
	return (
		<Box
			p={12}
			border="2px dashed $neutral7"
			display="flex"
			borderRadius="8px"
			color="$neutral9"
			alignItems="center"
			justifyContent="center">
			{children}
		</Box>
	);
}
