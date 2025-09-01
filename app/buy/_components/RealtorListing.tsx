import {useGetPropertiesQuery} from "@/services/properties/hooks";
import {PropertyFilters} from "@/services/properties/types";
import Buy from "@/app/_components/buy/buy";
import {useEffect, useMemo, useState} from 'react';

type RealtorListingsProps = {
    slug: string;
    selectedRooms: number[];
    onCountChange?: (total: number) => void;
};

// проверяем «непрерывность» выбора (например 2,3,4 или 3,4,5)
const isContiguous = (arr: number[]) => {
    if (arr.length <= 1) return true;
    for (let i = 1; i < arr.length; i++) {
        const prev = arr[i - 1];
        const cur = arr[i];
        if (!(cur === prev + 1)) return false;
    }
    return true;
};

export const RealtorListings: React.FC<RealtorListingsProps> = ({slug, selectedRooms, onCountChange}) => {
    const [page, setPage] = useState(1);

    // если выбрано «Все» — не добавляем комнатные фильтры вообще
    const allSelected = selectedRooms.length === 5;

    // Сбрасываем страницу при смене фильтров
    useEffect(() => {
        setPage(1);
    }, [slug, selectedRooms.join(',')]); // join, чтобы эффект срабатывал при изменении набора

    // Готовим фильтры (мемоизация, чтобы не дергать лишние запросы)
    const filters: PropertyFilters = useMemo(() => {
        const base: PropertyFilters = {
            created_by: slug,
            listing_type: 'regular',
            offer_type: 'sale',
            page, // <-- важное добавление
            // per_page: 12, // опционально, если нужно фиксированное кол-во на странице
        };

        if (allSelected) return base;

        const sorted = [...selectedRooms].sort((a, b) => a - b);

        if (isContiguous(sorted)) {
            base.roomsFrom = String(sorted[0]);
            base.roomsTo = String(sorted[sorted.length - 1]);
            return base;
        }

        base.rooms = sorted.join(','); // 5 трактуется как 5+
        return base;
    }, [slug, allSelected, selectedRooms, page]);

    const {data: propertiesResponse, isLoading} = useGetPropertiesQuery(filters);

    useEffect(() => {
        if (onCountChange) {
            onCountChange(propertiesResponse?.total ?? 0);
        }
    }, [propertiesResponse?.total, onCountChange]);

    const propertiesForBuy = propertiesResponse ?? {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
        first_page_url: '',
        last_page_url: '',
        links: [],
        next_page_url: null,
        path: '',
        prev_page_url: null,
    };

    const totalPages = propertiesForBuy.last_page ?? 1;
    const currentPage = propertiesForBuy.current_page ?? page;

    const goToPage = (p: number) => {
        if (p < 1 || p > totalPages || p === currentPage) return;
        setPage(p);
        // по желанию: скролл к началу списка
        // window?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // компактная полоска страниц (текущая ±2)
    const pagesToShow = useMemo(() => {
        const around = 2;
        const start = Math.max(1, currentPage - around);
        const end = Math.min(totalPages, currentPage + around);
        const arr: number[] = [];
        for (let i = start; i <= end; i++) arr.push(i);
        return arr;
    }, [currentPage, totalPages]);

    return (
        <div className="mt-6">
            <Buy
                properties={propertiesForBuy}
                isLoading={isLoading}
                hasTitle={false}
            />

            {totalPages > 1 && (
                <div className="mt-6 flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1 || isLoading}
                        className={`px-4 py-2 rounded-full border ${currentPage <= 1 || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Назад
                    </button>

                    {/* первая страница + троеточие */}
                    {pagesToShow[0] > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => goToPage(1)}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-full border ${currentPage === 1 ? 'bg-[#0036A5] text-white border-[#0036A5]' : ''}`}
                            >
                                1
                            </button>
                            {pagesToShow[0] > 2 && <span className="px-2">…</span>}
                        </>
                    )}

                    {/* диапазон вокруг текущей */}
                    {pagesToShow.map(p => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => goToPage(p)}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-full border ${currentPage === p ? 'bg-[#0036A5] text-white border-[#0036A5]' : ''}`}
                        >
                            {p}
                        </button>
                    ))}

                    {/* троеточие + последняя */}
                    {pagesToShow[pagesToShow.length - 1] < totalPages && (
                        <>
                            {pagesToShow[pagesToShow.length - 1] < totalPages - 1 && <span className="px-2">…</span>}
                            <button
                                type="button"
                                onClick={() => goToPage(totalPages)}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-full border ${currentPage === totalPages ? 'bg-[#0036A5] text-white border-[#0036A5]' : ''}`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages || isLoading}
                        className={`px-4 py-2 rounded-full border ${currentPage >= totalPages || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Вперёд
                    </button>
                </div>
            )}
        </div>
    );
};

// Chip без изменений
export const Chip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
                                                                                                        active,
                                                                                                        onClick,
                                                                                                        children
                                                                                                    }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 rounded-full border transition
      ${active ? 'bg-[#0036A5] text-white border-[#0036A5]' : 'bg-white text-[#020617] border-[#BAC0CC]'}
    `}
    >
        {children}
    </button>
);