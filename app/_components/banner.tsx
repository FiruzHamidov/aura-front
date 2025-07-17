'use client';

import {FC, useState} from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import FilterSearchIcon from '@/icons/FilterSearchIcon';
import {SelectInput} from '@/ui-components/SelectInput';
import {AllFilters} from './filters';

interface Option {
    id: string | number;
    name: string;
    unavailable?: boolean;
}

type ActiveTab = 'buy' | 'rent' | 'to_rent' | 'to_rent_out' | 'map' | 'evaluate' | 'fast_buy';

const propertyTypes: Option[] = [
    {id: 'apartment', name: 'Квартира'},
    {id: 'house', name: 'Дом'},
    {id: 'commercial', name: 'Коммерческая'},
    {id: 'land', name: 'Земельный участок'},
];

const roomOptions: Option[] = [
    {id: '1', name: '1'},
    {id: '2', name: '2'},
    {id: '3', name: '3'},
    {id: '4+', name: '4+'},
    {id: 'studio', name: 'Студия'},
];

const priceOptions: Option[] = [
    {id: '0-50k', name: '250 000'},
    {id: '50k-100k', name: '350 000'},
    {id: '100k-200k', name: '450 000'},
    {id: '200k+', name: '550 000'},
    {id: '1kk+', name: '1 550 000'},
];

export const MainBanner: FC<{ title: string }> = ({title}) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('buy');
    const [propertyType, setPropertyType] = useState('');
    const [rooms, setRooms] = useState('');
    const [price, setPrice] = useState('');
    const [isAllFiltersOpen, setIsAllFiltersOpen] = useState(false);

    return (
        <div className="container relative py-8 md:py-10 md:pt-[22px] bg-gradient-to-b overflow-hidden ">

            <div
                className={clsx(
                    'bg-white relative overflow-hidden z-0 rounded-[22px] px-4 sm:px-8 md:px-12 lg:px-[70px] py-6 sm:py-12 md:py-16 lg:py-[89px] bg-gradient-to-br from-[#0036a5] to-[#0058d4]',
                    isAllFiltersOpen && 'rounded-b-none'
                )}
            >
                <Image
                    src="/images/banner/building.png"
                    alt="Building"
                    width={695}
                    height={695}
                    className="absolute -right-12 z-0 top-0 opacity-[8%] z-[-1] pointer-events-none max-w-none"
                />
                <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-[60px]">
                    <h1 className="text-xl md:text-[52px] font-extrabold text-white mb-1.5 tracking-tight uppercase transition-all duration-300 hover:scale-105 cursor-default">
                        {title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white">
                        ваш надежный партнер в сфере недвижимости Таджикистана
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 md:mb-8">

                    {(['buy', 'rent', 'to_rent', 'to_rent_out', 'map', 'evaluate', 'fast_buy'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 sm:px-6 lg:px-9 py-2 sm:py-3 rounded-lg cursor-pointer transition-all duration-150 ease-in-out text-sm sm:text-base ${
                                activeTab === tab
                                    ? 'bg-[#FFDE2C] shadow-sm'
                                    : 'bg-white text-gray-700 border border-[#CBD5E1] hover:bg-gray-50 hover:border-gray-400'
                            }`}
                        >
                            {tab === 'buy'
                                ? 'Купить'
                                : tab === 'rent'
                                    ? 'Продать'
                                    : tab === 'to_rent'
                                        ? 'Снять'
                                        : tab === 'to_rent_out'
                                            ? 'Сдать'
                                            : tab === 'map'
                                                ? 'На карте'
                                                : tab === 'evaluate'
                                                    ? 'Оценить'
                                                    : 'Cроч. выкуп'}
                        </button>
                    ))}
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
                    {/* Property Type - Full width on mobile, auto on desktop */}
                    <div className="sm:col-span-2 lg:col-span-1 lg:w-[373px]">
                        <SelectInput
                            value={propertyType}
                            placeholder="Тип недвижимости"
                            onChange={(value) => setPropertyType(value)}
                            options={propertyTypes}
                        />
                    </div>

                    {/* Rooms */}
                    <div className="lg:w-[169px]">
                        <SelectInput
                            value={rooms}
                            placeholder="Комнат"
                            onChange={(value) => setRooms(value)}
                            options={roomOptions}
                        />
                    </div>

                    {/* Price */}
                    <div className="lg:w-[141px]">
                        <SelectInput
                            value={price}
                            placeholder="Цена"
                            onChange={(value) => setPrice(value)}
                            options={priceOptions}
                        />
                    </div>

                    {/* All Filters Button */}
                    <button
                        className="sm:col-span-2 lg:col-span-1 lg:w-[197px] bg-[#F0F2F5] hover:bg-sky-100 text-slate-700 px-4 sm:px-6 lg:px-[25px] py-3 rounded-lg text-lg flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
                        onClick={() => setIsAllFiltersOpen((prev) => !prev)}
                    >
                        <FilterSearchIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600"/>
                        <span>Все фильтры</span>
                    </button>

                    {/* Search Button */}
                    <button
                        className="sm:col-span-2 lg:col-span-1 lg:w-[197px] cursor-pointer bg-[#FFDE2C] hover:bg-[#d9b90f] px-4 sm:px-6 lg:px-[71px] py-3 rounded-lg font-bold transition-all flex items-center justify-center">
                        Найти
                    </button>
                </div>

            </div>

            {/* All Filters Modal */}
            <AllFilters
                isOpen={isAllFiltersOpen}
                onClose={() => setIsAllFiltersOpen(false)}
            />
        </div>
    );
};
