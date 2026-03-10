# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with React Router 7, deployed as a Cloudflare Worker. The site features server-side rendering (SSR) and is styled with Tailwind CSS v4.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts the dev server with HMR at `http://localhost:5173` (uses `--host` flag for network access)

### Type Checking
```bash
npm run typecheck
```
Generates Cloudflare types, React Router types, and runs TypeScript compiler. Run this before committing to catch type errors.

### Build for Production
```bash
npm run build
```
Creates production build using `react-router build`

### Preview Production Build
```bash
npm run preview
```
Builds and previews the production version locally

### Deploy to Cloudflare

**Option 1: Automated CI/CD (Recommended)**
Push changes to the `main` branch via pull request. GitHub Actions will automatically:
1. Build the project
2. Deploy to Cloudflare Workers
3. Make it live at rolan.dev

**Option 2: Manual Deployment**
```bash
npm run deploy
```
Builds and deploys directly to production via Wrangler. Requires `CLOUDFLARE_API_TOKEN` environment variable to be set. See [Deployment Setup](#deployment-setup) below.

### Generate Cloudflare Types
```bash
npm run cf-typegen
```
Runs automatically on `postinstall` but can be run manually if needed

## Architecture

### Deployment Target
- **Platform**: Cloudflare Workers
- **Domain**: rolan.dev
- **CI/CD**: GitHub Actions automatically deploys `main` branch to production
- **Worker Entry**: `workers/app.ts` - Cloudflare Worker fetch handler that delegates to React Router's request handler

### Framework Stack
- **React Router 7**: File-based routing with SSR enabled
- **Vite**: Build tool and dev server
- **Tailwind CSS v4**: Utility-first CSS framework
- **TypeScript**: Strict mode enabled with composite project structure

### Project Structure
```
app/
  ├── root.tsx              # Root layout, error boundary, global links/meta
  ├── routes.ts             # Route configuration (file-based routing config)
  ├── routes/
  │   ├── home.tsx          # Index route with meta tags
  │   └── og.tsx            # Open Graph image generation route
  ├── main/
  │   └── main.tsx          # Main landing page component
  ├── components/
  │   ├── socials.tsx       # Social media links component
  │   ├── contact-me.tsx    # Contact section (currently unused)
  │   └── featured-work.tsx # Work showcase (currently unused)
  └── app.css               # Global styles with Tailwind imports and custom animations

workers/
  └── app.ts                # Cloudflare Worker entry point

tsconfig.json               # Root TypeScript config (project references)
tsconfig.node.json          # Node/build tooling TypeScript config
tsconfig.cloudflare.json    # Cloudflare Worker TypeScript config
```

### TypeScript Configuration
The project uses TypeScript project references with three configs:
- **tsconfig.json**: Root config that references node and cloudflare configs
- **tsconfig.node.json**: For build tools and Vite config
- **tsconfig.cloudflare.json**: For Cloudflare Worker code

All configs use strict mode. Run `npm run typecheck` to validate all projects.

### Styling Approach
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Dark mode support via `prefers-color-scheme` media query
- Custom CSS in `app/app.css` includes:
  - Rainbow gradient text effect with rotation animation (`.rainbow-text`)
  - Global dark mode styles for html/body
  - Inter font family configuration

### Route Configuration
Routes are defined in `app/routes.ts` using React Router's route config API, not file-system conventions. To add a route:
1. Create the route file in `app/routes/`
2. Add it to `app/routes.ts` using `route()` or `index()` helpers

### Cloudflare Worker Integration
The Cloudflare Worker (`workers/app.ts`) is minimal - it creates a request handler from React Router's server build and provides the Cloudflare env and execution context via `AppLoadContext`. The worker is configured in `wrangler.jsonc` with the custom domain `rolan.dev`.

### CI/CD Pipeline
GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Triggers on push to `main` branch
2. Installs dependencies (Node.js 22)
3. Runs `npm run build`
4. Deploys to Cloudflare Workers using Wrangler action
5. Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets

## Deployment Setup

### CI/CD Workflow (Recommended)
The project uses GitHub Actions for automatic deployment to production:

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature-name
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

3. **Push to GitHub**
   ```bash
   git push -u origin feature-name
   ```

4. **Create Pull Request**
   Visit the URL provided in the push output, or manually create a PR at:
   ```
   https://github.com/tcorley/portfolio/pull/new/feature-name
   ```

5. **Merge to Main**
   Once the PR is approved and merged to `main`, GitHub Actions automatically:
   - Runs `npm run build`
   - Deploys to Cloudflare Workers
   - Makes changes live at rolan.dev

### Manual Deployment Setup
For direct deployment using `npm run deploy`:

1. **Get Cloudflare API Token**
   - Visit https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Use "Edit Cloudflare Workers" template
   - Copy the generated token

2. **Set Environment Variable**
   ```bash
   export CLOUDFLARE_API_TOKEN=your_token_here
   ```

   For permanent setup, add to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.):
   ```bash
   echo 'export CLOUDFLARE_API_TOKEN=your_token_here' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

**Note:** The CI/CD workflow (Option 1) is recommended as it:
- Requires no local API token setup
- Runs in a consistent environment
- Provides deployment history and rollback capability
- Prevents accidental production deployments

## Common Development Patterns

### Adding a New Route
1. Create route file in `app/routes/` (e.g., `app/routes/about.tsx`)
2. Export `meta`, `loader`, `action` functions as needed
3. Export default component
4. Register in `app/routes.ts`: `route('about', 'routes/about.tsx')`

### Dark Mode
Dark mode is automatically applied based on `prefers-color-scheme`. Use Tailwind's `dark:` variant for dark mode styles (e.g., `dark:bg-gray-900`).

### Meta Tags and SEO
Define meta tags in route files using the `meta` export function. See `app/routes/home.tsx` for comprehensive example including Open Graph and Twitter Card tags.

## Troubleshooting

### Deployment Issues

**Error: "CLOUDFLARE_API_TOKEN environment variable" required**
- This occurs when trying to run `npm run deploy` without the token set
- **Solution**: Either set up the token (see [Manual Deployment Setup](#manual-deployment-setup)) or use the CI/CD workflow by creating a PR

**GitHub CLI (gh) not available**
- The `gh` CLI tool may not be installed locally
- **Solution**: Create PRs manually by visiting the URL shown after `git push`, or install gh:
  ```bash
  # macOS
  brew install gh

  # Authenticate
  gh auth login
  ```

**Build fails during deployment**
- Ensure `npm run typecheck` passes locally before pushing
- Check GitHub Actions logs for detailed error messages
- Common issues:
  - TypeScript errors: Run `npm run typecheck` to catch them early
  - Missing dependencies: Run `npm install` to ensure all deps are installed
  - Route configuration: Verify routes are properly registered in `app/routes.ts`

**Changes not appearing after merge**
- GitHub Actions deployment takes 1-2 minutes after merge
- Check the Actions tab on GitHub to see deployment status
- Cloudflare may cache content; try hard refresh (Cmd+Shift+R / Ctrl+F5)
