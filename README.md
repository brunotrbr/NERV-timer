# NERV Timer

A NERV-inspired desktop clock, stopwatch, countdown timer, and racing-mode display. The interface runs offline in a resizable Neutralino window while preserving its original 800 x 480 (5:3) layout.

This is an independent fan project. It is not affiliated with, endorsed by, or sponsored by Khara, Gainax, or any other owner of the *Neon Genesis Evangelion* franchise. That notice does not grant permission to redistribute third-party branding or media.

## Features

- Local clock and calendar display
- Stopwatch and validated countdown timer
- Five-minute racing mode with sound and visual effects
- Audio mute control
- Offline, resizable 5:3 interface
- Portable Windows executable, unsigned NSIS installer, and Debian package

The Playwright smoke suite captures the interface at 800 x 480, 1080 x 648, and 1400 x 800 under `test-results/visual/`, providing a repeatable local visual demo after `npm test`.

## Requirements

- Node.js 20 or newer
- Windows 10/11 for the Windows portable executable and NSIS installer
- Debian 12/13 for the Debian package
- [NSIS](https://nsis.sourceforge.io/) on `PATH` when creating the Windows installer
- `dpkg-deb` when creating the Debian package

All JavaScript, fonts, images, and audio used at runtime are stored under `resources/`; the application does not require a network connection after it is built.

## Setup and development

Install the pinned dependencies and download the pinned Neutralino runtime binaries:

```sh
npm ci
npm run setup:neutralino
```

Launch the native development window:

```sh
npm run dev
```

The static application can also be hosted directly from `resources/`. Native initialization is skipped automatically in a normal browser.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs configuration validation plus browser smoke tests for the clock and date, stopwatch, countdown, racing mode, reset, audio controls, offline assets, and responsive 5:3 scaling.

`npm run build` creates an embedded-resource portable executable and copies the versioned Windows x64 artifact to `dist/release/`.
Close a portable build before rebuilding it so Windows can replace the executable.

Create the platform installer or package on its corresponding operating system:

```sh
npm run package:windows
npm run package:debian
```

The resulting versioned files are placed in `dist/release/`:

- `nerv-timer-1.0.0-windows-x64.exe`
- `nerv-timer-setup-1.0.0-windows-x64.exe`
- `nerv-timer-1.0.0-debian-x64.deb`

Windows installers are unsigned. The Debian package declares WebKitGTK 4.1 with a WebKitGTK 4.0 fallback.

Release assets also include `SHA256SUMS`. Verify a downloaded artifact with `sha256sum -c SHA256SUMS` on Linux or compare it with `Get-FileHash -Algorithm SHA256` on Windows.

## Releases

Push a tag matching the package version, such as `v1.0.0`. The GitHub Actions workflow validates that the tag, `package.json`, and `neutralino.config.json` versions agree, runs the smoke tests, builds x64 artifacts on Windows and Linux, generates SHA-256 checksums, and publishes them to a GitHub release. Download published builds from the repository's **Releases** page.

## Manual acceptance

Before publishing, verify the portable executable on Windows 10 and 11. Also verify NSIS install, Start Menu and desktop shortcuts, launch, title-bar **X** shutdown, **Alt+F4** shutdown, minimize/maximize behavior, absence of a background process after closing, and uninstall.

On Debian 12 and 13, inspect the package with `dpkg-deb --info`, then verify installation, the desktop launcher, WebKitGTK runtime loading, audio, launch, and removal.

## Known limitations

- Windows binaries and installers are not code-signed.
- Platform installation and uninstall checks require real Windows 10/11 and Debian 12/13 systems and are not replaced by browser automation.
- Public distribution requires the maintainer to confirm redistribution rights for all retained artwork, fonts, and audio.

## Provenance and credits

The timer originated in work by Cristián Salinas and was later adapted and packaged by Bruno Trindade Bragança and other NERV Timer contributors. Git history remains the authoritative contributor record.

The runtime vendors [Howler.js](https://howlerjs.com/) and includes a Yahoo UI CSS reset notice in `resources/style.css`. Retained fonts, images, icons, and audio must have their redistribution rights confirmed before a public release. See [CONTRIBUTING.md](CONTRIBUTING.md) for the asset policy.

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request and [SECURITY.md](SECURITY.md) before reporting a vulnerability. Community participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE)
