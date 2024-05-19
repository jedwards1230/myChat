#!/bin/sh

cd /web/packages/db
yarn run migrate

cd /web/apps/server
bun run src/index.ts