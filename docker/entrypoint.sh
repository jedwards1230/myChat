#!/bin/sh

cd /web/packages/db
yarn run migration:run

cd /web/apps/server
bun run src/index.ts