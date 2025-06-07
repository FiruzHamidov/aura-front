import { FC } from 'react';
import Image from 'next/image';

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
    href: '/services/renovation',
  },
  {
    title: 'Дизайнерские услуги',
    imageUrl: '/images/services/design.png',
    altText: 'Illustration of a modern living room interior design',
    href: '/services/design',
  },
  {
    title: 'Клининговые услуги',
    imageUrl: '/images/services/cleaning.png',
    altText: 'Illustration of cleaning supplies like mop and bucket',
    href: '/services/cleaning',
  },
  {
    title: 'Оформление документов',
    imageUrl: '/images/services/documents.png',
    altText: 'Illustration of document folders',
    href: '/services/documents',
  },
  {
    title: 'Ипотечный калькулятор',
    imageUrl: '/images/services/calculator.png',
    altText: 'Illustration of a calculator next to a house model',
    href: '/mortgage/calculator',
  },
];

const Services: FC = () => {
  return (
    <div className="bg-white rounded-[22px] px-4 md:px-10 py-6 md:py-[55px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
        {servicesData.map((service) => (
          <div
            key={service.href}
            className="h-full flex flex-col bg-[#EFF6FF] rounded-[22px] transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:-translate-y-1"
          >
            <div className="flex-grow flex flex-col justify-center p-5 max-w-[130px]">
              <h3 className="text-[17px] leading-5 font-semibold text-[#020617]">
                {service.title}
              </h3>
            </div>
            <div className="flex-shrink-0">
              <Image
                width={120}
                height={120}
                src={service.imageUrl}
                alt={service.altText}
                className="justify-self-end"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
