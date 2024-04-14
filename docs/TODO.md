# Todo

## Server

- Actual auth system
  - Current system implements basic email/pass with a basic session system.
    - Explore OAuth2 
    - Implement a proper JWT system
    - Implement a proper user system
    - Better error handling and validation
    - Actually hash the password (currently stored in plain text)
  - The project currently creates a default api key `user-1` and only validates that requests have a header: `{ Authorization: user-1 }`
    - Implement a proper API key system
  
- Better Chat processing `/modules/LLMNexus/`
  - Context window truncation
  - Proper tool selection
  - More tools
    - Add tools via OpenAPI spec
  - Handle different models/providers
    - Implement Gemini APi
    - Implement local ollama API
    - Explore LLM on Web API

## Client

- Better Agent Builder
  - Select tools
  - Modify System message
  - Modify hyperparameters
  - Validate per model limitations (streaming, function calls, etc)
- App icon
  - Fix alignment. Maybe different icon.
- Better file management
  - Desktop
    - Create file on the fly (paste text, save to buffer)
  - Mobile
    - Fix file upload
    - Fix file view
      - Gotta find a good way to differentiate local vs remote files
- @agent calling
  - Probably comes after better agent builder
  - Implement default agents
- Thread history search