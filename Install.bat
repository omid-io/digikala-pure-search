@echo off
chcp 65001 >nul
title نصب دائمی افزونه دیجی کالا سرچ خالص در گوگل کروم

echo ======================================================================
echo    🛒 نصب ۱-کلیکه افزونه دیجی کالا سرچ خالص (Omid Zaferi - omid.io)
echo ======================================================================
echo.

set "DEST_DIR=%LOCALAPPDATA%\DigikalaPureSearch"
set "EXT_ID=jfhoahnnmlkadloohnoebnofcfacibma"
set "CRX_SRC=%~dp0extension.crx"
set "CRX_DEST=%DEST_DIR%\extension.crx"

echo [1/3] در حال مستقر کردن پکیج رسمی افزونه در ویندوز...
if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"
copy /Y "%CRX_SRC%" "%CRX_DEST%" >nul
xcopy "%~dp0extension" "%DEST_DIR%\extension\" /E /I /Y /Q >nul

echo [2/3] ثبت افزونه در رجیستری رسمی گوگل کروم (External Extensions)...
reg add "HKCU\Software\Google\Chrome\Extensions\%EXT_ID%" /v "path" /t REG_SZ /d "%CRX_DEST%" /f >nul
reg add "HKCU\Software\Google\Chrome\Extensions\%EXT_ID%" /v "version" /t REG_SZ /d "2.2.0" /f >nul

:: برای مرورگر مایکروسافت اج نیز همزمان ثبت می شود
reg add "HKCU\Software\Microsoft\Edge\Extensions\%EXT_ID%" /v "path" /t REG_SZ /d "%CRX_DEST%" /f >nul
reg add "HKCU\Software\Microsoft\Edge\Extensions\%EXT_ID%" /v "version" /t REG_SZ /d "2.2.0" /f >nul

echo       افزونه با موفقیت به سیستم معرفی شد!
echo.

echo [3/3] فراخوانی مرورگر جهت نمایش پیام تایید نصب...
echo ======================================================================
echo    نکته بسیار مهم:
echo    به محض باز شدن کروم، یک پیام رسمی در بالای مرورگر ظاهر می شود:
echo    "دیجی کالا سرچ خالص اضافه شد"
echo    کافیست دکمه [Enable extension] یا [فعال سازی افزونه] را بزنید!
echo ======================================================================
echo.
timeout /t 2 >nul

start chrome.exe "https://www.digikala.com"

exit
