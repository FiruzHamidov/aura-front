'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { reportsApi } from '@/services/reports/api';
import { Input } from '@/ui-components/Input';
import { Button } from '@/ui-components/Button';

type AgentPropertiesReport = {
    agent_id: number;
    agent_name: string;
    summary: {
        total_properties: number;
        total_shows: number;
        by_status: Record<string, number>;
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

const STATUS_LABELS: Record<string, string> = {
    draft: 'Черновик',
    pending: 'Ожидание',
    approved: 'Одобрено/Опубликовано',
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

    // read either created_by or agent param
    const createdBy = search.get('created_by') ?? search.get('agent') ?? '';
    const dateFromParam = search.get('date_from') ?? '';
    const dateToParam = search.get('date_to') ?? '';

    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<AgentPropertiesReport | null>(null);
    const [error, setError] = useState<string | null>(null);

    // local editable filters (so user can change and apply)
    const [dateFrom, setDateFrom] = useState<string>(dateFromParam);
    const [dateTo, setDateTo] = useState<string>(dateToParam);

    const load = async (agentId: string) => {
        if (!agentId) {
            setError('Не указан агент (created_by или agent в query).');
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
            });
            setReport(data as AgentPropertiesReport);
        } catch (e: unknown) {
            console.error('agentPropertiesReport error', e);
            let msg = 'Ошибка загрузки';
            if (e instanceof Error) {
                msg = e.message;
            } else if (typeof e === 'object' && e !== null && 'statusText' in e) {
                const val = (e as Record<string, unknown>)['statusText'];
                if (val !== undefined && val !== null) msg = String(val);
            }
            setError(String(msg));
            setReport(null);
        }
    };

    useEffect(() => {
        // when page opens read current query param
        load(createdBy);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createdBy]);

    const applyFilters = () => {
        // update URL with date_from/date_to but keep created_by
        const params = new URLSearchParams();
        if (createdBy) params.set('created_by', createdBy);
        if (dateFrom) params.set('date_from', dateFrom);
        if (dateTo) params.set('date_to', dateTo);
        router.push(`/profile/reports/agent?${params.toString()}`);
        // load will be triggered by effect because search params changed
    };

    const clearFilters = () => {
        setDateFrom('');
        setDateTo('');
        const params = new URLSearchParams();
        if (createdBy) params.set('created_by', createdBy);
        router.push(`/profile/reports/agent?${params.toString()}`);
    };

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

            <div className="bg-white rounded-2xl shadow p-4">
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

                    <div className="flex items-end gap-2">
                        <Button onClick={() => applyFilters()} loading={loading}>
                            Применить
                        </Button>
                        <Button variant="secondary" onClick={clearFilters}>
                            Сбросить
                        </Button>
                    </div>
                </div>
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
            )}
        </div>
    );
}