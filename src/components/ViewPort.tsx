import { Box } from "@hope-ui/solid";
import { JSXElement } from "solid-js";

export function ViewPort(props: { children: JSXElement }) {
	return (
		<Box
			css={{
				height: "calc(100vh - var(--window-header-height))",
				overflowY: "auto",
				position: "relative",
			}}
		>
			{props.children}
		</Box>
	);
}
