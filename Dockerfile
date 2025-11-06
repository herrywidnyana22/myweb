# --- Stage 1: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install tools needed for native deps (sharp, mozjpeg, dll)
RUN apk add --no-cache \
    build-base \
    autoconf \
    automake \
    libtool \
    nasm \
    bash \
    git \
    python3

# Copy & install dependencies
COPY package*.json ./
RUN npm ci

# Copy rest of the code
COPY . .

# Build Next.js
RUN npm run build


# --- Stage 2: Production Image ---
FROM node:20-alpine
WORKDIR /app

# Copy built app from builder
COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
