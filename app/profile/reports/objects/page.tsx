'use client';

import {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {MultiSelect} from '@/ui-components/MultiSelect';
import {Button} from '@/ui-components/Button';
import {Input} from '@/ui-components/Input';
import {useGetAllPropertiesQuery} from '@/services/properties/hooks';
import {axios} from "@/utils/axios";
import {Property, PropertyFilters} from "@/services/properties/types";
import Link from "next/link";
import {
    EditIcon, Ellipsis,
    EyeIcon,
    GridIcon,
    HistoryIcon,
    ListIcon,
} from "lucide-react";
import clsx from 'clsx';
import BuyCard from "@/app/_components/buy/buy-card";
import {useProfile} from "@/services/login/hooks";

type FilterState = {
    date_from: string;
    date_to: string;
    interval: 'day' | 'week' | 'month';
    offer_type: (string | number)[];
    moderation_status: (string | number)[];
    type_id: (string | number)[];
    location_id: (string | number)[];
    agent_id: (string | number)[];
    contract_type_id: (string | number)[];
    roomsFrom?: string;
    roomsTo?: string;
};

type PriceMetric = 'sum' | 'avg';

const STATUS_OPTIONS = [
    {label: 'Черновик', value: 'draft'},
    {label: 'Ожидание', value: 'pending'},
    {label: 'Одобрено/Опубликовано', value: 'approved'},
    {label: 'Отклонено', value: 'rejected'},
    {label: 'Продано', value: 'sold'},
    {label: 'Продано владельцем', value: 'sold_by_owner'},
    {label: 'Арендовано', value: 'rented'},
    {label: 'Удалено', value: 'deleted'},
    {label: 'Отказано клиентом', value: 'denied'},
];

const OFFER_OPTIONS = [
    {label: 'Продажа', value: 'sale'},
    {label: 'Аренда', value: 'rent'},
];

const STATUS_LABELS: Record<string, string> = Object.fromEntries(
    STATUS_OPTIONS.map((o) => [String(o.value), o.label])
);

const statusLabel = (v?: string | null) => (v ? STATUS_LABELS[v] ?? v : '—');


// --- types for properties API (minimal, adapt to your backend response) ---
type Agent = { id: number; name: string };

export default function ReportsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {data: user} = useProfile();

    // read initial filters from query params so state persists on back/forward
    const initialFilters = useMemo<FilterState>(() => {
        const sp = Object.fromEntries(searchParams?.entries() ?? []);
        return {
            date_from: (sp.date_from as string) || '',
            date_to: (sp.date_to as string) || '',
            interval: ((sp.interval as string) || 'week') as 'day' | 'week' | 'month',
            offer_type: (searchParams?.getAll('offer_type') ?? []) as (string | number)[],
            moderation_status: (searchParams?.getAll('moderation_status') ?? []) as (string | number)[],
            type_id: (searchParams?.getAll('type_id') ?? []) as (string | number)[],
            location_id: (searchParams?.getAll('location_id') ?? []) as (string | number)[],
            contract_type_id: (searchParams?.getAll('contract_type_id') ?? []) as (string | number)[],
            agent_id: (searchParams?.getAll('agent_id') ?? []) as (string | number)[],
            // support reading either `rooms` (single) or `roomsFrom`/`roomsTo` from the query
            roomsFrom: (sp.roomsFrom as string) || (sp.rooms as string) || '',
            roomsTo: (sp.roomsTo as string) || (sp.rooms as string) || '',
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams?.toString()]);

    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [priceMetric, setPriceMetric] = useState<PriceMetric>(() => (searchParams?.get('price_metric') as PriceMetric) ?? 'sum');

    // table / pagination / sorting state persisted in query params
    const [page, setPage] = useState<number>(() => Number(searchParams?.get('page') ?? 1));
    const [perPage, setPerPage] = useState<number>(() => Number(searchParams?.get('per_page') ?? 20));
    const [sort, setSort] = useState<string>(() => (searchParams?.get('sort') as string) ?? '');
    const [openRow, setOpenRow] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>(() => (searchParams?.get('view') as 'table' | 'cards') ?? 'table');

    // agents
    const [agents, setAgents] = useState<Agent[]>([]);
    const [, setAgentsLoading] = useState(false);

    const loadAgents = async () => {
        setAgentsLoading(true);
        try {
            const response = await axios.get<Agent[]>('/user/agents');
            setAgents(Array.isArray(response.data) ? response.data : []);
        } catch (e) {
            console.error('agents load failed', e);
            setAgents([]);
        } finally {
            setAgentsLoading(false);
        }
    };

    useEffect(() => {
        loadAgents();
    }, []);

    // keep query params synced whenever filters / paging / sorting change
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.date_from) params.set('date_from', filters.date_from);
        if (filters.date_to) params.set('date_to', filters.date_to);
        if (filters.interval) params.set('interval', filters.interval);
        if (priceMetric) params.set('price_metric', priceMetric);
        filters.offer_type.forEach((v) => params.append('offer_type', String(v)));
        filters.moderation_status.forEach((v) => params.append('moderation_status', String(v)));
        filters.type_id.forEach((v) => params.append('type_id', String(v)));
        filters.location_id.forEach((v) => params.append('location_id', String(v)));
        filters.agent_id.forEach((v) => params.append('agent_id', String(v)));
        filters.contract_type_id.forEach((v) => params.append('contract_type_id', String(v)));

        // rooms handling: if user selected a single rooms value (roomsFrom === roomsTo), write `rooms=X`.
        // otherwise expose roomsFrom/roomsTo individually if present.
        if (filters.roomsFrom) {
            if (filters.roomsTo && filters.roomsFrom === filters.roomsTo) {
                params.set('rooms', String(filters.roomsFrom));
            } else {
                params.set('roomsFrom', String(filters.roomsFrom));
                if (filters.roomsTo) params.set('roomsTo', String(filters.roomsTo));
            }
        }

        if (page) params.set('page', String(page));
        if (perPage) params.set('per_page', String(perPage));
        if (sort) params.set('sort', sort);
        if (viewMode) params.set('view', viewMode);

        const queryString = params.toString();
        const current = searchParams?.toString() ?? '';

        // avoid replacing the URL if nothing changed to prevent extra re-renders
        if (queryString !== current) {
            const url = `/profile/reports/objects${queryString ? `?${queryString}` : ''}`;
            router.replace(url);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, priceMetric, page, perPage, sort, viewMode, searchParams?.toString()]);

    const resetFilters = () => {
        setFilters({
            date_from: '',
            date_to: '',
            interval: 'week',
            offer_type: [],
            moderation_status: [],
            type_id: [],
            location_id: [],
            contract_type_id: [],
            agent_id: [],
            roomsFrom: '',
            roomsTo: '',
        });
        setPriceMetric('sum');
        setPage(1);
        setPerPage(20);
        setSort('');
    };

    const getKindName = (l: Property) => {
        const slug = l.type?.slug;

        switch (slug) {
            case 'commercial':
                return 'Коммерческое помещение';
            case 'land-plots':
                return 'Земельный участок';
            case 'houses':
                return 'дом'; // при желании можно развести на коттедж/таунхаус по отдельному полю
            case 'parking':
                return 'парковка';
            // квартиры идут в двух категориях: secondary и new-buildings
            case 'secondary':
            case 'new-buildings':
            default:
                // если есть уточнение типа квартиры — используем его
                return l.apartment_type || 'квартира';
        }
    };

    const buildTitle = (l: Property) => {
        const kind = getKindName(l);
        const slug = l.type?.slug;

        if (slug === 'commercial') {
            // комнаты не показываем, фокус на площади/этаже
            return `${kind}${l.total_area ? `, ${l.total_area} м²` : ''}${
                l.floor ? `, ${l.floor}/${l.total_floors} этаж` : ''
            }`;
        }

        if (slug === 'land-plots') {
            // для участка чаще показывают площадь (если есть поле под сотки — подставь его)
            return `${kind}${l.land_size ? `, ${l.land_size} соток` : ''}`;
        }

        if (slug === 'houses') {
            // для домов комнатность опционально
            return `${l.rooms ? `${l.rooms} комн. ` : ''}${kind}${
                l.land_size ? `, ${l.land_size} соток` : ''
            }${l.floor ? `, ${l.floor}/${l.total_floors} этаж` : ''}`;
        }

        if (slug === 'parking') {
            return kind; // можно добавить «подземная/наземная» по отдельному полю, если появится
        }

        // квартиры: secondary / new-buildings (или дефолт)
        return `${l.rooms ? `${l.rooms} комн. ` : ''}${kind}${
            l.floor ? `, ${l.floor}/${l.total_floors} этаж` : ''
        }${l.total_area ? `, ${l.total_area} м²` : ''}`;
    };

    const handleIntervalChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as FilterState['interval'];
        setFilters((s) => ({...s, interval: value}));
    };

    // ---------- Properties table via provided hook (server-side pagination) ----------
    const propertyFilters = useMemo(() => {
        // map our UI filters to PropertyFilters used by the hook
        return {
            listing_type: '',
            page,
            per_page: perPage,
            moderation_status: (filters.moderation_status as []).join(','),
            offer_type: (filters.offer_type as []).join(','),
            created_by: (filters.agent_id).join(','),
            date_from: filters.date_from || undefined,
            date_to: filters.date_to || undefined,
            roomsFrom: filters.roomsFrom || undefined,
            roomsTo: filters.roomsTo || undefined,
            contract_type_id: filters.contract_type_id || undefined,
            // pass `sort` only when set — avoid sending a sentinel value like 'none'
            sort: sort || undefined,
        } as PropertyFilters;
    }, [filters, page, perPage, sort]);

    const {
        data: propertiesResponse,
    } = useGetAllPropertiesQuery(propertyFilters, true);

    // API may return either an array (Property[]) or a paginated object { data: Property[], ... }
    const propertiesItems: Property[] = Array.isArray(propertiesResponse)
        ? propertiesResponse
        : propertiesResponse?.data ?? [];



    console.log('propertiesItems', propertiesItems);
    // sorting helper
    const toggleSort = (field: string) => {
        // expected sort format 'field:asc' or 'field:desc'
        const cur = sort || '';
        const [curField, curDir] = cur.split(':');
        if (curField !== field) {
            setSort(`${field}:asc`);
        } else {
            if (curDir === 'asc') setSort(`${field}:desc`);
            else setSort(`${field}:asc`);
        }
        setPage(1);
    };

    // load reports stub (keeps previous semantics of your Apply button)
    const load = async () => {
        setLoading(true);
        try {
            // TODO: call reports API with queryObj and setSummary/series/rooms
            // example: const res = await reportsApi.getReports(queryObj)
        } catch {
            setError('Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" space-y-6">
            <h1 className="text-2xl font-semibold">Отчёты по объектам</h1>

            {/* Фильтры */}
            <div className="bg-white rounded-2xl shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                        type="date"
                        label="Дата с"
                        name="date_from"
                        value={filters.date_from}
                        onChange={(e) => setFilters((s) => ({...s, date_from: e.target.value}))}
                    />
                    <Input
                        type="date"
                        label="Дата по"
                        name="date_to"
                        value={filters.date_to}
                        onChange={(e) => setFilters((s) => ({...s, date_to: e.target.value}))}
                    />

                    <div>
                        <label className="block mb-2 text-sm text-[#666F8D]">Интервал</label>
                        <select
                            value={filters.interval}
                            onChange={handleIntervalChange}
                            className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5]"
                        >
                            <option value="day">День</option>
                            <option value="week">Неделя</option>
                            <option value="month">Месяц</option>
                        </select>
                    </div>

                    <MultiSelect
                        label="Тип объявления"
                        value={filters.offer_type}
                        options={OFFER_OPTIONS}
                        onChange={(arr) => setFilters((s) => ({...s, offer_type: arr}))}
                    />
                </div>

                <div className="mt-4">
                    <MultiSelect
                        label="Статусы"
                        value={filters.moderation_status}
                        options={STATUS_OPTIONS}
                        onChange={(arr) => setFilters((s) => ({...s, moderation_status: arr}))}
                    />
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="block mb-2 text-sm text-[#666F8D]">Агенты</label>
                        <select
                            className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5]"
                            value={filters.agent_id ? String(filters.agent_id) : ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFilters((s) => ({...s, agent_id: val ? [val] : []}));
                            }}
                        >
                            <option value="">— Все —</option>
                            {agents.map((a) => (
                                <option key={a.id} value={String(a.id)}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="block mb-2 text-sm text-[#666F8D]">Комнат</label>
                        <select
                            className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5]"
                            value={filters.roomsFrom ?? ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (!val) {
                                    // cleared -> remove range
                                    setFilters((s) => ({...s, roomsFrom: '', roomsTo: ''}));
                                } else {
                                    // single specific rooms selected -> set both from/to to the same value
                                    setFilters((s) => ({...s, roomsFrom: val, roomsTo: val}));
                                }
                            }}
                        >
                            <option value="">— Все —</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6+</option>
                        </select>
                        {/*<p className="text-xs text-gray-500 mt-1">Выберите количество комнат. При выборе, например, «2», в фильтре будут установлены roomsFrom=2 и roomsTo=2.</p>*/}
                    </div>

                    {/* placeholder for additional filters */}
                    <div className="flex flex-col gap-2">
                        <label className="block mb-2 text-sm text-[#666F8D]">Тип договора</label>
                        <select
                            className="w-full px-4 py-3 rounded-lg border border-[#BAC0CC] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0036A5]"
                            value={filters.contract_type_id ? String(filters.contract_type_id) : ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFilters((s) => ({...s, contract_type_id: val ? [val] : []}));
                            }}
                        >
                            <option value="">— Все —</option>
                            <option value="1">Альтернативный</option>
                            <option value="2">Эксклюзив</option>
                            <option value="3">Без договора</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <Button onClick={load} loading={loading}>
                        Применить
                    </Button>
                    <Button variant="secondary" onClick={resetFilters}>
                        Сбросить
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">{error}</div>
            )}

            {/* Properties table */}
            <div className="bg-white rounded-2xl shadow p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Список объектов</h2>

                    <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-500 mr-4">Всего: {propertiesResponse?.total ?? 0}</div>

                        <div className="inline-flex rounded-md shadow-sm" role="group">
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={clsx('px-3 py-1 text-sm rounded-l-md cursor-pointer', viewMode === 'table' ? 'bg-[#0036A5] font-semibold text-white' : 'bg-[#0036A5]/70 text-gray-100')}
                            >
                                <ListIcon/>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('cards')}
                                className={clsx('px-3 py-1 text-sm rounded-r-md cursor-pointer', viewMode === 'cards' ? 'bg-[#0036A5] font-semibold text-white' : 'bg-[#0036A5]/70 text-gray-100')}
                            >
                                <GridIcon/>
                            </button>
                        </div>
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-left">
                            <thead>
                            <tr>
                                <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('id')}>ID</th>
                                <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('title')}>Название</th>
                                <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('price')}>Цена</th>
                                <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('agent_id')}>Агент</th>
                                <th className="px-3 py-2 cursor-pointer"
                                    onClick={() => toggleSort('moderation_status')}>Статус
                                </th>
                                <th className="px-3 py-2">Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {propertiesItems.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-3 py-6 text-center text-gray-500">Нет данных</td>
                                </tr>
                            )}

                            {propertiesItems.map((p: Property) => (
                                <tr key={p.id} className="border-t">
                                    <td className="px-3 py-3">{p.id}</td>
                                    <td className="px-3 py-3">{buildTitle(p)}</td>
                                    <td className="px-3 py-3">{p.price ? `${p.price} ${p.currency ?? ''}` : '—'}</td>
                                    <td className="px-3 py-3">{p.creator?.name ?? '—'}</td>
                                    <td className="px-3 py-3">{statusLabel(p.moderation_status)}</td>
                                    <td className="px-3 py-3">
                                        <div className="relative inline-block text-left">
                                            <Button variant="circle" size="sm"
                                                onClick={() => {
                                                    setOpenRow(openRow === p.id ? null : p.id);
                                                }}
                                                    className='rounded-full'
                                            >
                                                <Ellipsis className=' w-5'/>

                                            </Button>

                                            {openRow === p.id && (
                                                <div
                                                    className="absolute right-0 left-0 m-auto mt-2 w-44 bg-white border rounded shadow z-20">
                                                    <Link href={`/apartment/${p.id}`}
                                                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                                                        <EyeIcon className="w-4 h-4"/>
                                                        <span>Посмотреть</span>
                                                    </Link>

                                                    <Link href={`/apartment/${p.id}/logs`}
                                                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                                                        <HistoryIcon className="w-4 h-4"/>
                                                        <span>Посмотреть историю</span>
                                                    </Link>
                                                    <Link href={`/profile/edit-post/${p.id}`}
                                                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                                                        <EditIcon className="w-4 h-4"/>
                                                        <span>Редактировать</span>
                                                    </Link>

                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {propertiesItems.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-6">Нет данных</div>
                        )}

                        {propertiesItems.map((p: Property) => (
                            <BuyCard listing={p} user={user} key={p.id}/>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                    <div
                        className="text-sm text-gray-600">Страница {propertiesResponse?.current_page} из {Math.max(1, Math.ceil((propertiesResponse?.total ?? 0) / (propertiesResponse?.per_page ?? perPage)))}</div>
                    <div className="flex items-center gap-2">
                        <Button variant="primary" onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}>Пред.</Button>
                        <div className="px-2">{page}</div>
                        <Button variant="primary" onClick={() => setPage((p) => p + 1)}
                                disabled={page >= Math.ceil((propertiesResponse?.total ?? 0) / (propertiesResponse?.per_page ?? perPage))}>След.</Button>
                        <select value={perPage} onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setPage(1);
                        }} className="ml-2 px-3 py-2 border rounded">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}