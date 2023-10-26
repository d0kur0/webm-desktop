const { ipcMain } = require("electron");
const { register, Client } = require('discord-rpc');

const clientId = '1166773524380274788';
register(clientId);

const rpc = new Client({ transport: 'ipc' });

ipcMain.on("discord/changeActivity", (event, fileJson) => {
	console.log("Activity changed", fileJson);
	const file = JSON.parse(fileJson);

	rpc.setActivity({
		details: `/${file.rootThread.board} - ${file.rootThread.subject}`,
		state: file.name,
		largeImageKey: file.previewUrl,
		largeImageText: file.name,
		smallImageKey: file.previewUrl,
		smallImageText: file.name,
		buttons: [
			{ label: 'Get source', url: file.url }
		],
	});
});

rpc.login({ clientId }).catch(console.error);
