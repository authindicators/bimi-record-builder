<?php
/**
 * Plugin Name: BIMI Record Builder
 * Description: Adds a shortcode [bimi-creation-tool] that renders a form to build a BIMI TXT record string with light validation and copy-to-clipboard.
 * Version: 1.0.3
 * Author: Matthew Vernhout / BIMI Group
 * Author URI: https://github.com/EmailKarma
 * Plugin URI: https://github.com/authindicators/bimi-record-builder
 * License: GPL-2.0-or-later
 * Text Domain: bimi-record-builder
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class BIMI_Record_Builder {

    const SHORTCODE = 'bimi-creation-tool';

    public function __construct() {
        add_shortcode(self::SHORTCODE, [$this, 'render_shortcode']);
        add_action('wp_enqueue_scripts', [$this, 'register_assets']);
    }

    public function register_assets() {
        // Register (but don't enqueue) assets; we'll enqueue only when shortcode is used
        $handle = 'bimi-record-builder';
        $src = plugins_url('assets/bimi-record-builder.js', __FILE__);
        $style_src = plugins_url('assets/bimi-record-builder.css', __FILE__);
        wp_register_script($handle, $src, ['wp-i18n'], '1.0.1', true);
        wp_register_style($handle, $style_src, [], '1.0.1');
    }

    public function render_shortcode($atts = [], $content = '') {
        wp_enqueue_script('bimi-record-builder');
        wp_enqueue_style('bimi-record-builder');

        ob_start();
        ?>
        <div class="bimi-builder" data-bimi-builder>
            <form class="bimi-form" novalidate>
                <div class="bimi-field">
                    <label for="bimi-domain">Domain to validate <span class="req">*</span></label>
                    <input type="text" id="bimi-domain" name="domain" placeholder="example.com" required>
                    <small class="hint">No protocol, no path — just the domain.</small>
                </div>

                <div class="bimi-field">
                    <label for="bimi-selector">BIMI selector</label>
                    <input type="text" id="bimi-selector" name="selector" placeholder="default" value="default">
                    <small class="hint">If empty, we will use <code>default</code>.</small>
                </div>

                <div class="bimi-field">
                    <label for="bimi-logo">URL of the Image (SVG) <span class="req">*</span></label>
                    <input type="url" id="bimi-logo" name="logo" placeholder="https://example.com/logo.svg" required>
                    <small class="hint">Must be an <code>.svg</code> file, accessible over HTTP(S).</small>
                </div>

                <div class="bimi-field">
                    <label for="bimi-vmc">URL of the VMC/CMC (optional)</label>
                    <input type="url" id="bimi-vmc" name="vmc" placeholder="https://example.com/vmc.pem">
                    <small class="hint">If blank, output will note as <code>a=;</code>.</small>
                </div>

                <fieldset class="bimi-field">
                    <legend>Avatar Preference (avp)</legend>
                    <div class="radio-group">
                        <label>
                            <input type="radio" name="avp" value="brand" checked>
                            brand — Prefer the BIMI logo (default)
                        </label>
                        <label>
                            <input type="radio" name="avp" value="personal">
                            personal — Prefer the sender’s personal avatar
                        </label>
                    </div>
                    <details class="avp-details">
                        <summary>More about avp</summary>
                        <div id="avp-tip" class="avp-copy">
                            <p>
							<ul>
								<li><strong>avp</strong>: Avatar Preference (optional; default "brand"). Lets the Domain Owner express a preference to show either the BIMI logo or a sender’s personal avatar where both are supported. If not present, treat as <code>avp=brand</code>.</p></li>
                                <li><strong>personal</strong>: If the sender has a personal avatar, providers SHOULD display it; otherwise, show the BIMI logo when eligible.</li>
                                <li><strong>brand</strong>: Providers SHOULD display the BIMI logo when eligible, even if a personal avatar exists.</li>
                            </ul>
                        </div>
                    </details>
                </fieldset>

                <div class="bimi-actions">
                    <button type="button" class="btn primary" data-generate>Generate BIMI TXT</button>
                    <button type="reset" class="btn">Reset</button>
                </div>
            </form>

            <div class="bimi-output" aria-live="polite">
                <div class="errors" data-errors hidden></div>
                <label for="bimi-result">Generated BIMI record</label>
                <textarea id="bimi-result" class="result" rows="3" readonly placeholder="Your BIMI record will appear here..."></textarea>
                <div class="bimi-actions">
                    <button type="button" class="btn" data-copy disabled>Copy</button>
                </div>
            </div>
        </div>

        <script>/* minimally guard against duplicate binding in case multiple shortcodes are on a page */</script>
        <?php
        return ob_get_clean();
    }
}

new BIMI_Record_Builder();

// Create asset files on activation if they don't exist (developer convenience only)
register_activation_hook(__FILE__, function() {
    $assets_dir = plugin_dir_path(__FILE__) . 'assets';
    if (!file_exists($assets_dir)) {
        @mkdir($assets_dir);
    }
    $js = file_exists($assets_dir . '/bimi-record-builder.js') ? '' : "";
    $css = file_exists($assets_dir . '/bimi-record-builder.css') ? '' : "";
    if ($js !== '') {
        file_put_contents($assets_dir . '/bimi-record-builder.js', $js);
    }
    if ($css !== '') {
        file_put_contents($assets_dir . '/bimi-record-builder.css', $css);
    }
});

?>