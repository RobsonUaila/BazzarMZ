#!/bin/bash

# Deploy script for E-commerce application
# Supported: Docker, PM2, Manual

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_MODE=${1:-docker}
ENV_FILE=".env.production"
BACKUP_DIR="./backups"

echo -e "${YELLOW}🚀 E-commerce Deployment Script${NC}"
echo -e "${YELLOW}Mode: $DEPLOY_MODE${NC}\n"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: $ENV_FILE not found${NC}"
    echo "Create .env.production with your production configuration"
    exit 1
fi

# Load environment variables
export $(cat $ENV_FILE | xargs)

# Create backup
echo -e "${YELLOW}📦 Creating database backup...${NC}"
mkdir -p $BACKUP_DIR
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

if command -v mysqldump &> /dev/null; then
    mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE
    echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
else
    echo -e "${YELLOW}⚠️  mysqldump not found, skipping database backup${NC}"
fi

case $DEPLOY_MODE in
    docker)
        echo -e "${YELLOW}🐳 Deploying with Docker...${NC}"
        
        # Check if docker is installed
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}❌ Docker not found. Please install Docker.${NC}"
            exit 1
        fi
        
        # Build and start containers
        echo "Building Docker image..."
        docker-compose build --no-cache
        
        echo "Starting services..."
        docker-compose up -d
        
        # Wait for services to be healthy
        echo "Waiting for services to be healthy..."
        sleep 10
        
        # Check health
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Services are healthy${NC}"
        else
            echo -e "${RED}❌ Services health check failed${NC}"
            docker-compose logs
            exit 1
        fi
        
        echo -e "${GREEN}✅ Docker deployment successful!${NC}"
        ;;
        
    pm2)
        echo -e "${YELLOW}⚙️  Deploying with PM2...${NC}"
        
        # Check if PM2 is installed
        if ! command -v pm2 &> /dev/null; then
            echo "Installing PM2 globally..."
            npm install -g pm2
        fi
        
        # Install dependencies
        echo "Installing dependencies..."
        cd backEnd && npm ci --only=production && cd ..
        cd frontEnd && npm ci && npm run build && cd ..
        
        # Stop old processes
        echo "Stopping old PM2 processes..."
        pm2 delete ecosystem.config.js 2>/dev/null || true
        
        # Start with PM2
        echo "Starting with PM2..."
        pm2 start ecosystem.config.js --env production
        
        # Save PM2 config
        pm2 save
        
        # Setup PM2 startup
        echo "Setting up PM2 startup..."
        pm2 startup
        
        echo -e "${GREEN}✅ PM2 deployment successful!${NC}"
        ;;
        
    manual)
        echo -e "${YELLOW}📦 Deploying manually...${NC}"
        
        # Install backend dependencies
        echo "Installing backend dependencies..."
        cd backEnd
        npm ci --only=production
        cd ..
        
        # Build frontend
        echo "Building frontend..."
        cd frontEnd
        npm ci
        npm run build
        cd ..
        
        echo -e "${GREEN}✅ Manual deployment prepared!${NC}"
        echo "To start the application:"
        echo "  Backend: cd backEnd && npm start"
        echo "  Frontend: cd frontEnd && npm run preview"
        ;;
        
    *)
        echo -e "${RED}❌ Unknown deployment mode: $DEPLOY_MODE${NC}"
        echo "Usage: ./deploy.sh [docker|pm2|manual]"
        exit 1
        ;;
esac

# Log deployment
echo -e "${YELLOW}📝 Logging deployment...${NC}"
echo "Deployment: $DEPLOY_MODE at $(date)" >> ./logs/deployments.log

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify application is running: curl http://localhost:3000/health"
echo "2. Check logs for any errors"
echo "3. Test with your frontend"
