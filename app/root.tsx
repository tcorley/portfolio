import { useLayoutEffect, useState } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';

const FAVICON_VERSION = '12';
const FAVICON_LIGHT = `/favicon-light.svg?v=${FAVICON_VERSION}`;
const FAVICON_DARK = `/favicon-dark.svg?v=${FAVICON_VERSION}`;
const COLOR_SCHEME_COOKIE = 'color-scheme';

type ColorScheme = 'light' | 'dark';

function faviconFor(scheme: ColorScheme) {
  return scheme === 'dark' ? FAVICON_DARK : FAVICON_LIGHT;
}

function colorSchemeFromCookie(cookieHeader: string | null): ColorScheme | null {
  const match = cookieHeader?.match(/(?:^|;\s*)color-scheme=(dark|light)(?:;|$)/);
  return match ? (match[1] as ColorScheme) : null;
}

function writeColorSchemeCookie(scheme: ColorScheme) {
  document.cookie = `${COLOR_SCHEME_COOKIE}=${scheme}; path=/; max-age=31536000; SameSite=Lax`;
}

// Persist OS scheme ASAP so the next SSR request (refresh) emits the right icon.
const colorSchemeCookieScript = `
(() => {
  const scheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
  document.cookie = ${JSON.stringify(COLOR_SCHEME_COOKIE + '=')} + scheme + '; path=/; max-age=31536000; SameSite=Lax';
})();
`;

export function loader({ request }: Route.LoaderArgs) {
  const fromCookie = colorSchemeFromCookie(request.headers.get('Cookie'));
  if (fromCookie) {
    return { colorScheme: fromCookie };
  }

  const hint = request.headers.get('Sec-CH-Prefers-Color-Scheme');
  if (hint === 'dark' || hint === 'light') {
    return { colorScheme: hint };
  }

  return { colorScheme: 'light' as const };
}

export function headers() {
  return {
    'Accept-CH': 'Sec-CH-Prefers-Color-Scheme',
    Vary: 'Sec-CH-Prefers-Color-Scheme',
  };
}

/**
 * SVG icon for browsers that support it. Remount on scheme change so Chromium
 * actually swaps the tab icon.
 */
function ThemeFavicon({ colorScheme }: { colorScheme: ColorScheme }) {
  const [href, setHref] = useState(() => faviconFor(colorScheme));

  useLayoutEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const sync = () => {
      const scheme: ColorScheme = darkQuery.matches ? 'dark' : 'light';
      writeColorSchemeCookie(scheme);
      setHref((current) => {
        const next = faviconFor(scheme);
        return current === next ? current : next;
      });
    };

    sync();
    darkQuery.addEventListener('change', sync);
    return () => darkQuery.removeEventListener('change', sync);
  }, []);

  return <link key={href} rel='icon' href={href} type='image/svg+xml' />;
}

export const links: Route.LinksFunction = () => [
  // Raster fallbacks: Safari still doesn't reliably use SVG favicons, and
  // browsers always probe /favicon.ico even when an SVG link is present.
  { rel: 'icon', href: `/favicon.ico?v=${FAVICON_VERSION}`, sizes: 'any' },
  {
    rel: 'icon',
    href: `/favicon-light-32.png?v=${FAVICON_VERSION}`,
    type: 'image/png',
    sizes: '32x32',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    href: `/favicon-dark-32.png?v=${FAVICON_VERSION}`,
    type: 'image/png',
    sizes: '32x32',
    media: '(prefers-color-scheme: dark)',
  },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, viewport-fit=cover'
        />
        <script dangerouslySetInnerHTML={{ __html: colorSchemeCookieScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <ThemeFavicon colorScheme={loaderData.colorScheme} />
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
