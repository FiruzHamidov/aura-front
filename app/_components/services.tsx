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
    <div className="container mx-auto mt-5">
      {/* Optional: Add a title for the section if desired */}
      {/* <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">Наши Услуги</h2> */}

      {/* White container similar to the hero search */}
      <div className="bg-white rounded-xl shadow-lg px-10 py-[55px]">
        {/* Grid for the service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.href}
              className="h-full flex flex-col bg-[#EFF6FF] rounded-xl transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:-translate-y-1"
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
                  objectFit="contain"
                  className="justify-self-end"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
