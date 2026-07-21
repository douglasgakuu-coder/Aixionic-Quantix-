FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY index.html ./
COPY src ./src
COPY public ./public
COPY tailwind.config.js postcss.config.js ./

RUN npm ci
RUN npm run build

FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]