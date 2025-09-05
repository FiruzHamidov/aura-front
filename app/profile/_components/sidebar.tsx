'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLogoutMutation } from '@/services/login/hooks';
import { usePathname } from 'next/navigation';

import HeartIcon from '@/icons/HeartIcon';
import ListingIcon from '@/icons/ListingIcon';
import LogoutIcon from '@/icons/LogoutIcon';
import UserIcon from '@/icons/UserIcon';
import PlusIcon from '@/icons/PlusIcon';
import MenuIcon from '@/icons/MenuIcon';
import XIcon from '@/icons/XIcon';
import CalendarIcon from '@/icons/CalendarIcon';

export const Sidebar = () => {
  const pathname = usePathname();
  const newPath =
    '/profile' +
    (pathname.split('/').slice(2).join('/')
      ? '/' + pathname.split('/').slice(2).join('/')
      : '');
  const [activeLink, setActiveLink] = useState(newPath);
  const [isOpen, setIsOpen] = useState(false);

  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Кнопка бургер-меню только на мобилке */}
      <button
        className="md:hidden absolute top-20 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon className="w-8 h-8 text-gray-800" />
      </button>

      {/* Затемнение фона и закрытие по клику */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-[305px] min-w-[305px] min-h-[600px] bg-white p-[18px] pb-8 rounded-r-xl shadow-xl transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:rounded-xl md:shadow-none
        `}
      >
        {/* Кнопка закрытия на мобильных */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setIsOpen(false)}>
            <XIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {[
            {
              href: '/profile/reports',
              icon: <ListingIcon className="w-6 h-6" />,
              label: 'Отчеты',
            },
            {
              href: '/profile',
              icon: <UserIcon className="w-6 h-6" />,
              label: 'Профиль',
            },
            {
              href: '/profile/favorites',
              icon: <HeartIcon className="w-6 h-6" />,
              label: 'Избранное',
            },
            // { href: '/profile/wallet', icon: <WalletIcon className="w-6 h-6" />, label: 'Кошелек' },
            {
              href: '/profile/my-listings',
              icon: <ListingIcon className="w-6 h-6" />,
              label: 'Мои объявления',
            },
            {
              href: '/profile/all-listings',
              icon: <ListingIcon className="w-6 h-6" />,
              label: 'Все объявления',
            },
            {
              href: '/profile/my-booking',
              icon: <CalendarIcon className="w-6 h-6" />,
              label: 'Мои показы',
            },
            {
              href: '/profile/add-post',
              icon: <PlusIcon className="w-6 h-6" />,
              label: 'Добавить объявление',
            },
          ].map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-3 rounded-3xl  ${
                activeLink === href
                  ? 'bg-[#0036A5] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                setActiveLink(href);
                setIsOpen(false);
              }}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="mt-auto flex items-center gap-3 bottom-0 relative text-red-600 p-3 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <LogoutIcon className="w-6 h-6" />
            <span>{logoutMutation.isPending ? 'Выходим...' : 'Выйти'}</span>
          </button>
        </nav>
      </div>
    </>
  );
};
