const { ipcMain } = require("electron");
const { getMainWindow } = require("../utils/getMainWindow");

ipcMain.on("debug/openTools", () => {
	const webView = getMainWindow().webContents;
	webView.isDevToolsOpened() ? webView.closeDevTools() : webView.openDevTools();
});
