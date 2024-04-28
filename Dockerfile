FROM node:21-alpine AS base
RUN corepack enable
RUN apk add --no-cache libc6-compat
RUN apk update && yarn global add turbo
WORKDIR /app
ENV TURBO_TELEMETRY_DISABLED=1
COPY .gitignore .gitignore
COPY .yarnrc.yml .yarnrc.yml

## Client Builder
FROM base AS client_builder
COPY . .
RUN turbo prune @mychat/client --docker

## Server Builder
FROM base AS server_builder
COPY . .
RUN turbo prune @mychat/server --docker

## Client Installer
FROM base AS client_installer
# Add lockfile and package.json's of isolated subworkspace
COPY --from=client_builder /app/out/json/ .
COPY --from=client_builder /app/out/yarn.lock ./yarn.lock
RUN corepack up && apk add --no-cache bash 
RUN yarn install


# Build the project
COPY --from=client_builder /app/out/full/ .
RUN yarn turbo run build --filter=client...

## Server Installer
FROM base AS server_installer
# Add lockfile and package.json's of isolated subworkspace
COPY --from=server_builder /app/out/json/ .
COPY --from=server_builder /app/out/yarn.lock ./yarn.lock
RUN corepack up && yarn install

# Build the project
COPY --from=server_builder /app/out/full/ .
RUN yarn turbo run build --filter=server...

## Runner
FROM oven/bun:latest AS runner
ENV NODE_ENV=production
ENV CLIENT_BUILD_DIR=web

WORKDIR /app
USER bun
COPY --from=server_installer --chown=bun:bun /app/ .

WORKDIR /app/packages/server
COPY --from=client_installer --chown=bun:bun /app/packages/client/dist/ ./web/

#CMD bun run src/index.ts
CMD tail -f /dev/null