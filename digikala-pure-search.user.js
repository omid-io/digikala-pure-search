// ==UserScript==
// @name         Digikala Pure Search | دیجی کالا سرچ خالص
// @namespace    https://github.com/omid-io/digikala-pure-search
// @version      2.2.0
// @description  حذف کامل کالاهای اسپانسری، شگفت انگیز و آگهی های دیجی کالا با چیدمان دقیق و کامل ردیف ها و اسکرول بدون باگ
// @author       Omid Zaferi (https://github.com/omid-io)
// @match        https://*.digikala.com/*
// @match        https://digikala.com/*
// @icon         https://www.digikala.com/favicon.ico
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let remainderBuffer = [];
    let lastQueryKey = '';
    let totalFilteredCount = 0;
    let badgeEl = null;

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
        return 4;
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
        let changed = false;
        checkQueryReset(url);
        const cols = getColumnsCount(url);

        // Discovery v2 API format
        if (data?.data?.widgets?.[0]?.data?.widgets && Array.isArray(data.data.widgets[0].data.widgets)) {
            const subWidgets = data.data.widgets[0].data.widgets;

            const cleanWidgets = subWidgets.filter(w => {
                if (w.type !== 'product') {
                    totalFilteredCount++;
                    return false;
                }
                const d = w.data;
                if (!d) return false;
                if (isSponsored(d) || isDeal(d)) {
                    totalFilteredCount++;
                    return false;
                }
                return true;
            });

            const combined = remainderBuffer.concat(cleanWidgets);
            const take = Math.floor(combined.length / cols) * cols;
            const ready = combined.slice(0, take);
            remainderBuffer = combined.slice(take);

            data.data.widgets[0].data.widgets = ready;
            changed = true;
            updateBadge();
        }

        // Legacy v1 Search API format
        if (data?.data?.products && Array.isArray(data.data.products)) {
            const products = data.data.products;
            const clean = products.filter(p => !isSponsored(p) && !isDeal(p));

            const combined = remainderBuffer.concat(clean);
            const take = Math.floor(combined.length / cols) * cols;
            const ready = combined.slice(0, take);
            remainderBuffer = combined.slice(take);

            data.data.products = ready;
            changed = true;
            updateBadge();
        }

        return changed ? data : null;
    }

    // Hook XMLHttpRequest
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._pureUrl = typeof url === 'string' ? url : (url?.toString() || '');
        return origOpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        const url = this._pureUrl || '';
        if (url.includes('/discovery/api/v2/search') || url.includes('/v1/search/')) {
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const parsed = JSON.parse(this.responseText);
                        const modified = processSearchData(parsed, url);
                        if (modified) {
                            const newText = JSON.stringify(modified);
                            Object.defineProperty(this, 'responseText', { value: newText, writable: true, configurable: true });
                            Object.defineProperty(this, 'response', { value: newText, writable: true, configurable: true });
                        }
                    } catch (_) {}
                }
            }, true);
        }
        return origSend.apply(this, args);
    };

    // Hook window.fetch
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
                    return new Response(JSON.stringify(modified), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }
            } catch (_) {}
        }
        return response;
    };

    function updateBadge() {
        if (!document.body) return;
        if (!badgeEl) {
            badgeEl = document.createElement('div');
            badgeEl.id = 'digi-pure-badge';
            badgeEl.title = 'اسکریپت سرچ خالص دیجی کالا • توسعه دهنده: امید ظفری (Omid Zaferi)';
            badgeEl.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 999999;
                background: rgba(15, 23, 42, 0.9);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border-radius: 9999px;
                padding: 8px 16px;
                display: flex;
                align-items: center;
                gap: 8px;
                color: #f8fafc;
                font-family: inherit;
                font-size: 12px;
                direction: rtl;
                pointer-events: auto;
                user-select: none;
            `;
            badgeEl.innerHTML = `
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #00e5ff; box-shadow: 0 0 8px #00e5ff;"></span>
                <span>سرچ خالص: <strong id="digi-pure-userjs-count" style="color: #00e5ff;">۰</strong> مورد حذف شد</span>
            `;
            document.body.appendChild(badgeEl);
        }
        const span = document.getElementById('digi-pure-userjs-count');
        if (span) span.textContent = totalFilteredCount.toLocaleString('fa-IR');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateBadge);
    } else {
        updateBadge();
    }

    console.log('%c🚀 Digikala Pure Search Userscript v2.2 Active (Dynamic Responsive Grid Engine)', 'color: #00e5ff; font-weight: bold;');
})();
