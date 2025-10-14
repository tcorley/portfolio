import type { Route } from './+types/og';
import Memoji from '../main/Memoji.png';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Tyler Corley | Senior Software Engineer' },
    {
      name: 'description',
      content:
        'Portfolio of Tyler Corley - Senior Software Engineer at LinkedIn',
    },
  ];
}

export function headers({}: Route.HeadersArgs) {
  return {
    'Content-Type': 'text/html',
    'Cache-Control': 'public, max-age=31536000, immutable',
  };
}

export default function OG() {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '60px',
          maxWidth: '1000px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '80px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 30px 0',
              lineHeight: '1.1',
            }}
          >
            hi, i'm tyler <span className='rainbow-text'>rolan</span> corley
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: '#64748b',
              margin: '0',
              fontWeight: '400',
            }}
          >
            software engineer at linkedin
          </p>
        </div>
        <img
          src={Memoji}
          alt='Tyler Corley Memoji'
          style={{
            width: '250px',
            height: '250px',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
}
