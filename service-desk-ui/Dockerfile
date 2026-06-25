# ============================================
# ЭТАП 1: Сборка Angular-приложения
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build -- --configuration=production

# ============================================
# ЭТАП 2: Запуск через Nginx
# ============================================
FROM nginx:alpine

COPY --from=build /app/dist/service-desk-ui /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
