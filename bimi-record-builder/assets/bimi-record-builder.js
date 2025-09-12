/* ======= assets/bimi-record-builder.js ======= */
// Place this content in assets/bimi-record-builder.js
(function(){
    function ready(fn){ if(document.readyState !== 'loading'){ fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }

    function isValidDomain(domain){
        var re = /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
        return re.test(domain.trim());
    }

    function isValidUrl(url){
        try { new URL(url); return true; } catch (e) { return false; }
    }

    function isSvg(url){
        try { var u = new URL(url); return u.pathname.toLowerCase().endsWith('.svg'); } catch(e){ return false; }
    }

    ready(function(){
        document.querySelectorAll('[data-bimi-builder]').forEach(function(root){
            var domainEl = root.querySelector('#bimi-domain');
            var selectorEl = root.querySelector('#bimi-selector');
            var logoEl = root.querySelector('#bimi-logo');
            var vmcEl = root.querySelector('#bimi-vmc');
            var avpEls = root.querySelectorAll('input[name="avp"]');
            var errorsEl = root.querySelector('[data-errors]');
            var resultEl = root.querySelector('#bimi-result');
            var genBtn = root.querySelector('[data-generate]');
            var copyBtn = root.querySelector('[data-copy]');

            function gatherAvp(){
                var val = 'brand';
                avpEls.forEach(function(r){ if(r.checked){ val = r.value; } });
                return val;
            }

            function showErrors(list){
                if(!list.length){ errorsEl.hidden = true; errorsEl.innerHTML=''; return; }
                errorsEl.hidden = false;
                errorsEl.innerHTML = '<ul>' + list.map(function(e){ return '<li>'+ e +'</li>'; }).join('') + '</ul>';
            }

            function buildRecord(){
                var errs = [];
                var domain = (domainEl.value || '').trim();
                var selector = (selectorEl.value || 'default').trim() || 'default';
                var logo = (logoEl.value || '').trim();
                var vmc = (vmcEl.value || '').trim();
                var avp = gatherAvp();

                if(!isValidDomain(domain)){
                    errs.push('Please enter a valid domain (e.g., example.com).');
                }
                if(!logo){
                    errs.push('Logo URL is required.');
                } else if(!isValidUrl(logo)){
                    errs.push('Logo URL must be a valid URL (https).');
                } else if(!isSvg(logo)){
                    errs.push('Logo URL must end with .svg.');
                }
                if(vmc && !isValidUrl(vmc)){
                    errs.push('VMC/CMC must be a valid URL if provided.');
                }

                if(errs.length){
                    showErrors(errs);
                    resultEl.value = '';
                    copyBtn.disabled = true;
                    return;
                }

                showErrors([]);

                var parts = ['v=BIMI1', 'l=' + logo];

                if(vmc){
                    parts.push('a=' + vmc);
                } else {
                    parts.push('a=');
                }

                if(avp){
                    parts.push('avp=' + avp);
                }

                var record = selector + '._bimi.' + domain + '. IN TXT "' + parts.join('; ') + ';"';
                resultEl.value = record;
                copyBtn.disabled = false;
            }

            genBtn.addEventListener('click', buildRecord);

            copyBtn.addEventListener('click', function(){
                if(!resultEl.value){ return; }
                navigator.clipboard.writeText(resultEl.value).then(function(){
                    copyBtn.textContent = 'Copied!';
                    setTimeout(function(){ copyBtn.textContent = 'Copy'; }, 1200);
                }).catch(function(){
                    resultEl.select();
                    document.execCommand('copy');
                    copyBtn.textContent = 'Copied!';
                    setTimeout(function(){ copyBtn.textContent = 'Copy'; }, 1200);
                });
            });
        });
    });
})();