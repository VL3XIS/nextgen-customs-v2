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
import { DashboardSkeleton } from '../components/GlassSkeleton';
import { Zap, ArrowUpRight, TrendingUp, Users, Activity, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import type { AnalyticsStats } from '../types';
import { motion } from 'framer-motion';

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
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
ChartJS.defaults.font.family = '"Rajdhani", sans-serif';

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
        return <DashboardSkeleton />;
    }

    const { summary, charts } = stats || {
        summary: { totalJobs: 0, totalPosts: 0, timeSavedMinutes: 0, activeClients: 0, pipelineRevenue: 0, completedRevenue: 0 },
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
                    gradient.addColorStop(0, 'rgba(255, 42, 60, 0.4)');
                    gradient.addColorStop(1, 'rgba(255, 42, 60, 0.0)');
                    return gradient;
                },
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#18181B',
                pointBorderColor: '#FF2A3C',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const pieChartData = {
        labels: charts.byPlatform.map((d) => d.name),
        datasets: [
            {
                data: charts.byPlatform.map((d) => d.value),
                backgroundColor: ['#D0202F', '#1F1F22', '#3F3F46'], // Red, Black, Gray
                borderColor: 'rgba(0,0,0,0.5)',
                borderWidth: 2,
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
                backgroundColor: 'rgba(24, 24, 27, 0.9)',
                titleColor: '#fff',
                bodyColor: '#A1A1AA',
                borderColor: 'rgba(255, 42, 60, 0.2)',
                borderWidth: 1,
                padding: 12,
                titleFont: { family: 'Rajdhani', size: 14, weight: 'bold' },
                bodyFont: { family: 'Inter', size: 12 },
                displayColors: false,
                callbacks: {
                    label: (context) => ` ${context.parsed.y} Posts`
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.03)',
                },
                ticks: {
                    font: { family: 'Rajdhani', size: 12 }
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { family: 'Rajdhani', size: 12 }
                }
            }
        },
        elements: {
            line: {
                tension: 0.4
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-10"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white font-rajdhani uppercase tracking-wider flex items-center gap-3">
                        Command Center
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm font-light tracking-wide">
                        System Online • <span className="text-brand-neon">All Systems Nominal</span>
                    </p>
                </div>

                <Link to="new-job" className="group relative px-8 py-3 bg-brand-red overflow-hidden rounded-xl font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all duration-300 font-rajdhani uppercase tracking-widest border border-white/10 hover:scale-105 active:scale-95">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <div className="flex items-center relative z-10 gap-2">
                        <Zap className="h-5 w-5" />
                        <span>Initialize Job</span>
                    </div>
                </Link>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: 'Total Revenue',
                        value: summary.completedRevenue ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(summary.completedRevenue) : '$0',
                        sublabel: 'Realized Earnings',
                        icon: DollarSign,
                        trend: '+8%',
                        color: 'text-brand-neon'
                    },
                    {
                        label: 'Revenue Pipeline',
                        value: summary.pipelineRevenue ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(summary.pipelineRevenue) : '$0',
                        sublabel: 'Projected Earnings',
                        icon: Activity,
                        trend: '+12%',
                        color: 'text-blue-400'
                    },
                    {
                        label: 'Active Clients',
                        value: summary.activeClients || 0,
                        sublabel: 'Distinct Customers',
                        icon: Users,
                        trend: '+4%',
                        color: 'text-purple-400'
                    },
                    {
                        label: 'Time Saved',
                        value: `${Math.round(summary.timeSavedMinutes / 60)}h ${summary.timeSavedMinutes % 60}m`,
                        sublabel: 'AI Automation',
                        icon: TrendingUp,
                        trend: 'Optimization',
                        color: 'text-amber-400'
                    },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants as any}
                    >
                        <GlassCard className="p-6 h-full group hover:-translate-y-1 transition-transform duration-300" hoverEffect>
                            {/* Background Accents */}
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl group-hover:bg-brand-red/20 transition-colors duration-500" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${stat.color} group-hover:text-white group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-300`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-mono text-brand-neon bg-brand-neon/10 px-2 py-1 rounded border border-brand-neon/20 flex items-center gap-1">
                                        <ArrowUpRight className="h-3 w-3" />
                                        {stat.trend}
                                    </span>
                                </div>

                                <div>
                                    <div className="text-3xl md:text-4xl font-bold text-white font-rajdhani mb-1 tracking-tight group-hover:text-brand-red transition-colors duration-300">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-300 transition-colors">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Activity Chart */}
                <motion.div
                    variants={itemVariants as any}
                    className="lg:col-span-2"
                >
                    <GlassCard className="p-6 flex flex-col min-h-[400px]">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white font-rajdhani uppercase tracking-wider flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-brand-red" />
                                    Content Velocity
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">AI Generation Frequency (Last 7 Days)</p>
                            </div>
                            <div className="flex gap-2">
                                {['7D', '1M', '3M'].map((period) => (
                                    <button key={period} className={`px-3 py-1 rounded text-xs font-bold font-mono transition-colors ${period === '7D' ? 'bg-brand-red text-white' : 'bg-black/40 text-gray-500 hover:text-white'}`}>
                                        {period}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full h-full relative">
                            <Line options={chartOptions} data={lineChartData} />
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Platform Distribution */}
                <motion.div
                    variants={itemVariants as any}
                >
                    <GlassCard className="p-6 flex flex-col min-h-[400px]">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white font-rajdhani uppercase tracking-wider mb-1">Target Distribution</h3>
                            <p className="text-xs text-gray-500">Platform Share Analysis</p>
                        </div>

                        <div className="flex-1 flex items-center justify-center relative">
                            <Pie options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            color: '#9CA3AF',
                                            usePointStyle: true,
                                            pointStyle: 'rectRounded',
                                            boxWidth: 10,
                                            padding: 20,
                                            font: { family: 'Rajdhani', size: 12, weight: 'bold' }
                                        }
                                    }
                                }
                            }} data={pieChartData} />

                            {/* Center Hologram Element */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                                <div className="w-32 h-32 rounded-full border border-white/10 animate-pulse"></div>
                                <div className="absolute w-24 h-24 rounded-full border border-brand-red/20 animate-spin-slow"></div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </motion.div>
    );
}
