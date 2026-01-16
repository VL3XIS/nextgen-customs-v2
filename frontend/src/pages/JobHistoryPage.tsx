import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Eye, Trash2, Calendar, Search } from 'lucide-react';

export default function JobHistoryPage() {
    const [jobs, setJobs] = useState<any[]>([]);
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

    if (loading) return <div className="text-center py-12">Loading history...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Job History</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Vehicle</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Services</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Posts Generated</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredJobs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No jobs found. <Link to="/dashboard/new-job" className="text-brand-red hover:underline">Create one?</Link>
                                </td>
                            </tr>
                        ) : (
                            filteredJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{job.vehicle}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">{job.services}</td>
                                    <td className="px-6 py-4 text-gray-500 flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                                            {job._count?.posts || 0} Posts
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <Link to={`/dashboard/jobs/${job.id}/review`} className="text-blue-600 hover:text-blue-800" title="View">
                                                <Eye className="h-5 w-5" />
                                            </Link>
                                            <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:text-red-700" title="Delete">
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
    );
}
