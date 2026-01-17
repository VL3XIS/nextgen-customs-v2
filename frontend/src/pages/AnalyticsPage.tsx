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
                <h1 className="text-3xl font-bold text-white font-rajdhani uppercase tracking-wide">Performance Analytics</h1>
                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="bg-black/40 border border-white/10 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-brand-red outline-none backdrop-blur-sm"
                >
                    <option value="7days" className="bg-gray-900">Last 7 Days</option>
                    <option value="30days" className="bg-gray-900">Last 30 Days</option>
                    <option value="90days" className="bg-gray-900">Last 3 Months</option>
                </select>
            </div>

            {/* Summary Cards */}
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group hover:border-brand-red/30 transition-all">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-red/5 rounded-full blur-xl -translate-y-10 translate-x-10"></div>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider relative z-10">Total Jobs</p>
                    <p className="text-4xl font-bold text-white mt-1 relative z-10 font-rajdhani">{summary.totalJobs}</p>
                </div>
                <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group hover:border-brand-red/30 transition-all">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-red/5 rounded-full blur-xl -translate-y-10 translate-x-10"></div>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider relative z-10">Posts Created</p>
                    <p className="text-4xl font-bold text-white mt-1 relative z-10 font-rajdhani">{summary.totalPosts}</p>
                </div>
                <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group hover:border-brand-red/30 transition-all">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-red/10 rounded-full blur-xl -translate-y-10 translate-x-10"></div>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider relative z-10">Time Saved (Hours)</p>
                    <p className="text-4xl font-bold text-brand-red mt-1 relative z-10 font-rajdhani drop-shadow-[0_0_8px_rgba(255,42,60,0.5)]">{Math.round(summary.timeSavedMinutes / 60)}</p>
                </div>
                <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group hover:border-brand-red/30 transition-all">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-red/5 rounded-full blur-xl -translate-y-10 translate-x-10"></div>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider relative z-10">Avg Posts/Job</p>
                    <p className="text-4xl font-bold text-white mt-1 relative z-10 font-rajdhani">3.0</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg">
                    <h3 className="text-lg font-bold mb-4 text-white font-rajdhani uppercase tracking-wide">Post Generation Trend</h3>
                    <div className="h-64">
                        <Line data={{
                            labels: charts.postsOverTime.map((d) => d.date),
                            datasets: [{
                                label: 'Posts',
                                data: charts.postsOverTime.map((d) => d.count),
                                borderColor: '#DC2626',
                                backgroundColor: 'rgba(220, 38, 38, 0.2)',
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: '#fff',
                                pointBorderColor: '#DC2626'
                            }]
                        }} options={{
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9CA3AF' } },
                                x: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
                            }
                        }} />
                    </div>
                </div>

                <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg">
                    <h3 className="text-lg font-bold mb-4 text-white font-rajdhani uppercase tracking-wide">Platform Mix</h3>
                    <div className="h-64 flex justify-center">
                        <Pie data={{
                            labels: charts.byPlatform.map((d) => d.name),
                            datasets: [{
                                data: charts.byPlatform.map((d) => d.value),
                                backgroundColor: ['#DC2626', '#111827', '#4B5563'],
                                borderWidth: 0
                            }]
                        }} options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'bottom', labels: { color: '#9CA3AF' } }
                            }
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
