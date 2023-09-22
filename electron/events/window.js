const { BrowserWindow, ipcMain } = require("electron");

function getMainWindow() {
	return BrowserWindow.getAllWindows()?.[0];
}

ipcMain.on("window/minimize", () => {
	getMainWindow().minimize();
});

ipcMain.on("window/toggleFullscreen", () => {
	const mainWindow = getMainWindow();
	mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

ipcMain.on("window/close", () => {
	getMainWindow().close();
});
