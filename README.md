# Code Review Tool

A tool for automated code reviews using LLM models through Ollama.

## Features

- Fetches pull request diffs from Bitbucket
- Performs automated code reviews using LLM models
- Saves review results to a file
-  Context length can be extended using MAX_CONTEXT_LENGTH env variable (default 20K)

## Prerequisites

- Docker and Docker Compose

## Running with Docker

This project is fully containerized and can be run with a single command using Docker Compose.

### Setup

1. Create a `.env` file in the project root with the following variables:

```
MODEL_NAME='qwen2.5-coder:7b'  # Single model
# or multiple models (comma-separated):
MODEL_NAME='qwen2.5-coder:14b,codellama:13b,mixtral:8x7b'
PULL_REQUEST_URL='https://bitbucket.org/your-repo/pull-requests/123/diff'
BITBUCKET_USERNAME='your-username'
BITBUCKET_APP_PASSWORD='your-app-password'
MAX_CONTEXT_LENGTH = 32768, // context length to 32K tokens. 20k by default
```

2. Run the application:

```bash
docker-compose up
```

This will:
- Build the application container
- Start the Ollama service
- Download the specified LLM model (if not already downloaded)
- Run the code review process

The first run may take some time as it needs to download the LLM model.

### Ollama and Model Storage

In the Docker setup:
- Ollama is installed as a containerized service using the official `ollama/ollama:latest` image
- The downloaded models are stored in a Docker volume named `ollama-data` which is mounted to `/root/.ollama` inside the container
- This ensures that models persist between container restarts and don't need to be re-downloaded each time
- You can see the downloaded models by running `docker exec -it code-review-ollama-1 ollama list`

### Output

The review results will be saved in the `temp/review.txt` file.

## Running Locally (without Docker)

If you prefer to run the application locally:

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file as described above, and add:

```
OLLAMA_HOST=localhost
```

3. Make sure Ollama is installed and running locally.

4. Run the application:

```bash
pnpm run
```

## Available Scripts

- `pnpm guidelines` - Read guidelines
- `pnpm get-diff` - Get diff from Bitbucket
- `pnpm review-diff` - Review the PR diff
- `pnpm run` - Run the complete workflow (get diff and review)

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
