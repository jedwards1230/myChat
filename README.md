# myChat

ChatGPT clone. Definitely a WIP. This project was mostly to learn React Native and Fastify.

## Tooling

### Server

- Fastify
  - Serve static React files
  - Route validation with `@fastify/type-provider-typebox`
  - Auto-generated OpenAPI docs with `@eropple/fastify-openapi3`
- TypeORM & Postgres
- OpenAI API

### Client

- React Native and Expo
- State management with `zustand`
- Server state management with `@tanstack/react-query`
- Theming with `nativewind`
- Reusable UI components with `@radix-ui`

### Deployment

- The Dockerfile compiles the main backend and the web client assets.
  - Compiles `/server` for the main backend
  - Compiles `/client` for the web client
    - `/client/export.ts` is run to compile the static files into `/client/dist/`
      - This is a hack since the expo cli `export` command does not end its process on successful export. It expects you to ctrl+c. This script reads the output and gracefully exits if it works out.
      - This seems unreliable on Github Actions
- Docker Compose will serve:
  - Fastify server with static web client on port 3000
  - Postgres DB
- Github Action (DISABLED):
  - Connects to Tailscale network, builds docker image, deploys to private registry.
  - Currently disabled because it does not reliably export the web client.

## Features

### Server

- Database stores all chats and user data
- Optional JSON/stream response for chats
- Route schema validation
- OpenAPI spec (runs on `/docs` while server is running)
- Session management
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
