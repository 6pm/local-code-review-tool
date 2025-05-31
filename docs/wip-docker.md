## Docker Commands

### Using npm/pnpm scripts

- Start the application: `pnpm docker`
- Rebuild and start the application: `pnpm docker:build`
- Stop the application: `pnpm docker:down`

### Using Docker Compose directly

- Start the application: `docker-compose up`
- Rebuild the application: `docker-compose up --build`
- Run in background: `docker-compose up -d`
- Stop the application: `docker-compose down`
- View logs: `docker-compose logs -f`

### Managing Docker Volumes

- List all volumes: `docker volume ls`
- Inspect the Ollama data volume: `docker volume inspect ollama-data`
- Remove the volume (will delete all downloaded models): `docker volume rm ollama-data`

Note: The Docker volume `ollama-data` persists even when containers are stopped or removed with `docker-compose down`. To completely remove the volume and all downloaded models, you need to explicitly remove it with `docker volume rm ollama-data`.
