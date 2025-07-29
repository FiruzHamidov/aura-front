'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetAgentsQuery } from '@/services/users/hooks';
import { Agent } from '@/services/users/types';
import { STORAGE_URL } from '@/constants/base-url';

interface ExpertCardProps {
  expert: Agent;
}

const ExpertCard: FC<ExpertCardProps> = ({ expert }) => {
  const [showPhone, setShowPhone] = useState(false);
  const photoPath = expert?.photo;

  const image = `${STORAGE_URL}/${photoPath}`;

  const handleShowPhone = () => {
    setShowPhone(true);
  };

  return (
    <div className="bg-white rounded-[22px] px-9 py-[30px] text-center flex flex-col items-center h-full">
      <div className="relative w-20 h-20 mb-4">
        <Image
          src={photoPath ? image : '/images/team/2.png'}
          alt={expert?.name}
          fill
          className="rounded-full object-cover"
          sizes="(max-width: 768px) 100px, 112px"
        />
      </div>
      <h3 className="text-lg font-bold text-[#020617] mb-1.5 leading-snug">
        {expert.name}
      </h3>
      <p className="text-[#666F8D] mb-2">{expert.role.name}</p>
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
  const { data: agents } = useGetAgentsQuery();

  return (
    <div className="container mt-10 md:mt-20">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-10">
        Встречайте команду экспертов Aura Estate!
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {agents?.length ? (
          agents?.map((expert) => (
            <Link key={expert.id} href={`/about/team/${expert.id}`}>
              <ExpertCard expert={expert} />
            </Link>
          ))
        ) : (
          <p>Нет доступных экспертов</p>
        )}
      </div>
    </div>
  );
};

export default MeetTheTeam;
