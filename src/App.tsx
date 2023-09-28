import { Route, Routes } from "@solidjs/router";
import { NotificationsProvider, HopeProvider, Box } from "@hope-ui/solid";
import { useStore } from "@nanostores/solid";
import { $media } from "./stores/media";
import { ErrorBoundary, Match, Switch } from "solid-js";
import { GlobalLoading } from "./components/GlobalLoading";
import { PageDashBoard } from "./pages/PageDashBoard";
import { WindowBar } from "./components/WindowBar";
import { PageThreads } from "./pages/PageThreads";
import { PageListFiles } from "./pages/PageListFiles";
import { PageShuffleFile } from "./pages/PageShuffleFile";
import "./App.css";

function Routing() {
	return (
		<Routes>
			<Route path="/" component={PageDashBoard} />
			<Route path="/list" component={PageListFiles} />
			<Route path="/threads" component={PageThreads} />
			<Route path="/thread/:threadId" component={PageListFiles} />
			<Route path="/shuffle" component={PageShuffleFile} />
		</Routes>
	);
}

export function App() {
	const media = useStore($media);

	return (
		<HopeProvider config={{ initialColorMode: "system" }}>
			<NotificationsProvider placement="bottom">
				<WindowBar />

				<ErrorBoundary fallback={err => <Box css={{ p: 16 }}>{err.toString()}</Box>}>
					<Switch>
						<Match when={media().loading}>
							<GlobalLoading />
						</Match>

						<Match when={!media().loading}>
							<Box
								css={{
									height: "calc(100vh - var(--window-header-height))",
									overflowY: "auto",
									position: "relative",
								}}
							>
								<Routing />
							</Box>
						</Match>
					</Switch>
				</ErrorBoundary>
			</NotificationsProvider>
		</HopeProvider>
	);
}
