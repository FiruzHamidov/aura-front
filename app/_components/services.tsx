import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ServiceItem {
  title: string;
  description?: string;
  imageUrl: string;
  altText: string;
  href: string;
}

const servicesData: ServiceItem[] = [
  {
    title: 'Ремонт под ключ',
    imageUrl: '/images/services/renovation.png',
    altText: 'Illustration of a house being renovated',
    href: '/repair',
  },
  {
    title: 'Дизайнерские услуги',
    imageUrl: '/images/services/design.png',
    altText: 'Illustration of a modern living room interior design',
    href: '/design',
  },
  {
    title: 'Клининговые услуги',
    imageUrl: '/images/services/cleaning.png',
    altText: 'Illustration of cleaning supplies like mop and bucket',
    href: '/cleaning',
  },
  {
    title: 'Оформление документов',
    imageUrl: '/images/services/documents.png',
    altText: 'Illustration of document folders',
    href: '/document-registration',
  },
  {
    title: 'Ипотека',
    imageUrl: '/images/services/calculator.png',
    altText: 'Illustration of a calculator next to a house model',
    href: '/mortgage',
  },
];

const Services: FC = () => {
  return (
    <div className="bg-white rounded-[22px] px-4 md:px-10 py-6 md:py-[55px]">
      {/* Mobile: horizontal scroll, Desktop: grid */}
      <div className="overflow-x-auto md:overflow-visible hide-scrollbar">
        <div className="grid grid-flow-col auto-cols-[minmax(120px,1fr)] gap-4 md:grid-flow-row sm:auto-cols-[minmax(300px,1fr)] md:grid-cols-3 lg:grid-cols-5 md:gap-8">
          {servicesData.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="relative h-[120px] md:h-auto flex flex-col bg-[#EFF6FF] rounded-[22px] p-5 transition-all duration-300 ease-in-out md:hover:shadow-md md:hover:-translate-y-1"
            >
              <div className="max-w-[200px] md:max-w-[130px]">
                <h3 className="text-[12px] md:text-[17px] md:leading-5 font-semibold text-[#020617]">
                  {service.title}
                </h3>
              </div>

              <div className="absolute right-0 bottom-0 md:right-3 md:bottom-3 md:static md:mt-auto md:self-end">
                <Image
                  width={120}
                  height={120}
                  src={service.imageUrl}
                  alt={service.altText}
                  className="w-[70px] h-[70px] md:w-[120px] md:h-[120px] object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
