module.exports = {
	branches: ["master"],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/github",
			{
				assets: [
					{ path: "./dist_windows/squirrel.windows/x64/**.exe" },
					{ path: "./dist_macos/zip/darwin/x64/**.zip" },
					{ path: "./dist_linux/deb/x64/**.deb" },
					{ path: "./dist_linux/rpm/x64/**.rpm" },
				],
			},
		],
		[
			"@semantic-release/changelog",
			{
				changelogFile: "CHANGELOG.md",
			},
		],
		[
			"@semantic-release/npm",
			{
				npmPublish: false,
			},
		],
		[
			"@semantic-release/git",
			{
				assets: ["package.json", "CHANGELOG.md"],
				message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
			},
		],
	],
};
