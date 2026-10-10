(function () {
    'use strict';

    // ۱. تنظیمات پیش فرض کاربر
    let currentSettings = {
        hideSponsored: true,
        hideDeals: true,
        hideBanners: true
    };

    let filteredCount = 0;
    let badgeEl = null;

    // ۲. بارگذاری تنظیمات از حافظه پایدار کروم
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(currentSettings, (items) => {
            if (items) {
                currentSettings = items;
                applyRootClasses();
                cleanDOM();
            }
        });
    }

    function applyRootClasses() {
        const root = document.documentElement;
        if (!root) return;

        if (currentSettings.hideSponsored) {
            root.classList.remove('dk-allow-sponsored');
        } else {
            root.classList.add('dk-allow-sponsored');
        }

        if (currentSettings.hideDeals) {
            root.classList.remove('dk-allow-deals');
        } else {
            root.classList.add('dk-allow-deals');
        }

        if (currentSettings.hideBanners) {
            root.classList.remove('dk-allow-banners');
        } else {
            root.classList.add('dk-allow-banners');
        }
    }

    applyRootClasses();

    // ۳. گوش دادن به پیام های پاپ آپ جهت تغییر تنظیمات زنده
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'settingsChanged' && message.settings) {
                currentSettings = message.settings;
                applyRootClasses();
                cleanDOM();
                sendResponse({ status: 'ok' });
            } else if (message.action === 'getStats') {
                sendResponse({ blockedCount: filteredCount });
            }
            return true;
        });
    }

    // ۴. ساخت نشانگر زنده در گوشه صفحه دیجی کالا
    function updateBadge() {
        if (!document.body) return;
        if (!badgeEl) {
            badgeEl = document.createElement('div');
            badgeEl.id = 'digi-pure-badge';
            badgeEl.title = 'افزونه سرچ خالص دیجی کالا • توسعه دهنده: امید ظفری (Omid Zaferi)';
            badgeEl.innerHTML = `
                <span class="dot"></span>
                <span>سرچ خالص: <strong id="digi-pure-count" style="color: #00e5ff;">۰</strong> تبلیغ حذف شد</span>
            `;
            document.body.appendChild(badgeEl);
        }
        const countSpan = document.getElementById('digi-pure-count');
        if (countSpan) {
            countSpan.textContent = filteredCount.toLocaleString('fa-IR');
        }
    }

    const sponsoredKeywords = ['سفارشی', 'آگهی', 'اسپانسری', 'Sponsored', 'Ad'];
    const dealKeywords = ['شگفت انگیز', 'شگفت انگیزها', 'پیشنهاد شگفت انگیز', 'فروش ویژه'];

    function isSponsoredNode(el) {
        if (!currentSettings.hideSponsored || !el) return false;

        if (el.querySelector('dds-icon[name="badge-ad"]')) return true;

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

        if (
            el.querySelector('[data-cro-id*="ad_"]') ||
            el.querySelector('[data-cro-id*="sponsored"]') ||
            el.hasAttribute('data-ad') ||
            el.hasAttribute('data-sponsored')
        ) {
            return true;
        }

        const leafNodes = el.querySelectorAll('span, div, p, small');
        for (const node of leafNodes) {
            if (node.children.length === 0) {
                const text = node.textContent.trim();
                for (const kw of sponsoredKeywords) {
                    if (text === kw) return true;
                }
            }
        }
        return false;
    }

    function isDealNode(el) {
        if (!currentSettings.hideDeals || !el) return false;

        // الف) بررسی بج های تصویری و وکتوری شگفت انگیز
        if (
            el.querySelector('img[src*="IncredibleOffer"]') ||
            el.querySelector('img[src*="SpecialOffer"]') ||
            el.querySelector('img[src*="topBadge"]') ||
            el.querySelector('img[src*="incredible"]') ||
            el.querySelector('dds-icon[name="badge-amazing"]') ||
            el.querySelector('dds-icon[name="badge-special-sale"]')
        ) {
            return true;
        }

        // ب) بررسی کلاس ها و تایمرهای فروش ویژه
        if (
            el.querySelector('[class*="DealOfTheDay"]') ||
            el.querySelector('[class*="ProductPromotionTimeline"]') ||
            el.querySelector('[data-cro-id*="incredible"]')
        ) {
            return true;
        }

        // ج) بررسی متنی با نرمال سازی نیم فاصله
        const fullText = (el.innerText || el.textContent || '').replace(/[\u200c\u200b]/g, ' ');
        if (
            fullText.includes('فروش ویژه') ||
            fullText.includes('شگفت انگیز') ||
            fullText.includes('پیشنهاد شگفت انگیز')
        ) {
            // اطمینان از اینکه متن واقعا مربوط به نشان یا تخفیف است
            const leafNodes = el.querySelectorAll('span, div, p, small, h3, h4');
            for (const node of leafNodes) {
                const text = (node.textContent || '').replace(/[\u200c\u200b]/g, ' ').trim();
                for (const kw of dealKeywords) {
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

        // الف) کاروسل های اسپانسری بین نتایج
        if (currentSettings.hideBanners) {
            const swipers = document.querySelectorAll('.swiper, [class*="swiper"]');
            swipers.forEach(swiper => {
                if (swiper.querySelector('dds-icon[name="badge-ad"]') || isSponsoredNode(swiper)) {
                    const container = swiper.closest('div[class*="items-center"]') || swiper.closest('div[class*="rounded"]') || swiper.parentElement;
                    if (container && !container.classList.contains('digi-pure-banner-filtered')) {
                        container.classList.add('digi-pure-banner-filtered');
                        container.style.display = 'none';
                        
                        // جمع کردن کامل والد بیرونی با کادر و ارتفاع خالی
                        let p = container.parentElement;
                        while (p && p !== document.body && !p.classList.contains('product-list-virtual-feed')) {
                            if (p.className && (p.className.includes('min-h-') || p.className.includes('border-complete') || p.className.includes('rounded-large'))) {
                                p.style.display = 'none';
                                if (p.parentElement && p.parentElement.children.length === 1) {
                                    p.parentElement.style.display = 'none';
                                }
                                break;
                            }
                            p = p.parentElement;
                        }

                        filteredCount++;
                        changed = true;
                    }
                }
            });

            const banners = document.querySelectorAll('div[data-cro-id*="banner"], div[data-cro-id*="promotion"], div[data-cro-id*="ad_"]');
            banners.forEach(b => {
                if (!b.classList.contains('digi-pure-banner-filtered')) {
                    b.classList.add('digi-pure-banner-filtered');
                    b.style.display = 'none';
                    filteredCount++;
                    changed = true;
                }
            });
        }

        // ب) کارت های کالا در تمام صفحات جستجو و دسته بندی ها
        const candidates = document.querySelectorAll('article, [class*="ProductList__item"], [data-product-box="true"]');
        candidates.forEach(item => {
            const gridCell = item.closest('[class*="ProductList__item"]') || item.closest('article') || item;

            // بررسی کالای اسپانسری
            if (currentSettings.hideSponsored && isSponsoredNode(item)) {
                if (!gridCell.classList.contains('digi-pure-ad-filtered')) {
                    gridCell.classList.add('digi-pure-ad-filtered');
                    gridCell.style.display = 'none';
                    filteredCount++;
                    changed = true;
                }
                return;
            }

            // بررسی شگفت انگیز و فروش ویژه
            if (currentSettings.hideDeals && isDealNode(item)) {
                if (!gridCell.classList.contains('digi-pure-deal-filtered')) {
                    gridCell.classList.add('digi-pure-deal-filtered');
                    gridCell.style.display = 'none';
                    filteredCount++;
                    changed = true;
                }
                return;
            }
        });

        if (changed) {
            updateBadge();
        }

        // ج) تنظیم هوشمند عرض ستون های هر ردیف جهت حذف خانه های خالی بدون شکستن اسکرول
        adjustGridRows();
    }

    function adjustGridRows() {
        const feed = document.querySelector('.product-list-virtual-feed');
        if (!feed) return;

        feed.querySelectorAll('div[style*="grid"]').forEach(g => {
            const visibleChildren = Array.from(g.children).filter(c => {
                const art = c.querySelector('article') || (c.tagName === 'ARTICLE' ? c : null);
                return art && window.getComputedStyle(art).display !== 'none';
            });

            const count = visibleChildren.length;
            if (count === 0) {
                g.style.display = 'none';
                if (g.parentElement && g.parentElement !== feed) {
                    g.parentElement.style.height = '0px';
                }
            } else if (count > 0 && count < 4) {
                g.style.gridTemplateColumns = `repeat(${count}, minmax(0px, 1fr))`;
                g.style.display = 'grid';
            } else {
                g.style.gridTemplateColumns = 'repeat(4, minmax(0px, 1fr))';
                g.style.display = 'grid';
            }
        });
    }

    // ۵. پایش هوشمند با بهینه سازی فریم ریت (rAF Debounced Observer)
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

    // ۶. رهگیری ناوبری کلاینت در Next.js SPA
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

    console.log('%c🚀 Digikala Pure Search Extension v2.0 Active | Developer: Omid Zaferi (https://github.com/omid-io)', 'color: #00e5ff; font-weight: bold; font-size: 12px;');
})();
