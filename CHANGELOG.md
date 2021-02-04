## [0.2.5](https://github.com/isneezy/pdf-generator-service/compare/v0.2.4...v0.2.5) (2021-02-04)


### Bug Fixes

* issue where handlebars loops and conditions are being ignored ([602f990](https://github.com/isneezy/pdf-generator-service/commit/602f9904dfad36c93d41dd16cfde0788ac2155bb))
* make request body configurable via environment variables ([72b6a91](https://github.com/isneezy/pdf-generator-service/commit/72b6a91f0d71639b7f0b8c1c663571b52d692182))

## [0.2.4](https://github.com/isneezy/pdf-generator-service/compare/v0.2.3...v0.2.4) (2021-02-04)


### Bug Fixes

* increase request body limit ([1912b10](https://github.com/isneezy/pdf-generator-service/commit/1912b104bc23aeb3c6aa8f05f93a70da44c04fd6))

## [0.2.3](https://github.com/isneezy/pdf-generator-service/compare/v0.2.2...v0.2.3) (2020-10-22)


### Bug Fixes

* **toc:** links are now clickable and no more wrong page numbers ([#57](https://github.com/isneezy/pdf-generator-service/issues/57)) ([455fd60](https://github.com/isneezy/pdf-generator-service/commit/455fd6084cc5fac01233aa5d3c7c8e3bbcadbfaf))

## [0.2.2](https://github.com/isneezy/pdf-generator-service/compare/v0.2.1...v0.2.2) (2020-10-19)


### Bug Fixes

* **release:** make semantic-release update package.json version. ([b5c9f44](https://github.com/isneezy/pdf-generator-service/commit/b5c9f44594d3af8e72cc73752b52b9a9d2ad07a4))

## [0.2.1](https://github.com/isneezy/pdf-generator-service/compare/v0.2.0...v0.2.1) (2020-10-19)


### Bug Fixes

* **toc:** don't include empty headings on TOCs ([10a922a](https://github.com/isneezy/pdf-generator-service/commit/10a922a18446f31f56f183e470cf529971a21bfc))
* disable semantic release NPM publishing ([56858a4](https://github.com/isneezy/pdf-generator-service/commit/56858a4eb80e12394dd5117a02ce5afede463b97))
* **security:** remove semantic release dependency ([d3d36dc](https://github.com/isneezy/pdf-generator-service/commit/d3d36dc1d0b3988686b05d61752af814382e2bb7))

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
