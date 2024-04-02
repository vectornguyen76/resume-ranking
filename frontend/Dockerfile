FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm i -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000
