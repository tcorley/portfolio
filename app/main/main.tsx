import { useLayoutEffect } from 'react';
import { Code2 } from 'lucide-react';
import Memoji from './Memoji.png';
// import { FeaturedWork } from '../components/featured-work';
import { Socials } from '../components/socials';

/**
 * Optional QA hook: `?duo-posture=single|dual-portrait|dual-landscape`
 * mirrors foldable CSS so we can screenshot Duo layouts without a device.
 * Real Duo / foldable browsers still match via viewport-segment media queries.
 */
function useDuoPosturePreview() {
  useLayoutEffect(() => {
    const apply = () => {
      const value = new URLSearchParams(window.location.search).get(
        'duo-posture',
      );
      const root = document.documentElement;
      if (
        value === 'single' ||
        value === 'dual-portrait' ||
        value === 'dual-landscape'
      ) {
        root.dataset.duoPosture = value;
      } else {
        delete root.dataset.duoPosture;
      }
    };

    apply();
    window.addEventListener('popstate', apply);
    return () => {
      window.removeEventListener('popstate', apply);
      delete document.documentElement.dataset.duoPosture;
    };
  }, []);
}

export function Main() {
  useDuoPosturePreview();

  return (
    <div className='hero-page min-h-dvh bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 transition-colors duration-500 motion-reduce:transition-none'>
      <div className='hero-shell max-w-6xl mx-auto px-6 py-16 md:py-24'>
        <header className='hero-header text-center'>
          <div className='hero-layout flex flex-col items-center gap-8'>
            <div className='hero-copy max-w-4xl'>
              <div className='hero-brand flex flex-row justify-between'>
                <div className='inline-flex items-center gap-2 mb-6 text-slate-600 dark:text-slate-400'>
                  <Code2 size={20} />
                  <span className='font-display text-sm font-semibold tracking-[0.14em]'>
                    ROLAN.DEV
                  </span>
                </div>
                <div className='inline-flex items-center gap-2 mb-6'>
                  <span className='px-3 py-1 rounded-full rainbow-text font-semibold text-base bg-white dark:bg-gray-800 bg-clip-padding border border-transparent shadow-sm select-none'>
                    <span className='mr-1' role='img' aria-label='pin'>
                      📍
                    </span>
                    denver, co
                  </span>
                </div>
              </div>

              <h1 className='hero-title font-display text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight dark:text-slate-100'>
                <span className='sm:whitespace-nowrap'>
                  hi, i'm tyler <span className='rainbow-text mx-1'>rolan</span>{' '}
                  corley
                </span>
              </h1>

              <p className='hero-bio text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed'>
                senior software engineer at LinkedIn building web platforms and
                workflow systems with React and TypeScript. budding
                photographer, aspiring craftsman, and an overall curious human
              </p>

              <div className='hero-socials'>
                <Socials />
              </div>
            </div>

            {/* Hinge gutter — sized only when spanning dual screens */}
            <div className='hero-hinge' aria-hidden='true' />

            <div className='hero-avatar flex-shrink-0'>
              <img
                src={Memoji}
                alt='Tyler Corley Memoji'
                className='hero-avatar-img w-48 h-48 lg:w-64 lg:h-64 object-contain'
              />
            </div>
          </div>
        </header>

        {/* Featured work stays off until real project content lands */}
        {/* <FeaturedWork /> */}
      </div>
    </div>
  );
}
