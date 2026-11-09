import { Mail } from 'lucide-react';

export function ContactMe() {
  return (
    <footer className='mt-auto pt-10 pb-2 text-center'>
      <a
        href='mailto:tyler@corley.rocks'
        aria-label='Email Tyler'
        title='Email'
        className='inline-flex size-9 items-center justify-center rounded-full text-slate-400 transition-colors duration-300 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
      >
        <Mail size={18} aria-hidden='true' />
      </a>
    </footer>
  );
}
