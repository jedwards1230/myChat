FROM node:21-alpine AS base
RUN corepack enable
RUN apk add --no-cache bash libc6-compat
RUN apk update && yarn global add turbo
WORKDIR /web
ENV TURBO_TELEMETRY_DISABLED=1

## Dependencies
FROM base AS dependencies
COPY package.json yarn.lock ./
COPY .yarn/patches .yarn/patches
COPY .yarnrc.yml .yarnrc.yml
COPY apps apps
COPY packages packages
COPY tooling tooling
RUN find apps -type f ! -name 'package.json' -delete
RUN find packages -type f ! -name 'package.json' -delete
RUN find tooling -type f ! -name 'package.json' -delete

RUN yarn install

## Builder
FROM dependencies AS builder
ARG COMMIT_HASH
ARG REPO_URL
ENV EXPO_PUBLIC_COMMIT_HASH=$COMMIT_HASH
ENV EXPO_PUBLIC_GITHUB_REPO_URL=$REPO_URL
ENV EXPO_USE_FAST_RESOLVER=1
COPY . .
COPY --from=dependencies /web/node_modules ./node_modules
RUN yarn build

## Runner
FROM oven/bun:latest AS runner
ENV NODE_ENV=production
ENV CLIENT_BUILD_DIR=web

WORKDIR /web
USER bun

COPY --from=builder --chown=bun:bun /web/ .
COPY --from=builder --chown=bun:bun /web/apps/client/dist/ ./apps/server/web/

WORKDIR /web/apps/server
CMD bun run src/index.ts
