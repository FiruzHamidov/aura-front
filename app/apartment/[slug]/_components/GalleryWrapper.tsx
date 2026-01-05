'use client';
import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Map, Placemark, YMaps} from '@pbe/react-yandex-maps';
import HeartIcon from '@/icons/HeartIcon';
import {Property} from '@/services/properties/types';
import {useProfile} from '@/services/login/hooks';
import MortgageCalculator from '../_components/MortgageCalculator';
import PhotoGalleryModal from '@/ui-components/PhotoGalleryModal';
import BookingSidebarForm from '@/app/apartment/[slug]/_components/BookingSidebarForm';
import FooterPhoneIcon from '@/icons/FooterPhoneIcon';
import WhatsappInlineIcon from '@/icons/WhatsappInlineIcon';
import {
    Bath,
    Building2,
    Calendar1Icon,
    CopyIcon,
    EyeIcon,
    FileText,
    Flame,
    Grid2X2Check,
    Hammer,
    HistoryIcon,
    Home,
    Key,
    MapPin,
    ParkingSquare,
    Phone, Pickaxe,
    Ruler, StickyNote,
    User,
} from 'lucide-react';
import {axios} from '@/utils/axios';
import {AxiosError} from 'axios';

import {toast} from 'react-toastify';
import AdBanner from "@/app/apartment/[slug]/_components/AdBanner";
import {STORAGE_URL} from "@/constants/base-url";
import UserIcon from "@/icons/UserIcon";
import TelegramNoBgIcon from "@/icons/TelegramNoBgIcon";
import WhatsAppNoBgIcon from "@/icons/WhatsappNoBgIcon";
import BuyCard from "@/app/_components/buy/buy-card";


interface Props {
    apartment: Property;
    photos: string[];
}

