# Dockerfile for ParkBuddy SA Backend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy backend source
COPY backend/ ./

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 10000

# Start server
CMD ["node", "dist/server.js"]