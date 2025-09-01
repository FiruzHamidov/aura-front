'use client';

import { FC, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGetAgentsQuery } from '@/services/users/hooks';
import { Agent } from '@/services/users/types';
import { STORAGE_URL } from '@/constants/base-url';
import ExpertCardSkeleton from '../ExpertCardSkeleton';
import UserIcon from "@/icons/UserIcon";

interface ExpertCardProps {
  expert: Agent;
}

const ExpertCard: FC<ExpertCardProps> = ({ expert }) => {
  const [showPhone, setShowPhone] = useState(false);
  const photoPath = expert?.photo;
  const image = `${STORAGE_URL}/${photoPath}`;
  const handleShowPhone = () => setShowPhone(true);

  // Responsive card: full width and smaller fonts on mobile for /about/team
  return (
    <div
      data-slide
      className="bg-white rounded-[18px] px-4 py-5 text-center flex flex-col items-center h-full w-full max-w-full min-w-0 md:rounded-[22px] md:px-9 md:py-[30px] snap-start"
    >
      <div className="relative w-16 h-16 mb-3 md:w-20 md:h-20 md:mb-4">

        {expert.photo ? (
            <Image
                src={photoPath ? image : '/images/team/2.png'}
                alt={expert?.name}
                fill
                className="rounded-full object-cover"
                sizes="(max-width: 768px) 64px, 112px"
            />
        ) : (
            <div
                className="rounded-full flex justify-center items-center  h-[80px] w-[80px] bg-[#F1F5F9] p-1.5 mr-1.5">
              <UserIcon className="w-6 h-7"/>
            </div>
        )}
      </div>
      <h3 className="text-sm font-bold text-[#020617] mb-1 md:text-lg md:mb-1.5 leading-snug">
        {expert.name}
      </h3>
      <p className="text-xs text-[#666F8D] mb-2 md:text-base">
        {expert.role.name}
      </p>
      <button
        onClick={handleShowPhone}
        disabled={showPhone}
        className={`mt-auto w-full border border-[#BAC0CC] rounded-full md:px-3 py-1.5 text-xs md:text-sm transition-colors duration-200 cursor-pointer ${
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
  const { data: agents, isLoading } = useGetAgentsQuery();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const slides = Array.from(
        el.querySelectorAll<HTMLElement>('[data-slide]')
      );
      if (!slides.length) return;
      let idx = 0;
      let min = Number.POSITIVE_INFINITY;
      slides.forEach((slide, i) => {
        const dist = Math.abs(slide.offsetLeft - el.scrollLeft);
        if (dist < min) {
          min = dist;
          idx = i;
        }
      });
      setActiveIndex(idx);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [agents]);

  const scrollTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const slides = el.querySelectorAll<HTMLElement>('[data-slide]');
    const target = slides[index];
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 mt-10 md:mt-20">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-10">
          Встречайте команду экспертов Aura Estate!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <ExpertCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const isTeamPage = pathname === '/about/team';

  return (
    <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 mt-10 md:mt-20">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-10">
        Встречайте команду экспертов Aura Estate!
      </h2>

      {isTeamPage ? (
        // On /about/team: grid, 2 columns on mobile, no horizontal scroll, smaller cards/fonts
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {agents?.length ? (
            agents?.map((expert) => (
              <Link
                key={expert.id}
                href={`/about/team/${expert.id}`}
                className="w-full"
              >
                <ExpertCard expert={expert} />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-base md:text-lg">
                Нет доступных экспертов
              </p>
            </div>
          )}
        </div>
      ) : (
        // Elsewhere: keep slider on mobile
        <>
          <div
            ref={scrollerRef}
            className="overflow-x-auto md:overflow-visible hide-scrollbar snap-x snap-mandatory -mx-4 sm:mx-0"
          >
            <div className="grid grid-flow-col auto-cols-[280px] sm:auto-cols-[300px] gap-5 px-4 sm:px-0 md:grid-flow-row md:auto-cols-auto md:grid-cols-1 sm:md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
              {agents?.length ? (
                agents?.map((expert) => (
                  <Link key={expert.id} href={`/about/team/${expert.id}`}>
                    <ExpertCard expert={expert} />
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-500 text-lg">
                    Нет доступных экспертов
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dots indicator - only show on mobile/tablet when there are multiple items */}
          {agents && agents.length > 1 && (
            <div className="flex md:hidden justify-center items-center space-x-2 mt-[18px]">
              {agents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                    index === activeIndex
                      ? 'bg-[#0036A5]'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MeetTheTeam;