export default function GalleryWrapper({apartment, photos}: Props) {
    const {data: user} = useProfile();

    type UserRole = 'admin' | 'agent' | 'superadmin';

    const userRole = user?.role?.slug as UserRole | undefined;

    const ADMIN_ROLES: readonly UserRole[] = ['admin', 'superadmin'];

    const isAdminUser = ADMIN_ROLES.includes(userRole ?? 'agent');
    const isAgentUser = userRole === 'agent';
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleFavorite = () => setIsFavorite((v) => !v);

    const openModal = (index?: number) => {
        if (index !== undefined) setSelectedIndex(index);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    // helper: форматирование телефона в +992 XXX XX XX XX и чистый +992XXXXXXXXX
    const formatPhone = (rawPhone?: string | null) => {
        const rp = rawPhone ?? '';
        let cleanPhone = rp.replace(/[^\d+]/g, '');
        let digits = rp.replace(/\D/g, '');

        if (digits.startsWith('992')) {
            digits = digits.slice(3);
        }

        const formatted = digits.replace(
            /^(\d{3})(\d{2})(\d{2})(\d{2})$/,
            '$1 $2 $3 $4'
        );
        let display = formatted || rp;

        if (!cleanPhone.startsWith('+992')) {
            // если в raw нет +992 — добавим для ссылки
            cleanPhone = `+992${digits}`;
            if (formatted) display = `+992 ${formatted}`;
        }

        return {cleanPhone, display};
    };

    // creator phone (раньше был inline) — оставляем, но теперь через helper
    const creatorPhoneData = formatPhone(apartment.creator?.phone ?? '');
    const creatorCleanPhone = creatorPhoneData.cleanPhone;
    const creatorDisplayPhone = creatorPhoneData.display;

    // owner fields (покажем только admin'у)
    const ownerName = apartment.owner_name ?? '-'; // fallback
    const ownerPhoneRaw = apartment.owner_phone ?? '-';
    const ownerPhoneData = formatPhone(ownerPhoneRaw);
    const ownerCleanPhone = ownerPhoneData.cleanPhone;
    const ownerDisplayPhone = ownerPhoneData.display;

    const [coordinates] = useState<[number, number] | null>(
        apartment.latitude && apartment.longitude
            ? [parseFloat(apartment.latitude), parseFloat(apartment.longitude)]
            : null
    );

    // --- similar properties (fetched from backend) ---
    const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
    const [loadingSimilar, setLoadingSimilar] = useState(false);

    useEffect(() => {
        let mounted = true;
        const loadSimilar = async () => {
            if (!apartment?.id) return;
            setLoadingSimilar(true);
            try {
                const {data} = await axios.get(`/properties/${apartment.id}/similar`);
                if (mounted && Array.isArray(data)) {
                    setSimilarProperties(data);
                }
            } catch (err) {
                console.error('Load similar properties error', err);
            } finally {
                if (mounted) setLoadingSimilar(false);
            }
        };

        loadSimilar();
        return () => {
            mounted = false;
        };
    }, [apartment.id]);

    const [copied] = useState(false);

    const handleCopyLink = async () => {
        try {
            const url =
                typeof window !== 'undefined'
                    ? window.location.href
                    : `https://aura.tj/apartment/${apartment.id}`;

            await navigator.clipboard.writeText(url);
            toast.success('Ссылка скопирована успешно!', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: 'colored',
            });
        } catch {
            toast.error('Не удалось скопировать ссылку', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: true,
                theme: 'colored',
            });
        }
    };

    useEffect(() => {
        const controller = new AbortController();

        const sendView = async () => {
            try {
                await axios.post(
                    `/properties/${apartment.id}/view`,
                    {},
                    {signal: controller.signal}
                );
            } catch (e) {
                const error = e as AxiosError<{
                    message?: string;
                    errors?: Record<string, string[]>;
                }>;
                console.log(error);
            }
        };

        sendView();

        return () => controller.abort();
    }, [apartment.id]);


    const mapRef = useRef(undefined);
    const ymapsRef = useRef(null);

    const canEdit =
        isAdminUser ||
        (apartment.creator &&
            (user?.id === apartment.creator.id ||
                (apartment.agent_id && user?.id === apartment.agent_id)));

    // === Нормализация типа под человеко-понятное имя ===
    const getKindName = (p: Property) => {
        const slug = p.type?.slug;
        switch (slug) {
            case 'commercial':
                return 'Коммерческое помещение';
            case 'land-plots':
                return 'Земельный участок';
            case 'houses':
                return 'дом';
            case 'parking':
                return 'Парковка';
            case 'secondary':
            case 'new-buildings':
            default:
                return p.apartment_type || 'квартира';
        }
    };

    // короткие генераторы кусков
    const areaLabel = (p: Property) => (p.total_area ? `${p.total_area} м²` : '');
    const floorLabel = (p: Property) => (p.floor ? `${p.floor} этаж` : '');
    const roomsLabel = (p: Property) => (p.rooms ? `${p.rooms} комн.` : '');

    // === Итоговый TITLE без адреса (адрес добавим в JSX) ===
    const buildPageTitle = (p: Property) => {
        const kind = getKindName(p);
        const slug = p.type?.slug;

        if (slug === 'commercial') {
            // для коммерции не показываем "комнат", фокус на площади и этаже
            return [kind, areaLabel(p), floorLabel(p)].filter(Boolean).join(', ');
        }
        if (slug === 'land-plots') {
            return [kind, areaLabel(p)].filter(Boolean).join(', ');
        }
        if (slug === 'houses') {
            return [roomsLabel(p), kind, areaLabel(p), floorLabel(p)]
                .filter(Boolean)
                .join(', ');
        }
        if (slug === 'parking') {
            return kind;
        }
        // квартиры: secondary/new-buildings (и дефолт)
        return [roomsLabel(p), kind, floorLabel(p), areaLabel(p)]
            .filter(Boolean)
            .join(', ');
    };

    // Заголовок секций
    const aboutSectionTitle = (p: Property) => {
        const slug = p.type?.slug;
        if (slug === 'commercial') return 'О помещении';
        if (slug === 'land-plots') return 'Об участке';
        if (slug === 'houses') return 'О доме';
        if (slug === 'parking') return 'О парковке';
        return 'О квартире';
    };

    // Подпись к типу в характеристиках
    const typeFieldLabel = (p: Property) =>
        p.type?.slug === 'commercial' ? 'Тип объекта' : 'Тип жилья';

    function timeAgo(date: Date) {
        console.log('date', typeof date)
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'только что';
        if (minutes < 60) return `${minutes} мин назад`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ч назад`;
        const days = Math.floor(hours / 24);
        return `${days} дней назад`;
    }

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
                                        {buildPageTitle(apartment)}
                                        {apartment.address
                                            ? `, ${apartment.address}`
                                            : ', Адрес не указан'}
                                    </h1>
                                    <div className="text-[#666F8D] text-lg flex">
                                        ID: {apartment.id}
                                        <div className="flex gap-1 ml-3 items-center">
                                            <EyeIcon xlinkTitle="Просмотрено"/>
                                            {apartment.views_count}
                                        </div>
                                        <div className="flex gap-1 ml-3 items-center">
                                            <Calendar1Icon className='w-5' xlinkTitle="Просмотрено"/>
                                            {(() => {
                                                const d = new Date(apartment.created_at);
                                                const full = d.toLocaleString('ru-RU', {
                                                    year: 'numeric', month: 'long', day: '2-digit',
                                                    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dushanbe'
                                                });
                                                return (
                                                    <time dateTime={apartment.created_at} title={full}>
                                                        {timeAgo(d)}
                                                    </time>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 md:mt-0 mt-4 flex-wrap sm:flex-nowrap">
                                    <button
                                        className="w-14 h-14 rounded-full border border-[#BAC0CC] flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                                        onClick={toggleFavorite}
                                        aria-pressed={isFavorite}
                                    >
                                        <HeartIcon className="w-6 h-6 text-[#1E3A8A]"/>
                                    </button>


                                    {canEdit && (
                                        <Link
                                            href={`/profile/edit-post/${apartment.id}`}
                                            className="w-14 h-14 rounded-full border border-[#0036A5] bg-[#0036A5] flex items-center justify-center hover:bg-blue-800 transition-colors"
                                            title="Редактировать объявление"
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
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

                                    <Link href='#createBooking'
                                          className="w-auto h-14 px-4 gap-2 text-white rounded-full sm:hidden border border-[#0036A5] bg-[#0036A5] flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer"
                                    >
                                        <EyeIcon size={20} className="text-white"/>
                                        Создать показ
                                    </Link>


                                    {canEdit && (
                                        <Link
                                            href={`/apartment/${apartment.id}/logs`}
                                            className="w-14 h-14 rounded-full border border-[#0036A5] bg-[#0036A5] flex items-center justify-center hover:bg-blue-800 transition-colors"
                                            title="Редактировать объявление"
                                        >
                                            <HistoryIcon className="text-white"/>
                                        </Link>
                                    )}


                                    {/*<button*/}
                                    {/*    className="w-14 h-14 rounded-full border border-[#BAC0CC] flex items-center justify-center hover:bg-gray-50 cursor-pointer">*/}
                                    {/*    <SettingsIcon className="w-6 h-6 text-[#1E3A8A]"/>*/}
                                    {/*</button>*/}

                                </div>
                            </div>

                            {/* Галерея */}
                            {photos.length > 0 && (
                                <div className="mb-[30px]">
                                    {/* 303px слева + 376px справа (3 превью по 120 + 2 гэпа по 8) */}
                                    <div className="grid grid-cols-1 md:grid-cols-[303px_minmax(0,520px)] gap-4">
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
                                                                setSelectedIndex(
                                                                    (i) => (i - 1 + photos.length) % photos.length
                                                                );
                                                            }}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition"
                                                            aria-label="Предыдущее фото"
                                                        >
                                                            <svg
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                            >
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
                                                                setSelectedIndex(
                                                                    (i) => (i + 1) % photos.length
                                                                );
                                                            }}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition"
                                                            aria-label="Следующее фото"
                                                        >
                                                            <svg
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                            >
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
                                                <div
                                                    className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                    {photos.map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`w-2 h-2 rounded-full ${
                                                                i === selectedIndex
                                                                    ? 'bg-gray-900/80'
                                                                    : 'bg-gray-400/60'
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

                            {/* Property Details Blocks - Added after carousel */}
                            <div className="mb-6">
                                {/*<button*/}
                                {/*    className="md:w-[705px] text-center py-5 border border-[#BAC0CC] text-[#353E5C] rounded-lg flex items-center justify-center gap-2 cursor-pointer md:text-lg transition mb-[60px]">*/}
                                {/*    <span>Посмотреть объект в 3D пространстве</span>*/}
                                {/*    <svg*/}
                                {/*        width="32"*/}
                                {/*        height="28"*/}
                                {/*        viewBox="0 0 32 28"*/}
                                {/*        fill="none"*/}
                                {/*        xmlns="http://www.w3.org/2000/svg"*/}
                                {/*    >*/}
                                {/*        <path*/}
                                {/*            d="M31.9406 24.9756L31.0703 21.7276C30.9363 21.2275 30.4223 20.9306 29.9221 21.0647C29.422 21.1987 29.1253 21.7128 29.2593 22.2129L29.7485 24.0389L25.9104 21.823V12.823L16.9375 17.3148V27.3253L24.8398 23.3698L28.8111 25.6626L26.9851 26.1519C26.4849 26.2859 26.1882 26.8 26.3222 27.3001C26.4563 27.8004 26.9705 28.0971 27.4704 27.963L30.7183 27.0928C31.6411 26.8454 32.1879 25.8986 31.9406 24.9756ZM6.08957 21.8229L2.2515 24.0389L2.74075 22.2129C2.87475 21.7128 2.578 21.1987 2.07788 21.0647C1.57757 20.9306 1.06369 21.2275 0.929691 21.7276L0.0594406 24.9756C-0.187809 25.8984 0.358753 26.8454 1.28175 27.0926L4.52975 27.9629C5.03007 28.097 5.544 27.7999 5.67794 27.3001C5.81194 26.7999 5.51519 26.2859 5.01507 26.1519L3.18907 25.6626L7.16032 23.3698L15.0625 27.3252V17.3148L6.08957 12.823V21.8229ZM16.9362 7.39101V2.87713L18.2729 4.21382C18.639 4.57988 19.2326 4.57995 19.5987 4.21382C19.9648 3.84769 19.9648 3.25413 19.5987 2.88807L17.221 0.510383C16.5471 -0.163617 15.4503 -0.163617 14.7764 0.510383L12.3988 2.88807C12.0326 3.2542 12.0326 3.84776 12.3988 4.21382C12.7648 4.57995 13.3584 4.57995 13.7245 4.21382L15.0613 2.87713V7.39201L7.2465 11.3049C7.67919 11.5213 15.5605 15.4673 16.0001 15.6874C16.4397 15.4673 24.3209 11.5213 24.7536 11.3049L16.9362 7.39101"*/}
                                {/*            fill="#0036A5"*/}
                                {/*        />*/}
                                {/*    </svg>*/}
                                {/*</button>*/}

                                <div className="flex gap-8 flex-col md:flex-row mb-10">
                                    {/* О квартире */}
                                    {/* Левая колонка характеристик */}
                                    <div className="w-[317px]">
                                        <h2 className="text-2xl font-bold mb-4">
                                            {aboutSectionTitle(apartment)}
                                        </h2>
                                        <div className="space-y-0.5 text-sm">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <Home size={16}/> {typeFieldLabel(apartment)}
                                                </span>
                                                <span className="font-medium">
                                                  {apartment.type?.name || getKindName(apartment)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <Ruler size={16}/> Общая площадь
                                                </span>
                                                <span className="font-medium">
                                                  {apartment.total_area
                                                      ? apartment.total_area + 'м²'
                                                      : '-'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <Grid2X2Check size={16}/> Полноценная квартира?
                                                </span>
                                                <span className="font-medium">
                                                  {apartment.is_full_apartment
                                                      ? 'Да'
                                                      : 'Нет'}
                                                </span>
                                            </div>

                                            {(apartment.type.slug === 'houses' || apartment.type.slug === 'land_spots') && (
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <Ruler size={16}/> Площадь в сотках
                                                </span>
                                                    <span className="font-medium">
                                                  {apartment.land_size
                                                      ? apartment.land_size + 'соток'
                                                      : '-'}
                                                </span>
                                                </div>
                                            )}

                                            {/* Санузел показываем только для квартир/домов */}
                                            {['secondary', 'new-buildings', 'houses'].includes(
                                                apartment.type?.slug || ''
                                            ) && (
                                                <div className="flex justify-between py-2 border-b border-gray-100">
                                                  <span className="text-[#666F8D] flex items-center gap-2">
                                                    <Bath size={16}/> Санузел
                                                  </span>
                                                    <span className="font-medium">
                                                    {apartment.bathroom_count ?? '1'}
                                                  </span>
                                                </div>
                                            )}

                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <Hammer size={16}/> Ремонт
                                                </span>
                                                <span className="font-medium">
                                                  {apartment.repair_type?.name || 'Косметический'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <MapPin size={16}/> Район
                                                </span>
                                                <span className="font-medium">
                                                  {apartment.district || '-'}
                                                </span>
                                            </div>

                                            {/* --- ADMIN: дополнительные поля владелец / телефон владельца / у кого ключи --- */}
                                            {isAdminUser && (
                                                <>
                                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                                        <span className="text-[#666F8D] flex items-center gap-2">
                                                          <User size={16}/> Имя владельца
                                                        </span>
                                                        <span className="font-medium">
                                                          {ownerName || '-'}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                                        <span className="text-[#666F8D] flex items-center gap-2">
                                                          <User size={16}/> Владелец бизнесмен?
                                                        </span>
                                                        <span className="font-medium">
                                                          {apartment.is_business_owner ? 'Да' : 'Нет'}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                                        <span className="text-[#666F8D] flex items-center gap-2">
                                                          <Phone size={16}/> Телефон владельца
                                                        </span>
                                                        <span className="font-medium">
                                                          {ownerPhoneRaw ? (
                                                              <a
                                                                  href={`tel:${ownerCleanPhone}`}
                                                                  className="hover:underline"
                                                              >
                                                                  {ownerDisplayPhone}
                                                              </a>
                                                          ) : (
                                                              '-'
                                                          )}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                                        <span className="text-[#666F8D] flex items-center gap-2">
                                                          <Key size={16}/> У кого ключи
                                                        </span>
                                                        <span className="font-medium">
                                                          {apartment.object_key}
                                                        </span>
                                                    </div>

                                                    {/* --- Новый блок: тип договора --- */}
                                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                                          <span className="text-[#666F8D] flex items-center gap-2">
                                                            <FileText size={16}/> Тип договора
                                                          </span>
                                                        <span className="font-medium">
                                                            {apartment.contract_type?.name || '-'}
                                                          </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* О доме */}
                                    <div className="w-[317px]">
                                        <h2 className="text-2xl font-bold mb-4">О доме</h2>
                                        <div className="space-y-0.5 text-sm">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <Building2 size={16}/> Год постройки
                                                </span>
                                                <span className="font-medium">
                                                  {apartment.year_built || '-'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <Pickaxe size={16}/>Застройщик
                                                </span>
                                                <span className="font-medium">
                                                  {apartment.developer?.name || '-'}
                                                </span>
                                            </div>


                                            {/*<div className="flex justify-between py-2 border-b border-gray-100">*/}
                                            {/*    <span className="text-[#666F8D] flex items-center gap-2">*/}
                                            {/*      <ArrowUpDown size={16}/> Количество лифтов*/}
                                            {/*    </span>*/}
                                            {/*    <span className="font-medium">*/}
                                            {/*      {apartment.elevator_count || '-'}*/}
                                            {/*    </span>*/}
                                            {/*</div>*/}

                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <Building2 size={16}/> Тип дома
                                                </span>
                                                <span className="font-medium">
                                                  {apartment.building_type?.name || '-'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <ParkingSquare size={16}/> Парковка
                                                </span>
                                                <span className="font-medium">
                                                  {apartment.parking?.name || '-'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <Flame size={16}/> Отопление
                                                </span>
                                                <span className="font-medium">
                                                  {apartment.heating?.name || '-'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-[#666F8D] flex items-center gap-2">
                                                  <StickyNote size={16}/> Только для сайта aura.tj
                                                </span>
                                                <span className="font-medium">
                                                  {apartment.is_for_aura ? 'Да' : 'Нет'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-2xl font-bold mb-4">Описание</h2>
                                <div className="text-[#666F8D] whitespace-pre-line">
                                    {apartment.description || 'Описание не указано'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <div className="bg-white rounded-[22px] md:py-[30px] md:px-[22px] px-4 py-5 mb-6">
                            <div className="text-[#666F8D] text-lg mb-1.5">Цена</div>
                            <div className="text-[32px] font-bold text-[#0036A5]">
                                {Number(apartment.price).toLocaleString('ru-RU')}{' '}
                                {apartment.currency}
                            </div>
                        </div>

                        {apartment.creator && (
                            <div className="bg-white rounded-[22px] md:px-[26px] px-4 py-5 md:py-8">
                                <div className='flex justify-center'>
                                    <div
                                        className="relative w-[120px] h-[120px] rounded-full overflow-hidden flex-shrink-0 mb-4">
                                        <Link href={`/about/team/${apartment.creator.id}`}>
                                            {apartment.creator.photo ? (
                                                <Image
                                                    src={`${STORAGE_URL}/${apartment.creator.photo}`}
                                                    alt={apartment.creator.name}
                                                    width={120}
                                                    height={120}
                                                    className="rounded-full object-cover mr-2 h-[120px] w-[120px]"
                                                />
                                            ) : (
                                                <div
                                                    className="rounded-full flex justify-center items-center  h-[120px] w-[120px] bg-[#F1F5F9] p-1.5 mr-1.5">
                                                    <UserIcon className="w-6 h-7"/>
                                                </div>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-2 flex justify-center">
                                    <Link href={`/about/team/${apartment.creator.id}`}>
                                        {apartment.creator.name}
                                    </Link>
                                </h3>
                                <div className="text-[#666F8D] mb-4 flex justify-center">Специалист по недвижимости
                                </div>

                                <Link
                                    href={`tel:${creatorCleanPhone}`}
                                    className="flex items-center justify-center gap-3 w-full bg-[#0036A5] hover:bg-blue-800 text-white py-3 rounded-full text-center mb-4 transition-colors"
                                >
                                    <FooterPhoneIcon className="w-8 h-8"/>
                                    {creatorDisplayPhone}
                                </Link>

                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={`https://wa.me/${creatorCleanPhone}?text=${encodeURIComponent(
                                            `Здравствуйте! Интересует объект: ${buildPageTitle(apartment)} - https://www.aura.tj/apartment/${apartment.id}&utm_source=whatsAppAgentShare`
                                        )}`}
                                        className="flex items-center justify-center gap-3 w-full py-2 border border-[#25D366] text-[#25D366] rounded-full text-center hover:bg-[#25D366]/10 transition"
                                        target="_blank"
                                    >
                                        <WhatsappInlineIcon className="w-8 h-8"/> WhatsApp
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div
                            className="bg-white rounded-[22px] min-w-[200px] md:px-[26px] px-4 py-5 md:py-6 my-6 items-center">
                            <p className="text-2xl font-bold mb-2 flex justify-center">Поделиться</p>
                            <div className="flex gap-2 mt-4 justify-center">
                                <a href={`https://t.me/share/url?url=https://www.aura.tj/apartment/${apartment.id}/&text=${buildPageTitle(apartment)}&utm_source=tgShare`}
                                   target="_blank" aria-label="Telegram" rel="noopener">
                                    <TelegramNoBgIcon className="w-12 h-12 hover:border-blue-800 border-[#BAC0CC]"/>
                                </a>
                                <a href={`https://api.whatsapp.com/send?text=${buildPageTitle(apartment)} - https://www.aura.tj/apartment/${apartment.id}&utm_source=whatsAppShare`}
                                   target="_blank" aria-label="WhatsApp" rel="noopener">
                                    <WhatsAppNoBgIcon className="w-12 h-12 hover:border-blue-800 border-[#BAC0CC]"/>
                                </a>
                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    className="w-12 h-12 gap-2 text-white rounded-full border border-[#BAC0CC] flex items-center justify-center hover:border-blue-800 transition-colors cursor-pointer"
                                    title={copied ? 'Ссылка скопирована!' : 'Копировать ссылку'}
                                    aria-live="polite"
                                >
                                    <CopyIcon size={20} className="text-black"/>
                                </button>
                            </div>
                        </div>

                        {/* --- Google AdSense block (replace IDs) --- */}
                        <div
                            className="bg-white rounded-[22px] min-w-[200px] md:px-[26px] px-4 py-5 md:py-6 my-6 flex justify-center items-center">
                            <AdBanner
                                data-ad-slot="5085881730"
                                data-full-width-responsive="true"
                                data-ad-layout="in-article"
                                data-ad-format="auto"
                            />
                        </div>

                        {(isAdminUser || isAgentUser) && (
                            <div id="createBooking">
                                <BookingSidebarForm
                                    propertyId={apartment.id}
                                    defaultAgentId={user?.id}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* === Similar properties carousel === */}
                {similarProperties.length > 0 && (
                    <div className="">
                        <div className="flex items-center justify-between mb-3 bg-white rounded-[22px] p-4 my-6">
                            <h3 className="text-lg md:text-xl font-bold">Похожие объекты</h3>
                            <div
                                className="text-sm text-[#666F8D]">{loadingSimilar ? 'Загрузка...' : `${similarProperties.length} найдено`}</div>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {similarProperties.map((p) => (
                                <div className='w-[420px]' key={p.id}>
                                    <BuyCard listing={p} user={user}/>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {apartment.latitude && (
                    <div className="bg-white px-4 py-5 md:px-9 md:py-10 rounded-[14px] md:rounded-[22px] mt-4">
                        <div className="text-lg md:text-2xl mb-3 md:mb-6 font-bold">
                            Расположение на карте
                        </div>
                        <div className="h-[145px] md:h-[500px] w-full rounded-[12px] overflow-hidden">
                            <YMaps
                                query={{
                                    lang: 'ru_RU',
                                    apikey: 'dbdc2ae1-bcbd-4f76-ab38-94ca88cf2a6f',
                                }}
                            >
                                <Map
                                    state={{
                                        center: coordinates ?? [38.5597722, 68.7870384],
                                        zoom: coordinates ? 15 : 9,
                                    }}
                                    width="100%"
                                    height="100%"
                                    // onClick={handleMapClick}
                                    instanceRef={mapRef}
                                    modules={["geocode"]}
                                    onLoad={(ymaps) => {
                                        // @ts-expect-error type error disabling
                                        ymapsRef.current = ymaps;
                                        return undefined;
                                    }}
                                >
                                    {coordinates && (
                                        <Placemark
                                            geometry={coordinates}
                                            options={{
                                                preset: 'islands#blueHomeIcon',
                                                draggable: true,
                                            }}
                                            properties={{
                                                iconCaption: apartment.address,
                                            }}
                                        />
                                    )}
                                </Map>
                            </YMaps>
                        </div>
                    </div>
                )}


                <MortgageCalculator propertyPrice={apartment.price}/>
                <div
                    className="bg-white rounded-[22px] min-w-[200px] md:px-[26px] px-4 py-5 md:py-6 my-6 flex justify-center items-center">

                    <AdBanner
                        data-ad-slot="5694010534"
                        data-full-width-responsive="true"
                        data-ad-layout="in-article"
                        data-ad-format="auto"
                    />
                </div>
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
    const GAP = 10; // px
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
                            i === selectedIndex
                                ? 'border-[#0036A5]'
                                : 'border-transparent hover:border-blue-300'
                        }`}
                        style={{width: THUMB, height: THUMB}}
                        title={`Фото ${i + 1}`}
                    >
                        <Image
                            src={src}
                            alt={`Миниатюра ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="120px"
                        />
                    </button>
                ))}
            </div>
        );
    }
    // Десктоп: 3 колонки, видно 3 ряда (итого 9), дальше вертикальный скролл
    return (
        <div
            ref={containerRef}
            className="
                    hidden
                    md:grid
                    md:grid-cols-1
                    lg:grid-cols-2
                    xl:grid-cols-3
                    2xl:grid-cols-4
                    gap-3
                    overflow-y-auto
                    pr-1
                  "
            style={{maxHeight, scrollBehavior: 'smooth'}}
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
                        i === selectedIndex
                            ? 'border-blue-[#0036A5]'
                            : 'border-transparent hover:border-blue-300'
                    }`}
                    style={{width: THUMB, height: THUMB}}
                    title={`Фото ${i + 1}`}
                >
                    <Image
                        src={src}
                        alt={`Миниатюра ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                    />
                </button>
            ))}
        </div>
    );
}
