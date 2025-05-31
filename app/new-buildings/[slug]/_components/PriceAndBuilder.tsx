import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PhoneIcon from '@/icons/PhoneIcon';
import WhatsappGreenIcon from '@/icons/WhatsappGreenIcon';
import { BuildingComponentProps } from './types';

export const PriceAndBuilder: FC<BuildingComponentProps> = ({
  apartmentData,
}) => {
  return (
    <div className="lg:w-1/3">
      <div className="bg-white rounded-[22px] py-[15px] px-[22px] mb-5">
        <div className="text-[#666F8D] text-lg mb-1.5">Цена</div>
        <div className="text-[32px] font-bold text-[#0036A5] mb-1.5">
          {apartmentData.price}
        </div>
        <div className="text-[#666F8D] text-lg mb-2">
          8 170 c. – 9 260 c./м²
        </div>
      </div>

      <div className="bg-white rounded-[22px] px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden">
            <Image
              src={apartmentData.agent.image}
              alt={apartmentData.agent.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-0.5">
              {apartmentData.agent.name}
            </h3>
            <div className="text-[#666F8D]">{apartmentData.agent.position}</div>
          </div>
        </div>
        <div className="my-[14px] text-lg">{apartmentData.agent.address}</div>
        <div className="text-[#666F8D]">{apartmentData.agent.description}</div>

        <div className="mt-[14px] text-[#666F8D] text-lg space-y-3">
          <div className="flex items-center justify-between">
            <span>Строится</span>
            <span>{apartmentData.agent.building}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Построено</span>
            <span>{apartmentData.agent.builded}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Год основания</span>
            <span>{apartmentData.agent.founded}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Всего проектов</span>
            <span>{apartmentData.agent.projects}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[22px] px-8 py-4 mt-5">
        <Link
          href={`tel:${apartmentData.agent.phone.replace(/[^\d+]/g, '')}`}
          className="w-full rounded-full flex items-center"
        >
          <div className="bg-[#0036A5] p-2.5 rounded-full w-11 h-11 mr-2">
            <PhoneIcon className="w-8 h-8 mr-1" />
          </div>
          <div>
            <div className="text-sm text-[#666F8D] mb-0.5">
              Телефон застройщика
            </div>
            <div className="text-2xl font-bold">
              {apartmentData.agent.phone}
            </div>
          </div>
        </Link>
      </div>
      <div className="bg-[#22C55E] text-white rounded-[22px] px-8 py-4 mt-5">
        <Link
          target="_blank"
          href={`https://wa.me/${apartmentData.agent.phone.replace(
            /[^\d+]/g,
            ''
          )}`}
          className="w-full rounded-full flex items-center"
        >
          <div className="flex items-center justify-center bg-white rounded-full w-11 h-11 mr-2">
            <WhatsappGreenIcon className="w-8 h-8 mr-1" />
          </div>
          <div>
            <div className="text-sm mb-0.5">Написать в</div>
            <div className="text-2xl font-bold">Whatsapp</div>
          </div>
        </Link>
      </div>
      <div className="bg-white rounded-[22px] px-8 py-7 mt-5">
        <Link
          href={`tel:${apartmentData.agent.phone.replace(/[^\d+]/g, '')}`}
          className="block w-full rounded-full text-center text-2xl font-bold"
        >
          Скачать каталог
        </Link>
      </div>
    </div>
  );
};
