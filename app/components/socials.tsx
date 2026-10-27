import { SiBluesky, SiGithub } from '@icons-pack/react-simple-icons';
import { FileText } from 'lucide-react';
import {
  trackLinkClick,
  type TrackableLinkId,
} from '../lib/track-link-click';
import InBugBlack from '../main/InBug-Black.png';
import InBugWhite from '../main/InBug-White.png';

type SocialLinkIcon = {
  type: 'icon';
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: TrackableLinkId;
  href: string;
};

type SocialLinkImage = {
  type: 'image';
  label: TrackableLinkId;
  href: string;
};

type SocialLink = SocialLinkIcon | SocialLinkImage;

const socialLinks: SocialLink[] = [
  {
    type: 'icon',
    icon: FileText,
    label: 'resume',
    href: '/resume.pdf',
  },
  {
    type: 'icon',
    icon: SiGithub,
    label: 'github',
    href: 'https://github.com/tcorley',
  },
  {
    type: 'image',
    label: 'linkedin',
    href: 'https://linkedin.com/in/tcorley',
  },
  {
    type: 'icon',
    icon: SiBluesky,
    label: 'bluesky',
    href: 'https://bsky.app/profile/corley.rocks',
  },
];

/**
 * Equal pill boxes at every breakpoint.
 * w-32 (128px) fits the longest label ("linkedin"/"bluesky") with icon + padding.
 */
const PILL_CLASS =
  'group inline-flex h-11 w-32 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 dark:shadow-slate-800 dark:hover:shadow-lg';

const ICON_SLOT =
  'inline-flex size-5 shrink-0 items-center justify-center text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-white';

function SocialIcon({ social }: { social: SocialLink }) {
  if (social.type === 'icon') {
    // Solid brand marks fill the viewBox more than Lucide strokes — slight optical nudge
    const px = social.label === 'resume' ? 18 : 16;
    return <social.icon size={px} aria-hidden='true' />;
  }

  return (
    <>
      <img
        src={InBugBlack}
        alt=''
        aria-hidden='true'
        className='block h-[15px] w-auto max-w-[17px] object-contain dark:hidden'
      />
      <img
        src={InBugWhite}
        alt=''
        aria-hidden='true'
        className='hidden h-[15px] w-auto max-w-[17px] object-contain dark:block'
      />
    </>
  );
}

export function Socials() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-4'>
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => trackLinkClick(social.label, social.href)}
          className={PILL_CLASS}
          aria-label={social.label}
        >
          <span className={ICON_SLOT}>
            <SocialIcon social={social} />
          </span>
          <span className='translate-y-px text-sm font-medium leading-none text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-white'>
            {social.label}
          </span>
        </a>
      ))}
    </div>
  );
}
