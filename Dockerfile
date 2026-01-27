# Build stage
FROM node:20-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy backend
COPY backEnd ./backEnd
WORKDIR /app/backEnd
RUN npm install --only=production --legacy-peer-deps

# Copy frontend
WORKDIR /app
COPY frontEnd ./frontEnd
WORKDIR /app/frontEnd
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm install && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app



# Copy backend from builder
COPY --from=builder /app/backEnd ./backEnd

# Copy frontend build from builder
COPY --from=builder /app/frontEnd/dist ./frontEnd/dist



# Create logs directory
RUN mkdir -p ./logs ./backEnd/uploads ./backEnd/backups

# Set environment to production
ENV NODE_ENV=production

# Expose ports
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000), (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start with PM2
CMD ["node", "backEnd/server.js"]
