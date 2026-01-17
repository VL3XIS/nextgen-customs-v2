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
import { Briefcase, Zap, Clock, Users, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AnalyticsStats, Job } from '../types';
import { cn } from '../utils/cn';

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
    const [recentJobs, setRecentJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, jobsRes] = await Promise.all([
                    api.get('/analytics/summary'),
                    api.get('/jobs?limit=5')
                ]);
                setStats(statsRes.data);
                setRecentJobs(jobsRes.data.jobs);
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
                    <h1 className="text-4xl font-bold text-white font-rajdhani uppercase tracking-wide neon-text">
                        Overview <span className="text-brand-red">.</span>
                    </h1>
                    <p className="text-gray-400 mt-1 italic font-light tracking-wide">Welcome back, Admin</p>
                </div>

                <Link to="new-job" className="group relative px-8 py-3 bg-brand-red overflow-hidden rounded-xl font-bold text-lg text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:bg-red-600 transition-all duration-300 font-rajdhani uppercase tracking-wider">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <div className="flex items-center relative z-10">
                        <Zap className="h-5 w-5 mr-3 fill-current" />
                        <span>Initiate New Job</span>
                    </div>
                </Link>
            </div>

            {/* Metrics Cards - Exact Match Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Jobs', value: summary.totalJobs, icon: Briefcase, trend: '+ 12%', trendColor: 'text-green-400' },
                    { label: 'Posts Generated', value: summary.totalPosts, icon: Zap, trend: '- stable', trendColor: 'text-gray-400' },
                    { label: 'Time Saved', value: `${Math.round(summary.timeSavedMinutes / 60)}h ${summary.timeSavedMinutes % 60}m`, icon: Clock, trend: '~ 30m/post', trendColor: 'text-brand-red' },
                    { label: 'Active Clients', value: '48', icon: Users, trend: '+ 16 new', trendColor: 'text-green-400' }
                ].map((stat, i) => (
                    <div key={i} className="glass-panel-neon p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[140px] group">
                        {/* Header Row */}
                        <div className="flex justify-between items-start">
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.1em] font-display">{stat.label}</h3>
                            <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-red-500/50 transition-colors shadow-inner">
                                <stat.icon className="h-5 w-5 text-red-500" />
                            </div>
                        </div>

                        {/* Value Row */}
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-white font-rajdhani tracking-tight drop-shadow-lg block">{stat.value}</span>
                            <span className={cn("text-xs font-bold mt-1 block tracking-wide", stat.trendColor)}>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section - Exact Match Style */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-panel-neon p-6 rounded-2xl lg:col-span-2 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white font-rajdhani uppercase tracking-wide">Activity Overview</h3>
                        <div className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-xs text-gray-500 font-medium">Last 7 Days</div>
                    </div>
                    <div className="flex-1 min-h-[250px] relative">
                        <Line options={chartOptions} data={lineChartData} />
                    </div>
                </div>

                <div className="glass-panel-neon p-6 rounded-2xl flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6 font-rajdhani uppercase tracking-wide">Platform Mix</h3>
                    <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
                        <Pie options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'bottom', labels: { color: '#9CA3AF', usePointStyle: true, boxWidth: 8, padding: 20 } }
                            }
                        }} data={pieChartData} />
                    </div>
                </div>
            </div>

            {/* Recent Jobs Table - Glass Style */}
            <div className="glass-panel-neon rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-brand-red/20 flex justify-between items-center bg-brand-red/5">
                    <h3 className="text-lg font-bold text-white font-rajdhani uppercase tracking-wide">Recent Projects</h3>
                    <Link to="/dashboard/history" className="text-brand-red text-sm font-medium flex items-center hover:text-brand-neon transition-colors">
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-black/20">
                                <th className="px-6 py-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Service</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentJobs.length > 0 ? (
                                recentJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-white group-hover:text-brand-neon transition-colors">
                                                {job.vehicle}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{job.services}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-md text-xs font-bold border",
                                                job.status === 'COMPLETE'
                                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                            )}>
                                                {job.status.toLowerCase().replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No active jobs found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
