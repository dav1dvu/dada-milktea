@echo off
chcp 65001 >nul
title Tiệm Trà Sữa DADA - Dada Milktea Launcher
echo ==============================================================
echo    TIỆM TRÀ SỮA DADA (DADA MILKTEA) - 1-CLICK LAUNCHER
echo ==============================================================
echo.
echo Đang khởi động máy chủ Web Game nội bộ...
echo.

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    start http://localhost:8080/
    node local_server_test.mjs
    pause
    exit /b
)

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Khởi chạy qua Python Server...
    start http://localhost:8080/
    python -m http.server 8080
    pause
    exit /b
)

echo Không tìm thấy Node.js hoặc Python. Vui lòng mở tệp index.html trực tiếp bằng trình duyệt.
pause
