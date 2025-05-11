'use client';

import { FC, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/icons/Logo';
import MapIcon from '@/icons/MapIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import HeartIcon from '@/icons/HeartIcon';
import BoxIcon from '@/icons/BoxIcon';
import PlusIcon from '@/icons/PlusIcon';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { name: 'Главная', href: '/' },
  { name: 'Покупка', href: '/buy' },
  { name: 'Аренда', href: '/rent' },
  { name: 'Ипотека', href: '/mortgage' },
  { name: 'Сервисы', href: '/services' },
  { name: 'Реклама', href: '/ads' },
  {
    name: 'О нас',
    href: '/about',
    children: [
      { name: 'Новости', href: '/about/news' },
      { name: 'Команда', href: '/about/team' },
    ],
  },
];

const Header: FC = () => {
  const pathname = usePathname();
  const { push } = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdown &&
        dropdownRefs.current[activeDropdown] &&
        !dropdownRefs.current[activeDropdown]?.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const handleDropdownItemClick = () => {
    setActiveDropdown(null);
  };

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

          <div className="flex items-center space-x-3 md:space-x-4">
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

            <button className="hidden md:flex items-center space-x-2 bg-sky-100/70 hover:bg-sky-100 px-[27px] py-2 rounded-full text-sm  transition-colors">
              <PlusIcon className="h-6 w-6" />
              <span>Добавить объявление</span>
            </button>

            <Link href="/login">
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-[33.5px] py-2.5 rounded-full text-sm transition-colors cursor-pointer">
                Войти
              </button>
            </Link>
          </div>
        </div>
      </div>

      <nav className="border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 md:space-x-8 py-[22px] overflow-x-auto">
            {navItems.map((item) => (
              <div
                key={item.name}
                className=""
                ref={(el) => {
                  if (item.children) {
                    dropdownRefs.current[item.name] = el;
                  }
                }}
              >
                {item.children ? (
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        handleDropdownToggle(item.name);
                        push(item.href);
                      }}
                      className={`flex items-center hover:text-blue-600 whitespace-nowrap cursor-pointer transition-colors ${
                        pathname?.startsWith(item.href) ? 'text-blue-600' : ''
                      }`}
                      aria-expanded={activeDropdown === item.name}
                    >
                      {item.name}
                      <svg
                        className={`ml-1 w-4 h-4 transition-transform ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDropdownToggle(item.name);
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {activeDropdown === item.name && (
                      <div className="absolute z-50 w-48 rounded-md shadow-lg bg-white mt-32 py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 ${
                              pathname === child.href ? 'text-blue-600' : ''
                            }`}
                            onClick={handleDropdownItemClick}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`hover:text-blue-600 whitespace-nowrap transition-colors ${
                      pathname === item.href ? 'text-blue-600' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
