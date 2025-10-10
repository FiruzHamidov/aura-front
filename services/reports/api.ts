import { axios, getAuthToken } from "@/utils/axios";

export type TimeSeriesRow = { bucket: string; total: number; closed: number };
export type PriceBucketRow = { bucket: number; from: number; to: number; count: number };
export type PriceBucketsResponse = { range: [number, number]; buckets: PriceBucketRow[] };
export type RoomsRow = { rooms: number; cnt: number };

export type SummaryResponse = {
    total: number;
    by_status: { moderation_status: string; cnt: number }[];
    by_offer_type: { offer_type: string; cnt: number }[];
    avg_price: number;
    avg_total_area: number;
    sum_price: number;        // NEW
    sum_total_area: number;   // NEW
};

export type ManagerEfficiencyRow = {
    id: number | null;
    name: string;
    email?: string | null;
    total: number;
    approved: number;
    closed: number;
    close_rate: number;
    avg_price?: number; // либо
    sum_price?: number; // одно из них придёт в зависимости от price_metric
    sum_total_area?: number;
};

export type AgentsLeaderboardRow = {
    agent_name: string;
    total: number;
    closed: number; // можно оставить для совместимости
    sold_count: number;
    rented_count: number;
    sold_by_owner_count: number;
    sum_price?: number;
    avg_price?: number;
};

export type ConversionFunnel = {
    draft: number;
    pending: number;
    approved: number;
    rejected: number;
    closed: number; // sold+rented
};

// Универсальные распределения (by-status/type/location)
export type DistRow = Record<string, any> & { cnt: number };

/** ---------- Параметры запросов ---------- */
export type ReportsQuery = {
    // даты
    date_from?: string; // 'YYYY-MM-DD'
    date_to?: string;   // 'YYYY-MM-DD'
    price_metric?: string;   // 'YYYY-MM-DD'
    date_field?: "created_at" | "updated_at";
    interval?: "day" | "week" | "month";

    // мультиселекты и фильтры
    type_id?: (string | number)[];
    status_id?: (string | number)[];
    location_id?: (string | number)[];
    repair_type_id?: (string | number)[];
    currency?: (string | number)[];
    offer_type?: (string | number)[];
    listing_type?: (string | number)[];
    contract_type_id?: (string | number)[];
    created_by?: (string | number)[];
    agent_id?: (string | number)[];
    moderation_status?: (string | number)[];
    district?: (string | number)[];

    // диапазоны
    priceFrom?: number | string;
    priceTo?: number | string;
    roomsFrom?: number | string;
    roomsTo?: number | string;
    total_areaFrom?: number | string;
    total_areaTo?: number | string;
    living_areaFrom?: number | string;
    living_areaTo?: number | string;
    floorFrom?: number | string;
    floorTo?: number | string;
    total_floorsFrom?: number | string;
    total_floorsTo?: number | string;
    year_builtFrom?: number | string;
    year_builtTo?: number | string;

    // спец-параметры отдельных эндпоинтов
    buckets?: number; // price-buckets
    limit?: number;   // agents-leaderboard
    group_by?: "agent_id" | "created_by"; // manager-efficiency
};

/** ---------- Вспомогалки ---------- */
function buildParams(q?: ReportsQuery) {
    const params: Record<string, any> = {};
    if (!q) return params;

    const set = (k: string, v: any) => {
        if (v === undefined || v === null || v === "") return;
        if (Array.isArray(v)) params[k] = v.join(",");
        else params[k] = v;
    };

    Object.entries(q).forEach(([k, v]) => set(k, v));
    return params;
}

function authHeaders() {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

/** ---------- Константы эндпоинтов ---------- */
/* ВНИМАНИЕ: baseURL уже содержит /api в твоём axios, поэтому тут без /api в начале */
const REPORTS = {
    SUMMARY: "/reports/properties/summary",
    MANAGER_EFF: "/reports/properties/manager-efficiency",
    BY_STATUS: "/reports/properties/by-status",
    BY_TYPE: "/reports/properties/by-type",
    BY_LOCATION: "/reports/properties/by-location",
    TIME_SERIES: "/reports/properties/time-series",
    PRICE_BUCKETS: "/reports/properties/price-buckets",
    ROOMS_HIST: "/reports/properties/rooms-hist",
    AGENTS_LEADERBOARD: "/reports/properties/agents-leaderboard",
    CONVERSION: "/reports/properties/conversion",
} as const;

/** ---------- Методы API (с явным токеном в headers) ---------- */
export const reportsApi = {
    summary: async (query?: ReportsQuery): Promise<SummaryResponse> => {
        const { data } = await axios.get<SummaryResponse>(REPORTS.SUMMARY, {
            params: buildParams(query),
            headers: authHeaders(),
        });
        return data;
    },

    managerEfficiency: async (query?: ReportsQuery): Promise<ManagerEfficiencyRow[]> => {
        const { data } = await axios.get<ManagerEfficiencyRow[]>(REPORTS.MANAGER_EFF, {
            params: buildParams(query),
            headers: authHeaders(),
        });
        return data;
    },

    byStatus: async (query?: ReportsQuery): Promise<DistRow[]> => {
        const { data } = await axios.get<DistRow[]>(REPORTS.BY_STATUS, {
            params: buildParams(query),
            headers: authHeaders(),
        });
        return data;
    },

    byType: async (query?: ReportsQuery): Promise<DistRow[]> => {
        const { data } = await axios.get<DistRow[]>(REPORTS.BY_TYPE, {
            params: buildParams(query),
            headers: authHeaders(),
        });
        return data;
    },

    byLocation: async (query?: ReportsQuery): Promise<DistRow[]> => {
        const { data } = await axios.get<DistRow[]>(REPORTS.BY_LOCATION, {
            params: buildParams(query),
            headers: authHeaders(),
        });
        return data;
    },

    timeSeries: async (query?: ReportsQuery): Promise<TimeSeriesRow[]> => {
        const { data } = await axios.get<TimeSeriesRow[]>(REPORTS.TIME_SERIES, {
            params: buildParams(query),
            headers: authHeaders(),
        });
        return data;
    },

    priceBuckets: async (query?: ReportsQuery): Promise<PriceBucketsResponse> => {
        const { data } = await axios.get<PriceBucketsResponse>(REPORTS.PRICE_BUCKETS, {
            params: buildParams(query),
            headers: authHeaders(),
        });
        return data;
    },

    roomsHist: async (query?: ReportsQuery): Promise<RoomsRow[]> => {
        const { data } = await axios.get<RoomsRow[]>(REPORTS.ROOMS_HIST, {
            params: buildParams(query),
            headers: authHeaders(),
        });
        return data;
    },

    agentsLeaderboard: async (query?: ReportsQuery): Promise<AgentsLeaderboardRow[]> => {
        const { data } = await axios.get<AgentsLeaderboardRow[]>(REPORTS.AGENTS_LEADERBOARD, {
            params: buildParams(query),
            headers: authHeaders(),
        });
        return data;
    },

    conversion: async (query?: ReportsQuery): Promise<ConversionFunnel> => {
        const { data } = await axios.get<ConversionFunnel>(REPORTS.CONVERSION, {
            params: buildParams(query),
            headers: authHeaders(),
        });
        return data;
    },
};