'use client';

import {
    Chart as ChartJS,
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, PointElement, LineElement, BarElement,
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, PointElement, LineElement, BarElement
);

// Палитра цветов
const COLORS = [
    '#0036A5', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#E91E63', '#8BC34A', '#00BCD4',
];

export function PieStatus({ data }: { data: { label: string; value: number }[] }) {
    return (
        <div className="p-4 bg-white rounded-2xl shadow">
            <h3 className="font-semibold mb-3">Распределение по статусам</h3>
            <Pie
                data={{
                    labels: data.map(d => d.label),
                    datasets: [{
                        data: data.map(d => d.value),
                        backgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
                        borderColor: '#fff',
                        borderWidth: 2,
                    }],
                }}
            />
        </div>
    );
}

export function BarOffer({ data }: { data: { label: string; value: number }[] }) {
    return (
        <div className="p-4 bg-white rounded-2xl shadow">
            <h3 className="font-semibold mb-3">Тип объявления</h3>
            <Bar
                data={{
                    labels: data.map(d => d.label),
                    datasets: [{
                        label: 'Количество',
                        data: data.map(d => d.value),
                        backgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
                    }],
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
        </div>
    );
}

export function LineTimeSeries({ data }: { data: { x: string; total: number; closed: number }[] }) {
    return (
        <div className="p-4 bg-white rounded-2xl shadow">
            <h3 className="font-semibold mb-3">Динамика (всего/продано)</h3>
            <Line
                data={{
                    labels: data.map(d => d.x),
                    datasets: [
                        {
                            label: 'Всего',
                            data: data.map(d => d.total),
                            borderColor: COLORS[0],
                            backgroundColor: COLORS[0] + '33',
                            tension: 0.3,
                            fill: true,
                        },
                        {
                            label: 'Продано',
                            data: data.map(d => d.closed),
                            borderColor: COLORS[1],
                            backgroundColor: COLORS[1] + '33',
                            tension: 0.3,
                            fill: true,
                        },
                    ],
                }}
                options={{ responsive: true }}
            />
        </div>
    );
}

// export function BarBuckets({ data }: { data: { label: string; value: number }[] }) {
//     return (
//         <div className="p-4 bg-white rounded-2xl shadow">
//             <h3 className="font-semibold mb-3">Распределение по ценовым корзинам</h3>
//             <Bar
//                 data={{
//                     labels: data.map(d => d.label),
//                     datasets: [{
//                         label: 'Объекты',
//                         data: data.map(d => d.value),
//                         backgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
//                     }],
//                 }}
//                 options={{ responsive: true, plugins: { legend: { display: false } } }}
//             />
//         </div>
//     );
// }

export function BarRooms({ data }: { data: { label: string; value: number }[] }) {
    return (
        <div className="p-4 bg-white rounded-2xl shadow">
            <h3 className="font-semibold mb-3">Количество комнат</h3>
            <Bar
                data={{
                    labels: data.map(d => d.label),
                    datasets: [{
                        label: 'Объекты',
                        data: data.map(d => d.value),
                        backgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
                    }],
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
        </div>
    );
}