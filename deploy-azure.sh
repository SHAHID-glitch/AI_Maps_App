#!/bin/bash

# Azure Deployment Script for MAPS Application
# This script automates the deployment to Azure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🗺️  MAPS Application - Azure Deployment Script${NC}"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it from https://docs.microsoft.com/cli/azure/install-azure-cli${NC}"
    exit 1
fi

# Get deployment parameters from user
read -p "Enter resource group name (e.g., maps-rg): " RESOURCE_GROUP
read -p "Enter backend app name (e.g., maps-backend-api): " BACKEND_NAME
read -p "Enter frontend app name (e.g., maps-frontend): " FRONTEND_NAME
read -p "Enter Azure region (e.g., eastus): " REGION
read -p "Enter MongoDB connection string: " MONGODB_URI
read -p "Enter allowed frontend origin(s), comma separated (e.g., https://nice-sky-12345.azurestaticapps.net): " ALLOWED_ORIGINS
read -p "Enter OpenWeather API key (optional): " OPENWEATHER_API_KEY
read -p "Enter GROQ API key (optional): " GROQ_API_KEY

PLAN_NAME="${RESOURCE_GROUP}-plan"

echo ""
echo -e "${YELLOW}📝 Creating Azure resources...${NC}"

# Login to Azure
echo "Logging in to Azure..."
az login

# Create resource group
echo -e "${YELLOW}Creating resource group: $RESOURCE_GROUP${NC}"
az group create --name $RESOURCE_GROUP --location $REGION

# Create App Service Plan
echo -e "${YELLOW}Creating App Service plan...${NC}"
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Create Web App for Backend
echo -e "${YELLOW}Creating backend App Service...${NC}"
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --name $BACKEND_NAME \
  --runtime "node|18-lts"

# Configure backend environment variables
echo -e "${YELLOW}Configuring backend environment variables...${NC}"
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_NAME \
  --settings \
    MONGODB_URI="$MONGODB_URI" \
    PORT=5000 \
    NODE_ENV=production \
    ALLOWED_ORIGINS="$ALLOWED_ORIGINS" \
    OPENWEATHER_API_KEY="$OPENWEATHER_API_KEY" \
    GROQ_API_KEY="$GROQ_API_KEY" \
    WEBSITES_ENABLE_APP_SERVICE_STORAGE=false

# Enable backend deployment from local git
echo -e "${YELLOW}Setting up local git deployment for backend...${NC}"
az webapp deployment source config-local-git \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_NAME

# Get deployment credentials
echo ""
echo -e "${GREEN}✅ Backend created successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Deployment Instructions:${NC}"
echo ""
echo "Backend URL: https://$BACKEND_NAME.azurewebsites.net"
echo ""
echo "To deploy backend code:"
echo "  1. cd backend"
echo "  2. git remote add azure https://<username>@$BACKEND_NAME.scm.azurewebsites.net/$BACKEND_NAME.git"
echo "  3. git push azure main"
echo ""
echo -e "${YELLOW}Get your Azure deployment credentials:${NC}"
echo "  az webapp deployment list-publishing-credentials --resource-group $RESOURCE_GROUP --name $BACKEND_NAME"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Set VITE_API_BASE_URL to 'https://$BACKEND_NAME.azurewebsites.net' in your frontend build"
echo "  2. Deploy frontend to Azure Static Web Apps via GitHub"
echo "  3. Update your backend CORS configuration with your Static Web Apps URL"
echo ""
echo -e "${GREEN}✨ Azure deployment setup complete!${NC}"
