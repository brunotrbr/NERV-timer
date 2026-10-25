# NERV Timer — Pending Work

## Review and repository state

- [ ] Run the Reviewer stage using `.ai/prompts/reviewer.md` and record the result in `.ai/artifacts/review.md`.
- [ ] Address any `CHANGES_REQUESTED` findings and add regression tests where appropriate (maximum three correction rounds).
- [ ] Review all working-tree changes and authorized legacy-file deletions before committing.
- [ ] Normalize tracked text files to LF using `.gitattributes` and verify the resulting diff.
- [ ] Confirm the final working tree has no unmerged paths or unintended files.
- [ ] Create the commit only after review and human approval; do not push or merge automatically.

## Licensing, branding, and asset rights

- [ ] Confirm that every existing code contributor permits distribution under MIT, or preserve any applicable upstream license.
- [ ] Confirm redistribution rights for the restored Evangelion/NERV-derived application icon.
- [ ] Confirm redistribution rights for all retained franchise-derived artwork, names, logos, mottos, and interface elements.
- [ ] Confirm redistribution rights for `the-beast.mp3`, `NervShutdown.mp3`, `ping.mp3`, and `tic.mp3`.
- [ ] Confirm the license and redistribution terms for the Digital-7 font files.
- [ ] Verify attribution/license requirements for Howler.js and the Yahoo CSS reset.
- [ ] Add `THIRD_PARTY_NOTICES.md` containing all required licenses, copyright notices, sources, and attributions.
- [ ] Keep purchase receipts, license certificates, and personal records outside the public repository.
- [ ] Keep the non-affiliation notice visible if franchise-derived branding remains.

## Windows packaging and acceptance

- [ ] Install the pinned NSIS 3.12.0 toolchain on a Windows packaging host.
- [ ] Run `npm run package:windows` and verify the versioned unsigned installer in `dist/release/`.
- [ ] Inspect the installer and confirm it includes only approved runtime resources.
- [ ] Test the portable executable on Windows 10 and Windows 11.
- [ ] Test NSIS installation, Start Menu shortcut, desktop shortcut, application launch, and uninstall.
- [ ] Test title-bar **X** shutdown and confirm no background process remains.
- [ ] Test **Alt+F4** shutdown and confirm no background process remains.
- [ ] Test minimize, maximize, resize, relaunch, audio, stopwatch, countdown, and `RACING` behavior.
- [ ] Decide whether to obtain a code-signing certificate; releases remain unsigned until then.

## Debian packaging and acceptance

- [ ] Prepare a Debian 12/13 or equivalent Linux packaging environment with `dpkg-deb`.
- [ ] Run `npm run package:debian`.
- [ ] Inspect package control metadata, WebKitGTK dependencies, executable permissions, and desktop entry.
- [ ] Test installation, launcher discovery, WebKitGTK loading, audio, and launch on Debian 12.
- [ ] Test installation, launcher discovery, WebKitGTK loading, audio, and launch on Debian 13.
- [ ] Test package removal on Debian 12 and Debian 13.

## Git history sanitization

- [ ] Make a recoverable backup before rewriting history.
- [ ] Obtain explicit authorization for the Git history rewrite and any required force-push.
- [ ] Remove legacy logs, ZIP archives, WAV source files, OS metadata, hosting paths, and restricted media from all reachable history.
- [ ] Run a dedicated full-history secret scanner such as Gitleaks on the sanitized repository.
- [ ] Rotate any credential discovered during the full scan.
- [ ] Re-clone the sanitized repository and verify removed paths and objects are no longer reachable.
- [ ] If the repository is already public, document the coordinated rewrite and warn that existing clones may retain removed objects.

## GitHub repository configuration

- [ ] Add an accurate repository description and topics.
- [ ] Add a social preview image whose redistribution rights are documented.
- [ ] Enable private vulnerability reporting so `SECURITY.md` has a working private channel.
- [ ] Configure branch protection for the default branch.
- [ ] Require the validation and smoke-test checks before merge.
- [ ] Confirm GitHub recognizes the root MIT license.
- [ ] Confirm issue forms, pull-request template, Dependabot, and release workflow behave correctly on GitHub.

## CI and release validation

- [ ] Run the workflow in GitHub Actions on a pull request and confirm the Linux smoke-test job passes.
- [ ] Create a test `v*` tag matching `package.json` and `neutralino.config.json` versions.
- [ ] Confirm the tag builds Windows x64 and Debian x64 artifacts successfully.
- [ ] Confirm the release contains only the intended `.exe`, `.deb`, and `SHA256SUMS` files.
- [ ] Verify every published artifact against `SHA256SUMS`.
- [ ] Confirm the release job alone has `contents: write`; all other jobs must remain read-only.
- [ ] Review Dependabot updates before merging newer Action SHAs or npm dependencies.
- [ ] Review npm's deprecated transitive dependency warnings and blocked install-script notices after upstream package updates.
- [ ] Consider generating and publishing an SBOM for each tagged release.

## Documentation and human validation

- [ ] Add a committed screenshot or short demo with documented asset ownership.
- [ ] Recheck README installation commands and artifact names against actual Windows and Debian outputs.
- [ ] Record final Windows and Debian manual test results.
- [ ] Perform final human validation before public publication.
