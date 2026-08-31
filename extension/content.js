(function () {
    'use strict';

    // 1. تزریق استایل‌های اولیه جهت حذف پرش تصویر (Zero-Flicker CSS Injection)
    const injectedStyles = document.createElement('style');
    injectedStyles.textContent = `
        [data-ad="true"],
        [data-sponsored="true"],
        .digi-pure-filtered {
            display: none !important;
        }

        #digi-pure-badge {
            position: fixed;
            bottom: 24px;
            left: 24px;
            background: rgba(18, 20, 29, 0.92);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(0, 229, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), 0 0 16px rgba(0, 229, 255, 0.15);
            color: #f1f5f9;
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Tahoma, sans-serif;
            font-size: 12px;
            padding: 8px 14px;
            border-radius: 9999px;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 8px;
            direction: rtl;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
        }
        #digi-pure-badge:hover {
            transform: translateY(-2px);
            border-color: #00e5ff;
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(0, 229, 255, 0.25);
        }
        #digi-pure-badge .dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 8px #10b981;
            animation: pulse-dot 2s infinite ease-in-out;
        }
        @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.85); }
        }
    `;
    (document.head || document.documentElement).appendChild(injectedStyles);

    let filteredCount = 0;
    let badgeElement = null;

    function updateBadge() {
        if (!badgeElement) {
            badgeElement = document.createElement('div');
            badgeElement.id = 'digi-pure-badge';
            badgeElement.title = 'توسعه‌داده‌شده توسط امید ظفری (Omid Zaferi) | omid.io';
            badgeElement.innerHTML = `
                <span class="dot"></span>
                <span>سرچ خالص دیجی‌کالا: <strong id="digi-pure-count" style="color: #00e5ff;">۰</strong> تبلیغ حذف شد</span>
            `;
            document.body.appendChild(badgeElement);
        }
        const countSpan = document.getElementById('digi-pure-count');
        if (countSpan) {
            countSpan.textContent = filteredCount.toLocaleString('fa-IR');
        }
    }

    const adKeywords = ['آگهی', 'سفارشی', 'اسپانسری', 'Sponsored', 'Ad'];

    function isAdElement(element) {
        if (!element || element.classList?.contains('digi-pure-checked')) return false;
        element.classList.add('digi-pure-checked');

        const textContent = element.textContent || '';
        for (const kw of adKeywords) {
            const badges = element.querySelectorAll('span, p, div, small');
            for (const b of badges) {
                if (b.children.length === 0 && b.textContent.trim() === kw) {
                    return true;
                }
            }
        }

        if (
            element.querySelector('[data-cro-id*="ad_"]') ||
            element.querySelector('[data-cro-id*="sponsored"]') ||
            element.querySelector('a[href*="ad_type"]') ||
            element.querySelector('a[href*="adclick"]')
        ) {
            return true;
        }

        return false;
    }

    function cleanDOMProducts() {
        const productAnchors = document.querySelectorAll('a[href*="/product/dkp-"]');
        productAnchors.forEach(anchor => {
            const card = anchor.closest('article') || anchor.closest('[data-product-box="true"]') || anchor.closest('.product-list_ProductList__item__') || anchor.parentElement;
            if (card && !card.classList.contains('digi-pure-filtered')) {
                if (isAdElement(card)) {
                    card.classList.add('digi-pure-filtered');
                    card.style.display = 'none';
                    filteredCount++;
                    updateBadge();
                }
            }
        });

        const promoBanners = document.querySelectorAll('div[data-cro-id*="banner"], div[data-cro-id*="promotion"]');
        promoBanners.forEach(banner => {
            if (!banner.classList.contains('digi-pure-filtered')) {
                banner.classList.add('digi-pure-filtered');
                banner.style.display = 'none';
            }
        });
    }

    const observer = new MutationObserver(() => {
        cleanDOMProducts();
    });

    function init() {
        cleanDOMProducts();
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            updateBadge();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                updateBadge();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('%c🚀 Digikala Pure Search Active | Developer: Omid Zaferi (https://github.com/omid-io)', 'color: #00e5ff; font-weight: bold; font-size: 12px;');
})();
