FROM node:21-alpine AS base
RUN corepack enable
RUN apk add --no-cache bash libc6-compat
RUN apk update && yarn global add turbo
WORKDIR /web
ENV TURBO_TELEMETRY_DISABLED=1

## Dependencies
FROM base AS dependencies
COPY package.json yarn.lock ./
COPY .yarnrc.yml turbo.json ./
COPY .yarn/ .yarn/
COPY apps apps
COPY packages packages
COPY tooling tooling

# Remove all files except package.json
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
COPY apps/ apps/
COPY packages/ packages/
COPY tooling/ tooling/
COPY .yarn/ .yarn/
COPY package.json yarn.lock ./
COPY .yarnrc.yml turbo.json ./
COPY --from=dependencies /web/node_modules ./node_modules
RUN yarn build

## Runner
FROM oven/bun:latest AS runner
WORKDIR /web/
ENV NODE_ENV=production
ENV CLIENT_BUILD_DIR=web

# install node
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | /bin/bash - && apt-get install -y nodejs

COPY docker/entrypoint.sh /web/entrypoint.sh
COPY --from=builder /web/ .
COPY --from=builder /web/apps/client/dist/ ./apps/server/web/

RUN corepack enable && yarn

ENTRYPOINT [ "/web/entrypoint.sh" ]
