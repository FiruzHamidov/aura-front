'use client';

import {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {
    AgentsLeaderboardRow,
    ManagerEfficiencyRow, MissingPhoneAgentRow,
    reportsApi,
    ReportsQuery,
    RoomsRow,
    SummaryResponse,
    TimeSeriesRow,
} from '@/services/reports/api';
import {BarOffer, BarRooms, LineTimeSeries, PieStatus} from './_charts';
import {MultiSelect} from '@/ui-components/MultiSelect';
import {Button} from '@/ui-components/Button';
import {Input} from '@/ui-components/Input';
import Link from "next/link";

type FilterState = {
    date_from: string;
    date_to: string;
    interval: 'day' | 'week' | 'month';
    offer_type: (string | number)[];
    moderation_status: (string | number)[];
    type_id: (string | number)[];
    location_id: (string | number)[];
    agent_id: (string | number)[];
};

type PriceMetric = 'sum' | 'avg';

// Для безопасного доступа к метрикам цены
type WithMetrics = { sum_price?: number; avg_price?: number };
type SummaryUnion = SummaryResponse & { sum_price?: number; sum_total_area?: number };

const STATUS_OPTIONS = [
    {label: 'Черновик', value: 'draft'},
    {label: 'Ожидание', value: 'pending'},
    {label: 'Одобрено/Опубликовано', value: 'approved'},
    {label: 'Отклонено', value: 'rejected'},
    {label: 'Продано', value: 'sold'},
    {label: 'Продано владельцем', value: 'sold_by_owner'},
    {label: 'Арендовано', value: 'rented'},
    {label: 'Удалено', value: 'deleted'},
    {label: 'denied', value: 'Отказано клиентом'},
];

const OFFER_OPTIONS = [
    {label: 'Продажа', value: 'sale'},
    {label: 'Аренда', value: 'rent'},
];

const OFFER_LABELS: Record<string, string> = {
    sale: 'Продажа',
    rent: 'Аренда',
};

const STATUS_LABELS: Record<string, string> = Object.fromEntries(
    STATUS_OPTIONS.map(o => [String(o.value), o.label])
);

const statusLabel = (v?: string | null) =>
    v ? (STATUS_LABELS[v] ?? v) : '—';

const offerLabel = (v?: string | null) => (v ? (OFFER_LABELS[v] ?? v) : '—');

export default function ReportsPage() {
    const [filters, setFilters] = useState<FilterState>({
        date_from: '',
        date_to: '',
        interval: 'week',
        offer_type: [],
        moderation_status: [],
        type_id: [],
        location_id: [],
        agent_id: [],
    });

    function buildHref(basePath: string, input: {
        date_from?: string; date_to?: string;
        offer_type?: (string | number)[]; moderation_status?: (string | number)[];
        type_id?: (string | number)[]; location_id?: (string | number)[];
        created_by?: (string | number)[];
    }) {
        const qs = new URLSearchParams();
        if (input.date_from) qs.set('date_from', input.date_from);
        if (input.date_to) qs.set('date_to', input.date_to);
        input.offer_type?.forEach(v => qs.append('offer_type', String(v)));
        input.moderation_status?.forEach(v => qs.append('moderation_status', String(v)));
        input.type_id?.forEach(v => qs.append('type_id', String(v)));
        input.location_id?.forEach(v => qs.append('location_id', String(v)));
        input.created_by?.forEach(v => qs.append('created_by', String(v)));
        const q = qs.toString();
        return q ? `${basePath}?${q}` : basePath;
    }

    const [priceMetric, setPriceMetric] = useState<PriceMetric>('sum');

    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<SummaryResponse | null>(null);
    const [series, setSeries] = useState<TimeSeriesRow[]>([]);
    // const [buckets, setBuckets] = useState<PriceBucketsResponse | null>(null);
    const [rooms, setRooms] = useState<RoomsRow[]>([]);
    const [managers, setManagers] = useState<ManagerEfficiencyRow[]>([]);
    const [leaders, setLeaders] = useState<AgentsLeaderboardRow[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [missingAgents, setMissingAgents] = useState<MissingPhoneAgentRow[]>([]);

    // Формируем query строго типизированно
    const query = useMemo<Partial<ReportsQuery>>(() => {
        const q: Partial<ReportsQuery> = {
            date_from: filters.date_from || undefined,
            date_to: filters.date_to || undefined,
            interval: filters.interval,
            price_metric: priceMetric, // отправляем выбранную метрику
        };
        if (filters.offer_type.length) q.offer_type = filters.offer_type;
        if (filters.moderation_status.length) q.moderation_status = filters.moderation_status;
        if (filters.type_id.length) q.type_id = filters.type_id;
        if (filters.location_id.length) q.location_id = filters.location_id;
        if (filters.agent_id.length) q.agent_id = filters.agent_id;
        return q;
    }, [filters, priceMetric]);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const [s, ts, rh, me, lb, mp] = await Promise.all([
                reportsApi.summary(query),
                reportsApi.timeSeries(query),
                reportsApi.roomsHist(query),
                reportsApi.managerEfficiency({ ...query, group_by: 'created_by' }),
                reportsApi.agentsLeaderboard({ ...query, limit: 10 }),
                reportsApi.missingPhoneAgentsByStatus(query), // ⬅️ NEW
            ]);
            setSummary(s);
            setSeries(ts);
            setRooms(rh);
            setManagers(me);
            setLeaders(lb);
            setMissingAgents(mp); // ⬅️ NEW
        } catch (e) {
            const message =
                e instanceof Error
                    ? e.message
                    : typeof e === 'object' && e !== null && 'message' in e
                        ? String((e as { message: unknown }).message)
                        : 'Ошибка загрузки';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Преобразования данных для графиков
    const statusData = useMemo(
        () =>
            (summary?.by_status ?? []).map((r) => ({
                label: statusLabel(r.moderation_status ?? ''),
                value: Number(r.cnt || 0),
            })),
        [summary]
    );

    const offerData = useMemo(
        () =>
            (summary?.by_offer_type ?? []).map((r) => ({
                label: offerLabel(r.offer_type),
                value: Number(r.cnt || 0),
            })),
        [summary]
    );

    const seriesData = useMemo(
        () => series.map((r) => ({x: r.bucket, total: r.total, closed: r.closed})),
        [series]
    );

    // Вернули корзины цен — теперь переменная buckets используется
    // const bucketData = useMemo(
    //     () => (buckets?.buckets ?? []).map((b) => ({ label: `${b.from}–${b.to}`, value: b.count })),
    //     [buckets]
    // );

    const roomsData = useMemo(
        () => rooms.map((r) => ({label: String(r.rooms), value: r.cnt})),
        [rooms]
    );

    const resetFilters = () => {
        setFilters({
            date_from: '',
            date_to: '',
            interval: 'week',
            offer_type: [],
            moderation_status: [],
            type_id: [],
            location_id: [],
            agent_id: [],
        });
        setPriceMetric('sum');
    };

    const summaryPriceValue = useMemo(() => {
        if (!summary) return null;
        const s = summary as SummaryUnion;
        return priceMetric === 'sum' ? s.sum_price ?? null : s.avg_price ?? null;
    }, [summary, priceMetric]);

    const summaryAreaValue = useMemo(() => {
        if (!summary) return null;
        const s = summary as SummaryUnion;
        return priceMetric === 'sum' ? s.sum_total_area ?? null : s.avg_total_area ?? null;
    }, [summary, priceMetric]);

    const handleIntervalChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as FilterState['interval'];
        setFilters((s) => ({...s, interval: value}));
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

                <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Переключатель метрики цены */}
                    <div className="flex flex-col gap-2">
                        <span className="block mb-2 text-sm text-[#666F8D]">Метрика цены</span>
                        <div className="flex items-center gap-4">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="price_metric"
                                    value="sum"
                                    checked={priceMetric === 'sum'}
                                    onChange={() => setPriceMetric('sum')}
                                />
                                <span>Сумма</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="price_metric"
                                    value="avg"
                                    checked={priceMetric === 'avg'}
                                    onChange={() => setPriceMetric('avg')}
                                />
                                <span>Средняя</span>
                            </label>
                        </div>
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

            {/* Карточки сводки */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl shadow">
                    <div className="text-sm text-gray-500">Всего объектов</div>
                    <div className="text-2xl font-semibold">{summary?.total ?? '—'}</div>
                </div>

                <div className="p-4 bg-white rounded-2xl shadow">
                    <div className="text-sm text-gray-500">
                        {priceMetric === 'sum' ? 'Сумма цен' : 'Средняя цена'}
                    </div>
                    <div className="text-2xl font-semibold">
                        {summaryPriceValue !== null && summaryPriceValue !== undefined
                            ? Number(summaryPriceValue).toLocaleString()
                            : '—'}
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl shadow">
                    <div className="text-sm text-gray-500">
                        {priceMetric === 'sum' ? 'Суммарная площадь' : 'Средняя площадь'}
                    </div>
                    <div className="text-2xl font-semibold">
                        {summaryAreaValue !== null && summaryAreaValue !== undefined
                            ? priceMetric === 'sum'
                                ? Number(summaryAreaValue).toLocaleString()
                                : Number(summaryAreaValue).toFixed(2)
                            : '—'}
                    </div>
                </div>

                <div className="p-4 bg-white rounded-2xl shadow">
                    <div className="text-sm text-gray-500">Продажа/Аренда</div>
                    <div className="text-2xl font-semibold">
                        {(summary?.by_offer_type ?? [])
                            .map((x) => `${offerLabel(x.offer_type)}: ${Number(x.cnt || 0).toLocaleString()}`)
                            .join('  ') || '—'}
                    </div>
                </div>
            </div>

            {/* Графики */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieStatus data={statusData}/>
                <BarOffer data={offerData}/>
                <LineTimeSeries data={seriesData}/>
                {/*<BarBuckets data={bucketData} />*/}
                <BarRooms data={roomsData}/>
            </div>

            {/* Таблицы: эффективность и лидерборд */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
                    <h3 className="font-semibold mb-3">Эффективность агентов</h3>
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="text-left text-gray-500">
                            <th className="py-2 pr-4">Агент</th>
                            <th className="py-2 pr-4">Всего</th>
                            <th className="py-2 pr-4">Одобрено</th>
                            <th className="py-2 pr-4">Продано</th>
                            <th className="py-2 pr-4">Продано %</th>
                            <th className="py-2 pr-4">{priceMetric === 'sum' ? 'Сумма' : 'Ср. цена'}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {managers.map((m, i) => {
                            const metricValue =
                                priceMetric === 'sum'
                                    ? (m as WithMetrics).sum_price
                                    : (m as WithMetrics).avg_price;
                            return (
                                <tr key={i} className="border-t">
                                    <td className="py-2 pr-4">{m.name}</td>
                                    <td className="py-2 pr-4">{m.total}</td>
                                    <td className="py-2 pr-4">{m.approved}</td>
                                    <td className="py-2 pr-4">{m.closed}</td>
                                    <td className="py-2 pr-4">{m.close_rate}%</td>
                                    <td className="py-2 pr-4">{Number(metricValue ?? 0).toLocaleString()}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
                    <h3 className="font-semibold mb-3">Топ агентов</h3>
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="text-left text-gray-500">
                            <th className="py-2 pr-4">Агент</th>
                            <th className="py-2 pr-4">Продано</th>
                            <th className="py-2 pr-4">Арендовано</th>
                            <th className="py-2 pr-4">Продано владельцем</th>
                            <th className="py-2 pr-4">Всего</th>
                            <th className="py-2 pr-4">{priceMetric === 'sum' ? 'Сумма' : 'Ср. цена'}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leaders.map((r, i) => {
                            const metricValue =
                                priceMetric === 'sum'
                                    ? (r as WithMetrics).sum_price
                                    : (r as WithMetrics).avg_price;
                            // поля приходят из API: sold_count, rented_count, sold_by_owner_count
                            return (
                                <tr key={i} className="border-t">
                                    <td className="py-2 pr-4">{r.agent_name}</td>
                                    <td className="py-2 pr-4">{Number(r.sold_count ?? 0).toLocaleString()}</td>
                                    <td className="py-2 pr-4">{Number(r.rented_count ?? 0).toLocaleString()}</td>
                                    <td className="py-2 pr-4">{Number(r.sold_by_owner_count ?? 0).toLocaleString()}</td>
                                    <td className="py-2 pr-4">{Number(r.total ?? 0).toLocaleString()}</td>
                                    <td className="py-2 pr-4">{Number(metricValue ?? 0).toLocaleString()}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Таблица: Без телефона по агентам и статусам */}
            <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Без телефона — по агентам и статусам</h3>
                    {/* Общая ссылка на список (без конкретного агента/статуса, но с активными фильтрами) */}
                    <Link
                        href={buildHref('/profile/reports/missing-phone', {
                            date_from: filters.date_from || undefined,
                            date_to: filters.date_to || undefined,
                            offer_type: filters.offer_type,
                            moderation_status: filters.moderation_status,
                            type_id: filters.type_id,
                            location_id: filters.location_id,
                            created_by: filters.agent_id,
                        })}
                        className="text-[#0036A5] hover:underline"
                    >
                        Открыть список
                    </Link>
                </div>

                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500">
                        <th className="py-2 pr-4">Агент</th>
                        <th className="py-2 pr-4">Статус</th>
                        <th className="py-2 pr-4">Без телефона</th>
                        <th className="py-2 pr-4">Всего (в статусе)</th>
                        <th className="py-2 pr-4">Доля, %</th>
                        <th className="py-2 pr-4"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {missingAgents.length === 0 ? (
                        <tr>
                            <td className="py-4 text-gray-500" colSpan={6}>
                                Нет данных по текущим фильтрам
                            </td>
                        </tr>
                    ) : (
                        missingAgents.map((r, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-2 pr-4">{r.agent_name}</td>
                                <td className="py-2 pr-4">{statusLabel(r.moderation_status ?? '')}</td>
                                <td className="py-2 pr-4">{r.missing_phone}</td>
                                <td className="py-2 pr-4">{r.bucket_total}</td>
                                <td className="py-2 pr-4">{r.missing_share_pct}</td>
                                <td className="py-2 pr-4">
                                    {/* Ссылка "Список" — проваливаемся в отдельную страницу с предзаполненными фильтрами */}
                                    <Link
                                        href={buildHref('/profile/reports/missing-phone', {
                                            date_from: filters.date_from || undefined,
                                            date_to: filters.date_to || undefined,
                                            offer_type: filters.offer_type,
                                            moderation_status: filters.moderation_status,
                                            type_id: filters.type_id,
                                            location_id: filters.location_id,
                                            created_by: filters.agent_id,
                                        })}
                                        className="text-[#0036A5] hover:underline"
                                    >
                                        Открыть список
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
                    {error}
                </div>
            )}
        </div>
    );
}