'use client';

import { FC, useEffect, useRef, useState, TouchEventHandler, MouseEventHandler } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogoutMutation, useProfile } from '@/services/login/hooks';
import {
    Calendar,
    FileBarChart,
    GitCompareIcon,
    Heart,
    Home,
    LayoutDashboardIcon,
    List,
    Plus,
    School,
    TvMinimalPlay,
    User,
    Users,
    LucideIcon,
} from 'lucide-react';

const SCROLL_DELTA = 8;
const SHOW_TOP_OFFSET = 48;

type NavItem = {
    name: string;
    href: string;
    icon: LucideIcon;
    key?: string;
};

const MobileBottomNavigation: FC = () => {
    const pathname = usePathname();
    const { data: user } = useProfile();
    const logoutMutation = useLogoutMutation();

    const isAuthed = !!user;

    // --- авто-скрытие
    const [hidden, setHidden] = useState(false);
    const lastYRef = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY || 0;
            const diff = y - lastYRef.current;
            if (y <= SHOW_TOP_OFFSET) setHidden(false);
            else if (diff > SCROLL_DELTA) setHidden(true);
            else if (diff < -SCROLL_DELTA) setHidden(false);
            lastYRef.current = y;
        };
        lastYRef.current = window.scrollY || 0;
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setHidden(false);
    }, [pathname]);

    // --- меню навигации снизу
    const baseNav: NavItem[] = [{ name: 'Главная', href: '/', icon: Home }];
    const guestNav: NavItem[] = [
        ...baseNav,
        { name: 'Сравнить', href: '/comparison', icon: GitCompareIcon },
        { name: 'Избранное', href: '/favorites', icon: Heart },
        { name: 'Ещё', href: '/more', icon: LayoutDashboardIcon, key: 'more' },
    ];
    const authNav: NavItem[] = [
        ...baseNav,
        { name: 'Мои показы', href: '/profile/my-booking', icon: TvMinimalPlay },
        { name: 'Мои объекты', href: '/profile/my-listings', icon: School },
        { name: 'Ещё', href: '/more', icon: LayoutDashboardIcon, key: 'more' },
    ];
    const navItems = isAuthed ? authNav : guestNav;

    // --- Bottom Sheet (открывается по «Ещё» для авторизованных)
    const [sheetOpen, setSheetOpen] = useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);
    const startY = useRef<number | null>(null);
    const translateY = useRef(0);

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => {
        setSheetOpen(false);
        translateY.current = 0;
    };

    // Esc для закрытия
    useEffect(() => {
        if (!sheetOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeSheet();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [sheetOpen]);

    // простейший свайп вниз
    const onTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
        startY.current = e.touches[0].clientY;
    };
    const onTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
        if (startY.current == null) return;
        const dy = e.touches[0].clientY - startY.current;
        if (dy > 0) {
            translateY.current = Math.min(dy, 300);
            if (sheetRef.current) sheetRef.current.style.transform = `translateY(${translateY.current}px)`;
        }
    };
    const onTouchEnd: TouchEventHandler<HTMLDivElement> = () => {
        if (translateY.current > 120) closeSheet();
        else {
            translateY.current = 0;
            if (sheetRef.current) sheetRef.current.style.transform = '';
        }
        startY.current = null;
    };

    const isActive = (href: string) =>
        pathname === href || (href === '/favorites' && pathname === '/profile/favorites');

    return (
        <>
            {/* Bottom Nav */}
            <div
                className={`
          md:hidden fixed left-0 right-0 z-40 border-t border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80
          transition-transform duration-200
          ${hidden ? 'translate-y-full' : 'translate-y-0'}
          pb-[max(env(safe-area-inset-bottom),0px)]
          bottom-0
        `}
            >
                <div className="flex items-center justify-around py-2 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
                            if (isAuthed && item.key === 'more') {
                                e.preventDefault();
                                openSheet();
                            }
                        };
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={handleClick}
                                className="flex flex-col items-center justify-center py-2 px-1 min-w-0 flex-1"
                            >
                                <div className="p-1 rounded-md">
                                    <Icon className={`w-6 h-6 ${isActive(item.href) ? 'text-[#0036A5]' : 'text-gray-400'}`} />
                                </div>
                                <span
                                    className={`text-xs text-center mt-1 ${
                                        isActive(item.href) ? 'text-[#0036A5] font-medium' : 'text-gray-400'
                                    }`}
                                >
                  {item.name}
                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* FAB (только авторизованным, но не в profile/* и admin/*, кроме my-listings и all-listings) */}
            {isAuthed &&
                (pathname.startsWith('/profile/my-listings') ||
                    pathname.startsWith('/profile/all-listings') ||
                    (!pathname.startsWith('/profile') && !pathname.startsWith('/admin'))) && (
                    <Link
                        href="/profile/add-post"
                        className={`
              md:hidden fixed z-50 right-6
              bottom-[calc(160px+max(env(safe-area-inset-bottom),0px))]
              bg-[#0036A5] text-white rounded-xl shadow-lg
              w-14 h-14 flex items-center justify-center
              hover:bg-[#002a7a] transition
              ${hidden ? 'translate-y-6 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
            `}
                        aria-label="Добавить объявление"
                    >
                        <Plus className="w-7 h-7" />
                    </Link>
                )}

            {/* Bottom Sheet: меню профиля — только когда авторизован и открыт */}
            {isAuthed && sheetOpen && (
                <div className="md:hidden fixed inset-0 z-71">
                    {/* overlay */}
                    <div className="absolute inset-0" onClick={closeSheet} aria-hidden />
                    {/* FULL-SCREEN SHEET */}
                    <div
                        ref={sheetRef}
                        className={`
              absolute inset-0 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-2xl
              flex flex-col
              animate-[sheetIn_.24s_ease]
            `}
                        role="dialog"
                        aria-modal="true"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {/* header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <span className="font-medium text-base">Eще</span>
                            <button
                                onClick={closeSheet}
                                aria-label="Закрыть"
                                className="rounded-lg p-1.5 hover:bg-gray-100"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-gray-700"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* скроллимая колонка ссылок */}
                        <div className="flex-1 overflow-y-auto px-3 py-3">
                            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-300" />

                            <nav className="flex flex-col gap-2">
                                <SheetLink href="/profile" icon={User} label="Профиль" onClick={closeSheet} />
                                <SheetLink href="/profile/my-booking" icon={Calendar} label="Мои показы" onClick={closeSheet} />
                                <SheetLink href="/profile/all-listings" icon={List} label="Все объявления" onClick={closeSheet} />
                                <SheetLink href="/profile/favorites" icon={Heart} label="Избранное" onClick={closeSheet} />
                                <SheetLink href="/profile/reports" icon={FileBarChart} label="Отчёты" onClick={closeSheet} />
                                {user?.role?.slug === 'admin' && (
                                    <SheetLink href="/admin/users" icon={Users} label="Пользователи" onClick={closeSheet} />
                                )}
                            </nav>

                            <div className="flex justify-center">
                                <button
                                    onClick={async () => {
                                        await logoutMutation.mutateAsync();
                                        closeSheet();
                                    }}
                                    disabled={logoutMutation.isPending}
                                    className="mt-4 w-50 inline-flex items-center justify-center gap-2 absolute bottom-20 rounded-xl border px-4 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                                        />
                                    </svg>
                                    {logoutMutation.isPending ? 'Выходим…' : 'Выйти'}
                                </button>
                            </div>
                        </div>

                        <div className="h-[max(env(safe-area-inset-bottom),0px)]" />
                    </div>

                    <style jsx global>{`
                        @keyframes sheetIn {
                            from {
                                transform: translateY(10%);
                                opacity: 0.6;
                            }
                            to {
                                transform: translateY(0);
                                opacity: 1;
                            }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default MobileBottomNavigation;

type SheetLinkProps = {
    href: string;
    icon: LucideIcon;
    label: string;
    onClick: () => void;
};

function SheetLink({ href, icon: Icon, label, onClick }: SheetLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] text-gray-800 hover:bg-gray-50"
        >
            <Icon className="w-5 h-5" />
            <span className="truncate">{label}</span>
        </Link>
    );
}