# 🛒 دیجی‌کالا سرچ خالص و ارگانیک (Digikala Pure Search)

<div align="center">

![Digikala Pure Search Banner](https://raw.githubusercontent.com/omid-io/digikala-pure-search/main/assets/banner.png)

### 🧹 حذف هوشمند تبلیغات، کالاهای سفارشی و اسپانسری از دیجی‌کالا
**مشاهده رتبه‌بندی ۱۰۰٪ واقعی، ارگانیک و دست‌نخورده در تمام دسته‌بندی‌ها و جستجوها**

[![Install with Tampermonkey](https://img.shields.io/badge/GreasyFork-نصب_سریع_۱--کلیک-00e5ff?style=for-the-badge&logo=tampermonkey&logoColor=black)](https://update.greasyfork.org/scripts/593664/Digikala%20Pure%20Search%20%7C%20%D8%AD%D8%B0%D9%81%20%D8%AA%D8%A8%D9%84%DB%8C%D8%BA%D8%A7%D8%AA%20%D9%88%20%DA%A9%D8%A7%D9%84%D8%A7%D9%87%D8%A7%DB%8C%20%D8%A7%D8%B3%D9%BE%D8%A7%D9%86%D8%B3%D8%B1%DB%8C%20%D8%AF%DB%8C%D8%AC%DB%8C%E2%80%8C%DA%A9%D8%A7%D9%84%D8%A7.user.js)
[![Direct GitHub Raw Install](https://img.shields.io/badge/GitHub_Raw-نصب_مستقیم-white?style=for-the-badge&logo=github&logoColor=black)](https://raw.githubusercontent.com/omid-io/digikala-pure-search/main/digikala-pure-search.user.js)
[![Download Extension ZIP](https://img.shields.io/badge/Chrome_Extension-دانلود_فایل_ZIP-yellow?style=for-the-badge&logo=googlechrome&logoColor=black)](https://github.com/omid-io/digikala-pure-search/archive/refs/heads/main.zip)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[⚡ نصب سریع ۱-کلیک](#-روش-اول-نصب-سریع-۱-کلیک-با-تمپرمانکی-پیشنهادی) • [🧩 نصب افزونه مستقل کروم](#-روش-دوم-نصب-مستقیم-افزونه-مستقل-کروم-بدون-نیاز-به-تمپرمانکی) • [🛡️ فیلتر uBlock Origin](#-روش-سوم-استفاده-در-ublock-origin--adguard) • [🎯 چرا این ابزار؟](#-مشکل-چیست-و-این-ابزار-چه-می‌کند)

</div>

---

## 🎯 مشکل چیست و این ابزار چه می‌کند؟

در وب‌سایت دیجی‌کالا هنگامی که کالایی را جستجو می‌کنید یا مرتب‌سازی را روی **«پرفروش‌ترین»**، **«ارزان‌ترین»** یا **«محبوب‌ترین»** قرار می‌دهید، فروشندگان با پرداخت هزینه تبلیغات (سیستم Digikala Ads)، محصولات خود را با برچسب‌های کم‌رنگی مانند **«سفارشی»** یا **«آگهی»** در بالاترین ردیف‌های لیست تزریق می‌کنند.

این محصولات **واقعاً پرفروش یا ارزان نیستند** و قرار گرفتن آن‌ها در صدر نتایج باعث خطای دید و خرید کالاهای نامناسب می‌شود.

این ابزار با **پالایش هوشمند در سطح CSS و DOM (Zero-Flicker)**، کالاهای تبلیغاتی و بنرهای نامرتبط را حذف کرده تا **فقط و فقط ترتیب واقعی فروش و محصولات ارگانیک** به شما نمایش داده شود.

---

## 🚀 روش‌های نصب و استفاده (۳ مسیر ساده)

### 🔹 روش اول: نصب سریع ۱-کلیک با تمپرمانکی (پیشنهادی و خودکار)

اگر می‌خواهید اسکریپت با ۱ کلیک نصب شده و تمام آپدیت‌های بعدی را خودکار دریافت کند:

1. ابتدا افزونه رایگان **[Tampermonkey](https://www.tampermonkey.net/)** (یا Violentmonkey) را روی مرورگر خود نصب کنید.
2. روی یکی از دو لینک زیر کلیک کنید:
   * 👉 **[نصب ۱-کلیک از مخزن جهانی Greasy Fork (سرور رسمی)](https://update.greasyfork.org/scripts/593664/Digikala%20Pure%20Search%20%7C%20%D8%AD%D8%B0%D9%81%20%D8%AA%D8%A8%D9%84%DB%8C%D8%BA%D8%A7%D8%AA%20%D9%88%20%DA%A9%D8%A7%D9%84%D8%A7%D9%87%D8%A7%DB%8C%20%D8%A7%D8%B3%D9%BE%D8%A7%D9%86%D8%B3%D8%B1%DB%8C%20%D8%AF%DB%8C%D8%AC%DB%8C%E2%80%8C%DA%A9%D8%A7%D9%84%D8%A7.user.js)**
   * 👉 **[نصب مستقیم از لینک سورس گیت‌هاب (GitHub Raw)](https://raw.githubusercontent.com/omid-io/digikala-pure-search/main/digikala-pure-search.user.js)**
3. پنجره Tampermonkey باز می‌شود؛ دکمه **Install** را بزنید.
4. وارد [دیجی‌کالا](https://www.digikala.com/) شوید؛ تمام تبلیغات فیلتر شده و نشانگر زنده در گوشه صفحه فعال خواهد بود!

---

### 🔹 روش دوم: نصب مستقیم افزونه مستقل کروم (بدون نیاز به تمپرمانکی)

اگر نمی‌خواهید از افزونه‌های مدیریت اسکریپت استفاده کنید:

1. فایل زیپ مخزن را از لینک زیر دانلود کنید:  
   📦 **[دانلود پکیج کامل افزونه (ZIP)](https://github.com/omid-io/digikala-pure-search/archive/refs/heads/main.zip)**
2. فایل ZIP را از حالت فشرده خارج (Extract) کنید.
3. در مرورگر خود (Chrome, Edge, Brave, Opera) به آدرس `chrome://extensions` بروید.
4. در گوشه بالا سمت راست، کلید **Developer mode** را روشن کنید.
5. دکمه **Load unpacked** را بزنید و پوشه **`extension`** را انتخاب کنید. افزونه با آیکون اختصاصی فعال می‌شود!

---

### 🔹 روش سوم: استفاده در uBlock Origin / AdGuard

اگر از افزونه مسدودساز تبلیغات uBlock Origin استفاده می‌کنید:
1. وارد تنظیمات uBlock شده و به تب **My Filters (فیلترهای من)** بروید.
2. کدهای فایل **[`ublock-filter.txt`](ublock-filter.txt)** را کپی کرده و در انتهای لیست قرار دهید.
3. دکمه **Apply changes** را بزنید.

---

## ✨ قابلیت‌های کلیدی

- ⚡ **سازگار با همهٔ فیلترها و مرتب‌سازی‌ها:** عملکرد بی‌نقص روی پرفروش‌ترین، ارزان‌ترین، جدیدترین، پربازدیدترین و بالاترین امتیاز.
- 🛡️ **عدم حذف تخفیف‌های واقعی:** کالاهایی که واقعاً پرفروش هستند و تخفیف یا فروش ویژه خورده‌اند حفظ می‌شوند و فقط تبلیغات پولی حذف می‌گردند.
- 🚀 **فوق‌العاده سریع و بدون پرش تصویر (Zero-Flicker):** تزریق استایل در `document-start` قبل از لود شدن تصاویر.
- 📱 **پشتیبانی از اسکرول نامحدود (Infinite Scroll):** پایش پیوسته با MutationObserver با اسکرول صفحات.
- 📊 **شمارنده زنده و وضعیت:** بج اختصاصی سایبرپانک در گوشه صفحه با نمایش تعداد تبلیغات فیلترشده.

---

## 👨‍💻 توسعه‌دهنده و سازنده

توسعه‌داده‌شده با افتخار توسط **امید ظفری (Omid Zaferi)**  
* معمار نرم‌افزار و هوش مصنوعی | توسعه‌دهنده ابزارهای کاربردی وب و متن‌باز
* 🌐 وب‌سایت و پورتفولیو: [omid.io](https://github.com/omid-io)
* 🐙 گیت‌هاب: [@omid-io](https://github.com/omid-io)
* ✍️ مقاله تحلیلی در ویرگول: [پشت‌صحنه حذف تبلیغات دیجی‌کالا](https://virgool.io/@omid.zaferi/%DA%86%DA%AF%D9%88%D9%86%D9%87-%D8%AA%D8%A8%D9%84%DB%8C%D8%BA%D8%A7%D8%AA-%D9%88-%DA%A9%D8%A7%D9%84%D8%A7%D9%87%D8%A7%DB%8C-%D8%A7%D8%B3%D9%BE%D8%A7%D9%86%D8%B3%D8%B1%DB%8C-%D8%AF%DB%8C%D8%AC%DB%8C-%DA%A9%D8%A7%D9%84%D8%A7-%D8%AD%D8%B0%D9%81-%DA%A9%D9%86%DB%8C%D9%85-vxodabl4kdqm)

---

## 📄 لایسنس (License)

این پروژه تحت لایسنس **[MIT](LICENSE)** به صورت کاملاً آزاد و متن‌باز برای جامعه توسعه‌دهندگان و کاربران منتشر شده است.
