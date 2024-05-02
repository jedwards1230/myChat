FROM node:21-alpine AS base
RUN corepack enable
RUN apk add --no-cache bash libc6-compat
RUN apk update && yarn global add turbo
WORKDIR /app
ENV TURBO_TELEMETRY_DISABLED=1

## Installer
FROM base AS installer
ENV EXPO_USE_FAST_RESOLVER=1
COPY . .
RUN yarn install
RUN yarn build

## Runner
FROM oven/bun:latest AS runner
ARG COMMIT_HASH
ARG REPO_URL

ENV EXPO_PUBLIC_COMMIT_HASH=$COMMIT_HASH
ENV EXPO_PUBLIC_GITHUB_REPO_URL=$REPO_URL
ENV NODE_ENV=production
ENV CLIENT_BUILD_DIR=web

WORKDIR /app
USER bun

RUN apt-get update && apt-get install -y tree
RUN tree .

COPY --from=installer --chown=bun:bun /app/ .
COPY --from=installer --chown=bun:bun /app/packages/client/dist/ ./packages/server/web/

WORKDIR /app/packages/server
CMD bun run src/index.ts
