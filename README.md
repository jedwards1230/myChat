# myChat

ChatGPT clone. Definitely a WIP. This project was mostly to learn React Native and Fastify.

## Tooling

### Server

- Fastify
  - Serve client as a SPA React app
  - Schema validation with `zod`
  - Auto-generated OpenAPI docs served at `/docs`
- TypeORM & Postgres
- OpenAI API

### Client

- React Native and Expo
- Server state management with `@tanstack/react-query`
- Theming with `nativewind` and `tailwindcss`
- Reusable UI components with `@radix-ui`

### Deployment

There are two Compose files. They pull from `jewards1230/mychat` on Docker Hub. There is a Github Action that builds and pushes the image on every push to the `main` branch. 

These can be modified for local build contexts, but I generally only use docker for the local Postgres DB.

#### Compose.yml

- Docker Compose will serve:
  - Fastify server with static web client on port 3000
  - Postgres DB
- This is mostly used for local development and testing

#### Production.yml

- Docker Compose will serve the same as above, plus:
  - Tailscale Proxy that serves the Fastify server to the web with SSL
    - This is nice because it gives the app its own machine on the Tailscale network.
    - This exposes the Fastify server on port 443
    - This requires copying the funnel.json file to the appropriate directory when configuring Docker Compose variables
    - This can be reconfigured to use the Tailscale Serve service as well.

#### Development

- The Dockerfile compiles the main backend and serves a Postgres DB.
  - Note: Generally best to just run the PG DB alone and run fastify form the CLI
  - TODO: Add dev mode so docker watches for changes and restarts the server.
- Run `yarn run export` from the `./client` directory to export the web client to the `./client/dist` directory. The Dockerfile has an ENV variable to point to this directory.

## Features

### Server

- Database stores all chats and user data
- Optional JSON/stream response for chats
- Route schema validation
- OpenAPI spec (runs on `/docs` while server is running)
- Thread queue system

### Client

- Responsive Web view
- Native build (only tested iOS)
- Chat with the default agent. CRUD your messages and threads.
- Light/dark themes
- Create new agents
- Stream chat responses
- Upload files and inject text into message
- iOS: Native screens/routing
- iOS: Native context menus
