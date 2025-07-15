'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Logo from '@/icons/Logo';
import MapIcon from '@/icons/MapIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import HeartIcon from '@/icons/HeartIcon';
import BoxIcon from '@/icons/BoxIcon';
import PlusIcon from '@/icons/PlusIcon';
import UserIcon from '@/icons/UserIcon';
import { usePathname } from 'next/navigation';
import { useMe, useLogoutMutation } from '@/services/login/hooks';

const navItems = [
  { name: 'Главная', href: '/' },
  { name: 'Аренда', href: '/rent' },
  { name: 'Услуги', href: '/services' },
  { name: 'Новостройки', href: '/new-buildings' },
  { name: 'Новости', href: '/about/news' },
  { name: 'Команда', href: '/about/team' },
  { name: 'О нас', href: '/about' },
];

const Header: FC = () => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const { data: user, isLoading: userLoading } = useMe();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdown &&
        dropdownRefs.current[activeDropdown] &&
        !dropdownRefs.current[activeDropdown]?.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }

      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown, isUserMenuOpen]);

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

  const UserMenu = ({ isMobile = false }: { isMobile?: boolean }) => {
    if (userLoading) {
      return (
        <div
          className={`${
            isMobile ? 'w-full' : ''
          } bg-gray-100 animate-pulse rounded-full px-4 py-2`}
        >
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
          <button
            className={`${
              isMobile ? 'w-full' : ''
            } bg-[#F0F2F5] px-4 lg:px-6 xl:px-[33.5px] py-2 lg:py-2.5 rounded-full transition-colors cursor-pointer hover:bg-gray-200`}
          >
            Войти
          </button>
        </Link>
      );
    }

    if (isMobile) {
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-[#0036A5] rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-600">
                {user.role?.name || 'Пользователь'}
              </div>
            </div>
          </div>
          <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
              Профиль
            </button>
          </Link>
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {logoutMutation.isPending ? 'Выходим...' : 'Выйти'}
          </button>
        </div>
      );
    }

    return (
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center space-x-2 bg-[#F0F2F5] hover:bg-gray-200 px-4 lg:px-6 py-2 lg:py-2.5 rounded-full transition-colors cursor-pointer"
        >
          <div className="w-6 h-6 bg-[#0036A5] rounded-full flex">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <span className="hidden lg:block font-medium">{user.name}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isUserMenuOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isUserMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm text-gray-600">{user.email}</div>
              <div className="text-xs text-gray-500 mt-1">
                {user.role?.name || 'Пользователь'}
              </div>
            </div>
            <Link href="/profile" onClick={() => setIsUserMenuOpen(false)}>
              <button className="cursor-pointer w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors">
                Профиль
              </button>
            </Link>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="cursor-pointer w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {logoutMutation.isPending ? 'Выходим...' : 'Выйти'}
            </button>
          </div>
        )}
      </div>
    );
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
                <HeartIcon className="h-6 w-6 cursor-pointer" />
              </Link>
            </button>
            <Link href="/comparison" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="p-1.5 text-[#0036A5] transition-colors">
                <span className="sr-only">Saved Items</span>
                <BoxIcon className="h-6 w-6 cursor-pointer" />
              </button>
            </Link>

            {/* User Menu */}
            <UserMenu />

            <Link href="/profile/add-post" className="hidden xl:flex items-center space-x-2 bg-[#0036A5] hover:bg-blue-800 text-white px-6 py-2 rounded-full transition-colors cursor-pointer">
              <PlusIcon className="h-5 w-5 cursor-pointer text-white mb-1" />
              <span>Добавить объявление</span>
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
        <div className="container flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 lg:space-x-6 xl:space-x-8 py-4 lg:py-[22px] overflow-x-auto">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={`hover:text-blue-600 whitespace-nowrap transition-colors text-sm lg:text-base ${
                    pathname === item.href ? 'text-[#0036A5]' : ''
                  }`}
                >
                  {item.name}
                </Link>
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
              {/* Mobile User Menu */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <UserMenu isMobile />
              </div>

              {/* Mobile Action Buttons */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
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
