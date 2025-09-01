'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from '@/icons/HomeIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import HeartIcon from '@/icons/HeartIcon';
import GridIcon from '@/icons/GridIcon';

const MobileBottomNavigation: FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Главная',
      href: '/',
      icon: HomeIcon,
    },
    {
      name: 'Сравнить',
      href: '/comparison',
      icon: SettingsIcon,
    },
    {
      name: 'Избранное',
      href: '/favorites',
      icon: HeartIcon,
    },
    {
      name: 'Ещё',
      href: '/more',
      icon: GridIcon,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === '/favorites' && pathname === '/profile/favorites');

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center py-2 px-1 min-w-0 flex-1"
            >
              <div className="p-1 rounded-md">
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-[#0036A5]' : 'text-gray-400'
                  }`}
                />
              </div>
              <span
                className={`text-xs text-center mt-1 ${
                  isActive ? 'text-[#0036A5] font-medium' : 'text-gray-400'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;
