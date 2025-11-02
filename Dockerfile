
FROM node:20-alpine AS builder_myweb
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder_myweb /app/dist /usr/share/nginx/html
EXPOSE 3000