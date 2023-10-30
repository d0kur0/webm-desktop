const { ipcMain } = require("electron");
const { getMainWindow } = require("../utils/getMainWindow");

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

ipcMain.on("window/setupSizes", () => {
	getMainWindow().setSize(1240, 780);
	getMainWindow().center();
});
