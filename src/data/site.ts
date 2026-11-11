export const SITE = {
  name: 'David Ikangbo',
  title: 'David Ikangbo | DevOps, Platform Engineering, Cloud & SRE',
  tagline: 'I build secure, reliable cloud platforms that help teams deliver with confidence.',
  description:
    'David Ikangbo is a DevOps and Platform Engineer focused on secure, reliable cloud infrastructure, Kubernetes, CI/CD, secrets management, observability and recovery.',
  url: 'https://dikangbo.netlify.app',
  email: 'davidikangbo@gmail.com',
  phone: '+234 816 599 6623',
  location: 'Nigeria',
  jobTitle: 'DevOps Engineer',
  employer: 'eHealth Africa',
  resume: '/resume/',
  social: {
    linkedin: 'https://linkedin.com/in/david-ikangbo',
    github: 'https://github.com/Isorshe-ai',
    x: 'https://x.com/Dikangbo',
  },
};

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/projects/', label: 'Projects' },
  { href: '/blog/', label: 'Blog' },
  { href: '/contact/', label: 'Contact' },
];

export const CATEGORIES = ['DevOps', 'Platform Engineering', 'SRE', 'Cloud', 'Security'] as const;
export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
