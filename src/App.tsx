import { Route, Routes } from "@solidjs/router";
import { NotificationsProvider, globalCss, HopeProvider, Box } from "@hope-ui/solid";
import { useStore } from "@nanostores/solid";
import { $media } from "./stores/media";
import { Match, Switch } from "solid-js";
import { GlobalLoading } from "./components/GlobalLoading";
import { Main } from "./pages/Main";
import { WindowBar } from "./components/WindowBar";
import { Threads } from "./pages/Threads";
import { List } from "./pages/List";
import { Shuffle } from "./pages/Shuffle";

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
			<Route path="/list" component={List} />
			<Route path="/threads" component={Threads} />
			<Route path="/thread/:threadId" component={List} />
			<Route path="/shuffle" component={Shuffle} />
		</Routes>
	);
}

export function App() {
	globalStyles();

	const media = useStore($media);

	return (
		<HopeProvider config={{ initialColorMode: "system" }}>
			<NotificationsProvider placement="bottom">
				<WindowBar />

				<Switch>
					<Match when={media().loading}>
						<GlobalLoading />
					</Match>

					<Match when={!media().loading}>
						<Box height="calc(100vh - 52px)" overflowY="auto" position="relative">
							<Routing />
						</Box>
					</Match>
				</Switch>
			</NotificationsProvider>
		</HopeProvider>
	);
}
