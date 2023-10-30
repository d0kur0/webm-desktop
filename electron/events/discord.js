const { ipcMain } = require("electron");
const { register, Client } = require("discord-rpc");

const clientId = "1166773524380274788";
register(clientId);

const rpc = new Client({ transport: "ipc" });
rpc.login({ clientId }).catch(console.error);

ipcMain.on("discord/changeActivity", (event, file) => {
	queueMicrotask(async () => {
		try {
			await rpc.setActivity({
				state: file.name,
				details: `/${file.rootThread.board} - ${file.rootThread.subject}`.slice(0, 127),
				buttons: [{ label: "Get source", url: file.url }],
				largeImageKey: file.previewUrl,
				smallImageKey: file.previewUrl,
				largeImageText: file.name,
				smallImageText: file.name,
			});
		} catch (e) {
			// Поебать
		}
	});
});
