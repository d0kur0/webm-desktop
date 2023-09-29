module.exports = {
	branches: ["master"],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/github",
			{
				assets: [
					{ path: "dist_windows/squirrel.windows/x64/webm-desktop-${nextRelease.version} Setup.exe" },
					{ path: "dist_macos/zip/darwin/x64/webm-desktop-darwin-x64-${nextRelease.version}.zip" },
					{ path: "dist_linux/deb/x64/webm-desktop_${nextRelease.version}_amd64.deb" },
					{ path: "dist_linux/rpm/x64/webm-desktop-${nextRelease.version}-1.x86_64.rpm" },
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
