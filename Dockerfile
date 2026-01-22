# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy backend
COPY backEnd ./backEnd
WORKDIR /app/backEnd
RUN npm ci --only=production

# Copy frontend
WORKDIR /app
COPY frontEnd ./frontEnd
WORKDIR /app/frontEnd
RUN npm ci && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install PM2
RUN npm install -g pm2

# Copy backend from builder
COPY --from=builder /app/backEnd ./backEnd

# Copy frontend build from builder
COPY --from=builder /app/frontEnd/dist ./frontEnd/dist

# Copy ecosystem config
COPY ecosystem.config.js ./

# Create logs directory
RUN mkdir -p ./logs ./backEnd/uploads ./backEnd/backups

# Expose ports
EXPOSE 3000 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
