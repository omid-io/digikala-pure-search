// ==UserScript==
// @name         Digikala Pure Search | حذف تبلیغات و کالاهای اسپانسری دیجی کالا
// @namespace    https://github.com/omid-io
// @version      1.2.0
// @description  حذف هوشمند، فوری و خودکار کالاهای اسپانسری، آگهی ها، برچسب های سفارشی، شگفت انگیز، فروش ویژه، کاروسل های اسپانسری و بنرهای مزاحم از تمام نتایج جستجو و دسته بندی های دیجی کالا
// @author       Omid Zaferi (https://github.com/omid-io)
// @match        https://*.digikala.com/*
// @match        https://digikala.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=digikala.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @homepageURL  https://github.com/omid-io/digikala-pure-search
// @supportURL   https://greasyfork.org/en/scripts/593664-digikala-pure-search
// @updateURL    https://update.greasyfork.org/scripts/593664/Digikala%20Pure%20Search.meta.js
// @downloadURL  https://update.greasyfork.org/scripts/593664/Digikala%20Pure%20Search.user.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. تزریق استایل های اولیه فوری جهت حذف بدون پرش (Zero-Flicker CSS Injection)
    const styleEl = document.createElement('style');
    styleEl.id = 'digi-pure-style';
    styleEl.textContent = `
        /* مخفی سازی فوری در سطح گرید برای جلوگیری از خالی ماندن جای کالا */
        [class*="ProductList__item"]:has(dds-icon[name="badge-ad"]),
        [class*="ProductList__item"]:has(dds-icon[name="badge-amazing"]),
        [class*="ProductList__item"]:has(dds-icon[name="badge-special-sale"]),
        [class*="ProductList__item"]:has(a[href*="ad_variant_id"]),
        [class*="ProductList__item"]:has(a[href*="ad_type"]),
        [class*="ProductList__item"]:has(a[href*="adclick"]),
        [class*="ProductList__item"]:has([data-cro-id*="ad_"]),
        [class*="ProductList__item"]:has([data-cro-id*="sponsored"]),
        article:has(dds-icon[name="badge-ad"]),
        article:has(dds-icon[name="badge-amazing"]),
        article:has(dds-icon[name="badge-special-sale"]),
        article:has(a[href*="ad_variant_id"]),

        /* حذف کاروسل های اسپانسری و برندهای سفارشی */
        div:has(> .swiper:has(dds-icon[name="badge-ad"])),
        div:has(> div > .swiper:has(dds-icon[name="badge-ad"])),
        .swiper:has(dds-icon[name="badge-ad"]),

        /* حذف بنرهای تبلیغاتی لابلای لیست کالاها */
        div[data-cro-id*="banner"],
        div[data-cro-id*="promotion"],
        div[data-cro-id*="ad_"],
        .digi-pure-filtered {
            display: none !important;
        }

        /* نشانگر وضعیت سرچ خالص */
        #digi-pure-badge {
            position: fixed;
            bottom: 24px;
            left: 24px;
            background: rgba(18, 20, 29, 0.94);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(0, 229, 255, 0.35);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 16px rgba(0, 229, 255, 0.15);
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
            cursor: pointer;
        }
        #digi-pure-badge:hover {
            transform: translateY(-2px);
            border-color: #00e5ff;
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 229, 255, 0.3);
        }
        #digi-pure-badge .dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 8px #10b981;
            animation: digi-pulse 2s infinite ease-in-out;
        }
        @keyframes digi-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.85); }
        }
    `;
    (document.head || document.documentElement).appendChild(styleEl);

    let filteredCount = 0;
    let badgeEl = null;

    function updateBadge() {
        if (!document.body) return;
        if (!badgeEl) {
            badgeEl = document.createElement('div');
            badgeEl.id = 'digi-pure-badge';
            badgeEl.title = 'توسعه داده شده توسط امید ظفری (Omid Zaferi) | omid.io';
            badgeEl.innerHTML = `
                <span class="dot"></span>
                <span>سرچ خالص دیجی کالا: <strong id="digi-pure-count" style="color: #00e5ff;">۰</strong> تبلیغ حذف شد</span>
            `;
            document.body.appendChild(badgeEl);
        }
        const countSpan = document.getElementById('digi-pure-count');
        if (countSpan) {
            countSpan.textContent = filteredCount.toLocaleString('fa-IR');
        }
    }

    const adKeywords = [
        'سفارشی',
        'آگهی',
        'اسپانسری',
        'Sponsored',
        'Ad',
        'شگفت انگیز',
        'شگفت انگیزها',
        'پیشنهاد شگفت انگیز',
        'فروش ویژه'
    ];

    function isAdNode(el) {
        if (!el) return false;

        // ۱. آیکون های رسمی آگهی، شگفت انگیز و فروش ویژه
        if (el.querySelector('dds-icon[name="badge-ad"], dds-icon[name="badge-amazing"], dds-icon[name="badge-special-sale"]')) return true;

        // ۲. لینک های حاوی پارامترهای تبلیغاتی و ادوارینت
        const links = el.querySelectorAll('a[href]');
        for (const a of links) {
            const href = a.getAttribute('href') || '';
            if (href.includes('ad_variant_id') || href.includes('ad_type') || href.includes('adclick')) {
                return true;
            }
        }
        if (el.tagName === 'A') {
            const selfHref = el.getAttribute('href') || '';
            if (selfHref.includes('ad_variant_id') || selfHref.includes('ad_type') || selfHref.includes('adclick')) {
                return true;
            }
        }

        // ۳. اتریبیوت های رهگیری تبلیغات و CRO
        if (
            el.querySelector('[data-cro-id*="ad_"]') ||
            el.querySelector('[data-cro-id*="sponsored"]') ||
            el.hasAttribute('data-ad') ||
            el.hasAttribute('data-sponsored')
        ) {
            return true;
        }

        // ۴. متن برچسب های داخل کارت
        const leafNodes = el.querySelectorAll('span, div, p, small');
        for (const node of leafNodes) {
            if (node.children.length === 0) {
                const text = node.textContent.trim();
                for (const kw of adKeywords) {
                    if (text === kw || text.includes(kw)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function cleanDOM() {
        let changed = false;

        // الف) پاکسازی اسلایدرها و کاروسل های اسپانسری بین نتایج
        const swipers = document.querySelectorAll('.swiper, [class*="swiper"]');
        swipers.forEach(swiper => {
            if (isAdNode(swiper)) {
                const container = swiper.closest('div[class*="items-center"]') || swiper.parentElement;
                if (container && !container.classList.contains('digi-pure-filtered')) {
                    container.classList.add('digi-pure-filtered');
                    container.style.display = 'none';
                    filteredCount++;
                    changed = true;
                }
            }
        });

        // ب) پاکسازی کارت های کالا در تمام صفحات جستجو و دسته بندی ها
        const candidates = document.querySelectorAll('article, [class*="ProductList__item"], [data-product-box="true"]');
        candidates.forEach(item => {
            if (item.classList.contains('digi-pure-filtered')) return;

            if (isAdNode(item)) {
                // پیدا کردن محفظه کامل خانه گرید جهت حفظ تقارن و چیدمان منظم صفحه
                const gridCell = item.closest('[class*="ProductList__item"]') || item.closest('article') || item;
                if (gridCell && !gridCell.classList.contains('digi-pure-filtered')) {
                    gridCell.classList.add('digi-pure-filtered');
                    gridCell.style.display = 'none';
                    filteredCount++;
                    changed = true;
                }
            }
        });

        // ج) پاکسازی بنرهای تبلیغاتی تعبیه شده در بین لیست محصولات
        const banners = document.querySelectorAll('div[data-cro-id*="banner"], div[data-cro-id*="promotion"], div[data-cro-id*="ad"]');
        banners.forEach(b => {
            if (!b.classList.contains('digi-pure-filtered')) {
                b.classList.add('digi-pure-filtered');
                b.style.display = 'none';
                filteredCount++;
                changed = true;
            }
        });

        if (changed) {
            updateBadge();
        }
    }

    // پایش هوشمند با بهینه سازی فریم ریت (rAF Debounced Observer)
    let isScheduled = false;
    function scheduleClean() {
        if (!isScheduled) {
            isScheduled = true;
            requestAnimationFrame(() => {
                cleanDOM();
                isScheduled = false;
            });
        }
    }

    // رهگیری ناوبری کلاینت در Next.js SPA (تغییر دسته بندی، مرتب سازی، سرچ)
    function hookHistory() {
        const pushState = history.pushState;
        history.pushState = function () {
            pushState.apply(this, arguments);
            scheduleClean();
        };

        const replaceState = history.replaceState;
        history.replaceState = function () {
            replaceState.apply(this, arguments);
            scheduleClean();
        };

        window.addEventListener('popstate', scheduleClean);
    }

    const observer = new MutationObserver(scheduleClean);

    function init() {
        cleanDOM();
        updateBadge();
        hookHistory();

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                updateBadge();
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window._digikalaPureSearchLoaded = true;
    console.log('%c🚀 Digikala Pure Search v1.2.0 Active | Developer: Omid Zaferi (https://github.com/omid-io)', 'color: #00e5ff; font-weight: bold; font-size: 12px;');
})();
