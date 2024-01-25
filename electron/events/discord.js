const { ipcMain } = require("electron");

ipcMain.on("discord/changeActivity", (event, file) => {
	console.log("not implemented", event, file);
});
