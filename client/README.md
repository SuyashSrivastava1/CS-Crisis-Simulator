# Client - CS Crisis Simulator

This is the frontend application for the CS Crisis Simulator. It is a React single-page application built with Vite.

## Development

To run the frontend locally in development mode:

```bash
npm run dev
```

This will start the Vite development server. Note that the frontend expects the backend server to be running on port 3001. The Vite configuration includes a proxy to route `/api` requests to `http://localhost:3001` during development.

## Build

To build the frontend for production:

```bash
npm run build
```

This will generate the static assets in the `dist` directory, which can be served by the backend or any static hosting service.
