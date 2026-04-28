# ─── STAGE 1: BUILD ─────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Simple npm install with increased timeout
RUN npm install --timeout=600000

# Copy all remaining source files
COPY . .

# Build the React app
RUN npm run build

# ─── STAGE 2: SERVE ──────────────────────────────────────────────────
FROM nginx:alpine AS final

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 4000