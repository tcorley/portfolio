import type { Route } from './+types/home';
import { Main } from '../main/main';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'tyler corley | senior software engineer' },
    {
      name: 'description',
      content:
        'portfolio of tyler corley - senior software engineer specializing in react, typescript, and modern web technologies',
    },

    // Open Graph tags for social media sharing
    {
      property: 'og:title',
      content: 'Tyler Corley | Senior Software Engineer',
    },
    {
      property: 'og:description',
      content:
        'Portfolio of Tyler Corley - Senior Software Engineer at LinkedIn specializing in React, TypeScript, and modern web technologies',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://rolan.dev' },
    { property: 'og:image', content: './social.png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },

    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:title',
      content: 'Tyler Corley | Senior Software Engineer',
    },
    {
      name: 'twitter:description',
      content:
        'Portfolio of Tyler Corley - Senior Software Engineer at LinkedIn specializing in React, TypeScript, and modern web technologies',
    },
    { name: 'twitter:image', content: './social.png' },

    // Additional useful tags
    {
      name: 'keywords',
      content:
        'tyler corley, software engineer, react, typescript, linkedin, web development, portfolio',
    },
    { name: 'author', content: 'Tyler Corley' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ];
}

export default function Home() {
  return <Main />;
}
