import { Code2 } from 'lucide-react';
import Memoji from './Memoji.png';
// import { ContactMe } from '../components/contact-me';
// import { FeaturedWork } from '../components/featured-work';
import { Socials } from '../components/socials';

export function Main() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200'>
      <div className='max-w-6xl mx-auto px-6 py-16 md:py-24'>
        <header className='mb-20 animate-fadeIn text-center'>
          <div className='flex flex-col items-center gap-8'>
            <div className='max-w-4xl'>
              <div className='flex flex-row justify-between'>
                <div className='inline-flex items-center gap-2 mb-6 text-slate-600'>
                  <Code2 size={20} />
                  <span className='text-sm font-medium tracking-wide'>
                    ROLAN.DEV
                  </span>
                </div>
                <div className='inline-flex items-center gap-2 mb-6'>
                  <span className='px-3 py-1 rounded-full rainbow-text font-semibold text-base bg-white bg-clip-padding border border-transparent shadow-sm select-none'>
                    <span className='mr-1' role='img' aria-label='pin'>
                      📍
                    </span>
                    denver, co
                  </span>
                </div>
              </div>

              <h1 className='text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight'>
                <span className='sm:whitespace-nowrap'>
                  hi, i'm tyler <span className='rainbow-text mx-1'>rolan</span>{' '}
                  corley
                </span>
              </h1>

              <p className='text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed'>
                software engineer at linkedin dot com building with modern web
                technologies. budding photographer, aspiring craftsman, and an
                overall curious human
              </p>

              <Socials />
            </div>

            <div className='flex-shrink-0'>
              <img
                src={Memoji}
                alt='Tyler Corley Memoji'
                className='w-48 h-48 lg:w-64 lg:h-64 object-contain'
              />
            </div>
          </div>
        </header>

        {/* <FeaturedWork /> */}

        {/* <ContactMe /> */}
      </div>
    </div>
  );
}
