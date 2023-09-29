module.exports = {
	branches: ["master"],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/github",
			{
				assets: [
					{ path: "gh_assets/webm-desktop_setup_amd64.exe", label: "Windows Installer" },
					{ path: "gh_assets/webm-desktop-darwin-x64.zip", label: "MacOS app" },
					{ path: "gh_assets/webm-desktop_amd64.deb", label: "Installer for Debian-based distro" },
					{ path: "gh_assets/webm-desktop-1.x86_64.rpm", label: "Installer for RHat-based distro" },
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
