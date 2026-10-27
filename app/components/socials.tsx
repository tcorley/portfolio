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
  src: string;
  label: TrackableLinkId;
  href: string;
};

type SocialLink = SocialLinkIcon | SocialLinkImage;

export function Socials() {
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
      src: '', // will be handled in render
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
  return (
    <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-4'>
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => trackLinkClick(social.label, social.href)}
          className='group inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 dark:shadow-slate-800 dark:hover:shadow-lg'
          aria-label={social.label}
        >
          <span className='inline-flex size-5 shrink-0 items-center justify-center'>
            {social.type === 'icon' ? (
              <social.icon
                size={20}
                className='text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors'
              />
            ) : social.label === 'linkedin' ? (
              <>
                <img
                  src={InBugBlack}
                  alt=''
                  className='size-5 block dark:hidden'
                />
                <img
                  src={InBugWhite}
                  alt=''
                  className='size-5 hidden dark:block'
                />
              </>
            ) : (
              <img
                src={social.src}
                alt=''
                className='size-5'
              />
            )}
          </span>
          <span className='text-sm font-medium leading-none text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'>
            {social.label}
          </span>
        </a>
      ))}
    </div>
  );
}
