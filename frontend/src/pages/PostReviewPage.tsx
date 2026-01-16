import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Copy, RefreshCw, CheckCircle, ArrowLeft, Loader2, Instagram, Facebook, Linkedin } from 'lucide-react';

export default function PostReviewPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
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

    const handleUpdatePost = async (postId: string, field: string, value: any) => {
        // Optimistic update
        const updatedPosts = posts.map(p => p.id === postId ? { ...p, [field]: value } : p);
        setPosts(updatedPosts);

        // API update (debounced ideally, but simple for now)
        try {
            const post = updatedPosts.find(p => p.id === postId);
            await api.put(`/posts/${postId}`, {
                caption: post.caption,
                hashtags: post.hashtags,
                status: post.status
            });
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    const handleRegenerate = async () => {
        setRegenerating(true);
        try {
            // In a real app we'd call regenerate endpoint, here we might just re-call generate
            // ensuring backend handles cleanup. For now, let's just alert.
            alert('Regeneration not fully implemented in demo backend, but would call AI service again.');
        } finally {
            setRegenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could show a toast here
    };

    if (loading) return <div className="text-center py-12">Loading posts...</div>;
    if (!job) return <div className="text-center py-12">Job not found</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-900">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Review AI Posts</h1>
                    <p className="text-gray-500">{job.vehicle} • {job.services}</p>
                </div>
                <div className="ml-auto flex space-x-3">
                    <button
                        onClick={handleRegenerate}
                        disabled={regenerating}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white"
                    >
                        {regenerating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        Regenerate All
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/history')} // Or save active state
                        className="flex items-center px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-darkRed shadow-md"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve & Save
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50 rounded-t-xl">
                            <div className="flex items-center space-x-2">
                                {post.platform === 'instagram' && <Instagram className="h-5 w-5 text-pink-600" />}
                                {post.platform === 'facebook' && <Facebook className="h-5 w-5 text-blue-600" />}
                                {post.platform === 'linkedin' && <Linkedin className="h-5 w-5 text-blue-800" />}
                                <span className="font-bold capitalize text-gray-700">{post.platform}</span>
                            </div>
                            <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">
                                {post.caption.length} chars
                            </span>
                        </div>

                        <div className="p-4 flex-1 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Caption</label>
                                <textarea
                                    value={post.caption}
                                    onChange={(e) => handleUpdatePost(post.id, 'caption', e.target.value)}
                                    className="w-full text-sm p-3 border border-gray-200 rounded-lg h-48 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none resize-none"
                                />
                            </div>

                            {post.platform === 'instagram' && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Hashtags</label>
                                    <textarea
                                        value={post.hashtags.join(' ')}
                                        onChange={(e) => handleUpdatePost(post.id, 'hashtags', e.target.value.split(' '))}
                                        className="w-full text-xs p-3 border border-gray-200 rounded-lg h-24 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none resize-none text-blue-600"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-50 bg-gray-50 rounded-b-xl flex justify-between">
                            <button
                                onClick={() => copyToClipboard(post.platform === 'instagram' ? `${post.caption}\n\n${post.hashtags.join(' ')}` : post.caption)}
                                className="flex items-center text-xs font-medium text-gray-600 hover:text-brand-red transition-colors"
                            >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy Text
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
