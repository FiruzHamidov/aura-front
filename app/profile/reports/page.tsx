'use client';

import {ChangeEvent, useEffect, useMemo, useState, useCallback} from 'react';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {
    AgentsLeaderboardRow,
    ManagerEfficiencyRow,
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

type WithMetrics = { sum_price?: number; avg_price?: number };
type SummaryUnion = SummaryResponse & { sum_price?: number; sum_total_area?: number };

const STATUS_OPTIONS = [
    {label: 'Черновик', value: 'draft'},
    {label: 'Ожидание', value: 'pending'},
    {label: 'Одобрено/Опубликовано', value: 'approved'},
    {label: 'Отклонено', value: 'rejected'},
    {label: 'Продано агентом', value: 'sold'},
    {label: 'Продано владельцем', value: 'sold_by_owner'},
    {label: 'Арендовано', value: 'rented'},
    {label: 'Удалено', value: 'deleted'},
    {label: 'Отказано клиентом', value: 'denied'},
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

// Booking agent row (already present in api types)
type BookingAgentRow = {
    agent_id: number;
    agent_name: string;
    shows_count: number;
    total_minutes: number;
    unique_clients: number;
    unique_properties: number;
    first_show: string | null;
    last_show: string | null;
};

// Agent properties report types (matches backend)
type AgentPropertiesReport = {
    agent_id: number;
    agent_name: string;
    summary: {
        total_properties: number;
        total_shows: number;
        by_status: Record<string, number>;
        contracts: Record<string, number>;
    };
    properties: {
        id: number;
        title: string;
        price: number | null;
        currency: string | null;
        moderation_status: string | null;
        shows_count: number;
        first_show: string | null;
        last_show: string | null;
    }[];
};

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

    // --- URL sync for filters (serialize <-> query params) ---
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const serializeFilters = (f: FilterState) => {
        const p = new URLSearchParams();
        if (f.date_from) p.set('date_from', f.date_from);
        if (f.date_to) p.set('date_to', f.date_to);
        if (f.interval) p.set('interval', f.interval);
        if (f.offer_type && f.offer_type.length) p.set('offer_type', f.offer_type.join(','));
        if (f.moderation_status && f.moderation_status.length) p.set('moderation_status', f.moderation_status.join(','));
        if (f.type_id && f.type_id.length) p.set('type_id', f.type_id.join(','));
        if (f.location_id && f.location_id.length) p.set('location_id', f.location_id.join(','));
        if (f.agent_id && f.agent_id.length) p.set('agent_id', f.agent_id.join(','));
        return p;
    };

    const parseArray = (v: string | null | undefined) => (v ? v.split(',').map((x) => x) : []);
    // when query params change we want to auto-run the `load()` after filters are restored
    const [pendingLoadFromUrl, setPendingLoadFromUrl] = useState(false);

    // initialize filters from query params on mount
    useEffect(() => {
        if (!searchParams) return;
        const df = searchParams.get('date_from') ?? '';
        const dt = searchParams.get('date_to') ?? '';
        const interval = (searchParams.get('interval') as FilterState['interval']) ?? 'week';
        const offer_type = parseArray(searchParams.get('offer_type'));
        const moderation_status = parseArray(searchParams.get('moderation_status'));
        const type_id = parseArray(searchParams.get('type_id'));
        const location_id = parseArray(searchParams.get('location_id'));
        const agent_id = parseArray(searchParams.get('agent_id'));

        setFilters((s) => ({
            ...s,
            date_from: df,
            date_to: dt,
            interval,
            offer_type,
            moderation_status,
            type_id,
            location_id,
            agent_id,
        }));
        setPendingLoadFromUrl(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // when filters were restored from URL we want to run the load() once
    useEffect(() => {
        if (!pendingLoadFromUrl) return;
        // call load() after filters state has been updated
        load();
        setPendingLoadFromUrl(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, pendingLoadFromUrl]);

    // push filters into the URL whenever they change (replace to avoid history spam)
    useEffect(() => {
        const p = serializeFilters(filters);
        const qs = p.toString();
        const url = qs ? `${pathname}?${qs}` : pathname;
        // replace so user can go back cleanly
        router.replace(url);
    }, [filters, pathname, router]);

    const [priceMetric, setPriceMetric] = useState<PriceMetric>('sum');

    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<SummaryResponse | null>(null);
    const [series, setSeries] = useState<TimeSeriesRow[]>([]);
    const [rooms, setRooms] = useState<RoomsRow[]>([]);
    const [managers, setManagers] = useState<ManagerEfficiencyRow[]>([]);
    const [leaders, setLeaders] = useState<AgentsLeaderboardRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [bookingsReport, setBookingsReport] = useState<BookingAgentRow[]>([]);

    // single-agent detailed report
    const [agentPropertiesReport, setAgentPropertiesReport] = useState<AgentPropertiesReport | null>(null);
    // aggregated list for all agents (backend returns array when no agent param)
    const [agentsPropertiesList, setAgentsPropertiesList] = useState<AgentPropertiesReport[] | null>(null);

    // build typed query
    const query = useMemo<Partial<ReportsQuery>>(() => {
        const q: Partial<ReportsQuery> = {
            date_from: filters.date_from || undefined,
            date_to: filters.date_to || undefined,
            interval: filters.interval,
            price_metric: priceMetric,
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
            // main reports
            const [s, ts, rh, me, lb] = await Promise.all([
                reportsApi.summary(query),
                reportsApi.timeSeries(query),
                reportsApi.roomsHist(query),
                reportsApi.managerEfficiency({...query, group_by: 'created_by'}),
                reportsApi.agentsLeaderboard({...query, limit: 10}),
                reportsApi.missingPhoneAgentsByStatus(query),
            ]);

            setSummary(s);
            setSeries(ts);
            setRooms(rh);
            setManagers(me);
            setLeaders(lb);

            // bookings agents
            try {
                const bookings = await reportsApi.bookingsAgentsReport(query);
                setBookingsReport(bookings);
            } catch (e) {
                console.warn('bookingsAgentsReport failed', e);
                setBookingsReport([]);
            }

            // agent properties: if exactly one agent selected -> single report, otherwise fetch list for all agents
            if (filters.agent_id.length === 1) {
                try {
                    const agentId = filters.agent_id[0];
                    const apr = await reportsApi.agentPropertiesReport({
                        agent: String(agentId),
                        date_from: filters.date_from || undefined,
                        date_to: filters.date_to || undefined,
                    });
                    setAgentPropertiesReport(apr as AgentPropertiesReport);
                    setAgentsPropertiesList(null);
                } catch (e) {
                    console.warn('agentPropertiesReport(single) failed', e);
                    setAgentPropertiesReport(null);
                    setAgentsPropertiesList(null);
                }
            } else {
                // fetch aggregated list for all agents
                try {
                    const list = await reportsApi.agentPropertiesReport({
                        date_from: filters.date_from || undefined,
                        date_to: filters.date_to || undefined,
                    }) as AgentPropertiesReport[];
                    setAgentsPropertiesList(list);
                    setAgentPropertiesReport(null);
                } catch (e) {
                    console.warn('agentPropertiesReport(list) failed', e);
                    setAgentsPropertiesList(null);
                    setAgentPropertiesReport(null);
                }
            }
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

    // transforms for charts (same as before)
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
        // clear query string
        router.replace(pathname);
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

            {/* Сводные карточки */}
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
                <PieStatus data={statusData} dateFrom={filters.date_from} dateTo={filters.date_to}/>
                <BarOffer data={offerData} dateFrom={filters.date_from} dateTo={filters.date_to}/>
                <LineTimeSeries data={seriesData}/>
                <BarRooms data={roomsData} dateFrom={filters.date_from} dateTo={filters.date_to}/>
            </div>

            {/* Эффективность / Топ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* managers table */}
                <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
                    <h3 className="font-semibold mb-3">Эффективность агентов</h3>
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="text-left text-gray-500">
                            <th className="py-2 pr-4">Агент</th>
                            <th className="py-2 pr-4">Всего</th>
                            <th className="py-2 pr-4">Одобрено</th>
                            <th className="py-2 pr-4">Арендовано</th>
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
                                    <td className="py-2 pr-4"><Link
                                        href={`/profile/reports/objects/?agent_id=${m.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{m.name}</Link></td>
                                    <td className="py-2 pr-4"><Link
                                        href={`/profile/reports/objects/?agent_id=${m.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{m.total}</Link></td>
                                    <td className="py-2 pr-4"><Link
                                        href={`/profile/reports/objects/?agent_id=${m.agent_id}&moderation_status=approved&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{m.approved}</Link>
                                    </td>
                                    <td className="py-2 pr-4"><Link
                                        href={`/profile/reports/objects/?agent_id=${m.agent_id}&moderation_status=rented&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{m.rented}</Link>
                                    </td>
                                    <td className="py-2 pr-4"><Link
                                        href={`/profile/reports/objects/?agent_id=${m.agent_id}&moderation_status=sold&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{m.sold}</Link>
                                    </td>
                                    <td className="py-2 pr-4">{m.close_rate}%</td>
                                    <td className="py-2 pr-4">{Number(metricValue ?? 0).toLocaleString()}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* leaders table */}
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
                            return (
                                <tr key={i} className="border-t">
                                    <td className="py-2 pr-4"><Link
                                        href={`/profile/reports/objects/?agent_id=${r.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{r.agent_name}</Link>
                                    </td>
                                    <td className="py-2 pr-4"><Link
                                        href={`/profile/reports/objects/?agent_id=${r.agent_id}&offer_type=sale&moderation_status=sold&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{Number(r.sold_count ?? 0).toLocaleString()}</Link>
                                    </td>
                                    <td className="py-2 pr-4"><Link
                                        href={`/profile/reports/objects/?agent_id=${r.agent_id}&offer_type=rent&moderation_status=rented&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{Number(r.rented_count ?? 0).toLocaleString()}</Link>
                                    </td>
                                    <td className="py-2 pr-4"><Link
                                        href={`/profile/reports/objects/?agent_id=${r.agent_id}&moderation_status=sold_by_owner&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{Number(r.sold_by_owner_count ?? 0).toLocaleString()}</Link>
                                    </td>
                                    <td className="py-2 pr-4">{Number(r.total ?? 0).toLocaleString()}</td>
                                    <td className="py-2 pr-4">{Number(metricValue ?? 0).toLocaleString()}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bookings agents report */}
            <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Показы — по агентам</h3>
                    <div
                        className="text-sm text-gray-500">Период: {filters.date_from || '—'} — {filters.date_to || '—'}</div>
                </div>

                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-500">
                        <th className="py-2 pr-4">Агент</th>
                        <th className="py-2 pr-4">Показов</th>
                        <th className="py-2 pr-4">Мин. всего</th>
                        <th className="py-2 pr-4">Уник. клиенты</th>
                        <th className="py-2 pr-4">Уник. объекты</th>
                        <th className="py-2 pr-4">Первый показ</th>
                        <th className="py-2 pr-4">Последний показ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookingsReport.length === 0 ? (
                        <tr>
                            <td className="py-4 text-gray-500" colSpan={7}>
                                Нет данных по текущим фильтрам
                            </td>
                        </tr>
                    ) : (
                        bookingsReport.map((r, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-2 pr-4"><Link
                                    href={`/profile/reports/bookings?agent_id=${r.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{r.agent_name}</Link></td>
                                <td className="py-2 pr-4"><Link
                                    href={`/profile/reports/bookings?agent_id=${r.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{r.shows_count}</Link></td>
                                <td className="py-2 pr-4"><Link
                                    href={`/profile/reports/bookings?agent_id=${r.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{r.total_minutes}</Link></td>
                                <td className="py-2 pr-4"><Link
                                    href={`/profile/reports/bookings?agent_id=${r.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{r.unique_clients}</Link></td>
                                <td className="py-2 pr-4"><Link
                                    href={`/profile/reports/bookings?agent_id=${r.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{r.unique_properties}</Link></td>
                                <td className="py-2 pr-4"><Link
                                    href={`/profile/reports/bookings?agent_id=${r.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{r.first_show ?? '—'}</Link></td>
                                <td className="py-2 pr-4"><Link
                                    href={`/profile/reports/bookings?agent_id=${r.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{r.last_show ?? '—'}</Link></td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Agent properties report: single-agent or list */}
            {agentPropertiesReport ? (
                <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Отчёт по агенту: {agentPropertiesReport.agent_name}</h3>
                        <div
                            className="text-sm text-gray-500">Период: {filters.date_from || '—'} — {filters.date_to || '—'}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded">
                            <div className="text-sm text-gray-500">Всего объектов</div>
                            <div
                                className="text-lg font-semibold">{agentPropertiesReport.summary.total_properties}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <div className="text-sm text-gray-500">Всего показов</div>
                            <div className="text-lg font-semibold">{agentPropertiesReport.summary.total_shows}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <div className="text-sm text-gray-500">По статусам</div>
                            <div className="text-sm">
                                {Object.entries(agentPropertiesReport.summary.by_status).map(([k, v]) => (
                                    <div key={k} className="flex justify-between">
                                        <span className="text-gray-600">{statusLabel(k)}</span>
                                        <span className="font-medium">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                        {agentPropertiesReport.properties.length === 0 ? (
                            <tr>
                                <td className="py-4 text-gray-500" colSpan={6}>Нет объектов</td>
                            </tr>
                        ) : (
                            agentPropertiesReport.properties.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="py-2 pr-4">{p.title}</td>
                                    <td className="py-2 pr-4">{p.price ? `${p.price} ${p.currency ?? ''}` : '—'}</td>
                                    <td className="py-2 pr-4">{statusLabel(p.moderation_status ?? '')}</td>
                                    <td className="py-2 pr-4">{p.shows_count}</td>
                                    <td className="py-2 pr-4">{p.first_show ?? '—'}</td>
                                    <td className="py-2 pr-4">{p.last_show ?? '—'}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            ) : agentsPropertiesList && agentsPropertiesList.length > 0 ? (
                <div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Отчёты по агентам (агрегированно)</h3>
                        <div
                            className="text-sm text-gray-500">Период: {filters.date_from || '—'} — {filters.date_to || '—'}</div>
                    </div>

                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="text-left text-gray-500">
                            <th className="py-2 pr-4">Агент</th>
                            <th className="py-2 pr-4">Всего объектов</th>
                            <th className="py-2 pr-4">Всего показов</th>
                            <th className="py-2 pr-4">По статусам (кратко)</th>
                            <th className="py-2 pr-4">По контрактам</th>
                        </tr>
                        </thead>
                        <tbody>
                        {agentsPropertiesList.map((a) => (
                            <tr key={a.agent_id} className="border-t">
                                <td className="py-2 pr-4"><Link
                                    href={`/profile/reports/objects?agent_id=${a.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{a.agent_name}</Link>
                                </td>
                                <td className="py-2 pr-4"><Link
                                    href={`/profile/reports/objects?agent_id=${a.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{a.summary.total_properties}</Link>
                                </td>

                                <td className="py-2 pr-4">
                                    <Link
                                        href={`/profile/reports/bookings?agent_id=${a.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}>{a.summary.total_shows}</Link></td>
                                <td className="py-2 pr-4">
                                    {Object.entries(a.summary.by_status).map(([k, v]) => (
                                        <Link
                                            key={a.agent_id + k}
                                            href={`/profile/reports/objects?moderation_status=${encodeURIComponent(k)}&agent_id=${a.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}
                                        >
                                            <div className="text-sm flex gap-2">
                                                <span className="text-gray-600">{statusLabel(k)}:</span>
                                                <span className="font-medium">{v}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </td>

                                {/* contracts — a.summary.contracts is an array of {id, name, count} */}
                                <td className="py-2 pr-4">
                                    {Array.isArray(a.summary.contracts) && a.summary.contracts.length > 0 ? (
                                        a.summary.contracts.map((c) => (
                                            <Link
                                                key={`${a.agent_id}-contract-${c.id}`}
                                                href={`/profile/reports/objects?contract_type_id=${c.id}&agent_id=${a.agent_id}&date_from=${filters.date_from}&date_to=${filters.date_to}`}
                                            >
                                                <div className="text-sm flex gap-2">
                                                    <span className="text-gray-600">{c.name}:</span>
                                                    <span className="font-medium">{c.count}</span>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-sm text-gray-500">—</div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : null}

            {/*/!* Missing phones table (unchanged) *!/*/}
            {/*<div className="p-4 bg-white rounded-2xl shadow overflow-x-auto">*/}
            {/*    <div className="flex items-center justify-between mb-3">*/}
            {/*        <h3 className="font-semibold">Без телефона — по агентам и статусам</h3>*/}
            {/*        <Link*/}
            {/*            href={buildHref('/profile/reports/missing-phone', {*/}
            {/*                date_from: filters.date_from || undefined,*/}
            {/*                date_to: filters.date_to || undefined,*/}
            {/*                offer_type: filters.offer_type,*/}
            {/*                moderation_status: filters.moderation_status,*/}
            {/*                type_id: filters.type_id,*/}
            {/*                location_id: filters.location_id,*/}
            {/*                created_by: filters.agent_id,*/}
            {/*            })}*/}
            {/*            className="text-[#0036A5] hover:underline"*/}
            {/*        >*/}
            {/*            Открыть список*/}
            {/*        </Link>*/}
            {/*    </div>*/}

            {/*    <table className="min-w-full text-sm">*/}
            {/*        <thead>*/}
            {/*        <tr className="text-left text-gray-500">*/}
            {/*            <th className="py-2 pr-4">Агент</th>*/}
            {/*            <th className="py-2 pr-4">Статус</th>*/}
            {/*            <th className="py-2 pr-4">Без телефона</th>*/}
            {/*            <th className="py-2 pr-4">Всего (в статусе)</th>*/}
            {/*            <th className="py-2 pr-4">Доля, %</th>*/}
            {/*            <th className="py-2 pr-4"></th>*/}
            {/*        </tr>*/}
            {/*        </thead>*/}
            {/*        <tbody>*/}
            {/*        {missingAgents.length === 0 ? (*/}
            {/*            <tr>*/}
            {/*                <td className="py-4 text-gray-500" colSpan={6}>*/}
            {/*                    Нет данных по текущим фильтрам*/}
            {/*                </td>*/}
            {/*            </tr>*/}
            {/*        ) : (*/}
            {/*            missingAgents.map((r, i) => (*/}
            {/*                <tr key={i} className="border-t">*/}
            {/*                    <td className="py-2 pr-4">{r.agent_name}</td>*/}
            {/*                    <td className="py-2 pr-4">{statusLabel(r.moderation_status ?? '')}</td>*/}
            {/*                    <td className="py-2 pr-4">{r.missing_phone}</td>*/}
            {/*                    <td className="py-2 pr-4">{r.bucket_total}</td>*/}
            {/*                    <td className="py-2 pr-4">{r.missing_share_pct}</td>*/}
            {/*                    <td className="py-2 pr-4">*/}
            {/*                        <Link*/}
            {/*                            href={buildHref('/profile/reports/missing-phone', {*/}
            {/*                                date_from: filters.date_from || undefined,*/}
            {/*                                date_to: filters.date_to || undefined,*/}
            {/*                                offer_type: filters.offer_type,*/}
            {/*                                moderation_status: filters.moderation_status,*/}
            {/*                                type_id: filters.type_id,*/}
            {/*                                location_id: filters.location_id,*/}
            {/*                                created_by: filters.agent_id,*/}
            {/*                            })}*/}
            {/*                            className="text-[#0036A5] hover:underline"*/}
            {/*                        >*/}
            {/*                            Открыть список*/}
            {/*                        </Link>*/}
            {/*                    </td>*/}
            {/*                </tr>*/}
            {/*            ))*/}
            {/*        )}*/}
            {/*        </tbody>*/}
            {/*    </table>*/}
            {/*</div>*/}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
                    {error}
                </div>
            )}
        </div>
    );
}