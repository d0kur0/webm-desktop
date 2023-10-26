const { app, BrowserWindow, session, shell } = require("electron");
const path = require("path");
const fs = require("fs/promises");

if (require("electron-squirrel-startup")) {
	app.quit();
}

if (process.platform === "win32") app.setAppUserModelId(app.getName());

fs.readdir(path.join(__dirname, "events")).then(files => {
	try {
		files.map(file => require(path.join(__dirname, `events/${file}`)));
	} catch (e) {
		console.error(e)
	}
});

const isDev = process.env.NODE_ENV === "development";

const createWindow = () => {
	app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

	const mainWindow = new BrowserWindow({
		frame: false,
		width: 1240,
		height: 780,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			webSecurity: false,
		},
	});

	mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				"Content-Security-Policy": ["media-src: 'self'"],
			},
		});
	});

	isDev && mainWindow.loadURL("http://localhost:3000");
	isDev || mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));

	const filter = {
		urls: ["https://*.github.com/*", "https://*.4cdn.org/*"],
	};

	session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
		callback({ requestHeaders: {} });
	});

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("http")) shell.openExternal(url).catch(console.error);
		return { action: "deny" };
	});
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
