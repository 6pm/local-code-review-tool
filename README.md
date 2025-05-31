# Code Review Tool

A tool for automated code reviews using local LLM models through Ollama. It fetches pull requests and performs code reviews file by file. You can customize the review process by modifying the guidelines in "guidelines/review-guidelines.md". The tool supports multiple models, allowing you to compare their review results.
Review results will be saved in files named "temp/review-{MODEL_NAME}.txt".

## Features

- Fetches pull request diffs from Bitbucket and reviews files individually
- Performs automated code reviews using local LLM models
- Customizable review guidelines stored in "guidelines/review-guidelines.md"
- Saves review results to separate files for each model
- Configurable context length using MAX_CONTEXT_LENGTH environment variable (default: 20K tokens)

## Prerequisites

- [Ollama](https://ollama.com/)
- Node.js

### Step 1: Setup Ollama
1. Install [Ollama](https://ollama.com/)

2. Download the model you want to use, for example 'qwen2.5-coder':
```sh
ollama pull qwen2.5-coder:7b
```
The download might take a few minutes depending on the model size. Once completed, add the environment variable to the .env file in the root folder:

For a single model:
```sh
MODEL_NAME='qwen2.5-coder:7b'
```

For multiple models (comma-separated):
```sh
MODEL_NAME='qwen2.5-coder:14b,codellama:13b,mixtral:8x7b'
```

### Step 2: Configure Bitbucket Access
Follow the instructions in the [Bitbucket setup guide](/docs/configure-bitbucket.md).
After setup, add these variables to your .env file:
```sh
BITBUCKET_USERNAME='your-username'
BITBUCKET_APP_PASSWORD='your-app-password'
```

### Step 3: Configure Pull Request and Optional Parameters
Add your Bitbucket pull request URL to the environment variables:
```sh
PULL_REQUEST_URL='https://bitbucket.org/your-repo/pull-requests/123/diff'
```

The context length is an optional parameter. The default value is 20K tokens. You can extend it by setting the environment variable:
```sh
MAX_CONTEXT_LENGTH=32768
```

### Step 4: Customize Review Guidelines
Modify the guidelines file to match your project's requirements: [guidelines/review-guidelines.md](guidelines/review-guidelines.md)

## Running the Application

```bash
pnpm i    # Install dependencies
pnpm start # Start the review process
```

### Output

The review results will be saved in separate files under the `temp` directory, with filenames following the pattern `review-${MODEL_NAME}.txt`.
