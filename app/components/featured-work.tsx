import { ArrowUpRight } from 'lucide-react';

type FeaturedEntry = {
  org: string;
  era: string;
  title: string;
  hook: string;
  lines: string[];
  href?: string;
  hrefLabel?: string;
  note?: string;
};

const lead: FeaturedEntry = {
  org: 'LinkedIn',
  era: 'Senior Software Engineer · ~2021–present',
  title: 'Workflow automation',
  hook: 'I spent a few years turning workflow authoring into something people could own themselves — draft a flow, version it, run it — without waiting on an engineer to wire every step.',
  lines: [
    'Took the UI through three lives: a legacy surface, an on-prem editor, then a no-code automation platform. Wrote the specs and foundations other teams extended.',
    'Along the way shipped a Job Title filter that blends classic search with vector retrieval — typed a title, got a shortlist that felt right, with careful rollout so it didn’t surprise anyone.',
    'Cared about the boring craft too: how it feels under load, what you see when a run fails, whether the next person can build on what you left.',
  ],
};

const smaller: FeaturedEntry[] = [
  {
    org: 'LinkedIn',
    era: 'Developer Platform · ~2018–2021',
    title: 'Reclaiming unused storage',
    hook: 'A big key-value tier looked fully occupied until we actually measured it — most of what we thought was “in use” was just sitting there.',
    lines: [
      'Built soft→hard deletion so empty stores could leave quietly, then for real.',
      'The satisfying part wasn’t a dashboard number — it was watching dead weight become usable capacity again.',
    ],
    note: 'Happy to walk through it.',
  },
  {
    org: 'LinkedIn',
    era: 'Developer Platform',
    title: 'Internal UI platform',
    hook: 'Internal apps kept reinventing the same front-end pieces. I pulled that into shared patterns teams could actually pick up.',
    lines: [
      'Modular components, onboarding flows, Storybook — the stuff that makes the next screen feel familiar instead of bespoke.',
      'TypeScript migration guides and lint/style docs so large apps could move without guessing.',
    ],
    href: 'https://github.com/tcorley/storybook-router',
    hrefLabel: 'related: storybook-router',
  },
  {
    org: 'rolan.dev',
    era: 'Ongoing',
    title: 'This site & resume pipeline',
    hook: 'The portfolio is a small product I keep honest: React Router at the edge, one YAML file that becomes the resume PDF.',
    lines: [
      'SSR on Cloudflare Workers; social clicks tracked without being creepy.',
      'No stub projects on the site — if it’s here, the copy is real.',
    ],
    href: 'https://github.com/tcorley/portfolio',
    hrefLabel: 'source on github',
  },
  {
    org: 'eBay',
    era: 'Software Engineer II · ~2015–2018',
    title: 'Modern stack + AMP',
    hook: 'Took an existing eBay page onto the then-new Node/Marko stack and shipped an AMP cut so mobile felt snappy without a special snowflake app.',
    lines: [
      'Ground-up rewrite in the modern FE stack of the moment — Marko, Express, Lasso, the whole kit.',
      'Owned releases and CI for the surface so shipping stayed boring in the good way.',
    ],
  },
];

function SectionRule() {
  return (
    <div
      className='h-px flex-1 bg-gradient-to-r from-slate-300 via-slate-200 to-transparent dark:from-slate-600 dark:via-slate-700'
      aria-hidden='true'
    />
  );
}

function EntryLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='inline-flex items-center gap-1 text-sm font-medium text-slate-700 underline-offset-4 transition-colors hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white'
    >
      {label}
      <ArrowUpRight size={14} aria-hidden='true' className='shrink-0' />
    </a>
  );
}

function CraftLines({ lines }: { lines: string[] }) {
  return (
    <ul className='max-w-3xl space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
      {lines.map((line) => (
        <li key={line} className='flex gap-3'>
          <span
            className='mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500'
            aria-hidden='true'
          />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

function WorkMeta({ org, era }: { org: string; era: string }) {
  return (
    <p className='mb-1.5 text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400'>
      <span className='font-semibold text-slate-800 dark:text-slate-200'>{org}</span>
      <span className='mx-2 text-slate-300 dark:text-slate-600' aria-hidden='true'>
        ·
      </span>
      {era}
    </p>
  );
}

export function FeaturedWork() {
  return (
    <section
      aria-labelledby='featured-work-heading'
      className='mt-24 md:mt-32 scroll-mt-8'
    >
      <div className='mb-10 flex items-baseline gap-4 animate-fade-up'>
        <h2
          id='featured-work-heading'
          className='font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl'
        >
          featured work
        </h2>
        <SectionRule />
      </div>

      <article className='animate-fade-up' style={{ animationDelay: '0.08s' }}>
        <WorkMeta org={lead.org} era={lead.era} />

        <h3 className='font-display mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl'>
          {lead.title}
        </h3>

        <p className='mb-4 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300'>
          {lead.hook}
        </p>

        <div className='mb-4'>
          <CraftLines lines={lead.lines} />
        </div>

        <p className='text-sm text-slate-500 dark:text-slate-400'>
          More on{' '}
          <a
            href='/resume.pdf'
            className='font-medium text-slate-800 underline-offset-4 hover:underline dark:text-slate-200'
          >
            resume.pdf
          </a>
          .
        </p>
      </article>

      <div className='mt-14 md:mt-16'>
        <div className='mb-6 flex items-baseline gap-4'>
          <h3 className='font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl'>
            more work
          </h3>
          <SectionRule />
        </div>

        <ul className='divide-y divide-slate-200 dark:divide-slate-700'>
          {smaller.map((entry, index) => (
            <li
              key={entry.title}
              className='animate-fade-up py-6 first:pt-0 last:pb-0'
              style={{ animationDelay: `${0.12 + index * 0.06}s` }}
            >
              <WorkMeta org={entry.org} era={entry.era} />

              <h4 className='font-display mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
                {entry.title}
              </h4>

              <p className='mb-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300'>
                {entry.hook}
              </p>

              <div className='mb-3'>
                <CraftLines lines={entry.lines} />
              </div>

              <div className='flex flex-wrap items-center gap-x-4 gap-y-1'>
                {entry.href && entry.hrefLabel ? (
                  <EntryLink href={entry.href} label={entry.hrefLabel} />
                ) : null}
                {entry.note ? (
                  <p className='text-sm text-slate-500 dark:text-slate-500'>
                    {entry.note}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
