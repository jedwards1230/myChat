# myChat

ChatGPT clone. Definitely a WIP. This project was mostly to learn React Native and Fastify.

## Tooling

### Server

- Fastify
  - Serve static React files
  - Route validation with `@sinclair/typebox`
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
- Websocket handler for React Native clients
- Session management
- Thread queue system

### Client

- Responsive Web view
- Native build (only tested iOS)
- Chat with the default agent. CRUD your messages and threads.
- Light/dark themes
- Create new agents
- Stream chat responses
  - This uses WebSockets for streaming due to the limited `fetch` api in React Native.
- Upload files and inject text into message
- iOS: Native screens/routing
- iOS: Native context menus

## Todo

### Server

- Actual auth system
  - The project currently creates `user-1` by default and only validates that requests have a header: `{ Authorization: user-1 }`
- Currently doing a big refactor to make operations more streamlined.
  - Main functions like Thread/Message CRUD are stable. Secondary things like updating a Thread title need to be refactored.
  - Separation between Route/Thread Process/Db layers could definitely be cleaner.
  - Abstractions between Controller files and the Repo files are a bit mushy. Just needs some cleanup.
- Better Chat processing `/modules/models/`
  - Thread truncation
  - Proper tool selection
  - Handle different models/providers

### Client

- Better Agent Builder
- Agent tool options
- App icon
- Better Markdown support, include syntax highlighting
- Better file management
- @agent calling
- Thread history search
- Model/LLM selector
