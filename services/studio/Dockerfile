# Build stage
FROM node:18-alpine AS builder

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:18-alpine

# Install necessary packages for health checks, WebSocket support, and Prisma
RUN apk add --no-cache dumb-init wget curl netcat-openbsd openssl

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S studio -u 1001

# Copy built application and dependencies
COPY --from=builder --chown=studio:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=studio:nodejs /app/dist ./dist
COPY --from=builder --chown=studio:nodejs /app/package.json ./package.json
COPY --from=builder --chown=studio:nodejs /app/prisma ./prisma
COPY --chown=studio:nodejs start.sh ./start.sh

# Make startup script executable
USER root
RUN chmod +x ./start.sh

# Switch to non-root user
USER studio

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

# Expose port
EXPOSE 3001

# Health check with WebSocket support verification
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start the application with proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
