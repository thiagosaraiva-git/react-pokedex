# react-pokedex

Pokédex I developed using React, TypeScript, SASS, Axios and use-sound <br/>
Thanks to Rocketseat community, specially users Salomão Vasconcelos and Gabriel Nascimento

- https://react-pokedex-ebon.vercel.app/

![image](https://user-images.githubusercontent.com/9470353/183518007-5dec6bf6-c1dd-4da2-94da-03466b488690.png)

## Development

### Prerequisites

- Node.js 22+
- Yarn

### Installation

```bash
yarn install
```

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production (runs TypeScript check + Vite build)
- `yarn preview` - Preview production build
- `yarn test` - Run tests with Vitest (CI mode)
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting with Prettier

## CI/CD Requirements

This project enforces code quality through **required GitHub Actions status checks**. All three checks below **must pass** before merging to `main` or deploying:

### Required Status Checks

Configure the following checks as **required** in your GitHub repository branch protection settings (`Settings → Branches → main → Branch protection rules`):

1. **`Prettier Check`** - Enforces consistent code formatting
2. **`Build & Typecheck`** - Ensures zero TypeScript errors and successful build
3. **`Test`** - Runs Vitest test suite

### Running Checks Locally

Before pushing, verify your code passes all checks:

```bash
yarn format:check
yarn build
yarn test
```

To auto-fix formatting issues:

```bash
yarn format
```

### CI Pipeline

The CI workflow runs automatically on:

- All pull requests
- Pushes to `main` branch

Each check runs independently as a separate job, ensuring clear visibility of which quality gate failed.
