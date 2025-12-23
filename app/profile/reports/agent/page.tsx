'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {reportsApi} from '@/services/reports/api';
import {Input} from '@/ui-components/Input';
import {Button} from '@/ui-components/Button';
import {EditIcon, EyeIcon, HistoryIcon, User} from "lucide-react";
import {Property} from "@/services/properties/types";

type AgentPropertiesReport = {
    agent_id: number;
    agent_name: string;
    summary: {
        total_properties: number;
        total_shows: number;
        by_status: Record<string, number>;
    };
    properties: (Property & {
        type?: { id?: number; slug?: string } | null;
        apartment_type?: string | null;
        rooms?: number | null;
        total_area?: number | null;
        living_area?: number | null;
        land_size?: number | null;
        floor?: number | null;
        total_floors?: number | null;
        shows_count?: number | null;
        first_show?: string | null;
        last_show?: string | null;
    })[];
};

const STATUS_LABELS: Record<string, string> = {
    draft: 'Черновик',
    pending: 'Ожидание',
    approved: 'Опубликовано',
    rejected: 'Отклонено',
    sold: 'Продано',
    sold_by_owner: 'Продано владельцем',
    rented: 'Арендовано',
    deleted: 'Удалено',
    denied: 'Отказано клиентом',
};

const statusLabel = (v?: string | null) => (v ? (STATUS_LABELS[v] ?? v) : '—');

