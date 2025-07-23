import Link from 'next/link';
import FacebookIcon from '@/icons/FacebookIcon';
import InstagramIcon from '@/icons/InstagramIcon';
import WhatsAppIcon from '@/icons/Whatsapp';
import YouTubeIcon from '@/icons/YoutubeIcon';
import FooterPhoneIcon from '@/icons/FooterPhoneIcon';
import EmailIcon from '@/icons/EmailIcon';
import FooterLogoIcon from '@/icons/FooterLogoIcon';

interface FooterLink {
  name: string;
  href: string;
}

interface LinkColumn {
  title: string;
  links: FooterLink[];
}

const footerLinks: LinkColumn[] = [
  {
    title: 'Связь с нами',
    links: [
      { name: 'Информация о компании', href: '/about' },
      { name: 'Реклама', href: '/advertising' },
      { name: 'Контакты', href: '/contacts' },
      { name: 'Часто задаваемые вопросы', href: '/faq' },
    ],
  },
  {
    title: 'Сервисы',
    links: [
      { name: 'Выкуп недвижимости', href: '/services/purchase' },
      { name: 'Ипотека', href: '/mortgage' },
      { name: 'Оформление документов', href: '/services/documents' },
      { name: 'Клининговые услуги', href: '/services/cleaning' },
    ],
  },
];

const footerNav = [
  { name: 'Главная', href: '/' },
  { name: 'Объявления', href: '/buy' },
  { name: 'Реклама', href: '/' },
  { name: 'Политика', href: '/policy' },
  { name: 'Сервисы', href: '/services' },
  { name: 'Контакты', href: '/about' },
];

const socialMedia = [
  {
    Icon: FacebookIcon,
    href: 'https://www.facebook.com/people/Aura-estate/61558372065984/',
    label: 'Facebook',
  },
  {
    Icon: InstagramIcon,
    href: 'https://www.instagram.com/aura_estate_/',
    label: 'Instagram',
  },
  {
    Icon: WhatsAppIcon,
    href: 'https://wa.me/+992945313131',
    label: 'WhatsApp',
  },
  {
    Icon: YouTubeIcon,
    href: 'https://www.youtube.com/channel/UCFqrFmI0ha2CKYM3zUuGQCg',
    label: 'YouTube',
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#12213A] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 md:mb-12">
          {/* First Column - Address */}
          <div>
            <h3 className="text-2xl font-bold mb-[22px]">Наш адрес</h3>
            <div className="space-y-[14px]">
              <p className="text-sm text-[#B2C3E4]">Головной офис:</p>
              <p>г.Душанбе ул. Айни 9</p>
              <p>Республика Таджикистан</p>
              <p>743000</p>
            </div>
          </div>

          {/* Middle Columns - Links */}
          {footerLinks.map((column, colIndex) => (
            <div key={`col-${colIndex}`}>
              <h3 className="text-2xl font-bold mb-[26px]">{column.title}</h3>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white hover:opacity-80 transition-opacity"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h3 className="text-xl font-bold mb-6">Связь с нами</h3>

            <div className="flex items-center mb-6">
              <div className="mr-3">
                <FooterPhoneIcon className="w-9 h-9" />
              </div>
              <div>
                <p className="text-sm text-[#B2C3E4]">кол центр</p>
                <p className="font-bold text-lg">+992 446 40 31 31</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="mr-3">
                <EmailIcon className="w-9 h-9" />
              </div>
              <div>
                <p className="text-sm text-[#B2C3E4]">email</p>
                <p className="font-bold text-lg">info@aura.tj</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-700/50" />

      {/* Bottom Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="inline-block">
              <FooterLogoIcon className="h-12 w-[135px]" />
            </Link>
          </div>

          <div className="mb-6 md:mb-0">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {footerNav.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white hover:opacity-80 transition-opacity"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4">
            {socialMedia.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="rounded-full inline-flex items-center justify-center"
              >
                <social.Icon className="h-10 w-10 text-white hover:opacity-80 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
