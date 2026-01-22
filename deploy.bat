@echo off
REM Deploy script for E-commerce application (Windows)
REM Usage: deploy.ps1 [docker|pm2|manual]

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   E-commerce Deployment Script
echo ========================================
echo.

set DEPLOY_MODE=%1
if "%DEPLOY_MODE%"=="" set DEPLOY_MODE=pm2

set ENV_FILE=.env.production
set BACKUP_DIR=backups

if not exist "!ENV_FILE!" (
    echo Error: !ENV_FILE! not found
    echo Create .env.production with your production configuration
    exit /b 1
)

echo Creating database backup...
if not exist "!BACKUP_DIR!" mkdir "!BACKUP_DIR!"

for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set BACKUP_FILE=!BACKUP_DIR!\backup_!mydate!_!mytime!.sql

if "!DEPLOY_MODE!"=="docker" (
    echo.
    echo Deploying with Docker...
    docker-compose build --no-cache
    if !errorlevel! neq 0 (
        echo Docker build failed
        exit /b 1
    )
    
    docker-compose up -d
    if !errorlevel! neq 0 (
        echo Docker compose failed
        exit /b 1
    )
    
    echo Waiting for services...
    timeout /t 10 /nobreak
    
    echo Deployment successful!
    echo Access application at http://localhost:3000
    
) else if "!DEPLOY_MODE!"=="pm2" (
    echo.
    echo Deploying with PM2...
    
    REM Check if PM2 is installed
    where pm2 >nul 2>nul
    if !errorlevel! neq 0 (
        echo Installing PM2...
        call npm install -g pm2
    )
    
    REM Install dependencies
    echo Installing backend dependencies...
    cd backEnd
    call npm ci --only=production
    cd ..
    
    echo Building frontend...
    cd frontEnd
    call npm ci
    call npm run build
    cd ..
    
    REM Stop old processes
    echo Stopping old PM2 processes...
    call pm2 delete ecosystem.config.js 2>nul || true
    
    REM Start with PM2
    echo Starting with PM2...
    call pm2 start ecosystem.config.js --env production
    call pm2 save
    
    echo Deployment successful!
    echo View logs with: pm2 logs
    
) else if "!DEPLOY_MODE!"=="manual" (
    echo.
    echo Preparing manual deployment...
    
    echo Installing backend dependencies...
    cd backEnd
    call npm ci --only=production
    cd ..
    
    echo Building frontend...
    cd frontEnd
    call npm ci
    call npm run build
    cd ..
    
    echo.
    echo Manual deployment prepared!
    echo To start the application:
    echo   Backend: cd backEnd ^& npm start
    echo   Frontend: cd frontEnd ^& npm run preview
    
) else (
    echo Unknown deployment mode: !DEPLOY_MODE!
    echo Usage: deploy.bat [docker^|pm2^|manual]
    exit /b 1
)

echo.
echo ========================================
echo   Deployment Log
echo ========================================
echo Deployment: !DEPLOY_MODE! at %date% %time% >> logs\deployments.log

echo.
echo Deployment completed successfully!
echo.
echo Next steps:
echo 1. Verify application: curl http://localhost:3000/health
echo 2. Check logs for errors
echo 3. Test with your frontend
echo.

endlocal
