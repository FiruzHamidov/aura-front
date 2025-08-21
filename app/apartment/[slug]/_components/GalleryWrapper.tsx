'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SettingsIcon from '@/icons/SettingsIcon';
import HeartIcon from '@/icons/HeartIcon';
import { Property } from '@/services/properties/types';
import { useProfile } from '@/services/login/hooks';
import MortgageCalculator from '../_components/MortgageCalculator';
import PhotoGalleryModal from '@/ui-components/PhotoGalleryModal';
import BookingSidebarForm from '@/app/apartment/[slug]/_components/BookingSidebarForm';

interface Props {
    apartment: Property;
    photos: string[];
}

export default function GalleryWrapper({ apartment, photos }: Props) {
    const { data: user } = useProfile();
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleFavorite = () => setIsFavorite((v) => !v);

    const openModal = (index?: number) => {
        if (index !== undefined) setSelectedIndex(index);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const phone = apartment.creator?.phone ?? '';
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    const canEdit =
        (user && user.role?.slug === 'admin') ||
        (apartment.creator &&
            (user?.id === apartment.creator.id ||
                (apartment.agent_id && user?.id === apartment.agent_id)));

    return (
        <>
            <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8 pt-8 pb-12">
                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Левая часть */}
                    <div className="lg:w-3/4">
                        <div className="bg-white rounded-[22px] md:p-[30px] p-4">
                            <div className="md:flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">
                                        {apartment.rooms} ком квартира, {apartment.floor} этаж,{' '}
                                        {apartment.address || 'Адрес не указан'}
                                    </h1>
                                    <div className="text-[#666F8D] text-lg">ID: {apartment.id}</div>
                                </div>
                                <div className="flex gap-2 md:mt-0 mt-4">
                                    {canEdit && (
                                        <Link
                                            href={`/profile/edit-post/${apartment.id}`}
                                            className="w-14 h-14 rounded-full border border-[#0036A5] bg-[#0036A5] flex items-center justify-center hover:bg-blue-800 transition-colors"
                                            title="Редактировать объявление"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M12 20H21"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M16.5 3.5C16.8978 3.10218 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04016C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.69699 19.8532 3.9308 19.9598 4.18819C20.0665 4.44558 20.1213 4.72142 20.1213 5C20.1213 5.27858 20.0665 5.55442 19.9598 5.81181C19.8532 6.0692 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </Link>
                                    )}
                                    <button className="w-14 h-14 rounded-full border border-[#BAC0CC] flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                                        <SettingsIcon className="w-6 h-6 text-[#1E3A8A]" />
                                    </button>
                                    <button
                                        className="w-14 h-14 rounded-full border border-[#BAC0CC] flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                                        onClick={toggleFavorite}
                                        aria-pressed={isFavorite}
                                    >
                                        <HeartIcon className="w-6 h-6 text-[#1E3A8A]" />
                                    </button>
                                </div>
                            </div>

                            {/* Галерея */}
                            {photos.length > 0 && (
                                <div className="mb-6">
                                    {/* 303px слева + 376px справа (3 превью по 120 + 2 гэпа по 8) */}
                                    <div className="grid grid-cols-1 md:grid-cols-[303px_376px] gap-4">
                                        {/* Основное изображение 3:4, на md+: ровно 303×396 */}
                                        <div className="relative">
                                            <div
                                                className="relative w-full aspect-[3/4] md:w-[303px] md:h-[396px] md:aspect-auto rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
                                                onClick={() => openModal(selectedIndex)}
                                                title="Нажмите для увеличения"
                                            >
                                                <Image
                                                    src={photos[selectedIndex]}
                                                    alt={`Фото ${selectedIndex + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 303px"
                                                    priority
                                                />

                                                {/* Стрелки навигации */}
                                                {photos.length > 1 && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedIndex((i) => (i - 1 + photos.length) % photos.length);
                                                            }}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition"
                                                            aria-label="Предыдущее фото"
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M15 18L9 12L15 6"
                                                                    stroke="#333"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedIndex((i) => (i + 1) % photos.length);
                                                            }}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition"
                                                            aria-label="Следующее фото"
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M9 18L15 12L9 6"
                                                                    stroke="#333"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            {/* Точки снизу для наглядности */}
                                            {photos.length > 1 && (
                                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                    {photos.map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`w-2 h-2 rounded-full ${
                                                                i === selectedIndex ? 'bg-gray-900/80' : 'bg-gray-400/60'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Превью: md+ — сетка 3×N, видно 9; ниже — мобайл-лента */}
                                        {photos.length > 1 && (
                                            <>
                                                {/* Десктоп (md+): 3 колонки, max 3 ряда (9 штук), дальше скролл */}
                                                <Thumbs
                                                    photos={photos}
                                                    selectedIndex={selectedIndex}
                                                    onSelect={setSelectedIndex}
                                                />

                                                {/* Мобайл: горизонтальная лента снизу */}
                                                <div className="mt-3 md:hidden col-span-1">
                                                    <Thumbs
                                                        photos={photos}
                                                        selectedIndex={selectedIndex}
                                                        onSelect={setSelectedIndex}
                                                        mobile
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6">
                                <h2 className="text-2xl font-bold mb-4">Описание</h2>
                                <div className="text-[#666F8D] whitespace-pre-line">
                                    {apartment.description || 'Описание не указано'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-[22px] md:py-[30px] md:px-[22px] px-4 py-5 mb-6">
                            <div className="text-[#666F8D] text-lg mb-1.5">Цена</div>
                            <div className="text-[32px] font-bold text-[#0036A5]">
                                {Number(apartment.price).toLocaleString('ru-RU')} {apartment.currency}
                            </div>
                        </div>

                        {apartment.creator && (
                            <div className="bg-white rounded-[22px] md:px-[26px] px-4 py-5 md:py-8">
                                <h3 className="text-2xl font-bold mb-2">{apartment.creator.name}</h3>
                                <div className="text-[#666F8D] mb-4">Агент по недвижимости</div>

                                <Link
                                    href={`tel:${cleanPhone}`}
                                    className="block w-full bg-[#0036A5] hover:bg-blue-800 text-white py-5 rounded-full text-center mb-4 transition-colors"
                                >
                                    {apartment.creator.phone}
                                </Link>

                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={`https://wa.me/${cleanPhone}`}
                                        className="w-full py-3 border border-[#25D366] text-[#25D366] rounded-full text-center hover:bg-[#25D366]/10 transition"
                                        target="_blank"
                                    >
                                        WhatsApp
                                    </Link>
                                </div>
                            </div>
                        )}

                        {user && (user.role?.slug === 'agent' || user.role?.slug === 'admin') && (
                            <BookingSidebarForm propertyId={apartment.id} defaultAgentId={user.id} />
                        )}
                    </div>
                </div>

                <MortgageCalculator propertyPrice={apartment.price} />
            </div>

            <PhotoGalleryModal
                isOpen={isModalOpen}
                onClose={closeModal}
                photos={photos}
                initialIndex={selectedIndex}
            />
        </>
    );
}

function Thumbs({
                    photos,
                    selectedIndex,
                    onSelect,
                    mobile = false,
                }: {
    photos: string[];
    selectedIndex: number;
    onSelect: (i: number) => void;
    mobile?: boolean;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const THUMB = 120; // px
    const GAP = 8; // px
    const VISIBLE_ROWS = 3; // 3 ряда по 120
    const maxHeight = VISIBLE_ROWS * THUMB + (VISIBLE_ROWS - 1) * GAP; // 3*120 + 2*8 = 376

    // Плавный скролл к активной миниатюре
    useEffect(() => {
        const btn = btnRefs.current[selectedIndex];
        if (btn) {
            btn.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: mobile ? 'center' : 'nearest',
            });
        }
    }, [selectedIndex, mobile]);

    if (mobile) {
        // Мобайл: одна горизонтальная лента
        return (
            <div
                ref={containerRef}
                className="flex gap-2 overflow-x-auto scroll-smooth pb-1"
            >
                {photos.map((src, i) => (
                    <button
                        key={i}
                        ref={(el) => {
                            btnRefs.current[i] = el;
                        }}
                        type="button"
                        onClick={() => onSelect(i)}
                        className={`relative flex-none overflow-hidden rounded-lg border-2 transition ${
                            i === selectedIndex ? 'border-blue-600' : 'border-transparent hover:border-blue-300'
                        }`}
                        style={{ width: THUMB, height: THUMB }}
                        title={`Фото ${i + 1}`}
                    >
                        <Image src={src} alt={`Миниатюра ${i + 1}`} fill className="object-cover" sizes="120px" />
                    </button>
                ))}
            </div>
        );
    }
    // Десктоп: 3 колонки, видно 3 ряда (итого 9), дальше вертикальный скролл
    return (
        <div
            ref={containerRef}
            className="hidden md:grid md:grid-cols-3 md:gap-2 md:overflow-y-auto md:pr-1"
            style={{ maxHeight, scrollBehavior: 'smooth' }}
        >
            {photos.map((src, i) => (
                <button
                    key={i}
                    ref={(el) => {
                        btnRefs.current[i] = el;
                    }}
                    type="button"
                    onClick={() => onSelect(i)}
                    className={`relative overflow-hidden rounded-lg border-2 transition ${
                        i === selectedIndex ? 'border-blue-600' : 'border-transparent hover:border-blue-300'
                    }`}
                    style={{ width: THUMB, height: THUMB }}
                    title={`Фото ${i + 1}`}
                >
                    <Image src={src} alt={`Миниатюра ${i + 1}`} fill className="object-cover" sizes="120px" />
                </button>
            ))}
        </div>
    );
}