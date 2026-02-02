# Multi-stage Dockerfile for sparkle-todo

# ============================================
# Stage 1: Base with dependencies
# ============================================
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ============================================
# Stage 2: Development (for testing & dev server)
# ============================================
FROM base AS development
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ============================================
# Stage 3: Test runner
# ============================================
FROM base AS test
COPY . .
CMD ["npm", "test"]

# ============================================
# Stage 4: Build production assets
# ============================================
FROM base AS builder
COPY . .
ARG BUILD_MODE=production
RUN npm run build:${BUILD_MODE}

# ============================================
# Stage 5: Production (nginx)
# ============================================
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
