# Tyler Corley - Portfolio Website

Personal portfolio website built with React Router v7 and deployed on Cloudflare Workers. This project was created from the React Router Cloudflare template.

**Live Site:** [rolan.dev](https://rolan.dev)

## Features

- 🚀 Server-side rendering (SSR) with React Router v7
- ⚡️ Hot Module Replacement (HMR) for fast development
- 🌐 Deployed on Cloudflare Workers for edge computing
- 📦 Asset bundling and optimization with Vite
- 🔒 TypeScript by default
- 🎨 Tailwind CSS v4 for styling
- 🖼️ Open Graph image generation for social sharing
- 📱 Responsive design with dark mode support
- 📖 [React Router docs](https://reactrouter.com/)

## Tech Stack

- **Framework:** React Router v7
- **Runtime:** Cloudflare Workers
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React, Simple Icons
- **Build Tool:** Vite
- **Deployment:** Cloudflare Workers (Wrangler)

## Project Structure

```
/workspace
├── app/
│   ├── components/        # Reusable React components
│   │   ├── contact-me.tsx
│   │   ├── featured-work.tsx
│   │   └── socials.tsx
│   ├── main/              # Main page component and assets
│   │   ├── main.tsx
│   │   └── [images]
│   ├── routes/            # Route definitions
│   │   ├── home.tsx       # Home page route
│   │   └── og.tsx         # Open Graph image route
│   ├── root.tsx           # Root layout component
│   └── routes.ts          # Route configuration
├── workers/
│   └── app.ts             # Cloudflare Worker entry point
├── public/                # Static assets
└── wrangler.jsonc         # Cloudflare Workers configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account (for deployment)

### Installation

Install the dependencies:

```bash
npm install
```

This will automatically run `wrangler types` to generate TypeScript types for Cloudflare Workers.

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173` (or the next available port).

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

This command:
1. Generates Cloudflare Worker types
2. Generates React Router types
3. Runs TypeScript compiler

## Previewing the Production Build

Preview the production build locally:

```bash
npm run preview
```

## Building for Production

Create a production build:

```bash
npm run build
```

The build output will be generated in the `.react-router` directory.

## Deployment

This project is deployed to Cloudflare Workers using Wrangler CLI.

### Quick Deploy

To build and deploy directly to production:

```bash
npm run deploy
```

### Staged Deployment

For a safer deployment process, you can use Cloudflare's versioning:

1. **Upload a version:**
   ```bash
   npm run build
   npx wrangler versions upload
   ```

2. **Deploy a version to production:**
   ```bash
   npx wrangler versions deploy [version-id]
   ```

This allows you to verify a version before promoting it to production or roll it out progressively.

### Custom Domain

The project is configured with a custom domain (`rolan.dev`) in `wrangler.jsonc`. Ensure your Cloudflare account has the domain configured before deploying.

## Configuration

### Cloudflare Workers

Configuration is managed in `wrangler.jsonc`. Key settings:

- **Name:** `portfolio`
- **Main:** `./workers/app.ts`
- **Compatibility Date:** `2025-04-04`
- **Routes:** Custom domain configuration for `rolan.dev`

### React Router

React Router configuration is in `react-router.config.ts`:

- Server-side rendering enabled
- Future flags for experimental features

### Vite

Vite configuration in `vite.config.ts` includes:

- React Router plugin
- Cloudflare Workers plugin
- Tailwind CSS plugin
- TypeScript path resolution

## Styling

This project uses [Tailwind CSS v4](https://tailwindcss.com/) with the Vite plugin. The project includes:

- Responsive design utilities
- Dark mode support
- Custom animations and transitions
- Gradient backgrounds

## Components

### Available Components

- **Main:** Main portfolio page layout
- **Socials:** Social media links component
- **FeaturedWork:** Featured projects showcase (currently commented out)
- **ContactMe:** Contact section (currently commented out)

## Routes

- `/` - Home page (main portfolio)
- `/og` - Open Graph image generation endpoint

## Development Notes

- Components can be enabled/disabled by uncommenting imports in `app/main/main.tsx`
- The project uses React Router's type-safe routing with generated types
- Cloudflare Workers types are auto-generated on install

## License

Private project - All rights reserved

---

Built with ❤️ using [React Router](https://reactrouter.com/) and [Cloudflare Workers](https://workers.cloudflare.com/).
