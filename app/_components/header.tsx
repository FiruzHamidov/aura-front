'use client';

import {FC, useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import Logo from '@/icons/Logo';
import MapIcon from '@/icons/MapIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import HeartIcon from '@/icons/HeartIcon';
import BoxIcon from '@/icons/BoxIcon';
import PlusIcon from '@/icons/PlusIcon';
import {usePathname, useRouter} from 'next/navigation';

const navItems = [
  {name: 'Главная', href: '/'},
  {name: 'Сервисы', href: '/services'},
  {name: 'Новостройки', href: '/new-buildings'},
  {name: 'Новости', href: '/about/news'},
  {name: 'О нас', href: '/about',},
];

const Header: FC = () => {
  const pathname = usePathname();
  const { push } = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('header')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const handleDropdownItemClick = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4 lg:py-5">
          {/* Logo and Location - Desktop */}
          <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-10">
            <Link href="/" className="flex-shrink-0">
              <Logo className="w-[135px] h-[45px]" />
            </Link>
            {/* Location button - hidden on mobile and small tablets */}
            <button className="hidden lg:flex items-center space-x-2 bg-sky-100/70 hover:bg-sky-100 px-4 xl:px-[27px] py-2 rounded-full text-sm transition-colors">
              <MapIcon className="h-5 w-6 text-[#0036A5]" />
              <span className="text-sm">Душанбе</span>
            </button>
          </div>

          {/* Desktop Action Buttons - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Icon buttons */}
            <button className="p-1.5 cursor-pointer text-[#0036A5] transition-colors">
              <span className="sr-only">Filters</span>
              <SettingsIcon className="h-6 w-6 cursor-pointer" />
            </button>
            <button className="p-1.5 cursor-pointer text-[#0036A5] transition-colors">
              <Link href="/favorites">
                <span className="sr-only">Favorites</span>
                <HeartIcon className="h-6 w-6 cursor-pointer"/>
              </Link>
            </button>
            <Link href="/comparison" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="p-1.5 text-[#0036A5] transition-colors">
                <span className="sr-only">Saved Items</span>
                <BoxIcon className="h-6 w-6 cursor-pointer"/>
              </button>
            </Link>

            <button
                className="hidden xl:flex items-center space-x-2 bg-sky-100/70 hover:bg-sky-100 px-6 py-2 rounded-full transition-colors cursor-pointer pulse-shadow">
              <PlusIcon className="h-5 w-5 cursor-pointer"/>
              <span>Добавить объявление</span>
            </button>

            {/* Login button */}
            <Link href="/login">
              <button
                  className="bg-[#0036A5] hover:bg-blue-800 text-white px-4 lg:px-6 xl:px-[33.5px] py-2 lg:py-2.5 rounded-full transition-colors cursor-pointer">
                Войти
              </button>
            </Link>
          </div>

          {/* Mobile: Only Logo and Menu Button */}
          <div className="md:hidden flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 lg:space-x-6 xl:space-x-8 py-4 lg:py-[22px] overflow-x-auto">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
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
                      className={`flex items-center hover:text-blue-600 whitespace-nowrap cursor-pointer transition-colors text-sm lg:text-base ${
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
                      <div className="absolute z-50 w-48 rounded-md shadow-lg bg-white mt-8 py-2 border border-gray-100 font-bold">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors ${
                              pathname === child.href
                                ? 'text-[#0036A5] bg-blue-50'
                                : ''
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
                    className={`hover:text-blue-600 whitespace-nowrap transition-colors text-sm lg:text-base ${
                      pathname === item.href ? 'text-[#0036A5]' : ''
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

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <nav
            className="bg-white w-full max-w-sm h-full shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <Logo className="w-[135px] h-[45px]" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900"
                aria-label="Close menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {/* Mobile Action Buttons */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {/* Login Button */}
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-[#0036A5] hover:bg-blue-800 text-white px-4 py-3 rounded-lg font-medium transition-colors mb-3 sm:mb-0">
                    Войти
                  </button>
                </Link>

                {/* Location Button */}
                <button className="w-full flex items-center justify-center space-x-2 bg-sky-100/70 hover:bg-sky-100 px-4 py-3 rounded-lg transition-colors">
                  <MapIcon className="h-5 w-5 text-slate-600" />
                  <span>Душанбе</span>
                </button>

                {/* Add Listing Button */}
                <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg transition-colors">
                  <PlusIcon className="h-5 w-5" />
                  <span>Добавить объявление</span>
                </button>

                {/* Icon Actions */}
                <div className="flex justify-center space-x-6 pt-2">
                  <button className="p-3 text-[#0036A5] transition-colors">
                    <SettingsIcon className="h-6 w-6" />
                  </button>
                  <Link
                    href="/favorites"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="p-3 text-[#0036A5] transition-colors">
                      <HeartIcon className="h-6 w-6" />
                    </button>
                  </Link>
                  <Link
                    href="/comparison"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="p-3 text-[#0036A5] transition-colors">
                      <BoxIcon className="h-6 w-6" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => {
                            handleDropdownToggle(item.name);
                            push(item.href);
                          }}
                          className={`flex items-center justify-between w-full py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors ${
                            pathname?.startsWith(item.href)
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-gray-900'
                          }`}
                        >
                          <span className="font-medium">{item.name}</span>
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              activeDropdown === item.name ? 'rotate-180' : ''
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {activeDropdown === item.name && (
                          <div className="ml-4 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={`block py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors ${
                                  pathname === child.href
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700'
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
                        className={`block py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors font-medium ${
                          pathname === item.href
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-900'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
