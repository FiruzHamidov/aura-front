import { FC } from 'react';
import Link from 'next/link';
import Logo from '@/icons/Logo';
import MapIcon from '@/icons/MapIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import HeartIcon from '@/icons/HeartIcon';
import BoxIcon from '@/icons/BoxIcon';
import PlusIcon from '@/icons/PlusIcon';

const navItems = [
  { name: 'Главная', href: '/' },
  { name: 'Покупка', href: '/buy' },
  { name: 'Аренда', href: '/rent' },
  { name: 'Ипотека', href: '/mortgage' },
  { name: 'Сервисы', href: '/services' },
  { name: 'Реклама', href: '/ads' },
  { name: 'О нас', href: '/about' },
];

const Header: FC = () => {
  return (
    <header className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          <div className="flex items-center space-x-4 md:space-x-10">
            <Link href="/" className="w-full h-full">
              <Logo className="w-[135px] h-[44px]" />
            </Link>
            <button className="hidden sm:flex items-center space-x-1 bg-sky-100/70 hover:bg-sky-100 px-[27px] py-2 rounded-full text-sm transition-colors">
              <MapIcon className="h-5 w-6 text-slate-600" />
              <span>Душанбе</span>
            </button>
          </div>

          {/* Right Side: Icons and Buttons */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Icons (Consider making these links or buttons with actions) */}
            <button className="p-1.5 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors">
              <span className="sr-only">Filters</span>
              <SettingsIcon className="h-6 w-6" />
            </button>
            <button className="p-1.5 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors">
              <Link href="/favorites">
                <span className="sr-only">Favorites</span>
                <HeartIcon className="h-6 w-6" />
              </Link>
            </button>
            <button className="p-1.5 text-gray-500 hover:text-gray-800 transition-colors">
              <span className="sr-only">Saved Items</span>
              <BoxIcon className="h-6 w-6" />
            </button>

            {/* Add Listing Button */}
            <button className="hidden md:flex items-center space-x-2 bg-sky-100/70 hover:bg-sky-100 px-[27px] py-2 rounded-full text-sm font-medium transition-colors">
              <PlusIcon className="h-6 w-6" />
              <span>Добавить объявление</span>
            </button>

            {/* Login Button */}
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-[33.5px] py-2.5 rounded-full text-sm font-medium transition-colors">
              Войти
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Section */}
      <nav className="border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Use justify-center for center alignment as in image, or justify-start for left alignment */}
          <div className="flex space-x-6 md:space-x-8 py-[22px] overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium hover:text-blue-600 whitespace-nowrap transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
