# Grid Generator

Visual CSS Grid layout generator built with Next.js. Click cells to add items, drag to move, resize from corners, and export to CSS.

![Grid Generator](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![Playwright](https://img.shields.io/badge/Playwright-E2E-45ba4b?style=flat-square&logo=playwright)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

## Features

- 🎨 Interactive grid canvas with drag & drop
- 📐 Adjustable columns, rows, and gap
- 🔄 Export to Vanilla CSS, Bootstrap, or TailwindCSS
- 📦 UI framework support (shadcn/ui, MUI, Chakra, Ant Design)
- ⚡ Real-time code generation

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start development server      |
| `npm run build`   | Build for production          |
| `npm run start`   | Start production server       |
| `npm run lint`    | Run Biome linter              |
| `npm run format`  | Format code with Biome        |
| `npm test`        | Run Playwright E2E tests      |
| `npm run test:ui` | Run tests with interactive UI |

## Testing

This project uses [Playwright](https://playwright.dev/) for E2E testing.

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run specific test file
npx playwright test grid-generator.spec.ts
```

## Docker

### Development

```bash
docker compose up
```

### Production

```bash
# Build image
docker build -t grid-generator .

# Run container
docker run -p 3000:3000 grid-generator
```

## CI/CD

GitHub Actions workflow runs on push/PR to `main`:

- **Lint & Build** - Code quality and production build
- **E2E Tests** - Playwright tests in Microsoft container
- **Docker Build** - Build image using pre-built assets

Workflow features:

- Parallel job execution (lint-and-build + test)
- Concurrency control (cancels older runs)
- Artifact caching between jobs
- Skips on markdown-only changes

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [TailwindCSS 4](https://tailwindcss.com/) - Styling
- [Radix UI](https://radix-ui.com/) - Primitives
- [Motion](https://motion.dev/) - Animations
- [Biome](https://biomejs.dev/) - Linting & formatting
- [Playwright](https://playwright.dev/) - E2E testing

## License

MIT
