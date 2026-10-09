# 🛒 دیجی کالا سرچ خالص و ارگانیک (Digikala Pure Search)

<div align="center">

![Digikala Pure Search Banner](https://raw.githubusercontent.com/omid-io/digikala-pure-search/main/assets/banner.png)

### 🧹 حذف هوشمند تبلیغات، کالاهای سفارشی و اسپانسری از دیجی کالا
**مشاهده رتبه بندی ۱۰۰٪ واقعی، ارگانیک و دست نخورده در تمام دسته بندی ها و جستجوها**

[![Install with Tampermonkey](https://img.shields.io/badge/GreasyFork-1--Click_Install-00e5ff?style=for-the-badge&logo=tampermonkey&logoColor=black)](https://update.greasyfork.org/scripts/593664/Digikala%20Pure%20Search%20%7C%20%D8%AD%D8%B0%D9%81%20%D8%AA%D8%A8%D9%84%DB%8C%D8%BA%D8%A7%D8%AA%20%D9%88%20%DA%A9%D8%A7%D9%84%D8%A7%D9%87%D8%A7%DB%8C%20%D8%A7%D8%B3%D9%BE%D8%A7%D9%86%D8%B3%D8%B1%DB%8C%20%D8%AF%DB%8C%D8%AC%DB%8C%20%DA%A9%D8%A7%D9%84%D8%A7.user.js)
[![Direct GitHub Raw Install](https://img.shields.io/badge/GitHub_Raw-Direct_Install-white?style=for-the-badge&logo=github&logoColor=black)](https://raw.githubusercontent.com/omid-io/digikala-pure-search/main/digikala-pure-search.user.js)
[![Download Extension ZIP](https://img.shields.io/badge/Chrome_Extension-Download_ZIP-yellow?style=for-the-badge&logo=googlechrome&logoColor=black)](https://github.com/omid-io/digikala-pure-search/archive/refs/heads/main.zip)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[⚡ نصب سریع ۱-کلیک](#quick-install) • [🧩 نصب افزونه مستقل کروم](#chrome-extension) • [🛡️ فیلتر uBlock Origin](#ublock-filter) • [🎯 چرا این ابزار؟](#why)

</div>

---

<a id="why"></a>
<a id="-مشکل-چیست-و-این-ابزار-چه-می‌کند"></a>
<a id="-مشکل-چیست-و-این-ابزار-چه-می-کند"></a>
## 🎯 مشکل چیست و این ابزار چه می کند؟

در وب سایت دیجی کالا هنگامی که کالایی را جستجو می کنید یا مرتب سازی را روی **«پرفروش ترین»**، **«ارزان ترین»** یا **«محبوب ترین»** قرار می دهید، فروشندگان با پرداخت هزینه تبلیغات (سیستم Digikala Ads)، محصولات خود را با برچسب های کم رنگی مانند **«سفارشی»** یا **«آگهی»** در بالاترین ردیف های لیست تزریق می کنند.

این محصولات **واقعا پرفروش یا ارزان نیستند** و قرار گرفتن آن ها در صدر نتایج باعث خطای دید و خرید کالاهای نامناسب می شود.

این ابزار با **پالایش هوشمند در سطح CSS و DOM (Zero-Flicker)**، کالاهای تبلیغاتی، برچسب های سفارشی، شگفت انگیزهای تحمیلی و بنرهای نامرتبط را حذف کرده تا **فقط و فقط ترتیب واقعی فروش و محصولات ارگانیک** به شما نمایش داده شود.

---

## 🚀 روش های نصب و استفاده (۳ مسیر ساده)

<a id="windows-install"></a>
<a id="quick-install"></a>
### 🔹 روش اول: نصب ۱-کلیکه در ویندوز (فوق‌العاده سریع با Install.bat - پیشنهادی)

ساده‌ترین روش بدون نیاز به وب‌استور و تمپرمانکی:

1. فایل زیپ پروژه را دانلود کنید:  
   📦 **[دانلود پکیج کامل افزونه (ZIP)](https://github.com/omid-io/digikala-pure-search/archive/refs/heads/main.zip)**
2. فایل ZIP را از حالت فشرده خارج (Extract) کنید.
3. روی فایل **`Install.bat`** دابل‌کلیک کنید!
   * اسکریپت اتوماتیک افزونه را در ویندوز شما مستقر می‌کند.
   * یک شورتکات با نام **«دیجی کالا بدون تبلیغ»** روی دسکتاپ شما می‌سازد.
   * با کلیک روی آن یا زدن دکمه Load unpacked در صفحه باز شده کروم، افزونه بلافاصله فعال می‌شود.

---

<a id="tampermonkey-install"></a>
### 🔹 روش دوم: نصب با اسکریپت تمپرمانکی (Tampermonkey)

اگر از قبل افزونه Tampermonkey دارید:

1. روی یکی از دو لینک زیر کلیک کنید:
   * 👉 **[نصب ۱-کلیک از مخزن جهانی Greasy Fork (سرور رسمی)](https://update.greasyfork.org/scripts/593664/Digikala%20Pure%20Search%20%7C%20%D8%AD%D8%B0%D9%81%20%D8%AA%D8%A8%D9%84%DB%8C%D8%BA%D8%A7%D8%AA%20%D9%88%20%DA%A9%D8%A7%D9%84%D8%A7%D9%87%D8%A7%DB%8C%20%D8%A7%D8%B3%D9%BE%D8%A7%D9%86%D8%B3%D8%B1%DB%8C%20%D8%AF%DB%8C%D8%AC%DB%8C%20%DA%A9%D8%A7%D9%84%D8%A7.user.js)**
   * 👉 **[نصب مستقیم از لینک سورس گیت هاب (GitHub Raw)](https://raw.githubusercontent.com/omid-io/digikala-pure-search/main/digikala-pure-search.user.js)**
2. پنجره Tampermonkey باز می شود؛ دکمه **Install** را بزنید.
3. وارد [دیجی کالا](https://www.digikala.com/) شوید؛ تمام تبلیغات فیلتر می شوند!

---

<a id="chrome-extension"></a>
### 🔹 روش سوم: نصب دستی پوشه در کروم (Load Unpacked)

اگر می خواهید پوشه را مستقیما در تنظیمات مرورگر لود کنید:

1. در مرورگر به آدرس `chrome://extensions` بروید.
2. در بالا سمت راست، کلید **Developer mode** را روشن کنید.
3. دکمه **Load unpacked** را بزنید و پوشه **`extension`** را انتخاب کنید. افزونه با پنل کنترلی مدرن فعال می شود!

---

<a id="ublock-filter"></a>
<a id="-روش-سوم-استفاده-در-ublock-origin--adguard"></a>
### 🔹 روش سوم: استفاده در uBlock Origin / AdGuard

اگر از افزونه مسدودساز تبلیغات uBlock Origin استفاده می کنید:
1. وارد تنظیمات uBlock شده و به تب **My Filters (فیلترهای من)** بروید.
2. کدهای فایل **[`ublock-filter.txt`](ublock-filter.txt)** را کپی کرده و در انتهای لیست قرار دهید.
3. دکمه **Apply changes** را بزنید.

---

## ✨ قابلیت های کلیدی

- ⚡ **سازگار با همه فیلترها و مرتب سازی ها:** عملکرد بی نقص روی پرفروش ترین، ارزان ترین، جدیدترین، پربازدیدترین و بالاترین امتیاز.
- 🛡️ **عدم حذف تخفیف های واقعی:** کالاهایی که واقعا پرفروش هستند و تخفیف یا فروش ویژه خورده اند حفظ می شوند و فقط تبلیغات پولی حذف می گردند.
- 🚀 **فوق العاده سریع و بدون پرش تصویر (Zero-Flicker):** تزریق استایل در `document-start` قبل از لود شدن تصاویر.
- 📱 **پشتیبانی از اسکرول نامحدود (Infinite Scroll):** پایش پیوسته با MutationObserver با اسکرول صفحات.
- 📊 **شمارنده زنده و وضعیت:** بج اختصاصی سایبرپانک در گوشه صفحه با نمایش تعداد تبلیغات فیلترشده.

---

## 👨‍💻 توسعه دهنده و سازنده

توسعه داده شده با افتخار توسط **امید ظفری (Omid Zaferi)**  
* معمار نرم افزار و هوش مصنوعی | توسعه دهنده ابزارهای کاربردی وب و متن باز
* 🌐 وب سایت و پورتفولیو: [omid.io](https://github.com/omid-io)
* 🐙 گیت هاب: [@omid-io](https://github.com/omid-io)
* ✍️ مقاله تحلیلی در ویرگول: [پشت صحنه حذف تبلیغات دیجی کالا](https://virgool.io/@omid.zaferi/%DA%86%DA%AF%D9%88%D9%86%D9%87-%D8%AA%D8%A8%D9%84%DB%8C%D8%BA%D8%A7%D8%AA-%D9%88-%DA%A9%D8%A7%D9%84%D8%A7%D9%87%D8%A7%DB%8C-%D8%A7%D8%B3%D9%BE%D8%A7%D9%86%D8%B3%D8%B1%DB%8C-%D8%AF%DB%8C%D8%AC%DB%8C-%DA%A9%D8%A7%D9%84%D8%A7-%D8%AD%D8%B0%D9%81-%DA%A9%D9%86%DB%8C%D9%85-vxodabl4kdqm)

---

## 📄 لایسنس (License)

این پروژه تحت لایسنس **[MIT](LICENSE)** به صورت کاملا آزاد و متن باز برای جامعه توسعه دهندگان و کاربران منتشر شده است.
