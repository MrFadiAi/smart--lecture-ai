@echo off
echo ============================================
echo Smart Lecture AI - Firebase Setup Script
echo ============================================
echo.

REM Check if user is logged in
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/6] Logging in to Firebase...
    firebase login
    if %errorlevel% neq 0 (
        echo Error: Failed to login to Firebase
        exit /b 1
    )
) else (
    echo [1/6] Already logged in to Firebase ✓
)

echo.
echo [2/6] Creating Firebase project...
set /p PROJECT_NAME="Enter project name (e.g., smart-lecture-ai): "
if "%PROJECT_NAME%"=="" set PROJECT_NAME=smart-lecture-ai

firebase projects:create %PROJECT_NAME% --display-name="Smart Lecture AI"
if %errorlevel% neq 0 (
    echo Error: Failed to create project (may already exist)
    set /p USE_EXISTING="Use existing project? (y/n): "
    if /i "%USE_EXISTING%"=="y" (
        firebase projects:list
        set /p PROJECT_NAME="Enter existing project name: "
    ) else (
        exit /b 1
    )
)

echo.
echo [3/6] Enabling Firebase services...
echo Go to Firebase Console: https://console.firebase.google.com/project/%PROJECT_NAME%
echo.
echo Please enable the following services:
echo   1. Authentication (Email/Password provider)
echo   2. Firestore Database (Start in test mode)
echo   3. Storage (Start in test mode)
echo.
pause

echo.
echo [4/6] Getting Firebase configuration...
firebase apps:create web --project=%PROJECT_NAME% --json > firebase-config.json 2>&1
if %errorlevel% equ 0 (
    echo Configuration saved to firebase-config.json ✓
) else (
    echo Warning: Could not auto-generate config, get it from Firebase Console
)

echo.
echo [5/6] Updating .env.local with Firebase credentials...
echo.
echo Please copy your Firebase config from Firebase Console:
echo https://console.firebase.google.com/project/%PROJECT_NAME%/settings/general
echo.
echo Then update .env.local with your credentials.
echo.

echo.
echo [6/6] Deploying Firestore rules...
firebase deploy --only firestore:rules --project=%PROJECT_NAME%
firebase deploy --only storage:rules --project=%PROJECT_NAME%

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Update .env.local with your Firebase credentials
echo 2. Run: npm install
echo 3. Run: vercel --prod
echo.