export default function AgentReportPage() {
    const search = useSearchParams();
    const router = useRouter();

    const createdBy = search.get('created_by') ?? search.get('agent') ?? '';
    const dateFromParam = search.get('date_from') ?? '';
    const dateToParam = search.get('date_to') ?? '';
    const soldFromParam = search.get('sold_at_from') ?? '';
    const soldToParam = search.get('sold_at_to') ?? '';

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<AgentPropertiesReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [openRow, setOpenRow] = useState<number | null>(null);

    const [dateFrom, setDateFrom] = useState<string>(dateFromParam);
    const [dateTo, setDateTo] = useState<string>(dateToParam);
    const [soldFrom, setSoldFrom] = useState<string>(soldFromParam);
    const [soldTo, setSoldTo] = useState<string>(soldToParam);

    // загрузчик — типизируем и логируем ответ
    const load = async (agentId: string) => {
        if (!agentId) {
            setError('Не указан агент (параметр created_by или agent в query).');
            setReport(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await reportsApi.agentPropertiesReport({
                agent: agentId,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
                sold_at_from: soldFrom || undefined,
                sold_at_to: soldTo || undefined,
            });

            // логируем приходящие данные для отладки
            console.log('agentPropertiesReport response:', data);

            // API may return either a single AgentPropertiesReport or an array (aggregated mode).
            // Normalize to single object when possible.
            if (Array.isArray(data)) {
                // if array returned, try to find the report for the requested agent id
                const found = data.find((r) => String(r.agent_id) === String(agentId));
                setReport((found ?? data[0]) as unknown as AgentPropertiesReport);
            } else {
                setReport(data as unknown as AgentPropertiesReport);
            }
        } catch (e: unknown) {
            console.error('agentPropertiesReport error', e);
            let msg = 'Ошибка загрузки';
            if (e instanceof Error) msg = e.message;
            setError(msg);
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    // Перезапускаем загрузку при изменении агента или фильтров даты.
    // Включаем dateFrom/dateTo/soldFrom/soldTo — чтобы при applyFilters данные тоже загрузились.
    useEffect(() => {
        load(createdBy);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createdBy, dateFrom, dateTo, soldFrom, soldTo]);

    const applyFilters = async () => {
        const params = new URLSearchParams();
        if (createdBy) params.set('created_by', createdBy);
        if (dateFrom) params.set('date_from', dateFrom);
        if (dateTo) params.set('date_to', dateTo);
        if (soldFrom) params.set('sold_at_from', soldFrom);
        if (soldTo) params.set('sold_at_to', soldTo);

        // обновляем URL
        router.push(`/profile/reports/agent?${params.toString()}`);

        // дополнительно сразу запрашиваем данные (чтобы UI обновился быстрее)
        await load(createdBy);
    };

    const clearFilters = async () => {
        setDateFrom('');
        setDateTo('');
        setSoldFrom('');
        setSoldTo('');
        const params = new URLSearchParams();
        if (createdBy) params.set('created_by', createdBy);
        router.push(`/profile/reports/agent?${params.toString()}`);

        // перезагрузим без дат
        await load(createdBy);
    };

    const [filtersOpen, setFiltersOpen] = useState(true);

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

    // const getKindName = (l: Property) => {
    //     const slug = l.type?.slug;
    //
    //     switch (slug) {
    //         case 'commercial':
    //             return 'Коммерческое помещение';
    //         case 'land-plots':
    //             return 'Земельный участок';
    //         case 'houses':
    //             return 'дом'; // при желании можно развести на коттедж/таунхаус по отдельному полю
    //         case 'parking':
    //             return 'парковка';
    //         // квартиры идут в двух категориях: secondary и new-buildings
    //         case 'secondary':
    //         case 'new-buildings':
    //         default:
    //             // если есть уточнение типа квартиры — используем его
    //             return l.apartment_type || 'квартира';
    //     }
    // };
    //
    // const buildTitle = (l: Property) => {
    //     const kind = getKindName(l);
    //     const slug = l.type?.slug;
    //
    //     if (slug === 'commercial') {
    //         // комнаты не показываем, фокус на площади/этаже
    //         return `${kind}${l.total_area ? `, ${l.total_area} м²` : ''}${
    //             l.floor ? `, ${l.floor}/${l.total_floors} этаж` : ''
    //         }`;
    //     }
    //
    //     if (slug === 'land-plots') {
    //         // для участка чаще показывают площадь (если есть поле под сотки — подставь его)
    //         return `${kind}${l.land_size ? `, ${l.land_size} соток` : ''}`;
    //     }
    //
    //     if (slug === 'houses') {
    //         // для домов комнатность опционально
    //         return `${l.rooms ? `${l.rooms} комн. ` : ''}${kind}${
    //             l.land_size ? `, ${l.land_size} соток` : ''
    //         }${l.floor ? `, ${l.floor}/${l.total_floors} этаж` : ''}`;
    //     }
    //
    //     if (slug === 'parking') {
    //         return kind; // можно добавить «подземная/наземная» по отдельному полю, если появится
    //     }
    //
    //     // квартиры: secondary / new-buildings (или дефолт)
    //     return `${l.rooms ? `${l.rooms} комн. ` : ''}${kind}${
    //         l.floor ? `, ${l.floor}/${l.total_floors} этаж` : ''
    //     }${l.total_area ? `, ${l.total_area} м²` : ''}`;
    // };

    const summary = report?.summary;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Отчёт по агенту</h1>
                <div>
                    <Link href="/profile/reports" className="text-sm text-[#0036A5] hover:underline">
                        Вернуться к общим отчётам
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-4 sticky top-0 z-20">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Фильтры</h2>
                    <button
                        type="button"
                        onClick={() => setFiltersOpen(v => !v)}
                        className="text-sm text-[#0036A5]"
                    >
                        {filtersOpen ? 'Свернуть' : 'Развернуть'}
                    </button>
                </div>
                {filtersOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm text-[#666F8D] mb-2">Агент (created_by)</label>
                            <input
                                value={createdBy}
                                readOnly
                                className="w-full px-3 py-2 rounded border border-[#BAC0CC] bg-gray-50"
                            />
                        </div>

                        <div>
                            <Input
                                type="date"
                                label="Дата с"
                                name="date_from"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>

                        <div>
                            <Input
                                type="date"
                                label="Дата по"
                                name="date_to"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>

                        <div>
                            <Input
                                type="date"
                                label="Продано с"
                                name="sold_at_from"
                                value={soldFrom}
                                onChange={(e) => setSoldFrom(e.target.value)}
                            />
                        </div>

                        <div>
                            <Input
                                type="date"
                                label="Продано по"
                                name="sold_at_to"
                                value={soldTo}
                                onChange={(e) => setSoldTo(e.target.value)}
                            />
                        </div>

                        <div className="flex items-end gap-2">
                            <Button onClick={() => applyFilters()} loading={loading}>
                                Применить
                            </Button>
                            <Button variant="secondary" onClick={clearFilters}>
                                Сбросить
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {loading && (
                <div className="p-4 bg-white rounded-2xl shadow text-center">Загрузка...</div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
                    {error}
                </div>
            )}

            {!loading && report && (
                <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold">Агент: {report.agent_name}</h2>

                        <div className="text-sm text-gray-500">Период: {dateFrom || '—'} — {dateTo || '—'}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded">
                            <div className="text-sm text-gray-500">Всего объектов</div>
                            <div className="text-lg font-semibold">{summary?.total_properties ?? '—'}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <div className="text-sm text-gray-500">Всего показов</div>
                            <div className="text-lg font-semibold">{summary?.total_shows ?? '—'}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <div className="text-sm text-gray-500">По статусам</div>
                            <div className="text-sm">
                                {summary &&
                                    Object.entries(summary.by_status).map(([k, v]) => (
                                        <div key={k} className="flex justify-between text-gray-600">
                                            <span>{statusLabel(k)}</span>
                                            <span className="font-medium">{v}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className='flex'>
                            <Link href={`/about/team/${createdBy}`}
                                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                                <User className="w-6 h-6"/>
                                <span>Посмотреть страницу агента</span>
                            </Link></div>
                    </div>

                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="text-left text-gray-500">
                            <th className="py-2 pr-4">Объект</th>
                            <th className="py-2 pr-4">Цена</th>
                            <th className="py-2 pr-4">Статус</th>
                            <th className="py-2 pr-4">Показов</th>
                            <th className="py-2 pr-4">Первый показ</th>
                            <th className="py-2 pr-4">Последний показ</th>
                        </tr>
                        </thead>
                        <tbody>
                        {report.properties.length === 0 ? (
                            <tr>
                                <td className="py-4 text-gray-500" colSpan={6}>
                                    Нет объектов
                                </td>
                            </tr>
                        ) : (
                            report.properties.map((p) => (
                                <tr className="border-t" key={p.id}>


                                    <td className="py-2 pr-4 font-medium">{buildTitle(p)}</td>
                                    <td className="py-2 pr-4">{p.price ? `${p.price} ${p.currency ?? ''}` : '—'}</td>
                                    <td className="py-2 pr-4">{statusLabel(p.moderation_status ?? '')}</td>
                                    <td className="py-2 pr-4">{p.shows_count}</td>
                                    <td className="py-2 pr-4">{p.first_show ?? '—'}</td>
                                    <td className="py-2 pr-4">{p.last_show ?? '—'}</td>
                                    <td className="py-2 pr-4">
                                        <div className="relative inline-block text-left">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setOpenRow(openRow === p.id ? null : p.id);
                                                }}
                                                className="inline-flex items-center gap-2 px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50"
                                            >
                                                Действия
                                                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"
                                                     aria-hidden="true">
                                                    <path fillRule="evenodd"
                                                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </button>

                                            {openRow === p.id && (
                                                <div
                                                    className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-20">
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
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}