import { ArrowUpRight } from 'lucide-react';

type Outcome = string;

type FeaturedEntry = {
  org: string;
  era: string;
  title: string;
  hook: string;
  outcomes: Outcome[];
  href?: string;
  hrefLabel?: string;
  note?: string;
};

const lead = {
  org: 'LinkedIn',
  era: 'Senior Software Engineer · ~2021–present',
  title: 'Workflow automation',
  problem:
    'Internal teams needed to automate cross-system work without waiting on engineers to hand-roll every flow. Authoring was fragmented across generations of UI; the job was to make automation something people could own end to end.',
  owned: [
    'Led three generations of the workflow authoring experience — legacy UI → on-prem editor → no-code automation platform — so engineers could create, version, and run workflows in the product.',
    'Authored core specs and platform foundations that others built on, not just a feature slice.',
    'Partnered across UI, transport, and backend so create / version / execute stayed coherent, with observability, performance budgets, and compliance treated as production concerns.',
  ],
  secondAngle: {
    title: 'Also shipped: hybrid retrieval filter',
    body: 'On a sales-productivity surface I shipped a cognitive Job Title filter — hybrid BM25 + vector retrieval with rollout guardrails (top-K=50). Expansion work targets a predictable ~p95 latency (~10 minutes for the async expansion step, not interactive search).',
  },
  metrics: [
    { label: 'CLS good', value: '~96%' },
    { label: 'INP good', value: '~98%' },
    { label: 'JS bundle', value: '−16%' },
    { label: 'CI feedback', value: '−44%' },
  ],
  closing:
    'Real-user Core Web Vitals stayed healthy while we cut the JS bundle ~16% and CI feedback ~44%. Happy to walk through the arc — details also live on the resume.',
};

const smaller: FeaturedEntry[] = [
  {
    org: 'LinkedIn',
    era: 'Developer Platform · ~2018–2021',
    title: 'Reclaiming unused storage',
    hook: 'Most of the distributed key-value tier looked “in use” until we measured it — then we proved ~60% of production stores (~860 of ~1400) were unused and shipped the soft→hard deletion path that got the space back.',
    outcomes: [
      'Identified ~60% of production stores as unused (~860 / ~1400).',
      'Shipped soft-to-hard deletion workflows that reclaimed capacity.',
      'Public resume framing: multi-million annual savings from reclaimed capacity.',
    ],
    note: 'Internal platform work — ask me for a walkthrough.',
  },
  {
    org: 'LinkedIn',
    era: 'Developer Platform',
    title: 'Internal UI platform',
    hook: 'Turned one-off front-end delivery into shared patterns — modular components, onboarding flows, Storybook — plus TypeScript migration guidance so large internal apps stopped reinventing the wheel.',
    outcomes: [
      'Component modularization, onboarding flows, and Storybook patterns for teams.',
      'Front-end enablement docs and TypeScript migration patterns (lint/style, developer guides).',
      'Aimed at fewer runtime defects and faster onboarding.',
    ],
    href: 'https://github.com/tcorley/storybook-router',
    hrefLabel: 'related: storybook-router',
    note: 'Open-source decorator is adjacent craft, not the internal platform itself.',
  },
  {
    org: 'rolan.dev',
    era: 'Ongoing',
    title: 'This site & resume pipeline',
    hook: 'The portfolio is itself a small product: React Router 7 + Tailwind v4 on Cloudflare Workers, with a YAML→PDF resume pipeline as the single public source of truth.',
    outcomes: [
      'SSR personal site at the edge with click-tracked social egress.',
      'Resume rendered from resume/resume.yaml → /resume.pdf.',
      'Featured work ships only when the copy is real — no stub projects.',
    ],
    href: 'https://github.com/tcorley/portfolio',
    hrefLabel: 'source on github',
  },
  {
    org: 'eBay',
    era: 'Software Engineer II · ~2015–2018',
    title: 'Modern stack + AMP',
    hook: 'Took an existing eBay page onto the then-new Node/Marko stack and shipped an Accelerated Mobile Pages version as part of a structured-data / SEO push — early mobile-performance work that still reads.',
    outcomes: [
      'Ground-up conversion onto eBay’s modern FE stack (Node.js, Marko, Express, Lasso, Less).',
      'AMP version of the page for mobile.',
      'Led releases and owned CI / repo hygiene for the surface.',
    ],
    note: 'No public demo — happy to talk through it.',
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

function EntryLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
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

export function FeaturedWork() {
  return (
    <section
      aria-labelledby='featured-work-heading'
      className='mt-24 md:mt-32 scroll-mt-8'
    >
      <div className='mb-12 flex items-baseline gap-4 animate-fade-up'>
        <h2
          id='featured-work-heading'
          className='font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl'
        >
          featured work
        </h2>
        <SectionRule />
      </div>

      {/* Lead case study */}
      <article className='animate-fade-up' style={{ animationDelay: '0.08s' }}>
        <p className='mb-3 text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400'>
          <span className='font-semibold text-slate-800 dark:text-slate-200'>
            {lead.org}
          </span>
          <span className='mx-2 text-slate-300 dark:text-slate-600' aria-hidden='true'>
            ·
          </span>
          {lead.era}
        </p>

        <h3 className='font-display mb-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl'>
          {lead.title}
        </h3>

        <p className='mb-6 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300'>
          {lead.problem}
        </p>

        <ul className='mb-8 max-w-3xl space-y-3 text-base leading-relaxed text-slate-700 dark:text-slate-300'>
          {lead.owned.map((item) => (
            <li key={item} className='flex gap-3'>
              <span
                className='mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500'
                aria-hidden='true'
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className='mb-8 max-w-3xl border-l-2 border-slate-300 pl-5 dark:border-slate-600'>
          <p className='mb-2 font-display text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200'>
            {lead.secondAngle.title}
          </p>
          <p className='text-base leading-relaxed text-slate-600 dark:text-slate-300'>
            {lead.secondAngle.body}
          </p>
        </div>

        <dl className='mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4'>
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

        <p className='max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-400'>
          {lead.closing}{' '}
          <a
            href='/resume.pdf'
            className='font-medium text-slate-800 underline-offset-4 hover:underline dark:text-slate-200'
          >
            resume.pdf
          </a>
        </p>
      </article>

      {/* Smaller projects — editorial list */}
      <div className='mt-16 md:mt-20'>
        <div className='mb-8 flex items-baseline gap-4'>
          <h3 className='font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl'>
            more work
          </h3>
          <SectionRule />
        </div>

        <ul className='divide-y divide-slate-200 dark:divide-slate-700'>
          {smaller.map((entry, index) => (
            <li
              key={entry.title}
              className='animate-fade-up py-8 first:pt-0 last:pb-0'
              style={{ animationDelay: `${0.12 + index * 0.06}s` }}
            >
              <p className='mb-2 text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400'>
                <span className='text-slate-700 dark:text-slate-300'>{entry.org}</span>
                <span
                  className='mx-2 text-slate-300 dark:text-slate-600'
                  aria-hidden='true'
                >
                  ·
                </span>
                {entry.era}
              </p>

              <h4 className='font-display mb-3 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
                {entry.title}
              </h4>

              <p className='mb-4 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300'>
                {entry.hook}
              </p>

              <ul className='mb-4 max-w-3xl space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
                {entry.outcomes.map((outcome) => (
                  <li key={outcome} className='flex gap-3'>
                    <span
                      className='mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500'
                      aria-hidden='true'
                    />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
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
