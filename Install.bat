@echo off
chcp 65001 >nul
title نصب سریع افزونه سرچ خالص دیجی کالا (Digikala Pure Search)

echo ======================================================================
echo    🛒 نصب ۱-کلیکه افزونه دیجی کالا سرچ خالص (Omid Zaferi - omid.io)
echo ======================================================================
echo.

set "DEST_DIR=%LOCALAPPDATA%\DigikalaPureSearch"
set "SRC_DIR=%~dp0extension"

echo [1/3] در حال آماده سازی فایل های افزونه در مسیر دائمی ویندوز...
if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"
xcopy "%SRC_DIR%" "%DEST_DIR%\" /E /I /Y /Q >nul
echo       فایل های افزونه با موفقیت در مسیر زیر مستقر شدند:
echo       %DEST_DIR%
echo.

echo [2/3] کپی کردن آدرس پوشه در حافظه سیستم (Clipboard)...
powershell -Command "Set-Clipboard -Value '%DEST_DIR%'"
echo       آدرس در کلیپ بورد ذخیره شد (کافیست در پنجره انتخاب پوشه Paste کنید).
echo.

echo [3/3] ایجاد شرتکات اختصاصی روی دسکتاپ...
set "VBS_SCRIPT=%TEMP%\create_shortcut.vbs"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "SHORTCUT_PATH=%DESKTOP_DIR%\دیجی کالا بدون تبلیغ.lnk"

(
echo Set oWS = WScript.CreateObject("WScript.Shell"^)
echo sLinkFile = "%SHORTCUT_PATH%"
echo Set oLink = oWS.CreateShortcut(sLinkFile^)
echo oLink.TargetPath = "chrome.exe"
echo oLink.Arguments = "--load-extension=""%DEST_DIR%"" https://www.digikala.com"
echo oLink.Description = "اجرای دیجی کالا با افزونه سرچ خالص"
echo oLink.Save
) > "%VBS_SCRIPT%"

cscript //nologo "%VBS_SCRIPT%" >nul
if exist "%VBS_SCRIPT%" del "%VBS_SCRIPT%"
echo       شرتکات «دیجی کالا بدون تبلیغ» روی دسکتاپ شما ایجاد شد!
echo.

echo ======================================================================
echo    🎉 آماده سازی با موفقیت به پایان رسید!
echo ======================================================================
echo.
echo دو روش برای استفاده وجود دارد:
echo 1. کافیست روی شرتکات «دیجی کالا بدون تبلیغ» روی دسکتاپ کلیک کنید.
echo 2. یا در صفحه chrome://extensions دکمه Load unpacked را بزنید و Ctrl+V کنید.
echo.
echo در حال باز کردن گوگل کروم...
timeout /t 2 >nul

start chrome.exe "chrome://extensions" "https://www.digikala.com"

exit
