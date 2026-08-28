// ==UserScript==
// @name         Digikala Pure & Organic Search
// @name:fa      دیجی‌کالا سرچ خالص و ارگانیک (حذف تبلیغات و سفارشی‌ها)
// @namespace    https://github.com/omid-io/digikala-pure-search
// @version      3.0.0
// @description  حذف خودکار و کامل تمام کالاهای آگهی، سفارشی، اسپانسر و بنرهای تبلیغاتی از نتایج جستجو و دسته‌بندی‌های دیجی‌کالا برای نمایش ترتیب واقعی محصولات
// @description:fa حذف خودکار و کامل تمام کالاهای آگهی، سفارشی، اسپانسر و بنرهای تبلیغاتی از نتایج جستجو و دسته‌بندی‌های دیجی‌کالا برای نمایش ترتیب واقعی محصولات
// @author       Omid Zaferi (omid-io)
// @homepageURL  https://github.com/omid-io/digikala-pure-search
// @supportURL   https://github.com/omid-io/digikala-pure-search/issues
// @match        *://*.digikala.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=digikala.com
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // ۱. هوک عمیق در سطح شبکه (Network Interceptor): پالایش مستقیم داده‌های API دیجی‌کالا قبل از تحویل به ری‌اکت
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);
        const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');

        if (url.includes('/search/') || url.includes('/categories/') || url.includes('api.digikala.com')) {
            try {
                const clone = response.clone();
                const json = await clone.json();
                if (json && json.data) {
                    // خالی کردن بخش تبلیغات
                    if (json.data.advertisement) {
                        json.data.advertisement = {};
                    }
                    // پالایش لیست محصولات: حذف هر کالایی که آگهی یا ارتقایافته است
                    if (Array.isArray(json.data.products)) {
                        json.data.products = json.data.products.filter(p => {
                            const props = p.properties || {};
                            if (props.is_ad === true) return false;
                            if (props.ad && props.ad.length > 0) return false;
                            if (p.badges && p.badges.some(b => b.title === 'سفارشی' || b.title === 'آگهی')) return false;
                            return true;
                        });
                    }
                    return new Response(JSON.stringify(json), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }
            } catch (e) {
                // در صورت خطا، بدون اختلال به پاسخ اصلی بازمی‌گردد
            }
        }
        return response;
    };

    // ۲. تزریق استایل هوشمند با سلکتور :has() برای جلوگیری از پرش تصویر (Zero-Flicker CSS)
    const style = document.createElement('style');
    style.textContent = `
        article:has(use[*|href="#ads"]),
        article:has(use[href="#ads"]),
        article:has(svg[style*="--color-ad"]),
        article:has(a[href*="ad_variant_id"]),
        div[data-testid="product-card"]:has(a[href*="ad_variant_id"]),
        div[data-testid="product-card"]:has(use[*|href="#ads"]),
        div[class*="ProductList__item"]:has(a[href*="ad_variant_id"]),
        div[class*="ProductList__item"]:has(use[*|href="#ads"]),
        div[class*="SponsoredBrand"],
        div[class*="c-adplacement"],
        a[href*="banner_id"],
        .dk-purged-ad {
            display: none !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    // ۳. پاک‌سازی سمت کلاینت (DOM Scanner) برای سازگاری ۱۰۰٪ با اسکرول نامحدود
    function cleanDOM() {
        document.querySelectorAll('article').forEach(art => {
            const hasAdUrl = art.querySelector('a[href*="ad_variant_id"]');
            const hasAdSvg = art.querySelector('use[*|href="#ads"], use[href="#ads"]');
            const hasAdText = Array.from(art.querySelectorAll('span, p, div')).some(el => {
                if (el.children.length === 0) {
                    const t = el.textContent.trim();
                    return t === 'سفارشی' || t === 'آگهی' || t === 'Ad';
                }
                return false;
            });

            if (hasAdUrl || hasAdSvg || hasAdText) {
                art.classList.add('dk-purged-ad');
                art.style.setProperty('display', 'none', 'important');
                if (art.parentElement && (art.parentElement.className.includes('ProductList__item') || art.parentElement.children.length === 1)) {
                    art.parentElement.classList.add('dk-purged-ad');
                    art.parentElement.style.setProperty('display', 'none', 'important');
                }
            }
        });

        // حذف بنرهای متفرقه اسپانسر بین ردیف‌های محصول
        document.querySelectorAll('div[class*="SponsoredBrand"], div[class*="c-adplacement"], a[href*="banner_id"]').forEach(b => {
            b.classList.add('dk-purged-ad');
            b.style.setProperty('display', 'none', 'important');
        });
    }

    // اجرای دوره‌ای سبک و بدون مصرف منابع
    setInterval(cleanDOM, 350);
})();
