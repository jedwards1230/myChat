FROM oven/bun:1 as base
WORKDIR /app
RUN mkdir -p /temp/dev && \
    chown -R bun:bun /app

FROM base as builder
COPY server/package.json server/bun.lockb /temp/dev/
RUN cd /temp/dev && \ 
    bun install --frozen-lockfile

FROM base AS release
COPY --from=builder /temp/dev/node_modules ./node_modules
COPY server/ .
COPY client/dist/ web/
USER bun
ENV NODE_ENV=production
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "start" ]
