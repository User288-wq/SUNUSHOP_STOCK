# ===== ETAPE 1 : Build =====
FROM node:20-alpine AS build
WORKDIR /app

# Copier package.json et installer les dependances
COPY package*.json ./
RUN npm ci

# Copier le code source et builder
COPY . .
RUN npm run build -- --configuration production

# ===== ETAPE 2 : Runtime =====
FROM nginx:alpine

# Copier la config nginx personnalisee
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers builders
COPY --from=build /app/dist/sunushop-frontend/browser /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Lancer nginx
CMD ["nginx", "-g", "daemon off;"]