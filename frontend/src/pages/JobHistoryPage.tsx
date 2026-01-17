// ... imports ...
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Eye, Trash2, Calendar, Search, PlusCircle } from 'lucide-react';
import type { Job } from '../types';

export default function JobHistoryPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            setJobs(response.data.jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this job?')) {
            try {
                await api.delete(`/jobs/${id}`);
                setJobs(jobs.filter(job => job.id !== id));
            } catch (error) {
                console.error('Error deleting job:', error);
            }
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.services.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-wide font-rajdhani uppercase">
                        Job History <span className="text-brand-red">.</span>
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">Manage and track all vehicle projects</p>
                </div>

                <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="relative group w-full sm:w-auto">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-hover:text-brand-red transition-colors" />
                        <input
                            type="text"
                            placeholder="Search vehicle or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-1 focus:ring-brand-red focus:border-brand-red/50 outline-none transition-all"
                        />
                    </div>
                    <Link to="/dashboard/new-job" className="bg-white/5 hover:bg-brand-red text-white p-2 rounded-lg border border-white/10 transition-colors hidden sm:block">
                        <PlusCircle className="h-6 w-6" />
                    </Link>
                </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-black/20">
                                <th className="px-6 py-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Services</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Posts</th>
                                <th className="px-6 py-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No jobs found matching your search. <Link to="/dashboard/new-job" className="text-brand-red hover:underline ml-1">Create new?</Link>
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-white group-hover:text-brand-neon transition-colors">{job.vehicle}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 truncate max-w-[200px]">{job.services}</td>
                                        <td className="px-6 py-4 text-gray-500 flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <span className="bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                {job._count?.posts || 0} Generated
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <Link to={`/dashboard/jobs/${job.id}/review`} className="text-gray-400 hover:text-brand-neon transition-colors" title="View">
                                                    <Eye className="h-5 w-5" />
                                                </Link>
                                                <button onClick={() => handleDelete(job.id)} className="text-gray-400 hover:text-brand-red transition-colors" title="Delete">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
