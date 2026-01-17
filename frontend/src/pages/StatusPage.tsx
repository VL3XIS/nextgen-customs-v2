import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { GlassSkeleton } from '../components/GlassSkeleton';
import { CheckCircle2, Clock, Wrench, Paintbrush, ShieldCheck, Flag } from 'lucide-react';
import { cn } from '../utils/cn';

interface PublicJob {
    id: string;
    vehicle: string;
    customerName: string;
    status: string;
    lastUpdate: string;
    photos: { id: string; url: string; uploadedAt: string }[];
}

const STEPS = [
    { id: 'ESTIMATE', label: 'Estimate', icon: Clock },
    { id: 'APPROVED', label: 'Approved', icon: CheckCircle2 },
    { id: 'IN_PROGRESS', label: 'In Progress', icon: Wrench },
    { id: 'PAINT', label: 'Paint', icon: Paintbrush },
    { id: 'QUALITY_CHECK', label: 'Quality Check', icon: ShieldCheck },
    { id: 'COMPLETE', label: 'Ready', icon: Flag },
];

export default function StatusPage() {
    const { jobId } = useParams();
    const [job, setJob] = useState<PublicJob | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        api.get(`/public/jobs/${jobId}`)
            .then(res => setJob(res.data.job))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [jobId]);

    // Calculate progress index
    const currentStepIndex = STEPS.findIndex(s => s.id === job?.status) || 0;

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 space-y-6">
            <GlassSkeleton className="w-full max-w-md h-32" />
            <GlassSkeleton className="w-full max-w-md h-64" />
        </div>
    );

    if (error || !job) return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
            <h1 className="text-3xl font-bold font-display text-brand-red mb-4">Job Not Found</h1>
            <p className="text-gray-400">Please check your link and try again.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-outfit pb-20">
            {/* Header */}
            <div className="h-24 bg-black/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-center sticky top-0 z-50">
                <img src="/logo-full.png" alt="Next Gen Customs" className="h-10 object-contain" />
            </div>

            <div className="max-w-3xl mx-auto p-6 space-y-8 animate-fade-in">

                {/* Vehicle Card */}
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

                    <h2 className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-2">Vehicle Status</h2>
                    <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-2">{job.vehicle}</h1>
                    <p className="text-xl text-gray-300">Client: {job.customerName}</p>
                    <div className="mt-6 inline-block bg-brand-red/20 border border-brand-red text-brand-red px-4 py-1.5 rounded-full font-bold uppercase tracking-wide text-sm shadow-[0_0_15px_rgba(220,38,38,0.4)] animate-pulse">
                        {job.status.replace('_', ' ')}
                    </div>
                </div>

                {/* Tracking Steps */}
                <div className="relative">
                    {/* Vertical Line for Mobile */}
                    <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-white/10 md:hidden" />

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <div key={step.id} className={cn(
                                    "relative flex items-center md:flex-col md:text-center p-4 rounded-xl border transition-all duration-500",
                                    isActive
                                        ? "bg-brand-red/10 border-brand-red shadow-[0_0_20px_rgba(220,38,38,0.3)] scale-105 z-10"
                                        : isCompleted
                                            ? "bg-white/5 border-white/10 opacity-50"
                                            : "bg-transparent border-transparent opacity-20"
                                )}>
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center mr-4 md:mr-0 md:mb-3 border-2 transition-all duration-500",
                                        isActive
                                            ? "bg-brand-red border-brand-red text-white shadow-[0_0_20px_rgba(220,38,38,0.6)]"
                                            : isCompleted
                                                ? "bg-zinc-800 border-zinc-600 text-gray-400"
                                                : "bg-transparent border-zinc-800 text-zinc-700"
                                    )}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className={cn(
                                            "font-bold font-display uppercase tracking-wider text-sm",
                                            isActive ? "text-white" : "text-gray-500"
                                        )}>
                                            {step.label}
                                        </p>
                                        {isActive && (
                                            <p className="text-xs text-brand-red font-medium mt-1 animate-pulse">Current Stage</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Photo Gallery */}
                {job.photos.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold font-display uppercase tracking-wider text-white">Latest Photos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {job.photos.map(photo => (
                                <div key={photo.id} className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl cursor-pointer">
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${photo.url}`}
                                        alt="Job Update"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <p className="text-gray-300 text-xs font-mono">
                                            Uploaded: {new Date(photo.uploadedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
