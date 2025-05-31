import BedIcon from '@/icons/BedIcon';
import FloorIcon from '@/icons/FloorIcon';
import PlanIcon from '@/icons/PlanIcon';
import ShowerIcon from '@/icons/ShowerIcon';
import Image from 'next/image';

const apartmentOffers = [
  {
    id: 1,
    title: '1 комнатная квартира',
    description: 'Квартира находится в Блоках А и В.',
    rooms: 1,
    bathrooms: 2,
    area: 58,
    floor: 4,
    price: 222560,
    pricePerMeter: 4280,
    image: '/images/buildings/plans/1.png',
  },
  {
    id: 2,
    title: '2 комнатная квартира',
    description: 'Квартира находится в Блоках А и В.',
    rooms: 2,
    bathrooms: 3,
    area: 65,
    floor: 4,
    price: 278560,
    pricePerMeter: 4280,
    image: '/images/buildings/plans/2.png',
  },
  {
    id: 3,
    title: '3 комнатная квартира',
    description: 'Квартира находится в Блоках А и В.',
    rooms: 3,
    bathrooms: 2,
    area: 97,
    floor: 4,
    price: 415160,
    pricePerMeter: 4280,
    image: '/images/buildings/plans/3.png',
  },
  {
    id: 4,
    title: '4 комнатная квартира',
    description: 'Квартира находится в Блоках А и В.',
    rooms: 4,
    bathrooms: 2,
    area: 120,
    floor: 4,
    price: 500000,
    pricePerMeter: 4167,
    image: '/images/buildings/plans/3.png',
  },
];

export const Offers = () => {
  return (
    <div className="bg-white rounded-[22px] py-10 px-[60px] mt-5">
      <h2 className="text-2xl font-bold mb-8">Предложения</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1-комнатная квартира */}
        {apartmentOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-[#F7FAFD] rounded-xl overflow-hidden"
          >
            <div className="relative h-[188px] w-full bg-[#F0F7FF] rounded-xl mb-4 px-12 py-[18px]">
              <Image
                fill
                src={offer.image}
                alt={offer.title}
                className="object-contain p-2 rotate-270"
              />
            </div>

            <h3 className="text-xl font-semibold mb-1">{offer.title}</h3>
            <p className="text-[#667085] mb-3 text-sm">{offer.description}</p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-[#667085]">
                <BedIcon className="w-5 h-5 mr-1" />
                <span>{offer.rooms}</span>
              </div>

              <div className="flex items-center gap-1 text-[#667085]">
                <ShowerIcon className="w-5 h-5 mr-1" />
                <span>{offer.bathrooms}</span>
              </div>

              <div className="flex items-center gap-1 text-[#667085]">
                <PlanIcon className="w-5 h-5 mr-1" />

                <span>{offer.area} м²</span>
              </div>

              <div className="flex items-center gap-1 text-[#667085]">
                <FloorIcon className="w-5 h-5 mr-1" />
                <span>{offer.floor}</span>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-[#0036A5] text-2xl font-bold">
                {offer.price.toLocaleString()} с.
              </span>
              <span className="ml-auto text-sm text-[#667085]">
                {offer.pricePerMeter.toLocaleString()} с./м²
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
