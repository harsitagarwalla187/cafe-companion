# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy package definitions and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Production serve stage using Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose standard Cloud Run port
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
