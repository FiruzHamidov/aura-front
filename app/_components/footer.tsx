import { FC } from 'react';
import Link from 'next/link';
import FacebookIcon from '@/icons/FacebookIcon';
import InstagramIcon from '@/icons/InstagramIcon';
import WhatsAppIcon from '@/icons/Whatsapp';
import YouTubeIcon from '@/icons/YoutubeIcon';
import Logo from '@/icons/Logo';

interface FooterLink {
  name: string;
  href: string;
}

interface LinkColumn {
  links: FooterLink[];
}

const footerLinks: LinkColumn[] = [
  {
    links: [
      { name: 'Вторичка', href: '/secondary' },
      { name: 'Новостройки', href: '/new' },
      { name: 'Дома', href: '/houses' },
      { name: 'Земельные участки', href: '/land' },
      { name: 'Коммерческая', href: '/commercial' },
      { name: 'Гаражи', href: '/garages' },
    ],
  },

  {
    links: [
      { name: 'История компании', href: '/about/history' },
      { name: 'Блог', href: '/blog' },
      { name: 'Карьера', href: '/career' },
      { name: 'Карта сайта', href: '/sitemap' },
      { name: 'О нас', href: '/about' },
    ],
  },

  {
    links: [
      { name: 'Контакты', href: '/contacts' },
      { name: 'Ипотека', href: '/mortgage' },
      { name: 'Клининговые услуги', href: '/services/cleaning' },
    ],
  },
];

const socialMedia = [
  {
    Icon: FacebookIcon,
    href: 'https://facebook.com',
    label: 'Facebook',
  },
  {
    Icon: InstagramIcon,
    href: 'https://instagram.com',
    label: 'Instagram',
  },
  {
    Icon: WhatsAppIcon,
    href: 'https://whatsapp.com',
    label: 'WhatsApp',
  },
  {
    Icon: YouTubeIcon,
    href: 'https://youtube.com',
    label: 'YouTube',
  },
];

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white rounded-t-[42px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 md:mb-12">
          <div className="md:col-span-3">
            <Link href="/" className="inline-block mb-5 w-full">
              <Logo className="h-16 w-full" />
            </Link>
            <div className="flex space-x-3">
              {socialMedia.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-full inline-flex items-center justify-center"
                >
                  <social.Icon className="h-10 w-10" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((column, colIndex) => (
            <div key={`col-${colIndex}`} className="md:col-span-2">
              <ul className="space-y-[14px]">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[#353E5C] transition-colors text-[18px]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-3">
            <div className="mb-[18px]">
              <p className="text-[#666F8D] text-[18px]">Позвоните нам</p>
              <a
                href="tel:+992945313131"
                className="block text-[32px] font-bold text-[#1E3A8A] transition-colors"
              >
                +992 945 31 31 31
              </a>

              <a
                  href="tel:+992446403131"
                  className="block text-[32px] font-bold text-[#1E3A8A] transition-colors"
              >
                +992 446 40 31 31
              </a>

            </div>
            <p className="text-[#353E5C]">Душанбе ул. Айни 9</p>
          </div>
        </div>
      </div>

      <hr className="text-[#E3E6EA]" />
      {/* Bottom Section */}
      <div className="container pt-[21px] pb-[31px] text-[#353E5C] flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>© {currentYear} «АУРА»</span>
        <Link href="/terms" className="hover:text-blue-600 transition-colors">
          Пользовательское соглашение
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
