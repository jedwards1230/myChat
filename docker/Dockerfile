FROM oven/bun:latest AS base
RUN bun add -g turbo
WORKDIR /web
ARG TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM
ENV TURBO_TELEMETRY_DISABLED=1

## Builder
FROM base AS builder
WORKDIR /web
ARG COMMIT_HASH
ARG REPO_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV EXPO_PUBLIC_COMMIT_HASH=$COMMIT_HASH
ENV EXPO_PUBLIC_GITHUB_REPO_URL=$REPO_URL
ENV EXPO_USE_FAST_RESOLVER=1

COPY . .
RUN bun install
RUN bun run build:web

## Runner
FROM node:21-alpine AS runner
WORKDIR /web/
ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs nextjs
USER nextjs

COPY --from=builder /web/apps/web/next.config.js .
COPY --from=builder /web/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /web/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /web/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /web/apps/web/public ./apps/web/public

CMD node apps/web/server.js