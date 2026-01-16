import { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import api from '../services/api';
import type { AnalyticsStats } from '../types';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [range, setRange] = useState('30days');

    useEffect(() => {
        // In real app, pass range to API
        api.get('/analytics/summary').then(res => setStats(res.data));
    }, [range]);

    if (!stats) return <div>Loading...</div>;

    const { charts, summary } = stats;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-brand-red outline-none"
                >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 3 Months</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm">Posts Created</p>
                    <p className="text-3xl font-bold text-brand-black">{summary.totalPosts}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm">Time Saved (Hours)</p>
                    <p className="text-3xl font-bold text-brand-red">{Math.round(summary.timeSavedMinutes / 60)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm">Avg Posts/Job</p>
                    <p className="text-3xl font-bold text-brand-black">3.0</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">Post Generation Trend</h3>
                    <div className="h-64">
                        <Line data={{
                            labels: charts.postsOverTime.map((d) => d.date),
                            datasets: [{
                                label: 'Posts',
                                data: charts.postsOverTime.map((d) => d.count),
                                borderColor: '#DC2626',
                                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                                fill: true,
                                tension: 0.4
                            }]
                        }} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">Platform Mix</h3>
                    <div className="h-64 flex justify-center">
                        <Pie data={{
                            labels: charts.byPlatform.map((d) => d.name),
                            datasets: [{
                                data: charts.byPlatform.map((d) => d.value),
                                backgroundColor: ['#DC2626', '#1F2937', '#0077B5'],
                                borderWidth: 0
                            }]
                        }} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
