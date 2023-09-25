const { BrowserWindow } = require("electron");

module.exports.getMainWindow = function getMainWindow() {
	return BrowserWindow.getAllWindows()?.[0];
};
