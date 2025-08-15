@echo off
setlocal enabledelayedexpansion

:: Set compression quality (0–100)
set "QUALITY=80"

:: Temporary file for safe overwrite
set "TMPFILE=%TEMP%\compressed_tmp.webp"

:: Loop through all .webp files in this folder
for %%F in (*.webp) do (
    echo Compressing: %%~nxF
    cwebp -q %QUALITY% "%%F" -o "!TMPFILE!"
    move /Y "!TMPFILE!" "%%F" >nul
)

echo All .webp files compressed and overwritten.
pause
