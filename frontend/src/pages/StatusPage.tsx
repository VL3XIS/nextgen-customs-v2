import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Wrench, Paintbrush, ShieldCheck, Flag, Calendar, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';

interface PublicJob {
    id: string;
    vehicle: string;
    customerName: string;
    status: string;
    lastUpdate: string;
    notes?: string;
    photos: { id: string; url: string; uploadedAt: string }[];
}

const STEPS = [
    { id: 'ESTIMATE', label: 'Analysis', icon: Clock, color: '#facc15' },
    { id: 'APPROVED', label: 'Approved', icon: CheckCircle2, color: '#22c55e' },
    { id: 'IN_PROGRESS', label: 'Modification', icon: Wrench, color: '#3b82f6' },
    { id: 'PAINT', label: 'Finish', icon: Paintbrush, color: '#a855f7' },
    { id: 'QUALITY_CHECK', label: 'Inspection', icon: ShieldCheck, color: '#06b6d4' },
    { id: 'COMPLETE', label: 'Delivery', icon: Flag, color: '#ef4444' },
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

    const currentStepIndex = STEPS.findIndex(s => s.id === job?.status);

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="relative">
                <div className="w-24 h-24 border-t-4 border-brand-red rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-b-4 border-white/20 rounded-full animate-spin-reverse" />
                </div>
            </div>
        </div>
    );

    if (error || !job) return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className="w-20 h-20 bg-brand-red/10 border border-brand-red/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-brand-red" />
                </div>
                <h1 className="text-4xl font-bold font-rajdhani text-white mb-4 uppercase tracking-tighter">Job Not Found</h1>
                <p className="text-zinc-500 max-w-sm mx-auto">This order tracking link may have expired or is incorrect. Please contact NextGen Customs support.</p>
                <a href="/" className="mt-8 inline-flex items-center gap-2 text-brand-red hover:underline font-bold uppercase text-sm tracking-widest">
                    Return to Home <ExternalLink className="w-4 h-4" />
                </a>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-outfit selection:bg-brand-red selection:text-white">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[150px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,42,60,0.4)]">
                            <Flag className="text-white w-6 h-6" />
                        </div>
                        <span className="font-rajdhani font-bold text-2xl tracking-tighter text-white uppercase italic">NextGen <span className="text-brand-red">Customs</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <Phone className="w-4 h-4 text-brand-red" />
                            <span>(512) 555-0199</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <MapPin className="w-4 h-4 text-brand-red" />
                            <span>Austin, TX</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Job Info & Tracking */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Hero Section */}
                        <section className="space-y-4">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 border border-brand-red/30 rounded-full text-brand-red text-xs font-bold uppercase tracking-widest"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
                                </span>
                                Live Build Tracker
                            </motion.div>
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-7xl font-rajdhani font-bold text-white tracking-tighter uppercase italic leading-none"
                            >
                                {job.vehicle}
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-zinc-400 font-light flex items-center gap-3"
                            >
                                Precision Engineering for <span className="text-white font-bold italic underline decoration-brand-red underline-offset-4">{job.customerName}</span>
                            </motion.p>
                        </section>

                        {/* Progress Roadmap */}
                        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-[60px] rounded-full group-hover:bg-brand-red/10 transition-colors" />

                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Production Journey
                            </h3>

                            <div className="relative pt-4 pb-8">
                                {/* Track Line */}
                                <div className="absolute top-9 left-6 right-6 h-0.5 bg-zinc-800 hidden md:block" />
                                <div
                                    className="absolute top-9 left-6 h-0.5 bg-brand-red transition-all duration-1000 ease-out hidden md:block shadow-[0_0_15px_rgba(255,42,60,0.5)]"
                                    style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative">
                                    {STEPS.map((step, index) => {
                                        const StepIcon = step.icon;
                                        const isCurrent = index === currentStepIndex;
                                        const isPast = index < currentStepIndex;
                                        const isFuture = index > currentStepIndex;

                                        return (
                                            <div key={step.id} className="relative flex md:flex-col items-center gap-4 md:gap-0">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 z-10",
                                                    isCurrent ? "bg-brand-red border-brand-red shadow-[0_0_25px_rgba(255,42,60,0.6)] text-white scale-125" :
                                                        isPast ? "bg-zinc-900 border-zinc-700 text-brand-red" :
                                                            "bg-zinc-950 border-zinc-900 text-zinc-800"
                                                )}>
                                                    <StepIcon className="w-5 h-5" />
                                                </div>
                                                <div className="md:mt-4 text-left md:text-center">
                                                    <p className={cn(
                                                        "text-xs font-bold uppercase tracking-wider transition-colors duration-500",
                                                        isCurrent ? "text-white" : isPast ? "text-zinc-300" : "text-zinc-700"
                                                    )}>
                                                        {step.label}
                                                    </p>
                                                    {isCurrent && (
                                                        <motion.div
                                                            layoutId="status-indicator"
                                                            className="text-[10px] text-brand-red font-black uppercase tracking-tighter mt-1"
                                                        >
                                                            Current
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        {/* Recent Build Photos */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-end">
                                <h3 className="text-2xl font-rajdhani font-bold text-white uppercase italic tracking-tighter">Build Updates</h3>
                                <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest underline decoration-brand-red/30 px-2">{job.photos.length} Total Snapshots</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {job.photos.length > 0 ? job.photos.map((photo, i) => (
                                        <motion.div
                                            key={photo.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group relative aspect-[16/10] bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl"
                                        >
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}${photo.url}`}
                                                alt="Build Phase"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                                                <h4 className="text-white font-bold uppercase tracking-tight text-lg mb-1">Observation Log #{i + 1}</h4>
                                                <p className="text-zinc-400 text-xs font-mono">Date Captured: {new Date(photo.uploadedAt).toLocaleDateString()}</p>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="md:col-span-2 h-64 bg-zinc-900/50 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-zinc-600 gap-4">
                                            <Paintbrush className="w-12 h-12 opacity-20" />
                                            <p className="font-bold uppercase tracking-widest text-sm italic">Photo logs pending completion</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Overview & Metadata */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Status Card */}
                        <div className="bg-brand-red p-[1px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,42,60,0.15)] group">
                            <div className="bg-[#0a0a0a] rounded-[23px] p-8 space-y-6 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-[40px] rounded-full" />

                                <div className="space-y-1">
                                    <span className="text-brand-red text-xs font-black uppercase tracking-[0.2em]">Active Status</span>
                                    <h4 className="text-3xl font-rajdhani font-black text-white uppercase italic tracking-tighter leading-none">
                                        {job.status.replace('_', ' ')}
                                    </h4>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-500">Last Synced</span>
                                        <span className="text-zinc-300 font-mono italic">{new Date(job.lastUpdate).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-500">Project ID</span>
                                        <span className="text-zinc-300 font-mono">#{job.id.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                </div>

                                {job.notes && (
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <p className="text-xs text-zinc-400 italic leading-relaxed">
                                            "{job.notes}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Crew & Assistance */}
                        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
                            <h4 className="text-lg font-rajdhani font-bold text-white uppercase italic tracking-tight">Support Desk</h4>

                            <div className="space-y-4">
                                <a href="tel:5125550199" className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-red transition-colors">
                                        <Phone className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Direct Line</p>
                                        <p className="text-white font-medium">(512) 555-0199</p>
                                    </div>
                                </a>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-blue transition-colors">
                                        <Mail className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Email Inquiry</p>
                                        <p className="text-white font-medium">builds@nextgen.com</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-zinc-800 hover:bg-zinc-750 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all border border-white/5 hover:border-white/20">
                                Send Message
                            </button>
                        </div>

                        {/* Location Mini Map Mock */}
                        <div className="aspect-square bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden p-8 flex flex-col items-center justify-center text-center gap-4 relative">
                            <div className="absolute inset-0 bg-brand-red/5 blur-[80px]" />
                            <MapPin className="w-12 h-12 text-brand-red opacity-50" />
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] relative"> Austin Delivery Center<br />Now Accepting Exotic Work</p>
                        </div>

                    </div>
                </div>
            </main>

            {/* Sticky Footer */}
            <footer className="border-t border-white/5 py-12 px-6 bg-black/50">
                <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
                    <p className="text-zinc-600 text-xs font-mono">© 2026 NEXTGEN CUSTOMS PERFORMANCE DIVISION | POWERED BY ANTIGRAVITY v2.5</p>
                    <div className="flex gap-4">
                        {['Instagram', 'Youtube', 'TikTok'].map(s => (
                            <span key={s} className="text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-brand-red cursor-pointer transition-colors">{s}</span>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
