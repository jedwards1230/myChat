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
FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 mychat
USER mychat
COPY --from=server_installer /app/packages/server/. .
COPY --from=server_installer /app/packages/server/package.json .
COPY --from=client_installer --chown=mychat:nodejs /app/packages/client/dist/ ./web/

CMD yarn start