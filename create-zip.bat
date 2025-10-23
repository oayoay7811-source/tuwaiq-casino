@echo off
echo ========================================
echo   Creating ZIP file for sharing...
echo ========================================
echo.

:: Create a temporary directory name with timestamp
set "timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "timestamp=%timestamp: =0%"

:: Set the output filename
set "zipfile=Tuwaiq-Casino-Game_%timestamp%.zip"

echo Creating ZIP file: %zipfile%
echo.
echo Including files:
echo   - index.html
echo   - script.js
echo   - style.css
echo   - README.md
echo   - DEPLOYMENT_GUIDE.md
echo.

:: Use PowerShell to create ZIP
powershell -command "Compress-Archive -Path 'index.html','script.js','style.css','README.md','DEPLOYMENT_GUIDE.md' -DestinationPath '%zipfile%' -Force"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! ZIP file created!
    echo ========================================
    echo.
    echo File: %zipfile%
    echo Location: %cd%
    echo.
    echo You can now share this ZIP file with anyone!
    echo They just need to extract it and open index.html
    echo.
    explorer /select,"%cd%\%zipfile%"
) else (
    echo.
    echo ERROR: Failed to create ZIP file
    echo.
)

pause

