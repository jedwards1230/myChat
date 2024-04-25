FROM oven/bun:1 as base
WORKDIR /app
RUN mkdir -p /temp/dev && \
    chown -R bun:bun /app

FROM base as builder
COPY packages/server/package.json /temp/dev/
RUN cd /temp/dev && bunx turbo prune server --docker && bun install 

FROM base AS release
COPY --from=builder /temp/dev/node_modules ./node_modules
COPY packages/server/ .
COPY packages/client/dist/ web/
USER bun
ENV NODE_ENV=production
ENV CLIENT_BUILD_DIR=web
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "start" ]
