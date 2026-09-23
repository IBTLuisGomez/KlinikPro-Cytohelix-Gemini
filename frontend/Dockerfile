# Stage 1: Build React App
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copiar el build de vite (carpeta dist)
COPY --from=builder /app/dist /usr/share/nginx/html
# Copiar configuración custom de nginx si tuviéramos para React Router,
# pero con la de por defecto basta agregando una regla para SPA (Single Page App)
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
