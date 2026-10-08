/* ======= assets/bimi-record-builder.js ======= */
/* BIMI Record Builder v1.0.4 */

(function () {

    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    /*
     * Basic domain validation.
     * Accepts domains and subdomains, but not protocols or paths.
     */
    function isValidDomain(domain) {
        var re = /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
        return re.test(domain.trim());
    }

    /*
     * BIMI asset URLs must use HTTPS.
     */
    function isValidHttpsUrl(url) {
        try {
            var parsed = new URL(url);
            return parsed.protocol === 'https:';
        } catch (e) {
            return false;
        }
    }

    /*
     * Check that the BIMI logo URL points to an SVG file.
     * Query strings do not interfere with the extension check.
     */
    function isSvg(url) {
        try {
            var parsed = new URL(url);
            return parsed.pathname.toLowerCase().endsWith('.svg');
        } catch (e) {
            return false;
        }
    }

    /*
     * Normalize comma-separated lps values.
     *
     * Example:
     * newsletter, offers, promotions
     *
     * Becomes:
     * newsletter,offers,promotions
     */
    function normalizeLps(value) {

        if (!value) {
            return '';
        }

        return value
            .split(',')
            .map(function (item) {
                return item.trim();
            })
            .filter(function (item) {
                return item.length > 0;
            })
            .join(',');
    }


    ready(function () {

        document.querySelectorAll('[data-bimi-builder]').forEach(function (root) {

            /*
             * Form elements
             */
            var domainEl = root.querySelector('#bimi-domain');
            var selectorEl = root.querySelector('#bimi-selector');
            var logoEl = root.querySelector('#bimi-logo');
            var vmcEl = root.querySelector('#bimi-vmc');
            var lpsEl = root.querySelector('#bimi-lps');

            var avpEls = root.querySelectorAll('input[name="avp"]');

            var errorsEl = root.querySelector('[data-errors]');
            var resultEl = root.querySelector('#bimi-result');

            var genBtn = root.querySelector('[data-generate]');
            var copyBtn = root.querySelector('[data-copy]');


            /*
             * Get selected AVP preference.
             * Brand remains the default.
             */
            function gatherAvp() {

                var value = 'brand';

                avpEls.forEach(function (radio) {

                    if (radio.checked) {
                        value = radio.value;
                    }

                });

                return value;
            }


            /*
             * Display validation errors.
             *
             * Existing CSS handles the red error styling.
             */
            function showErrors(errors) {

                if (!errors.length) {

                    errorsEl.hidden = true;
                    errorsEl.innerHTML = '';

                    return;
                }

                errorsEl.hidden = false;

                errorsEl.innerHTML =
                    '<ul>' +
                    errors.map(function (error) {
                        return '<li>' + error + '</li>';
                    }).join('') +
                    '</ul>';
            }


            /*
             * Generate BIMI record.
             */
            function buildRecord() {

                var errors = [];

                var domain =
                    (domainEl.value || '').trim();

                var selector =
                    (selectorEl.value || 'default').trim() || 'default';

                var logo =
                    (logoEl.value || '').trim();

                var vmc =
                    (vmcEl.value || '').trim();

                var lps = '';

                if (lpsEl) {
                    lps = normalizeLps(
                        (lpsEl.value || '').trim()
                    );
                }

                var avp = gatherAvp();


                /*
                 * Domain validation
                 */
                if (!isValidDomain(domain)) {

                    errors.push(
                        'Please enter a valid domain, for example example.com.'
                    );
                }


                /*
                 * BIMI logo validation
                 */
                if (!logo) {

                    errors.push(
                        'Logo URL is required.'
                    );

                } else {

                    if (!isValidHttpsUrl(logo)) {

                        errors.push(
                            'Logo URL must be a valid HTTPS URL.'
                        );
                    }

                    if (!isSvg(logo)) {

                        errors.push(
                            'Logo URL must point to an .svg file.'
                        );
                    }
                }


                /*
                 * VMC/CMC validation.
                 *
                 * This field is optional.
                 * If supplied, it must use HTTPS.
                 */
                if (vmc && !isValidHttpsUrl(vmc)) {

                    errors.push(
                        'VMC/CMC URL must be a valid HTTPS URL if provided.'
                    );
                }


                /*
                 * Stop generation if validation failed.
                 */
                if (errors.length) {

                    showErrors(errors);

                    resultEl.value = '';

                    copyBtn.disabled = true;

                    return;
                }


                /*
                 * Clear previous errors.
                 */
                showErrors([]);


                /*
                 * Build BIMI tag list.
                 */
                var parts = [
                    'v=BIMI1',
                    'l=' + logo,
                    vmc ? 'a=' + vmc : 'a='
                ];


                /*
                 * lps is optional.
                 *
                 * If blank, the tag is completely omitted.
                 */
                if (lps) {

                    parts.push(
                        'lps=' + lps
                    );
                }


                /*
                 * AVP preference.
                 */
                if (avp) {

                    parts.push(
                        'avp=' + avp
                    );
                }


                /*
                 * Assemble complete DNS record.
                 */
                var record =
                    selector +
                    '._bimi.' +
                    domain +
                    '. IN TXT "' +
                    parts.join('; ') +
                    ';"';


                /*
                 * Display result and enable copy.
                 */
                resultEl.value = record;

                copyBtn.disabled = false;
            }


            /*
             * Generate button.
             */
            genBtn.addEventListener(
                'click',
                buildRecord
            );


            /*
             * Copy BIMI record.
             */
            copyBtn.addEventListener(
                'click',
                function () {

                    if (!resultEl.value || copyBtn.disabled) {
                        return;
                    }

                    navigator.clipboard
                        .writeText(resultEl.value)

                        .then(function () {

                            copyBtn.textContent = 'Copied!';

                            setTimeout(function () {

                                copyBtn.textContent = 'Copy';

                            }, 1200);
                        })

                        .catch(function () {

                            /*
                             * Fallback for browsers where
                             * Clipboard API is unavailable.
                             */
                            resultEl.select();

                            document.execCommand('copy');

                            copyBtn.textContent = 'Copied!';

                            setTimeout(function () {

                                copyBtn.textContent = 'Copy';

                            }, 1200);
                        });
                }
            );

        });

    });

})();