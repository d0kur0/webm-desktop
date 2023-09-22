import { Route, Routes } from "@solidjs/router";
import { Box, globalCss, HopeProvider } from "@hope-ui/solid";
import { useStore } from "@nanostores/solid";
import { $media } from "./stores/media";
import { Match, Switch } from "solid-js";
import { GlobalLoading } from "./components/GlobalLoading";
import { Main } from "./pages/Main";
import { WindowBar } from "./components/WindowBar";

const globalStyles = globalCss({
	"*": {
		margin: 0,
		padding: 0,
	},
});

function Routing() {
	return (
		<Routes>
			<Route path="/" component={Main} />
		</Routes>
	);
}

export function App() {
	globalStyles();

	const media = useStore($media);

	return (
		<HopeProvider config={{ initialColorMode: "system" }}>
			<WindowBar />

			<Switch>
				<Match when={media().loading}>
					<GlobalLoading />
				</Match>

				<Match when={!media().loading}>
					<Routing />
				</Match>
			</Switch>
		</HopeProvider>
	);
}
