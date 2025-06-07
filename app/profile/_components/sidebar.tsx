'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeartIcon from '@/icons/HeartIcon';
import ListingIcon from '@/icons/ListingIcon';
import LogoutIcon from '@/icons/LogoutIcon';
import UserIcon from '@/icons/UserIcon';
import WalletIcon from '@/icons/WalletIcon';

export const Sidebar = () => {
  const [activeLink, setActiveLink] = useState('/profile');

  return (
    <div className="min-w-[305px] w-[305px] h-max bg-white rounded-xl p-[18px] pb-8">
      <nav className="flex flex-col gap-3">
        <Link
          href="/profile"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium ${
            activeLink === '/profile'
              ? 'bg-[#0036A5] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveLink('/profile')}
        >
          <UserIcon className="w-6 h-6" />
          <span>Профиль</span>
        </Link>
        <Link
          href="/profile/favorites"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium ${
            activeLink === '/profile/favorites'
              ? 'bg-[#0036A5] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveLink('/profile/favorites')}
        >
          <HeartIcon className="w-6 h-6" />
          <span>Избранное</span>
        </Link>
        <Link
          href="/profile/wallet"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium ${
            activeLink === '/profile/wallet'
              ? 'bg-[#0036A5] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveLink('/profile/wallet')}
        >
          <WalletIcon className="w-6 h-6" />
          <span>Кошелек</span>
        </Link>
        <Link
          href="/profile/my-listings"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium ${
            activeLink === '/profile/my-listings'
              ? 'bg-[#0036A5] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveLink('/profile/my-listings')}
        >
          <ListingIcon className="w-6 h-6" />
          <span>Мои объявления</span>
        </Link>

        <Link href="/login">
          <button className="mt-[310px] flex items-center gap-3 text-red-600 p-3 rounded-lg hover:bg-gray-100">
            <LogoutIcon className="w-6 h-6" />
            <span>Выйти</span>
          </button>
        </Link>
      </nav>
    </div>
  );
};
