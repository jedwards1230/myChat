# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/logs
RUN mkdir -p /usr/src/app/db/uploads
RUN chown -R bun:bun /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install_server
RUN mkdir -p /temp/dev
COPY server/package.json server/bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install Node.js
FROM base AS install_node
RUN apt-get update && apt-get install -y curl procps
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# install client deps
FROM install_node AS install_client
RUN mkdir -p /temp/dev1
COPY client/package.json client/bun.lockb /temp/dev1/
RUN cd /temp/dev1 && bun install

# build the client with `expo export -p web`
FROM install_client AS build_client
COPY client/ /temp/dev1
# This runs `expo export -p web`. Can take about 5 minutes.
RUN cd /temp/dev1 && bun run export.ts 
RUN ls -al /temp/dev1 && ls -al /temp/dev1/dist 

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS release
COPY --from=install_server /temp/dev/node_modules ./node_modules
COPY --from=build_client /temp/dev1/dist ./web
COPY server/ .

# relative to server root (/usr/src/app)
ENV CLIENT_BUILD_DIR=./web
ENV CLIENT_STORAGE_DIR=./db/uploads
ENV NODE_ENV=production

# run the app
USER bun
EXPOSE 3000/tcp
RUN ls -al /usr/src/app/web
ENTRYPOINT [ "bun", "start" ]