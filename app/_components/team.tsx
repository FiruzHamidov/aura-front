'use client';

import { FC, useState } from 'react';
import Image from 'next/image';

interface ExpertProfile {
  id: number | string;
  name: string;
  role: string;
  imageUrl: string;
  imageAlt: string;
  phone?: string;
}

const expertData: ExpertProfile[] = [
  {
    id: 1,
    name: 'Савоев Шорух Искандарович',
    role: 'Менеджер по продажам',
    imageUrl: '/images/team/1.png',
    imageAlt: 'Фото Савоев Шорух',
    phone: '+123 456 7890',
  },
  {
    id: 2,
    name: 'Шамсидинова Фарангис Саторова',
    role: 'Менеджер по продажам',
    imageUrl: '/images/team/2.png',
    imageAlt: 'Фото Шамсидинова Фарангис',
    phone: '+123 456 7891',
  },
  {
    id: 3,
    name: 'Хошимов Туйчи Муродоавич',
    role: 'Менеджер по продажам',
    imageUrl: '/images/team/3.png',
    imageAlt: 'Фото Хошимов Туйчи',
    phone: '+123 456 7892',
  },
  {
    id: 4,
    name: 'Орипов Сухроб Валиевич',
    role: 'Менеджер по продажам',
    imageUrl: '/images/team/4.png',
    imageAlt: 'Фото Орипов Сухроб',
    phone: '+123 456 7893',
  },
];

interface ExpertCardProps {
  expert: ExpertProfile;
}

const ExpertCard: FC<ExpertCardProps> = ({ expert }) => {
  const [showPhone, setShowPhone] = useState(false);

  const handleShowPhone = () => {
    setShowPhone(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 px-9 py-[30px] text-center flex flex-col items-center">
      <div className="relative w-20 h-20 mb-4">
        <Image
          src={expert.imageUrl}
          alt={expert.imageAlt}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-full"
          sizes="(max-width: 768px) 100px, 112px"
        />
      </div>
      <h3 className="text-lg font-bold text-[#020617] mb-1.5 leading-snug">
        {expert.name}
      </h3>
      <p className="text-[#666F8D] mb-2">{expert.role}</p>
      <button
        onClick={handleShowPhone}
        disabled={showPhone}
        className={`mt-auto w-full border border-[#BAC0CC] rounded-full px-4 py-2 text-sm transition-colors duration-200 cursor-pointer ${
          showPhone
            ? 'bg-gray-100 text-gray-500 cursor-default'
            : 'text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2'
        }`}
      >
        {showPhone ? expert.phone || 'Телефон не указан' : 'Показать телефон'}
      </button>
    </div>
  );
};

const MeetTheTeam: FC = () => {
  return (
    <section>
      <div className="container mt-20 mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-10">
          Встречайте команду экспертов Aura Estate!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {expertData.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetTheTeam;
