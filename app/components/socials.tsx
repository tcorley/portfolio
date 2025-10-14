import { SiBluesky, SiGithub } from '@icons-pack/react-simple-icons';
import InBug from '../main/InBug-Black.png';

type SocialLinkIcon = {
  type: 'icon';
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  href: string;
};

type SocialLinkImage = {
  type: 'image';
  src: string;
  label: string;
  href: string;
};

type SocialLink = SocialLinkIcon | SocialLinkImage;

export function Socials() {
  const socialLinks: SocialLink[] = [
    {
      type: 'icon',
      icon: SiGithub,
      label: 'github',
      href: 'https://github.com/tcorley',
    },
    {
      type: 'image',
      src: InBug,
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
    <div className='flex gap-4 justify-center flex-wrap'>
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target='_blank'
          rel='noopener noreferrer'
          className='group flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5'
          aria-label={social.label}
        >
          {social.type === 'icon' ? (
            <social.icon
              size={20}
              className='text-slate-700 group-hover:text-slate-900 transition-colors'
            />
          ) : (
            <img
              src={social.src}
              alt={social.label}
              className='w-5 h-5 text-slate-700 group-hover:text-slate-900 transition-colors'
            />
          )}
          <span className='text-sm font-medium text-slate-700 group-hover:text-slate-900'>
            {social.label}
          </span>
        </a>
      ))}
    </div>
  );
}
