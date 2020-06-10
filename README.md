# basic-chat-app
## an express and socket.io application.
# dependencies
a list of dependencies can be found in the package.json of this project

## app structure
- ` app.js` serves as the entry point for the application. it defines the express server and connects it to MongoDB using mongoose. it requires the routes and models used in the application. Sockets and session are defined here to ensure communication between the client and server.
- `config.js` contains the configuration for passport. is a central location environment variables/config.
- `models,js` contains all the mongoose schema  definition for the application.
- `routes.js` contains all the routes definitions for our API


