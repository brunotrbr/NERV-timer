# Contributing to NERV Timer

Thank you for helping improve the project.

## Local setup

Install Node.js 20 or newer, then run:

```sh
npm ci
npm run setup:neutralino
npm test
```

Use `npm run dev` for the native development window. Keep browser assets under `resources/`; do not recreate legacy root-level source trees.

## Changes and pull requests

- Add or update a behavioral test before changing behavior.
- Run `npm test` and the relevant platform package command.
- Keep JavaScript readable and consistent with the existing dependency-free application code.
- Describe manual platform checks that cannot run in automation.
- Do not include credentials, logs, archives, source WAV files, purchase records, or OS metadata.

Every new or replaced image, font, icon, audio file, or vendored component must include its source, author, license, and evidence that redistribution is permitted. A pull request must not include personal license certificates or receipts.
