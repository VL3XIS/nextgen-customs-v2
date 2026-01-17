import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Copy, RefreshCw, CheckCircle, ArrowLeft, Loader2, Instagram, Facebook, Linkedin } from 'lucide-react';
import type { Job, Post } from '../types';
import { cn } from '../utils/cn';

export default function PostReviewPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [regenerating, setRegenerating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobRes, postsRes] = await Promise.all([
                    api.get(`/jobs/${jobId}`),
                    api.get(`/posts/${jobId}`)
                ]);
                setJob(jobRes.data.job);
                setPosts(postsRes.data.posts);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        if (jobId) fetchData();
    }, [jobId]);

    const handleUpdatePost = async (postId: string, field: keyof Post, value: string | string[]) => {
        // Optimistic update
        const updatedPosts = posts.map(p => p.id === postId ? { ...p, [field]: value } : p);
        setPosts(updatedPosts);

        // API update (debounced ideally, but simple for now)
        try {
            const post = updatedPosts.find(p => p.id === postId);
            if (post) {
                await api.put(`/posts/${postId}`, {
                    caption: post.caption,
                    hashtags: post.hashtags,
                    status: post.status
                });
            }
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    const handleRegenerate = async () => {
        setRegenerating(true);
        try {
            const response = await api.post('/posts/regenerate', { jobId });
            setPosts(response.data.posts);
            // Optional: show a success toast
        } catch (error) {
            console.error('Error regenerating posts:', error);
            alert('Failed to regenerate posts. Please try again.');
        } finally {
            setRegenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could show a toast here
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
        </div>
    );
    if (!job) return <div className="text-center py-12 text-gray-400">Job not found</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-lg bg-white/5 hover:bg-brand-red/20 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white tracking-wide">Review Content</h1>
                        <p className="text-gray-400 text-sm flex items-center mt-1">
                            <span className="text-brand-red mr-2">●</span>
                            {job.vehicle}
                            <span className="mx-2 text-gray-600">|</span>
                            {job.services}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <button
                        onClick={handleRegenerate}
                        disabled={regenerating}
                        className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all w-full md:w-auto disabled:opacity-50"
                    >
                        {regenerating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        Regenerate
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/history')} // Or save active state
                        className="flex items-center justify-center px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-neon hover:shadow-[0_0_15px_rgba(255,42,60,0.5)] transition-all transform hover:-translate-y-0.5 w-full md:w-auto font-bold tracking-wide"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="glass-panel flex flex-col h-full rounded-2xl overflow-hidden border border-white/10 group hover:border-brand-red/30 transition-all duration-300">
                        <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {post.platform === 'instagram' && <Instagram className="h-5 w-5 text-pink-500 drop-shadow-lg" />}
                                {post.platform === 'facebook' && <Facebook className="h-5 w-5 text-blue-500 drop-shadow-lg" />}
                                {post.platform === 'linkedin' && <Linkedin className="h-5 w-5 text-blue-400 drop-shadow-lg" />}
                                {post.platform === 'tiktok' && <div className="h-5 w-5 bg-gradient-to-tr from-cyan-400 to-pink-500 rounded-full flex items-center justify-center text-[8px] font-bold text-black">TK</div>}
                                <span className="font-bold capitalize text-gray-200 tracking-wide text-sm">{post.platform}</span>
                            </div>
                            <span className={cn(
                                "text-[10px] font-mono px-2 py-0.5 rounded border",
                                post.caption.length > 280 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"
                            )}>
                                {post.caption.length} chars
                            </span>
                        </div>

                        <div className="p-4 flex-1 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Caption</label>
                                <textarea
                                    value={post.caption}
                                    onChange={(e) => handleUpdatePost(post.id, 'caption', e.target.value)}
                                    className="w-full text-sm p-3 bg-black/30 border border-white/10 rounded-xl h-48 focus:ring-1 focus:ring-brand-red focus:border-brand-red/50 outline-none resize-none text-gray-300 leading-relaxed scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
                                />
                            </div>

                            {(post.platform === 'instagram' || post.platform === 'tiktok' || post.platform === 'linkedin') && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Hashtags</label>
                                    <textarea
                                        value={post.hashtags.join(' ')}
                                        onChange={(e) => handleUpdatePost(post.id, 'hashtags', e.target.value.split(' '))}
                                        className="w-full text-xs p-3 bg-black/30 border border-white/10 rounded-xl h-24 focus:ring-1 focus:ring-brand-red focus:border-brand-red/50 outline-none resize-none text-brand-neon font-mono"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/5 bg-black/20 flex justify-between">
                            <button
                                onClick={() => copyToClipboard(post.platform === 'instagram' || post.platform === 'tiktok' || post.platform === 'linkedin' ? `${post.caption}\n\n${post.hashtags.join(' ')}` : post.caption)}
                                className="flex items-center text-xs font-medium text-gray-500 hover:text-brand-red transition-colors w-full justify-center py-1 hover:bg-white/5 rounded"
                            >
                                <Copy className="h-3 w-3 mr-1.5" />
                                Copy to Clipboard
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
