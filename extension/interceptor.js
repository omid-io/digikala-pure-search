/**
 * Digikala Pure Search - Engine Interceptor
 * Injected into MAIN world at document_start.
 * Intercepts Digikala Search API responses (XHR and Fetch) before React receives them.
 * Dynamically synchronizes with Digikala's active columns_per_page (4, 5, etc.)
 * Guarantees 100% full rows with zero empty slots and bug-free infinite scrolling.
 * 
 * Author: Omid Zaferi (https://github.com/omid-io)
 */
(function () {
    'use strict';

    if (window.__digiPureInterceptorInstalled) return;
    window.__digiPureInterceptorInstalled = true;

    let remainderBuffer = [];
    let lastQueryKey = '';
    let totalFilteredCount = 0;

    function getSettings() {
        try {
            const raw = document.documentElement.dataset.digiPureSettings;
            if (raw) return JSON.parse(raw);
        } catch (_) {}
        return {
            hideSponsored: true,
            hideDeals: true,
            hideBanners: true
        };
    }

    function checkQueryReset(url) {
        try {
            const parsedUrl = new URL(url, location.origin);
            const q = parsedUrl.searchParams.get('q') || '';
            const sort = parsedUrl.searchParams.get('sort') || '';
            const key = `${q}__${sort}`;
            if (lastQueryKey && lastQueryKey !== key) {
                remainderBuffer = [];
            }
            lastQueryKey = key;
        } catch (_) {}
    }

    function getColumnsCount(url) {
        try {
            const parsedUrl = new URL(url, location.origin);
            const param = parsedUrl.searchParams.get('columns_per_page');
            if (param) {
                const parsed = parseInt(param, 10);
                if (parsed > 0) return parsed;
            }
        } catch (_) {}
        return 4; // default
    }

    function isSponsored(item) {
        if (!item) return false;
        if (item.is_ad || item.ad) return true;
        if (item.properties?.is_ad || item.properties?.ad || item.properties?.ad_url) return true;
        return false;
    }

    function isDeal(item) {
        if (!item) return false;
        const dim7 = item.data_layer?.dimension7;
        if (dim7 === 'incredible' || dim7 === 'special-offer') return true;

        if (Array.isArray(item.badges)) {
            for (const b of item.badges) {
                const title = b.title || '';
                const icon = b.icon || '';
                const type = b.type || '';
                const theme = b.theme || '';
                if (
                    title.includes('شگفت') ||
                    icon.includes('Incredible') ||
                    type.includes('incredible') ||
                    theme.includes('incredible')
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    function processSearchData(data, url) {
        const settings = getSettings();
        let changed = false;
        checkQueryReset(url);
        const cols = getColumnsCount(url);

        // 1. Discovery v2 API format
        if (data?.data?.widgets?.[0]?.data?.widgets && Array.isArray(data.data.widgets[0].data.widgets)) {
            const subWidgets = data.data.widgets[0].data.widgets;

            const cleanWidgets = subWidgets.filter(w => {
                if (w.type !== 'product') {
                    if (settings.hideBanners) {
                        totalFilteredCount++;
                        return false;
                    }
                    return true;
                }

                const d = w.data;
                if (!d) return false;

                if (settings.hideSponsored && isSponsored(d)) {
                    totalFilteredCount++;
                    return false;
                }

                if (settings.hideDeals && isDeal(d)) {
                    totalFilteredCount++;
                    return false;
                }

                return true;
            });

            // Combine with buffered items from previous response
            const combined = remainderBuffer.concat(cleanWidgets);
            
            // Strictly deliver exact multiples of cols so every single row is 100% full!
            const take = Math.floor(combined.length / cols) * cols;
            const ready = combined.slice(0, take);
            remainderBuffer = combined.slice(take);

            data.data.widgets[0].data.widgets = ready;
            changed = true;

            dispatchStats();
        }

        // 2. Legacy v1 Search API format
        if (data?.data?.products && Array.isArray(data.data.products)) {
            const products = data.data.products;
            const clean = products.filter(p => {
                if (settings.hideSponsored && isSponsored(p)) {
                    totalFilteredCount++;
                    return false;
                }
                if (settings.hideDeals && isDeal(p)) {
                    totalFilteredCount++;
                    return false;
                }
                return true;
            });

            const combined = remainderBuffer.concat(clean);
            const take = Math.floor(combined.length / cols) * cols;
            const ready = combined.slice(0, take);
            remainderBuffer = combined.slice(take);

            data.data.products = ready;
            changed = true;

            dispatchStats();
        }

        return changed ? data : null;
    }

    function dispatchStats() {
        window.dispatchEvent(new CustomEvent('digi-pure-stats-sync', {
            detail: { count: totalFilteredCount }
        }));
    }

    // ----------------------------------------------------
    // Intercept XMLHttpRequest
    // ----------------------------------------------------
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._pureSearchUrl = typeof url === 'string' ? url : (url?.toString() || '');
        return origOpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        const url = this._pureSearchUrl || '';
        if (url.includes('/discovery/api/v2/search') || url.includes('/v1/search/')) {
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const parsed = JSON.parse(this.responseText);
                        const modified = processSearchData(parsed, url);
                        if (modified) {
                            const newText = JSON.stringify(modified);
                            Object.defineProperty(this, 'responseText', {
                                value: newText,
                                writable: true,
                                configurable: true
                            });
                            Object.defineProperty(this, 'response', {
                                value: newText,
                                writable: true,
                                configurable: true
                            });
                        }
                    } catch (_) {}
                }
            }, true);
        }
        return origSend.apply(this, args);
    };

    // ----------------------------------------------------
    // Intercept window.fetch
    // ----------------------------------------------------
    const origFetch = window.fetch;
    window.fetch = async function (...args) {
        const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
        const response = await origFetch.apply(this, args);

        if (url.includes('/discovery/api/v2/search') || url.includes('/v1/search/')) {
            try {
                const clone = response.clone();
                const json = await clone.json();
                const modified = processSearchData(json, url);
                if (modified) {
                    const modifiedText = JSON.stringify(modified);
                    return new Response(modifiedText, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }
            } catch (_) {}
        }

        return response;
    };

    console.log('%c🚀 Digikala Pure Search Native Interceptor Active (Dynamic Responsive Grid Engine)', 'color: #00e5ff; font-weight: bold;');
})();
