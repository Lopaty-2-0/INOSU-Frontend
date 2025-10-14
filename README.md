# INOSU-Frontend

How to set up application for development and production without docker or with docker.

## Setup - without Docker
- Node.js v20+ and npm/pnpm are required.

### Install dependencies
Make sure to install dependencies:
```bash
pnpm install
# or
npm run install
```

### Start development server
Start the development server on http://localhost:3000:
```bash
pnpm dev
# or
npm run dev
```

### Production
Build the application for production:
```bash
pnpm build
# or
npm run build
```

Locally preview production build:
```bash
pnpm preview
# or
npm run preview
```
The app will be available at: http://localhost:3000



## Setup - with Docker
- Make sure to have Docker installed on your machine.
- This ensures the same environment on any device — no need to install Node.js or dependencies locally.

### Build Docker images
This command builds all the services defined in the docker-compose.yml, creating the necessary Docker images and preparing them for running.
```bash
docker compose build
```

### Start development server
Make sure to install dependencies first:
```bash
pnpm install
# or
npm run install
```
Runs pnpm run dev inside Docker with live reload.
```bash
docker compose up nuxt
```
Then open: http://localhost:3000


### Production
This will create an optimized production build inside the container.
```bash
docker compose build nuxt-prod
```

Run the production build
```bash
docker compose up nuxt-prod
```
The app will be available at: http://localhost:3000

### Optional cleanup
To free space from old images and cache:
```bash
docker system prune -a
```
