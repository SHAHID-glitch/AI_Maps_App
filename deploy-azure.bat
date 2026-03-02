@echo off
REM Azure Deployment Script for MAPS Application (Windows)
REM This script automates the deployment to Azure

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 🗺️  MAPS Application - Azure Deployment
echo ========================================
echo.

REM Check if Azure CLI is installed
az --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Azure CLI is not installed.
    echo Please install it from: https://docs.microsoft.com/cli/azure/install-azure-cli
    pause
    exit /b 1
)

REM Get deployment parameters from user
set /p RESOURCE_GROUP="Enter resource group name (e.g., maps-rg): "
set /p BACKEND_NAME="Enter backend app name (e.g., maps-backend-api): "
set /p FRONTEND_NAME="Enter frontend app name (e.g., maps-frontend): "
set /p REGION="Enter Azure region (e.g., eastus): "
set /p MONGODB_URI="Enter MongoDB connection string: "

echo.
echo 📝 Creating Azure resources...
echo.

REM Login to Azure
echo Logging in to Azure...
call az login

REM Create resource group
echo ✓ Creating resource group: %RESOURCE_GROUP%
call az group create --name %RESOURCE_GROUP% --location %REGION%

REM Create App Service Plan
echo ✓ Creating App Service plan...
call az appservice plan create ^
  --name maps-plan ^
  --resource-group %RESOURCE_GROUP% ^
  --sku B1 ^
  --is-linux

REM Create Web App for Backend
echo ✓ Creating backend App Service...
call az webapp create ^
  --resource-group %RESOURCE_GROUP% ^
  --plan maps-plan ^
  --name %BACKEND_NAME% ^
  --runtime "node|18-lts"

REM Configure backend environment variables
echo ✓ Configuring backend environment variables...
call az webapp config appsettings set ^
  --resource-group %RESOURCE_GROUP% ^
  --name %BACKEND_NAME% ^
  --settings ^
    MONGODB_URI="%MONGODB_URI%" ^
    PORT=5000 ^
    NODE_ENV=production ^
    WEBSITES_ENABLE_APP_SERVICE_STORAGE=false

REM Enable backend deployment from local git
echo ✓ Setting up local git deployment...
call az webapp deployment source config-local-git ^
  --resource-group %RESOURCE_GROUP% ^
  --name %BACKEND_NAME%

echo.
echo ========================================
echo ✅ Backend created successfully!
echo ========================================
echo.
echo Backend URL: https://%BACKEND_NAME%.azurewebsites.net
echo.
echo 📋 Next Steps:
echo.
echo 1. Deploy backend:
echo    cd backend
echo    git remote add azure https://^<username^>@%BACKEND_NAME%.scm.azurewebsites.net/%BACKEND_NAME%.git
echo    git push azure main
echo.
echo 2. Deploy frontend to Azure Static Web Apps via GitHub
echo.
echo 3. Update environment variables
echo.
echo For detailed instructions, see AZURE_DEPLOYMENT.md
echo.
pause
