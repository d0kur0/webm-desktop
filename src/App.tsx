import { Route, Routes } from "@solidjs/router";
import { NotificationsProvider, HopeProvider, Box, Heading, Anchor, Button } from "@hope-ui/solid";
import { useStore } from "@nanostores/solid";
import { $files } from "./stores/media";
import { ErrorBoundary, Match, onMount, Switch } from "solid-js";
import { MediaLoading } from "./components/MediaLoading";
import { PageDashBoard } from "./pages/PageDashBoard";
import { WindowBar } from "./components/WindowBar";
import { PageThreads } from "./pages/PageThreads";
import { PageListFiles } from "./pages/PageListFiles";
import { PageShuffleFile } from "./pages/PageShuffleFile";
import "./App.css";
import { ViewPort } from "./components/ViewPort";

const { ipcRenderer } = window.require("electron");

function ErrorScreen(props: { err: Error }) {
	return (
		<Box css={{ p: 16, px: 42 }}>
			<Heading css={{ fontSize: "2rem" }}>Какая-то ошибка</Heading>

			<Box css={{ mt: 24 }}>
				Какая-то рантайм ошибка, скорее всего потому, что разработчик сделал что-то хуево. <br />
				Если возникает часто и хочется фикса, можно создать ишью{" "}
				<Anchor css={{ color: "$accent10" }} external href="https://github.com/d0kur0/webm-desktop/issues">
					гитхабе
				</Anchor>{" "}
				программы.
			</Box>

			<Button onClick={location.reload} css={{ mt: 24 }} colorScheme="warning">
				Перезагрузить страницу
			</Button>

			<Heading css={{ fontSize: "1.5rem", mt: 24 }}>Отладочная инфа</Heading>

			<Box css={{ mt: 19, backgroundColor: "$neutral5", p: 15, borderRadius: 15 }}>
				<Box>{props.err?.name}</Box>
				<Box>{props.err?.cause as never}</Box>
				<Box>{props.err?.message}</Box>
				<Box>{props.err?.stack}</Box>
			</Box>
		</Box>
	);
}

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

	onMount(() => {
		ipcRenderer.send("window/setupSizes");
	});

	return (
		<HopeProvider config={{ initialColorMode: "system" }}>
			<NotificationsProvider placement="bottom">
				<WindowBar />

				<ErrorBoundary fallback={(err) => <ErrorScreen err={err} />}>
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
