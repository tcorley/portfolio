import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('og', 'routes/og.tsx'),
] satisfies RouteConfig;
