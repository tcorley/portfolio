import { ArrowUpRight } from 'lucide-react';

type FeaturedEntry = {
  org: string;
  era: string;
  title: string;
  hook: string;
  outcomes: string[];
  href?: string;
  hrefLabel?: string;
  note?: string;
};

const lead: FeaturedEntry & {
  metrics: { label: string; value: string }[];
} = {
  org: 'LinkedIn',
  era: 'Senior Software Engineer · ~2021–present',
  title: 'Workflow automation',
  hook: 'Led three generations of a workflow authoring UI — legacy → on-prem editor → no-code — so engineers could create, version, and run workflows in the product. Wrote the specs and foundations others built on.',
  outcomes: [
    'Also shipped a cognitive Job Title filter (hybrid BM25 + vector, top-K=50); ~p95 ~10 min for async expansion, not interactive search.',
    'Treated the surface like production software: observability, performance budgets, compliance.',
  ],
  metrics: [
    { label: 'CLS good', value: '~96%' },
    { label: 'INP good', value: '~98%' },
    { label: 'JS bundle', value: '−16%' },
    { label: 'CI feedback', value: '−44%' },
  ],
};

const smaller: FeaturedEntry[] = [
  {
    org: 'LinkedIn',
    era: 'Developer Platform · ~2018–2021',
    title: 'Reclaiming unused storage',
    hook: 'Measured a distributed key-value tier that looked fully used — ~60% of production stores (~860 / ~1400) were unused.',
    outcomes: [
      'Shipped soft→hard deletion workflows that reclaimed the capacity.',
      'Public resume framing: multi-million annual savings.',
    ],
    note: 'Ask me for a walkthrough.',
  },
  {
    org: 'LinkedIn',
    era: 'Developer Platform',
    title: 'Internal UI platform',
    hook: 'Turned one-off front-end delivery into shared patterns — components, onboarding flows, Storybook, TypeScript migration guides.',
    outcomes: [
      'Standardized delivery across internal teams.',
      'Aimed at fewer runtime defects and faster onboarding.',
    ],
    href: 'https://github.com/tcorley/storybook-router',
    hrefLabel: 'related: storybook-router',
  },
  {
    org: 'rolan.dev',
    era: 'Ongoing',
    title: 'This site & resume pipeline',
    hook: 'React Router 7 + Tailwind v4 on Cloudflare Workers, with a YAML→PDF resume as the single public source of truth.',
    outcomes: [
      'SSR at the edge; click-tracked social egress.',
      'Resume from resume/resume.yaml → /resume.pdf.',
    ],
    href: 'https://github.com/tcorley/portfolio',
    hrefLabel: 'source on github',
  },
  {
    org: 'eBay',
    era: 'Software Engineer II · ~2015–2018',
    title: 'Modern stack + AMP',
    hook: 'Moved an existing eBay page onto the then-new Node/Marko stack and shipped an AMP version for a structured-data / SEO push.',
    outcomes: [
      'Ground-up conversion (Node.js, Marko, Express, Lasso, Less).',
      'Led releases and owned CI / repo hygiene for the surface.',
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

function OutcomeList({ outcomes }: { outcomes: string[] }) {
  return (
    <ul className='max-w-3xl space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
      {outcomes.map((outcome) => (
        <li key={outcome} className='flex gap-3'>
          <span
            className='mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500'
            aria-hidden='true'
          />
          <span>{outcome}</span>
        </li>
      ))}
    </ul>
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
        <p className='mb-2 text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400'>
          <span className='font-semibold text-slate-800 dark:text-slate-200'>
            {lead.org}
          </span>
          <span className='mx-2 text-slate-300 dark:text-slate-600' aria-hidden='true'>
            ·
          </span>
          {lead.era}
        </p>

        <h3 className='font-display mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl'>
          {lead.title}
        </h3>

        <p className='mb-4 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300'>
          {lead.hook}
        </p>

        <div className='mb-6'>
          <OutcomeList outcomes={lead.outcomes} />
        </div>

        <dl className='mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4'>
          {lead.metrics.map((metric) => (
            <div key={metric.label} className='min-w-0'>
              <dt className='text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                {metric.label}
              </dt>
              <dd className='font-display mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className='text-sm text-slate-500 dark:text-slate-400'>
          Details on{' '}
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
              <p className='mb-1.5 text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400'>
                <span className='text-slate-700 dark:text-slate-300'>{entry.org}</span>
                <span
                  className='mx-2 text-slate-300 dark:text-slate-600'
                  aria-hidden='true'
                >
                  ·
                </span>
                {entry.era}
              </p>

              <h4 className='font-display mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
                {entry.title}
              </h4>

              <p className='mb-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300'>
                {entry.hook}
              </p>

              <div className='mb-3'>
                <OutcomeList outcomes={entry.outcomes} />
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
