import { Route, Routes } from "@solidjs/router";
import { NotificationsProvider, HopeProvider, Box } from "@hope-ui/solid";
import { useStore } from "@nanostores/solid";
import { $files } from "./stores/media";
import { ErrorBoundary, Match, Switch } from "solid-js";
import { MediaLoading } from "./components/MediaLoading";
import { PageDashBoard } from "./pages/PageDashBoard";
import { WindowBar } from "./components/WindowBar";
import { PageThreads } from "./pages/PageThreads";
import { PageListFiles } from "./pages/PageListFiles";
import { PageShuffleFile } from "./pages/PageShuffleFile";
import "./App.css";
import { ViewPort } from "./components/ViewPort";

function Routing() {
	return (
		<Routes>
			<Route path="/" component={PageDashBoard} />
			<Route path="/list" component={PageListFiles} />
			<Route path="/threads" component={PageThreads} />
			<Route path="/thread/:board/:threadId" component={PageListFiles} />
			<Route path="/shuffle" component={PageShuffleFile} />
		</Routes>
	);
}

export function App() {
	const media = useStore($files);

	return (
		<HopeProvider config={{ initialColorMode: "system" }}>
			<NotificationsProvider placement="bottom">
				<WindowBar />

				<ErrorBoundary fallback={err => <Box css={{ p: 16 }}>{err.toString()}</Box>}>
					<Switch>
						<Match when={media().loading}>
							<MediaLoading />
						</Match>

						<Match when={!media().loading}>
							<ViewPort>
								<Routing />
							</ViewPort>
						</Match>
					</Switch>
				</ErrorBoundary>
			</NotificationsProvider>
		</HopeProvider>
	);
}
