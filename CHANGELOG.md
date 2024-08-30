# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- `$uri` variable resolution no longer appends a domain.  Resolver is expected
to search a list of configured domains.
- `$location` variable renamed to `$srv`, matching the name of the resource
record.
- Variable functions updated to take structured parameters as arguments,
corresponding to latest changes in `electrolyte`.

## [0.2.8] - 2024-05-02
### Added
- `$uri` variable which can be `@require`'d.  Value is set to result of
highest-priority `URI` record found via service discovery.

## [0.2.7] - 2023-11-02
### Added
- Loading environment variables from `.env.{NODE_ENV}` file.

### Changed
- Upgraded `dotenv` dependency to version 16.x.

## [0.2.6] - 2023-10-19

TODO: Review this for accuracy.

### Changed
- Upgraded `electrolyte` dependency to version 0.7.x.

## [0.2.5] - 2020-10-01

## [0.2.4] - 2019-02-20

[Unreleased]: https://github.com/bixbyjs/bixby/compare/v0.2.8...HEAD
[0.2.8]: https://github.com/bixbyjs/bixby/compare/v0.2.7...v0.2.8
[0.2.7]: https://github.com/bixbyjs/bixby/compare/v0.2.6...v0.2.7
[0.2.6]: https://github.com/bixbyjs/bixby/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/bixbyjs/bixby/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/bixbyjs/bixby/compare/v0.2.3...v0.2.4
