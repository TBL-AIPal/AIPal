Here's the updated README section that reflects the changes to the root `package.json` scripts:

---

# My Monorepo Project

This monorepo contains both a **Node.js/Express server** and a **Next.js client** app. Below are instructions on how to set up and run the project, including linting and formatting with **ESLint** and **Prettier**.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12.x or higher)
- [PNPM](https://pnpm.io/) (version 9.x or higher)
  
  Install PNPM globally if not already installed:

  ```bash
  npm install -g pnpm
  ```

## Project Structure

The monorepo has the following structure:

```
/packages
  /client    # Next.js client app
  /server    # Node.js Express server
pnpm-workspace.yaml  # Defines the packages in the workspace
package.json          # Root package.json for managing both client and server
pnpm-lock.yaml
```

## PNPM Workspace Setup

We are using **PNPM workspaces** to manage multiple packages. The `pnpm-workspace.yaml` file defines the structure of the workspace:

```yaml
packages:
  # include packages in subfolders 
  - 'packages/*'
  # exclude test directories
  - '!**/tests/**'
  - '!**/__tests__/**'
  - '!**/__mocks__/**'
```

This setup includes all packages located inside the `packages` folder and excludes test-related directories such as `tests`, `__tests__`, and `__mocks__`.

## Installation

To install all dependencies for both the client and server:

```bash
pnpm install
```

This will install all dependencies in both the `client` and `server` directories, as well as any shared dependencies in the root `node_modules`.

## Development

To start both the **client** and **server** in development mode concurrently, run the following command:

```bash
pnpm dev
```

- **Client**: The Next.js app will run at [http://localhost:3000](http://localhost:3000).
- **Server**: The Express server will run at [http://localhost:5000](http://localhost:5000).

### Running Individually

If you want to run either the server or client individually:

- **Server** (from the root):

  ```bash
  pnpm --filter ./packages/server dev
  ```

- **Client** (from the root):

  ```bash
  pnpm --filter ./packages/client dev
  ```

## Building for Production

To build both the **client** and **server** apps for production:

```bash
pnpm build
```

This will run the build process for both the server and client.

### Starting the Production Build

Once built, you can start the production version of both apps with:

```bash
pnpm start
```

This runs both the client and server in production mode.

## Linting with ESLint

We use **ESLint** to maintain consistent code quality and styling. ESLint configurations are included for both the server and client.

### Run Linting

To lint the codebase:

```bash
pnpm lint
```

This will lint the code in both the client and server directories based on the ESLint configuration specified for each package.

### Auto-fixing Issues

To automatically fix linting issues:

```bash
pnpm lint:fix
```

### Strict Linting

To enforce zero warnings in linting for the **client** package:

```bash
pnpm lint:strict
```

## Formatting Code

We use **Prettier** to format the codebase.

### Check Formatting

To check if the code is formatted correctly:

```bash
pnpm format:check
```

### Auto-format Code

To automatically format the code:

```bash
pnpm format:fix
```

## Testing

To run tests:

```bash
pnpm test
```

To watch for test changes:

```bash
pnpm test:watch
```

## License

[MIT](LICENSE)

---

This updated README includes the new root-level scripts for linting and formatting, ensuring a unified approach to managing code quality across your monorepo. Let me know if you need any more changes!