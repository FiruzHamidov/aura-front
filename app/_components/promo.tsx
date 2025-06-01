import { FC } from 'react';
import Image from 'next/image';

interface PromoCardData {
  id: number | string;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  imageUrl: string;
  imageAlt: string;
}

const promoData: PromoCardData[] = [
  {
    id: 1,
    title: 'Квартира мечты по<br />лучшей цене!',
    description:
      'Современные новостройки с выгодными условиями - успей купить по специальной цене!',
    bgColor: 'bg-yellow-400',
    textColor: 'text-black',
    imageUrl: '/images/promo/1.png',
    imageAlt: 'Современное жилое здание',
  },
  {
    id: 2,
    title: 'Ипотека в новостройках<br />от 14% годовых',
    description:
      'Выгодные условия и комфортное жильё — оформите ипотеку на лучших условиях!',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    imageUrl: '/images/promo/2.png',
    imageAlt: 'Дом',
  },
  {
    id: 3,
    title: 'Сервис аренды квартир<br />в новостройках',
    description:
      'Аренда без хлопот – просто, быстро, выгодно в месте с Aura Estate еще не было так просто',
    bgColor: 'bg-sky-500',
    textColor: 'text-white',
    imageUrl: '/images/promo/3.png',
    imageAlt: 'Дом с ключами',
  },
];

interface PromoCardProps {
  cardData: PromoCardData;
}

const PromoCard: FC<PromoCardProps> = ({ cardData }) => {
  return (
    <div
      className={`relative rounded-3xl p-6 md:p-8 overflow-hidden h-full flex flex-col justify-between min-h-[200px] md:min-h-[240px] ${cardData.bgColor} ${cardData.textColor} hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
    >
      <div className="relative z-10 max-w-[60%]">
        {' '}
        <h3
          className="text-lg font-bold mb-2.5 leading-6 md:leading-none"
          dangerouslySetInnerHTML={{ __html: cardData.title }}
        />
        <p className="text-xs md:text-sm opacity-90">{cardData.description}</p>
      </div>

      <div className="absolute bottom-0 right-0 w-1/2 md:w-[45%] lg:w-[55%] max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] aspect-[5/4] pointer-events-none -bottom-1 -right-1 md:-bottom-2 md:-right-2">
        <Image
          src={cardData.imageUrl}
          alt={cardData.imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
        />
      </div>
    </div>
  );
};

const Promo: FC = () => {
  const activeIndex = 0;
  return (
    <section className="container py-5 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {promoData.map((card) => (
          <PromoCard key={card.id} cardData={card} />
        ))}
      </div>

      <div className="flex justify-center items-center space-x-2 mt-8">
        {promoData.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
              index === activeIndex
                ? 'bg-blue-700'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Promo;
