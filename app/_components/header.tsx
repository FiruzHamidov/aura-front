'use client';

import {FC, useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import Logo from '@/icons/Logo';
import MapIcon from '@/icons/MapIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import HeartIcon from '@/icons/HeartIcon';
import PlusIcon from '@/icons/PlusIcon';
import UserIcon from '@/icons/UserIcon';
import {usePathname} from 'next/navigation';
import {useLogoutMutation, useMe} from '@/services/login/hooks';

const navItems = [
    {name: 'Главная', href: '/'},
    {name: 'Снять', href: '/rent'},
    {name: 'Аренда', href: '/rent'},
    {name: 'Новостройки', href: '/new-buildings'},
    {name: 'Ипотека', href: '/mortgage'},
    {name: 'Сервисы', href: '/services'},
    // {name: 'Реклама', href: '/advertising'},
];

const Header: FC = () => {
    const pathname = usePathname();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const userMenuRef = useRef<HTMLDivElement | null>(null);
    const [isClient, setIsClient] = useState(false);

    const {data: user, isLoading: userLoading} = useMe();
    const logoutMutation = useLogoutMutation();

    useEffect(() => {
        setIsClient(true);
    }, []);

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
            if (isMobileMenuOpen && !(event.target as Element).closest('nav')) {
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

    const UserMenu = ({isMobile = false}: { isMobile?: boolean }) => {
        if (!isClient || userLoading) {
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
                            <UserIcon className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <div className=" text-gray-900">{user.name}</div>
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
                        <UserIcon className="w-6 h-6 text-white"/>
                    </div>
                    <span className="hidden lg:block ">{user.name}</span>
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
                    <div
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="text-sm text-gray-600">{user.email}</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {user.role?.name || 'Пользователь'}
                            </div>
                        </div>
                        <Link href="/profile" onClick={() => setIsUserMenuOpen(false)}>
                            <button
                                className="cursor-pointer w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors">
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
            <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3 sm:py-4 lg:py-5">
                    {/* Logo and Location - Desktop */}
                    <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-10">
                        <Link href="/" className="flex-shrink-0">
                            <Logo className="w-[135px] h-[45px]"/>
                        </Link>
                        {/* Location button - hidden on mobile and small tablets */}
                        <button
                            className="hidden lg:flex items-center space-x-2 bg-sky-100/70 hover:bg-sky-100 px-4 xl:px-[27px] py-2 rounded-full text-sm transition-colors">
                            <MapIcon className="h-5 w-6 text-[#0036A5]"/>
                            <span className="text-sm">Душанбе</span>
                        </button>
                    </div>

                    {/* Desktop Action Buttons - Hidden on mobile */}
                    <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                        {/* Icon buttons */}
                        <Link href="/comparison" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="p-1.5 cursor-pointer text-[#0036A5] transition-colors">
                                <span className="sr-only">Filters</span>
                                <SettingsIcon className="h-6 w-6 cursor-pointer"/>
                            </button>
                        </Link>

                        <button className="p-1.5 cursor-pointer text-[#0036A5] transition-colors">
                            <Link href="/favorites">
                                <span className="sr-only">Favorites</span>
                                <HeartIcon className="h-6 w-6 cursor-pointer"/>
                            </Link>
                        </button>

                        {/* User Menu */}
                        <UserMenu/>

                        <Link
                            href="/profile/add-post"
                            className="hidden pulse-shadow xl:flex items-center space-x-2 bg-[#0036A5] hover:bg-blue-800 text-white px-6 py-2 rounded-full transition-colors cursor-pointer"
                        >
                            <PlusIcon className="h-5 w-5 cursor-pointer text-white mb-1"/>
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
                <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Mobile Navigation Fullscreen Overlay */}
            {isMobileMenuOpen && (
                <nav className="md:hidden fixed inset-0 z-50 bg-gradient-to-b bg-[#0036a5] flex flex-col">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between px-6 py-4">
                        <Logo className="w-[135px] h-[45px] brightness-0 invert"/>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 text-white hover:text-gray-200 rounded-full bg-white/10 hover:bg-white/20 transition-all"
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

                    {/* Navigation Links - Center */}
                    <div className="flex-1 flex flex-col justify-center px-6">
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <div key={item.name} className="text-center">
                                    <Link
                                        href={item.href}
                                        className={`block text-white text-2xl hover:text-gray-200 transition-colors py-2 ${
                                            pathname === item.href ? 'text-yellow-300' : ''
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </div>
                            ))}

                            {/* О нас dropdown */}
                            <div className="text-center">
                                <button
                                    onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                                    className="flex items-center justify-center space-x-2 text-white text-2xl hover:text-gray-200 transition-colors py-2 mx-auto"
                                >
                                    <span>О нас</span>
                                    <svg
                                        className={`w-5 h-5 transition-transform ${
                                            isAboutDropdownOpen ? 'rotate-180' : ''
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

                                {isAboutDropdownOpen && (
                                    <div className="mt-4 space-y-3">
                                        <Link
                                            href="/about/news"
                                            className="block text-white/80 text-lg hover:text-white transition-colors py-1"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Новости
                                        </Link>
                                        <Link
                                            href="/about/team"
                                            className="block text-white/80 text-lg hover:text-white transition-colors py-1"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Команда
                                        </Link>
                                        <Link
                                            href="/about"
                                            className="block text-white/80 text-lg hover:text-white transition-colors py-1"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            О компании
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="p-6 space-y-4">
                        <div className="flex space-x-4">
                            {/* Location Button */}
                            <button
                                className="flex-1 flex items-center justify-center space-x-1 bg-white px-3 py-2 rounded-full transition-all">
                                <MapIcon className="h-5 w-5 text-white"/>
                                <span>Душанбе</span>
                            </button>

                            {/* Login/User Button */}
                            {!user ? (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1"
                                >
                                    <button className="w-full bg-white px-4 py-3 rounded-full transition-all">
                                        Войти
                                    </button>
                                </Link>
                            ) : (
                                <Link href="/profile"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="flex-1">
                                    <div className="flex items-center space-x-1 bg-white px-3 py-2 rounded-full">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                            <UserIcon className="w-5 h-5 text-[#0036a5]"/>
                                        </div>
                                        <span className="text-sm">{user.name}</span>
                                    </div>
                                </Link>
                            )}
                        </div>

                        {/* Add Listing Button */}
                        <Link
                            href="/profile/add-post"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block"
                        >
                            <button
                                className="w-full flex items-center justify-center space-x-2 text-white border-2 border-white font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
                                <PlusIcon className="h-5 w-5"/>
                                <span>Добавить объявление</span>
                            </button>
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;
