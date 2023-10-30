const path = require("path");
const fs = require("node:fs/promises");

module.exports = {
	packagerConfig: {
		asar: true,
		icon: "./icons/icon",
	},
	rebuildConfig: {},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {
				setupIcon: "./icons/icon.ico",
			},
		},
		{
			name: "@electron-forge/maker-zip",
			platforms: ["darwin"],
			config: {
				options: {
					icon: "./icons/icon.icns",
				},
			},
		},
		{
			name: "@electron-forge/maker-deb",
			config: {
				options: {
					icon: "./icons/icon.png",
				},
			},
		},
		{
			name: "@electron-forge/maker-rpm",
			config: {
				options: {
					icon: "./icons/icon.png",
				},
			},
		},
	],
	plugins: [
		{
			name: "@electron-forge/plugin-auto-unpack-natives",
			config: {},
		},
	],
	hooks: {
		packageAfterPrune: async (_config, buildPath) => {
			const gypPath = path.join(buildPath, "node_modules", "register-scheme", "build", "node_gyp_bins");
			await fs.rm(gypPath, { recursive: true, force: true });
		},
	},
};
