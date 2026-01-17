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
    ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import api from '../services/api';
import { Briefcase, Zap, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AnalyticsStats, Job } from '../types';

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
        return <div className="text-center py-12">Loading stats...</div>;
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
                borderColor: '#DC2626',
                backgroundColor: 'rgba(220, 38, 38, 0.5)',
                tension: 0.4,
            },
        ],
    };

    const pieChartData = {
        labels: charts.byPlatform.map((d) => d.name),
        datasets: [
            {
                data: charts.byPlatform.map((d) => d.value),
                backgroundColor: ['#DC2626', '#111827', '#0077b5'],
                borderColor: ['#ffffff', '#ffffff', '#ffffff'],
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <Link to="new-job" className="bg-brand-red text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-darkRed transition-colors flex items-center shadow-md">
                    <Zap className="h-4 w-4 mr-2" />
                    Create New Job
                </Link>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Total Jobs</h3>
                        <Briefcase className="h-5 w-5 text-brand-red" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{summary.totalJobs}</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                        +12% from last month
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Posts Generated</h3>
                        <Zap className="h-5 w-5 text-brand-red" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{summary.totalPosts}</p>
                    <p className="text-xs text-green-600 mt-1">
                        Consistent activity
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Time Saved</h3>
                        <Clock className="h-5 w-5 text-brand-red" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{Math.round(summary.timeSavedMinutes / 60)}h {summary.timeSavedMinutes % 60}m</p>
                    <p className="text-xs text-gray-500 mt-1">
                        ~30 mins per post
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Active Clients</h3>
                        <Users className="h-5 w-5 text-brand-red" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">48</p>
                    <p className="text-xs text-green-600 mt-1">
                        +3 this week
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Overview</h3>
                    <div className="h-64">
                        <Line options={{ responsive: true, maintainAspectRatio: false }} data={lineChartData} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Distribution</h3>
                    <div className="h-64 flex justify-center">
                        <Pie options={{ responsive: true, maintainAspectRatio: false }} data={pieChartData} />
                    </div>
                </div>
            </div>

            {/* Recent Jobs Mockup (Static for now, will link to real data in History page) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Recent Jobs</h3>
                    <Link to="/dashboard/history" className="text-brand-red text-sm font-medium flex items-center hover:underline">
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-3 font-semibold text-gray-500 text-sm">Vehicle</th>
                                <th className="pb-3 font-semibold text-gray-500 text-sm">Service</th>
                                <th className="pb-3 font-semibold text-gray-500 text-sm">Date</th>
                                <th className="pb-3 font-semibold text-gray-500 text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentJobs.length > 0 ? (
                                recentJobs.map((job) => (
                                    <tr key={job.id}>
                                        <td className="py-3 text-sm font-medium">{job.vehicle}</td>
                                        <td className="py-3 text-sm text-gray-500 truncate max-w-[200px]">{job.services}</td>
                                        <td className="py-3 text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${job.status === 'COMPLETE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {job.status.toLowerCase().replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500">No jobs found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
