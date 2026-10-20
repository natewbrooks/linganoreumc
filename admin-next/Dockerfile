# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Baked into the client bundle at build time. Overrides any local .env file
ENV NEXT_PUBLIC_API_BASE_URL=https://api.linganoreumc.com
ENV NEXT_PUBLIC_BASE_URL=https://linganoreumc.com
RUN npm run build

# Run stage
FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
