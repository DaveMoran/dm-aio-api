FROM oven/bun:1.3

WORKDIR /app

# Copy dependency files first for layer caching
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

EXPOSE 3000
CMD ["bun", "run", "start"]
