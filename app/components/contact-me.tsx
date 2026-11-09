import { Mail } from 'lucide-react';

export function ContactMe() {
  return (
    <section
      aria-labelledby='contact-heading'
      className='mt-8 pt-10 border-t border-slate-300/80 dark:border-slate-700 text-center'
    >
      <h2
        id='contact-heading'
        className='font-display text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-3'
      >
        collab?
      </h2>
      <p className='text-base md:text-lg text-slate-600 dark:text-slate-400 mb-5 max-w-xl mx-auto leading-relaxed'>
        open to interesting roles and side projects — say hello.
      </p>
      <a
        href='mailto:tyler@corley.rocks'
        className='inline-flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium underline decoration-slate-400/80 underline-offset-4 transition-colors duration-300 hover:text-slate-950 hover:decoration-slate-700 dark:hover:text-white dark:hover:decoration-slate-300'
      >
        <Mail size={18} aria-hidden='true' />
        tyler@corley.rocks
      </a>
    </section>
  );
}
