FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Gera cliente do Prisma dentro do container
RUN npx prisma generate

COPY . .

EXPOSE 3001

CMD ["npx", "tsx", "server.ts"]
