FROM node:22

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm@10.8.0

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Create temp directory if it doesn't exist
RUN mkdir -p temp

# Set environment variables
ENV NODE_ENV=production

# Command to run the application
CMD ["pnpm", "start"]