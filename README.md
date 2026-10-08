# BIMI Record Builder

**Version:** 1.0.4  
**Author:** Matthew Vernhout / BIMI Group  
**License:** GPL-2.0-or-later  
**Repository:** https://github.com/authindicators/bimi-record-builder

BIMI Record Builder is a standalone WordPress plugin that generates a copyable DNS TXT record for Brand Indicators for Message Identification (BIMI). It provides a front-end form using the `[bimi-creation-tool]` shortcode. The tool builds a record from user inputs; it does not publish DNS records or check BIMI eligibility.

## Requirements and installation

Install on a WordPress site that supports plugins. The plugin includes one PHP file and two front-end assets:

```text
bimi-record-builder/
├── bimi-record-builder.php
└── assets/
    ├── bimi-record-builder.js
    └── bimi-record-builder.css
```

1. Upload the `bimi-record-builder` folder to `wp-content/plugins/`, or install a ZIP of that folder using the WordPress Plugins screen.
2. Activate **BIMI Record Builder**.
3. Add `[bimi-creation-tool]` to a page or post.
4. Publish the page and open it to use the builder.

## Form fields

| Field | Required | Behaviour |
| --- | --- | --- |
| Domain | Yes | Enter a domain such as `example.com`, without a scheme or path. |
| BIMI selector | No | Defaults to `default` when blank. |
| Image URL (`l=`) | Yes | Must be an HTTPS URL whose path ends in `.svg`. |
| VMC/CMC URL (`a=`) | No | If supplied, must use HTTPS. When blank, output contains `a=;`. |
| Local-Part Selector (`lps=`) | No | Enter comma-separated values such as `newsletter,offers,promotions`. Omitted when blank. |
| Avatar Preference (`avp=`) | No | Radio buttons select `brand` (default) or `personal`. Help text explains the preference. |

The builder trims spaces around `lps` values and removes empty comma-separated entries. For example, `newsletter, offers, promotions` becomes `newsletter,offers,promotions`.

## Example output

With an SVG URL, no certificate URL, and `lps=help`:

```dns
default._bimi.example.com. IN TXT "v=BIMI1; l=https://example.com/logo.svg; a=; lps=help; avp=brand;"
```

With the optional `lps` field blank:

```dns
default._bimi.example.com. IN TXT "v=BIMI1; l=https://example.com/logo.svg; a=; avp=brand;"
```

The output includes the fully qualified DNS owner name and a zone-file-style `IN TXT` declaration. DNS provider interfaces may ask for the host/name and TXT value in separate fields, so adjust the presentation to suit your DNS provider.

## Validation and limitations

- The builder performs basic client-side checks on the domain and SVG extension.
- Both supplied asset URLs must use HTTPS.
- Validation errors appear in red, clear the generated record, and disable the Copy button.
- The Copy button becomes available after a record is generated successfully.
- The builder does **not** retrieve the SVG or certificate, validate SVG Tiny PS compliance, verify certificate validity, query DNS, test DMARC, or confirm mailbox-provider display.
- `lps` input is normalized as comma-separated text, but the plugin does not independently verify each value against a BIMI specification grammar.
- Record generation alone does not guarantee BIMI compliance or logo display.

## Development

The plugin registers the shortcode in `bimi-record-builder.php` and uses `assets/bimi-record-builder.js` for record generation and copying. Styling is in `assets/bimi-record-builder.css`. The PHP file registers asset versions as `1.0.4` to help with cache invalidation.

For changes and version history, see [CHANGELOG.md](CHANGELOG.md).
