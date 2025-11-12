'use client';

import { JSX, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogoutMutation, useProfile } from '@/services/login/hooks';
import {
  Building,
  Calendar as CalendarIcon,
  FileBarChart as ReportsIcon,
  Heart as HeartIcon,
  LogOut as LogOutIcon,
  Plus as PlusIcon,
  School,
  User as UserIcon,
  Users as UsersIcon,
} from 'lucide-react';
import type { User } from '@/services/login/types';

type RoleSlug = 'admin' | 'agent' | 'user';
type MenuItem = { href: string; label: string; icon: JSX.Element };

const ALL_ITEMS: Record<string, MenuItem> = {
  reports: {
    href: '/profile/reports',
    label: 'Отчёты',
    icon: <ReportsIcon className="w-5 h-5" />,
  },
  profile: {
    href: '/profile',
    label: 'Профиль',
    icon: <UserIcon className="w-5 h-5" />,
  },
  favorites: {
    href: '/profile/favorites',
    label: 'Избранное',
    icon: <HeartIcon className="w-5 h-5" />,
  },
  myList: {
    href: '/profile/my-listings',
    label: 'Мои объявления',
    icon: <School className="w-5 h-5" />,
  },
  allList: {
    href: '/profile/all-listings',
    label: 'Все объявления',
    icon: <School className="w-5 h-5" />,
  },
  booking: {
    href: '/profile/my-booking',
    label: 'Мои показы',
    icon: <CalendarIcon className="w-5 h-5" />,
  },
  addPost: {
    href: '/profile/add-post',
    label: 'Добавить объявление',
    icon: <PlusIcon className="w-5 h-5" />,
  },
  users: {
    href: '/admin/users',
    label: 'Пользователи',
    icon: <UsersIcon className="w-5 h-5" />,
  },
  buildings: {
    href: '/admin/new-buildings',
    label: 'Новостройки',
    icon: <Building className="w-5 h-5" />,
  },
};

const roleMenus: Record<RoleSlug, Array<keyof typeof ALL_ITEMS>> = {
  admin: [
    'reports',
    'profile',
    'allList',
    'buildings',
    'booking',
    'users',
    'favorites',
    'addPost',
  ],
  agent: ['profile', 'favorites', 'myList', 'buildings', 'booking', 'addPost'],
  user: ['profile', 'favorites', 'myList', 'booking', 'addPost'],
};

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: user } = useProfile();
  const logoutMutation = useLogoutMutation();

  const role: RoleSlug = useMemo(() => {
    const slug = (user as User)?.role?.slug as string | undefined;
    if (slug === 'admin') return 'admin';
    if (slug === 'agent') return 'agent';
    return 'user';
  }, [user]);

  const menuToRender = roleMenus[role].map((k) => ALL_ITEMS[k]);

  const isActive = (href: string) =>
    href === '/profile' ? pathname === '/profile' : pathname.startsWith(href);

  const itemCls = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm transition-colors
     ${active ? 'bg-[#0036A5] text-white' : 'text-gray-700 hover:bg-gray-100'}`;

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {}
  };

  return (
    <>
      {/* DESKTOP: горизонтальные "табы" + sticky */}
      <div className="mx-auto max-w-[1520px] px-7 mt-5 hidden md:block sticky top-2 z-3 ">
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-xl">
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3 px-2">
            {menuToRender.map(({ href, icon, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  aria-current={active ? 'page' : undefined}
                  className={itemCls(active)}
                >
                  {icon}
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              );
            })}
            <div className="ml-auto">
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <LogOutIcon className="w-5 h-5" />
                {logoutMutation.isPending ? 'Выходим…' : 'Выйти'}
              </button>
            </div>
          </nav>
          {/* нижняя синяя линия как у табов */}
          <div className="h-[1px] w-full bg-gray-100" />
        </div>
      </div>
    </>
  );
};
