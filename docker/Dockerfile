FROM node:21-alpine AS base
RUN corepack enable \
    && apk add --no-cache bash libc6-compat \
    && apk update && yarn global add turbo
WORKDIR /web
ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM
ENV TURBO_TELEMETRY_DISABLED=1

## Dependencies
FROM base AS dependencies
COPY . .
RUN turbo prune @mychat/web --docker

## Builder
FROM base AS builder
ARG COMMIT_HASH
ARG REPO_URL
ENV EXPO_PUBLIC_COMMIT_HASH=$COMMIT_HASH
ENV EXPO_PUBLIC_GITHUB_REPO_URL=$REPO_URL
ENV EXPO_USE_FAST_RESOLVER=1

COPY .gitignore .gitignore
COPY --from=dependencies /web/out/json/ .
COPY --from=dependencies /web/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project
COPY --from=dependencies /web/out/full/ .
RUN yarn turbo run build --filter=@mychat/web...


## Runner
FROM oven/bun:latest AS runner
WORKDIR /web/
ENV NODE_ENV=production
ENV CLIENT_BUILD_DIR=web

# Install node
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /web/apps/web/next.config.js .
COPY --from=builder /web/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /web/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /web/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /web/apps/web/public ./apps/web/public

CMD node apps/web/server.js