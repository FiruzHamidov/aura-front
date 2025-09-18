'use client';

import {useState, useMemo, JSX} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogoutMutation, useProfile } from '@/services/login/hooks';

import {
  Menu as MenuIcon,
  X as XIcon,
  User as UserIcon,
  Heart as HeartIcon,
  List as ListIcon,
  Calendar as CalendarIcon,
  Plus as PlusIcon,
  LogOut as LogOutIcon,
  Users as UsersIcon,
  FileBarChart as ReportsIcon,
} from 'lucide-react';
import {User} from "@/services/login/types";

type RoleSlug = 'admin' | 'agent' | 'user';

type MenuItem = {
  href: string;
  label: string;
  icon: JSX.Element;
};

const ALL_ITEMS: Record<string, MenuItem> = {
  reports:   { href: '/profile/reports',      label: 'Отчёты',           icon: <ReportsIcon className="w-6 h-6" /> },
  profile:   { href: '/profile',              label: 'Профиль',          icon: <UserIcon className="w-6 h-6" /> },
  favorites: { href: '/profile/favorites',    label: 'Избранное',        icon: <HeartIcon className="w-6 h-6" /> },
  myList:    { href: '/profile/my-listings',  label: 'Мои объявления',   icon: <ListIcon className="w-6 h-6" /> },
  allList:   { href: '/profile/all-listings', label: 'Все объявления',   icon: <ListIcon className="w-6 h-6" /> },
  booking:   { href: '/profile/my-booking',   label: 'Мои показы',       icon: <CalendarIcon className="w-6 h-6" /> },
  addPost:   { href: '/profile/add-post',     label: 'Добавить объявление', icon: <PlusIcon className="w-6 h-6" /> },
  users:     { href: '/admin/users',        label: 'Пользователи',     icon: <UsersIcon className="w-6 h-6" /> },
};

const roleMenus: Record<RoleSlug, Array<keyof typeof ALL_ITEMS>> = {
  // Админ: показываем нужное, скрываем “личные” пункты
  admin: ['reports', 'profile', 'allList', 'booking', 'users', 'favorites', 'addPost'],
  // Агент: без “Все объявления” и “Отчёты”
  agent: ['profile', 'favorites', 'myList', 'booking', 'addPost'],
  // Обычный пользователь
  user:  ['profile', 'favorites', 'myList', 'booking', 'addPost'],
};

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
  const { data: user } = useProfile();

  // Определяем роль по slug
  const role: RoleSlug = useMemo(() => {
    const slug = (user as User)?.role?.slug as string | undefined;
    if (slug === 'admin') return 'admin';
    if (slug === 'agent') return 'agent';
    return 'user';
  }, [user]);

  const menuToRender = roleMenus[role].map((key) => ALL_ITEMS[key]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
      <>
        {/* Бургер на мобилке */}
        <button
            className="md:hidden absolute top-20 left-4 z-50"
            onClick={() => setIsOpen(true)}
            aria-label="Открыть меню"
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

        <aside
            className={`
          fixed top-0 left-0 z-50 h-full w-[305px] min-w-[305px] min-h-[600px] bg-white p-[18px] pb-8 rounded-r-xl shadow-xl transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:rounded-xl md:shadow-none
        `}
        >
          {/* Кнопка закрытия на мобильных */}
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setIsOpen(false)} aria-label="Закрыть меню">
              <XIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            {menuToRender.map(({ href, icon, label }) => (
                <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 p-3 rounded-3xl ${
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
                className="mt-auto flex items-center gap-3 bottom-0 relative text-red-600 p-3 rounded-3xl hover:bg-gray-100 disabled:opacity-50"
            >
              <LogOutIcon className="w-6 h-6" />
              <span>{logoutMutation.isPending ? 'Выходим...' : 'Выйти'}</span>
            </button>
          </nav>
        </aside>
      </>
  );
};