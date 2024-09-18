# Base image with Node.js version 20-slim, keeping the image lightweight
FROM node:20-slim AS base

# Set PNPM environment variables and add it to PATH
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack to globally handle package managers like pnpm
RUN corepack enable

# Build stage: to install dependencies and build the client and server
FROM base AS build

# Copy all the project files into the container
COPY . /usr/src/app

# Set the working directory to the app folder
WORKDIR /usr/src/app

# Use a cache for pnpm store, to optimize dependency installation
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Run the build process for all packages in the monorepo
RUN pnpm run -r build

# Prepare the client build for production
RUN pnpm deploy --filter=client --prod /prod/client

# Prepare the server build for production
RUN pnpm deploy --filter=server --prod /prod/server

# Client stage: handles the client build
FROM base AS client

# Copy the built client app from the build stage
COPY --from=build /prod/client /prod/client

# Set the working directory to the client app
WORKDIR /prod/client

# Expose port 3000 for the client (Next.js)
EXPOSE 3000

# Start the client application using pnpm
CMD [ "pnpm", "start" ]

# Server stage: handles the server build
FROM base AS server

# Copy the built server app from the build stage
COPY --from=build /prod/server /prod/server

# Set the working directory to the server app
WORKDIR /prod/server

# Expose port 5000 for the server (Express.js)
EXPOSE 5000

# Start the server application using pnpm
CMD [ "pnpm", "start" ]
