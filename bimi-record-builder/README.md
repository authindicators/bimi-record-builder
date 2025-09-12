# BIMI Record Builder

![Version](https://img.shields.io/badge/version-1.0.3-blue) ![License](https://img.shields.io/badge/license-GPL-2.0-or-later-lightgrey)

A WordPress utility to help you generate BIMI DNS TXT records quickly and accurately, with simple validation and copy-to-clipboard.

## Features
- Build a BIMI DNS TXT record from form inputs.
- Validate HTTPS URLs for `l=` (SVG) and `a=` (VMC), highlighting errors.
- Provide a selector field with `default` as the prefilled option.
- Output `a=;` when no VMC is supplied, per your spec.
- Copy-to-clipboard button for quick DNS pasting.
- Shortcode to embed the tool in any WordPress page.

## Shortcode
Use this shortcode on a page or post:
```
[bimi_record_builder]
```

## Installation
1. Upload the plugin folder to `wp-content/plugins/` and activate it.
2. Add the shortcode above to any page.
3. Enter your domain, SVG URL (`l=`), optional VMC URL (`a=`), and the selector.
4. Click **Build** to generate the record, then **Copy** to copy it.

**Behaviour details**
- If `a` is not provided, the generator outputs `a=;`.
- All links must use HTTPS, or the UI flags them in red.
- The selector defaults to `default` when not supplied.

## WordPress plugin header

**bimi-record-builder/bimi-record-builder.php**

```
* Plugin Name: BIMI Record Builder
 * Description: Adds a shortcode [bimi-creation-tool] that renders a form to build a BIMI TXT record string with light validation and copy-to-clipboard.
 * Version: 1.0.3
 * Author: Matthew Vernhout / BIMI Group
 * Author URI: https://github.com/EmailKarma
 * Plugin URI: https://github.com/authindicators/bimi-checker
 * License: GPL-2.0-or-later
 * Text Domain: bimi-record-builder
```

## Contributing
PRs and issues are welcome. Please describe your changes clearly.

## License
GPL-2.0-or-later
