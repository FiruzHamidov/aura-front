'use client';

import {useEffect, useMemo, useState} from 'react';
import BuyCard from '@/app/_components/buy/buy-card';
import BuyCardSkeleton from '@/ui-components/BuyCardSkeleton';
import {useGetMyPropertiesQuery} from '@/services/properties/hooks';
import {Property} from '@/services/properties/types';
import {useProfile} from "@/services/login/hooks";

export default function MyListings() {
    const {data: user} = useProfile();

    // базовые параметры запроса — как и было
    const {data: myProperties, isLoading} = useGetMyPropertiesQuery(
        { listing_type: '', per_page: 100 },
        true
    );

    const [selectedTab, setSelectedTab] = useState<'active' | 'inactive'>('active');

    // ====== ПАГИНАЦИЯ (клиентская) ======
    const [page, setPage] = useState(1);
    const perPage = 12;

    // ресет страницы при смене вкладки или обновлении данных
    useEffect(() => { setPage(1); }, [selectedTab]);
    useEffect(() => { setPage(1); }, [myProperties]);

    const listings: Property[] = myProperties?.data || [];

    const activeListings = useMemo(
        () => listings.filter(l => l.moderation_status === 'approved'),
        [listings]
    );

    const inactiveListings = useMemo(
        () => listings.filter(l => l.moderation_status !== 'approved'),
        [listings]
    );

    const currentListings = selectedTab === 'active' ? activeListings : inactiveListings;

    const totalItems = currentListings.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    const startIdx = (page - 1) * perPage;
    const endIdx = Math.min(startIdx + perPage, totalItems);

    const paginated = useMemo(
        () => currentListings.slice(startIdx, endIdx),
        [currentListings, startIdx, endIdx]
    );

    const changeTab = (tab: 'active' | 'inactive') => {
        setSelectedTab(tab);
        setPage(1);
    };

    const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

    // для компактной навигации страниц сделаем небольшую "полосу" кнопок
    const pageNumbers = useMemo(() => {
        const delta = 1; // соседние страницы слева/справа
        const pages: number[] = [];
        const from = Math.max(1, page - delta);
        const to   = Math.min(totalPages, page + delta);
        for (let i = from; i <= to; i++) pages.push(i);
        // гарантируем первую/последнюю
        if (pages[0] !== 1) pages.unshift(1);
        if (pages[pages.length - 1] !== totalPages) pages.push(totalPages);
        // уберем дубликаты
        return [...new Set(pages)];
    }, [page, totalPages]);

    if (isLoading) {
        return (
            <div>
                <div className="mb-6">
                    <div className="flex space-x-4 border-b">
                        <button
                            className={`pb-2 px-4 border-b-2 font-medium ${
                                selectedTab === 'active' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                            }`}
                            onClick={() => changeTab('active')}
                        >
                            Активные
                        </button>
                        <button
                            className={`pb-2 px-4 border-b-2 font-medium ${
                                selectedTab === 'inactive' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                            }`}
                            onClick={() => changeTab('inactive')}
                        >
                            Неактивные
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
                    {Array.from({length: 6}).map((_, index) => (
                        <BuyCardSkeleton key={index}/>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b pb-2">
                    <div className="flex space-x-4">
                        <button
                            className={`pb-2 px-4 border-b-2 font-medium ${
                                selectedTab === 'active' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                            }`}
                            onClick={() => changeTab('active')}
                        >
                            Активные ({activeListings.length})
                        </button>
                        <button
                            className={`pb-2 px-4 border-b-2 font-medium ${
                                selectedTab === 'inactive' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                            }`}
                            onClick={() => changeTab('inactive')}
                        >
                            Неактивные ({inactiveListings.length})
                        </button>
                    </div>

                    {/* Инфо по текущему диапазону */}
                    <div className="text-sm text-gray-500">
                        {totalItems > 0
                            ? <>Показываю <span className="font-medium">{startIdx + 1}–{endIdx}</span> из <span className="font-medium">{totalItems}</span></>
                            : 'Нет данных'}
                    </div>
                </div>
            </div>

            {paginated.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">
                        {selectedTab === 'active'
                            ? 'У вас нет активных объявлений'
                            : 'У вас нет неактивных объявлений'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
                        {paginated.map((listing: Property) => (
                            <BuyCard listing={listing} user={user} key={listing.id}/>
                        ))}
                    </div>

                    {/* ПАГИНАТОР */}
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <button
                            className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50 disabled:opacity-40"
                            onClick={() => goTo(page - 1)}
                            disabled={page <= 1}
                        >
                            Назад
                        </button>

                        {pageNumbers.map((n, i) => {
                            const isEllipsis =
                                (i > 0 && n - pageNumbers[i - 1] > 1);
                            return (
                                <span key={`${n}-${i}`} className="flex">
                  {isEllipsis && <span className="px-1 text-gray-400">…</span>}
                                    <button
                                        onClick={() => goTo(n)}
                                        className={`px-3 py-2 rounded-xl border text-sm mx-0.5 ${
                                            n === page ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'
                                        }`}
                                    >
                    {n}
                  </button>
                </span>
                            );
                        })}

                        <button
                            className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50 disabled:opacity-40"
                            onClick={() => goTo(page + 1)}
                            disabled={page >= totalPages}
                        >
                            Вперёд
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}