import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Loader2, Upload, FileImage, X, Sparkles, CheckCircle2 } from 'lucide-react';
// import { Job } from '../types'; // Removed to fix unused var error

// Minimal Job Type Definition if not imported
interface JobType {
    id: string;
    customerName: string;
    vehicle: string;
    status: string;
    createdAt: string;
}

export default function SocialStudioPage() {
    const [activeTab, setActiveTab] = useState<'existing' | 'quick'>('existing');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<JobType[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
    const [photos, setPhotos] = useState<File[]>([]);

    // Quick Post Data
    const [quickData, setQuickData] = useState({
        vehicle: '',
        customerName: '',
        services: '',
        notes: ''
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Search Logic
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        try {
            const res = await api.get(`/jobs?search=${encodeURIComponent(searchQuery)}&limit=10`);
            setSearchResults(res.data.jobs);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPhotos([...photos, ...Array.from(e.target.files)]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            let jobId = selectedJob?.id;

            // 1. If Quick Post, Create Job First
            if (activeTab === 'quick') {
                const jobFormData = new FormData();
                jobFormData.append('vehicle', quickData.vehicle);
                jobFormData.append('customerName', quickData.customerName || 'Walk-in'); // Fallback
                jobFormData.append('services', quickData.services);
                jobFormData.append('notes', quickData.notes);
                // Status defaults to IN_PROGRESS logic in backend, but we might want COMPLETE. 
                // For now standard create is fine, it just won't have photos yet.

                const createRes = await api.post('/jobs', jobFormData);
                jobId = createRes.data.job.id;

                // Set status to COMPLETED since we are posting about it? 
                // Optional, but lets keeps it simple for now.
            }

            if (!jobId) throw new Error("No Job ID available");

            // 2. Upload "After" Photos to the Job
            if (photos.length > 0) {
                const photoData = new FormData();
                photos.forEach(p => photoData.append('photos', p));
                await api.post(`/jobs/${jobId}/photos`, photoData);
            }

            // 3. Generate Posts
            await api.post('/posts/generate', { jobId });

            // 4. Navigate
            navigate(`/dashboard/jobs/${jobId}/review`);

        } catch (error) {
            console.error('Generation Error:', error);
            alert('Failed to generate posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-wider font-rajdhani uppercase flex items-center gap-3">
                        <Sparkles className="text-brand-neon" />
                        Social Studio
                    </h1>
                    <p className="text-gray-500 mt-1">Create engaging social media content for your jobs</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => setActiveTab('existing')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'existing'
                            ? 'bg-brand-red text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Search Existing Job
                    </button>
                    <button
                        onClick={() => setActiveTab('quick')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'quick'
                            ? 'bg-brand-red text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Quick Post
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Input / Search */}
                <div className="lg:col-span-2 space-y-6">

                    {activeTab === 'existing' ? (
                        <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-6 space-y-6">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search by vehicle or customer name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-neon/50 outline-none transition-all"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                                    Search
                                </button>
                            </form>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {isSearching ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="animate-spin text-brand-red h-8 w-8" />
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map(job => (
                                        <div
                                            key={job.id}
                                            onClick={() => setSelectedJob(job)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedJob?.id === job.id
                                                ? 'bg-brand-red/10 border-brand-red scale-[1.02]'
                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-white font-bold">{job.vehicle}</h3>
                                                    <p className="text-sm text-gray-400">{job.customerName}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${job.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                                        }`}>
                                                        {job.status}
                                                    </span>
                                                    <span className="text-xs text-gray-600 mt-1">
                                                        {new Date(job.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-gray-600">
                                        <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                        <p>Search for a job to get started</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Quick Post Form */
                        <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Vehicle</label>
                                <input
                                    type="text"
                                    value={quickData.vehicle}
                                    onChange={e => setQuickData({ ...quickData, vehicle: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-neon/50 outline-none"
                                    placeholder="e.g. 1969 Chevy Camaro"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Customer Name (Optional)</label>
                                <input
                                    type="text"
                                    value={quickData.customerName}
                                    onChange={e => setQuickData({ ...quickData, customerName: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-neon/50 outline-none"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Services Performed</label>
                                <textarea
                                    value={quickData.services}
                                    onChange={e => setQuickData({ ...quickData, services: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-neon/50 outline-none h-24 resize-none"
                                    placeholder="Full restoration, ceramic coating, etc."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Notes</label>
                                <textarea
                                    value={quickData.notes}
                                    onChange={e => setQuickData({ ...quickData, notes: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-neon/50 outline-none h-20 resize-none"
                                    placeholder="Any special details to mention..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Upload & Action */}
                <div className="space-y-6">
                    <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Upload className="h-5 w-5 text-brand-red" />
                            Upload Photos
                        </h3>

                        <div className="border-2 border-dashed border-brand-red/30 rounded-xl p-8 hover:border-brand-red hover:bg-brand-red/5 transition-all cursor-pointer relative group text-center mb-4">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="relative z-0">
                                <FileImage className="h-8 w-8 text-brand-red mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <p className="text-sm text-gray-300">Drop files here</p>
                            </div>
                        </div>

                        {photos.length > 0 && (
                            <div className="space-y-2 mb-6 max-h-[200px] overflow-y-auto custom-scrollbar">
                                {photos.map((photo, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs bg-white/5 p-2 rounded border border-white/5">
                                        <span className="truncate text-gray-300 max-w-[150px]">{photo.name}</span>
                                        <button onClick={() => removePhoto(i)} className="text-gray-500 hover:text-red-400">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-white/10 pt-4">
                            <button
                                onClick={handleGenerate}
                                disabled={loading || (activeTab === 'existing' && !selectedJob) || photos.length === 0}
                                className="w-full bg-brand-red hover:bg-brand-red/80 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-brand-red/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide font-rajdhani"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        Generate Posts
                                    </>
                                )}
                            </button>
                            {(activeTab === 'existing' && !selectedJob) && (
                                <p className="text-xs text-center text-red-400 mt-2">Please select a job first</p>
                            )}
                            {photos.length === 0 && (
                                <p className="text-xs text-center text-red-400 mt-2">Please upload at least 1 photo</p>
                            )}
                        </div>
                    </div>

                    {/* Summary Card */}
                    {selectedJob && activeTab === 'existing' && (
                        <div className="bg-gradient-to-br from-brand-red/10 to-black rounded-xl border border-brand-red/20 p-6 animate-in fade-in slide-in-from-right-4">
                            <h4 className="text-brand-red font-bold uppercase tracking-wider text-xs mb-3">Selected Job</h4>
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-white leading-tight">{selectedJob.vehicle}</h2>
                                <p className="text-sm text-gray-400">{selectedJob.customerName}</p>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wide">
                                <CheckCircle2 className="h-4 w-4" />
                                Ready for Content
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
