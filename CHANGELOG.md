# Changelog

All notable changes to **BIMI Record Builder** are documented here. Versions below reflect the development history discussed for this plugin; earlier entries summarize known milestones rather than a complete Git release history.

## [1.0.4] - 2026-10-08

### Added
- Optional Local-Part Selector (`lps=`) text field, positioned after the VMC/CMC URL input.
- Comma-separated `lps` values in generated BIMI TXT records.
- Normalization of whitespace and empty entries in comma-separated `lps` input.

### Changed
- Omit `lps=` entirely when the field is blank.
- Preserve the existing form layout, styling, AVP radio buttons, validation feedback, and copy behaviour.
- Updated the PHP plugin header and registered JavaScript/CSS asset versions to `1.0.4`.

### Output examples

With `lps` supplied:

```dns
default._bimi.example.com. IN TXT "v=BIMI1; l=https://example.com/logo.svg; a=; lps=newsletter,offers,promotions; avp=brand;"
```

Without `lps`:

```dns
default._bimi.example.com. IN TXT "v=BIMI1; l=https://example.com/logo.svg; a=; avp=brand;"
```

## [1.0.3] - Prior version

- Established baseline for the current standalone WordPress plugin implementation.
- Included `[bimi-creation-tool]`, selector input, optional VMC/CMC URL, AVP controls, record generation, and copy-to-clipboard.
- Included basic validation and red error messages.

## [1.0.1 to 1.0.2] - Earlier development

- Refined record formatting, including empty certificate output as `a=;`.
- Iterated on front-end validation and presentation.

## [1.0.0] - Initial development

- Introduced a front-end BIMI TXT record generator for WordPress.
- Added inputs for domain, BIMI selector, SVG logo URL, certificate URL, and avatar preference.
