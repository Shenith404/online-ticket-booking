# Stage 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code and configuration files
COPY src ./src
COPY tsconfig.json tsconfig.build.json ./

# Build the NestJS application
RUN npm run build

# Stage 2: Install production dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 3: Create the production-ready image
FROM node:20-alpine AS production

WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy package.json for reference
COPY --from=build /app/package.json ./package.json

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/dist ./dist

# Note: Environment variables should be provided at runtime

# Change ownership to the non-root user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose the port your NestJS application listens on
EXPOSE 3002



# Command to run the application in production mode
CMD [ "node", "dist/main" ]