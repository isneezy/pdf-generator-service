# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# [0.2.0](https://github.com/isneezy/pdf-generator-service/compare/v0.1.0...v0.2.0) (2020-10-19)

### Bug Fixes

* **deps:** Bump @types/node from 14.11.2 to 14.11.3 ([#44](https://github.com/isneezy/pdf-generator-service/issues/44)) ([8d46a8b](https://github.com/isneezy/pdf-generator-service/commit/8d46a8b963bab7cc54697d6956e7b3bbc2591db4))
* **deps:** Create Dependabot v2 config file ([#43](https://github.com/isneezy/pdf-generator-service/issues/43)) ([aeaf762](https://github.com/isneezy/pdf-generator-service/commit/aeaf762ebcb75d4ca80a55e9453dabd6e2f44866))
* **deps:** update @typescript-eslint/eslint-plugin from 4.2.0 to 4.4.0 ([#42](https://github.com/isneezy/pdf-generator-service/issues/42)) ([cb05e9d](https://github.com/isneezy/pdf-generator-service/commit/cb05e9dcc1f276ce337ecccb8fb27d260e4d9e4d))
* **deps:** update jest from 26.4.2 to 26.5.0 ([#41](https://github.com/isneezy/pdf-generator-service/issues/41)) ([e4395ba](https://github.com/isneezy/pdf-generator-service/commit/e4395bace9368f19205bc73d4f0d24b6ee9433f3))


### Features

* added support for Table of contents (TOCs)([#21](https://github.com/isneezy/pdf-generator-service/issues/21)) ([67c5324](https://github.com/isneezy/pdf-generator-service/commit/67c5324c4d387f321fb8b14f258fc8f7531d7e92))
* added support for handlebars templates.
* added default Page borders `{ top: '1.9 cm', bottom: '1.9 cm', left: '1.9 cm', right: '1.9 cm' }`.
* added Header and Footer template support.
* added `--export-tagged-pdf` chromium launch args to produce tagged PDFs, better for accessibility.
* Start using edge repository for the docker image, so we can get the most recent chromium build.
* Start using docker multistage build to reduce image size.

## [0.1.0] - 2020-09-21

### Added
- This CHANGELOG file to hopefully tell the project story.
- Github actions for continuous integration (CI).
- Dockerfile & automated builds and releases.
- /generate - route to generate PDF files based on HTML input.
