# Todo

## Server

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

## Client

- Better Agent Builder
- Agent tool options
- App icon
- Better Markdown support, include syntax highlighting
- Better file management
- @agent calling
- Thread history search
- Model/LLM selector