import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    type ChartOptions
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import api from '../services/api';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AnalyticsStats } from '../types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Global Chart Defaults for Dark Theme
ChartJS.defaults.color = '#9CA3AF';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

export default function DashboardHome() {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await api.get('/analytics/summary');
                setStats(statsRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
            </div>
        );
    }

    const { summary, charts } = stats || {
        summary: { totalJobs: 0, totalPosts: 0, timeSavedMinutes: 0 },
        charts: { postsOverTime: [], byPlatform: [] }
    };

    const lineChartData = {
        labels: charts.postsOverTime.map((d) => d.date),
        datasets: [
            {
                label: 'Posts Generated',
                data: charts.postsOverTime.map((d) => d.count),
                borderColor: '#FF2A3C', // Neon Red
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(255, 42, 60, 0.5)');
                    gradient.addColorStop(1, 'rgba(255, 42, 60, 0.0)');
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#FF2A3C',
                pointHoverBackgroundColor: '#FF2A3C',
                pointHoverBorderColor: '#fff',
            },
        ],
    };

    const pieChartData = {
        labels: charts.byPlatform.map((d) => d.name),
        datasets: [
            {
                data: charts.byPlatform.map((d) => d.value),
                backgroundColor: ['#D0202F', '#18181B', '#374151'], // Red, Black, Gray
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#121212',
                titleColor: '#fff',
                bodyColor: '#9CA3AF',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-white font-rajdhani uppercase tracking-wider">
                        OVERVIEW
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Welcome back, Admin User</p>
                </div>

                <Link to="new-job" className="group relative px-6 py-2.5 bg-brand-red overflow-hidden rounded-lg font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all duration-300 font-rajdhani uppercase tracking-wider border border-brand-red/50">
                    <div className="flex items-center relative z-10">
                        <Zap className="h-4 w-4 mr-2" />
                        <span>Initiate New Job</span>
                    </div>
                </Link>
            </div>

            {/* Metrics Cards - Exact Match Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'TOTAL JOBS', value: summary.totalJobs, sublabel: '+ 12%' },
                    { label: 'POSTS GENERATED', value: summary.totalPosts, sublabel: '~ stable' },
                    { label: 'TIME SAVED', value: `${Math.round(summary.timeSavedMinutes / 60)}h 0m`, sublabel: '~ 2 hours' },
                    { label: 'ACTIVE CLIENTS', value: '48', sublabel: '+ 2 new' }
                ].map((stat, i) => (
                    <div key={i} className="bg-gradient-to-br from-brand-red/20 to-brand-red/5 backdrop-blur-md rounded-xl border border-brand-red/30 p-6 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all">
                        {/* Diagonal stripes background pattern */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)'
                        }}></div>

                        {/* Icon in top right */}
                        <div className="absolute top-4 right-4 opacity-20">
                            <div className="w-8 h-8 rounded-full border-2 border-white/30"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-3">{stat.label}</div>
                            <div className="text-4xl font-bold text-white font-rajdhani mb-1">{stat.value}</div>
                            <div className="text-gray-500 text-xs">{stat.sublabel}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section - Exact Match Style */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-black/60 backdrop-blur-md rounded-xl border border-brand-red/20 p-6 lg:col-span-2 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-white font-rajdhani uppercase tracking-wider">ACTIVITY OVERVIEW</h3>
                        <div className="bg-black/40 border border-white/10 rounded px-3 py-1 text-[10px] text-gray-500 font-medium uppercase">Last 7 Days</div>
                    </div>
                    <div className="flex-1 min-h-[250px] relative">
                        <Line options={chartOptions} data={lineChartData} />
                    </div>
                </div>

                <div className="bg-black/60 backdrop-blur-md rounded-xl border border-brand-red/20 p-6 flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-6 font-rajdhani uppercase tracking-wider">PLATFORM MIX</h3>
                    <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
                        <Pie options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'bottom', labels: { color: '#9CA3AF', usePointStyle: true, boxWidth: 8, padding: 20, font: { size: 11 } } }
                            }
                        }} data={pieChartData} />
                    </div>
                </div>
            </div>

            {/* Recent Jobs Table - Removed per design */}
        </div>
    );
}
