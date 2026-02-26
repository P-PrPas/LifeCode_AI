FROM oven/bun:latest

WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy application
COPY . .

EXPOSE 3000

# Run the application using bun
CMD ["bun", "run", "dev"]
