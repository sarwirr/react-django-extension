# Use a Node.js base image (v18-alpine for compatibility with pnpm)
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy all files to the container
COPY . .

# Install dependencies and build the application
RUN pnpm install && pnpm build

# Expose port 3000
EXPOSE 3000

# Run the application
CMD ["pnpm", "dev"]
