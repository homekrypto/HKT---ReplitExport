# Multi-stage build for HKT Platform
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY *.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build stage
FROM base AS builder

# Install dev dependencies for build
RUN npm ci

# Build the application
RUN npm run build:optimized

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package.json for production
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S hkt -u 1001

# Change ownership
RUN chown -R hkt:nodejs /app

USER hkt

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:8080/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "dist/index.js"]