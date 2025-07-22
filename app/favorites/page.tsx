'use client';

import {useState} from 'react';
import {useMe} from '@/services/login/hooks';
import {useFavorites} from '@/services/favorites/hooks';
import {Tabs} from '@/ui-components/tabs/tabs';
import BuyCard from '../_components/buy/buy-card';
import {FavoriteResponse} from '@/services/favorites/types';
import Link from 'next/link';

type FilterType = 'all' | 'sale' | 'rent';

export default function Favorites() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const {data: user} = useMe();
    const {data: favorites = [], isLoading} = useFavorites(!!user);

    const filteredFavorites =
        activeFilter === 'all'
            ? favorites
            : favorites.filter(
                (favorite) =>
                    favorite.property &&
                    (activeFilter === 'rent'
                        ? favorite.property.offer_type === 'rent'
                        : favorite.property.offer_type === 'sale' ||
                        favorite.property.offer_type !== 'rent')
            );

    const objectsCount = filteredFavorites.length;

    if (isLoading) {
        return (
            <div className="container">
                <div className="bg-white rounded-[22px] p-[30px] my-10">
                    <h1 className="text-2xl font-bold text-[#020617] mb-1">Избранное</h1>
                    <p className="text-[#666F8D]">Загрузка избранных объявлений...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container">
                <div className="bg-white rounded-[22px] p-[30px] my-10">
                    <h1 className="text-2xl font-bold text-[#020617] mb-1">Избранное</h1>
                    <p className="text-[#666F8D]">
                        Войдите в аккаунт, чтобы видеть избранные объявления
                    </p>
                    <div className="mt-4">
                        <Link
                            href="/login"
                            className="bg-[#0036A5] text-white px-4 py-2 rounded-lg"
                        >
                            Войти
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="container">
                <div className="bg-white rounded-[22px] p-[30px] my-10">
                    <h1 className="text-2xl font-bold text-[#020617] mb-1">Избранное</h1>
                    <p className="text-[#666F8D]">У вас пока нет избранных объявлений</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="bg-white rounded-[22px] p-[30px] my-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[#020617] mb-1">
                            Избранное
                        </h1>
                        <p className="text-[#666F8D]">Найдено {objectsCount} объекта</p>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <Tabs
                            tabs={[
                                {key: 'all', label: 'Все'},
                                {key: 'sale', label: 'Продажа'},
                                {key: 'rent', label: 'Аренда'},
                            ]}
                            activeType={activeFilter}
                            setActiveType={setActiveFilter}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[14px] mb-10 md:mb-16">
                {Array.isArray(filteredFavorites) &&
                    filteredFavorites.map((favorite: FavoriteResponse) => (
                        <BuyCard key={favorite.id} listing={favorite.property}/>
                    ))}
            </div>
        </div>
    );
}
