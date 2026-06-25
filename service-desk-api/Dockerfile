FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Убираем --only=production
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/main.js"]
