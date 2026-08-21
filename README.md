# prelegal

A platform for drafting common legal agreements.

## Status: In Progress 🚧

This project is currently under active development and is **not yet ready for use**.

- **Current state:** in progress
- **Target completion:** 27 August 2026 (one week from 20 August 2026)

Documentation — including installation, configuration, usage examples, and
contribution guidelines — will be added as the project is completed. Expect
breaking changes until then.

## Contents

- **`templates/`** — legal agreement templates from
  [Common Paper](https://github.com/CommonPaper), free to use under
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See
  [`templates/LICENSE.md`](templates/LICENSE.md).
- **`catalog.json`** — the template index, recording each file's source
  repository, path, and commit.
- **`frontend/`** — a Next.js app for drafting a Mutual NDA: fill in a form,
  see the agreement fill in beside it, and print it to PDF. See
  [`frontend/README.md`](frontend/README.md).

## Getting started

```bash
cd frontend
npm install
npm run dev
```

## License

See [LICENSE](LICENSE).
