import { Mail } from 'lucide-react';

export function ContactMe() {
  return (
    <section className='bg-white rounded-3xl p-8 md:p-12 shadow-sm'>
      <h2 className='text-3xl font-bold text-slate-900 mb-4'>collab?</h2>
      <p className='text-lg text-slate-600 mb-6 max-w-2xl'>lorem ipsum 🤪</p>
      <a
        href='mailto:tyler@corley.rocks'
        className='inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors duration-300 hover:shadow-lg'
      >
        <Mail size={20} />
        get in touch
      </a>
    </section>
  );
}
