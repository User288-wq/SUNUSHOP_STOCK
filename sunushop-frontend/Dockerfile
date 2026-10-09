# ===== Frontend Dockerfile - version rapide =====
# Utilise le dist/ deja builde en local (npm run build)
FROM nginx:alpine

# Copier la config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build local
COPY dist/sunushop-frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]