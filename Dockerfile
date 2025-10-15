FROM node:22-bullseye AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate

# Development stage
FROM base AS dev
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# Build stage
FROM base AS build
ENV NODE_ENV=production
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm run build

# Production runtime stage
FROM node:22-bullseye AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]