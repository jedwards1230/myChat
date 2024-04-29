# Todo

## Server

- **Actual auth system**
  - Current system implements basic email/pass with a basic session system.
    - Explore OAuth2 
    - Implement a proper JWT system
    - Implement a proper user system
    - Better error handling and validation
    - Actually hash the password (currently stored in plain text!!!)
  - The project currently creates a default api key `user-1` and only validates that requests have a header: `{ Authorization: user-1 }`
    - Implement a proper API key system
  
- Better Chat processing `/modules/LLMNexus/`
  - **Context window truncation**
  - **Proper tool selection** - Default agent tools can be toggles on/off by the user, but there are no custom tool configs yet. This would ideally be similar to ChatGPT having static tools (code interpreter, browser, etc) and dynamic tools (search, etc)
  - **User-specific tool config**
  - **More tools**
    - File creator
    - DB search
    - Add tools via OpenAPI spec
  - **More models/providers**
    - Implement Gemini APi
    - Implement local ollama API
    - Explore LLM on Web API

## Client

- **Better Agent Builder**
  - Select tools
  - Modify parameters
  - Validate per model limitations (streaming, function calls, etc)
- **App icon**
  - Fix alignment. Maybe different icon.
- **Better file management**
  - **Handle image uploads**
  - **Quick view** all files attached to Thread
  - Desktop
    - **Create file on the fly** (paste text, save to buffer)
  - Mobile
    - Fix file upload
    - Fix file view
      - Gotta find a good way to differentiate local vs remote files
- **@agent calling**
  - Probably comes after better agent builder
  - Implement default agents
- **Thread history search**
- Active Chat
  - Fix scroll so it follows the text streamed in, but does not scroll when user scrolls up
  - Fix loading indicator sometimes attaching to the wrong message
  - Fix NetworkChange error when a chat is being streamed
  - Explore better triggers for title generation