FROM node:21 as base
WORKDIR /app
ENV TURBO_TELEMETRY_DISABLED=1
RUN corepack enable && \
    mkdir -p /temp/dev && 

FROM base as builder
COPY . /temp/dev/
RUN cd /temp/dev/ && yarn install

FROM base AS release
COPY --from=builder /temp/dev/node_modules ./node_modules
COPY packages/server/ .
COPY packages/client/dist/ web/
ENV NODE_ENV=production
ENV CLIENT_BUILD_DIR=web
EXPOSE 3000/tcp
ENTRYPOINT [ "yarn", "start" ]