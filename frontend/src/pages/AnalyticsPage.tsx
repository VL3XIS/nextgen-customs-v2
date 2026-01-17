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
                <h1 className="text-3xl font-bold text-white font-rajdhani uppercase tracking-wider">ANALYTICS</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-brand-red/20 to-brand-red/5 backdrop-blur-md rounded-xl border border-brand-red/30 p-6 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)'
                    }}></div>
                    <div className="relative z-10">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-3">TOTAL JOBS</p>
                        <p className="text-4xl font-bold text-white font-rajdhani mb-1">{summary.totalJobs}</p>
                        <p className="text-gray-500 text-xs">~ 0.0%</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-brand-red/20 to-brand-red/5 backdrop-blur-md rounded-xl border border-brand-red/30 p-6 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)'
                    }}></div>
                    <div className="relative z-10">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-3">POSTS CREATED</p>
                        <p className="text-4xl font-bold text-white font-rajdhani mb-1">{summary.totalPosts}</p>
                        <p className="text-gray-500 text-xs">~ 0.0%</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-brand-red/20 to-brand-red/5 backdrop-blur-md rounded-xl border border-brand-red/30 p-6 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)'
                    }}></div>
                    <div className="relative z-10">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-3">TIME SAVED</p>
                        <p className="text-4xl font-bold text-white font-rajdhani mb-1">{Math.round(summary.timeSavedMinutes / 60)}</p>
                        <p className="text-gray-500 text-xs">~ Significant</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-brand-red/20 to-brand-red/5 backdrop-blur-md rounded-xl border border-brand-red/30 p-6 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)'
                    }}></div>
                    <div className="relative z-10">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-3">AVG POSTS/JOB</p>
                        <p className="text-4xl font-bold text-white font-rajdhani mb-1">3.0</p>
                        <p className="text-gray-500 text-xs">~ 12 posts/job</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-black/60 backdrop-blur-md rounded-xl border border-brand-red/20 p-6">
                    <h3 className="text-sm font-bold mb-4 text-white font-rajdhani uppercase tracking-wider">POST GENERATION TREND</h3>
                    <div className="h-64">
                        <Line data={{
                            labels: charts.postsOverTime.map((d) => d.date),
                            datasets: [{
                                label: 'Posts',
                                data: charts.postsOverTime.map((d) => d.count),
                                borderColor: '#D0202F',
                                backgroundColor: 'rgba(208, 32, 47, 0.2)',
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: '#fff',
                                pointBorderColor: '#D0202F',
                                borderWidth: 2
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

                <div className="bg-black/60 backdrop-blur-md rounded-xl border border-brand-red/20 p-6">
                    <h3 className="text-sm font-bold mb-4 text-white font-rajdhani uppercase tracking-wider">PLATFORM MIX</h3>
                    <div className="h-64 flex justify-center">
                        <Pie data={{
                            labels: charts.byPlatform.map((d) => d.name),
                            datasets: [{
                                data: charts.byPlatform.map((d) => d.value),
                                backgroundColor: ['#D0202F', '#18181B', '#4B5563'],
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderWidth: 1
                            }]
                        }} options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'bottom', labels: { color: '#9CA3AF', font: { size: 11 }, usePointStyle: true, boxWidth: 8, padding: 20 } }
                            }
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
