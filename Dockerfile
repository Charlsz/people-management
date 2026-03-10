FROM node:20-alpine AS base

WORKDIR /app

# Dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Prisma generate
COPY prisma ./prisma/
RUN npx prisma generate

# Build
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
