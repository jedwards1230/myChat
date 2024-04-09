FROM oven/bun:1 as base
WORKDIR /app
RUN chown -R bun:bun /app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY server/package.json server/bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS release
COPY --from=install /temp/dev/node_modules ./node_modules
COPY server/ .

USER bun
ENV NODE_ENV=production
ENV CLIENT_BUILD_DIR=web/
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "start" ]