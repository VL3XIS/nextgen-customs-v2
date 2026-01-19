import { useDraggable } from '@dnd-kit/core';
import { Clock, User, Calendar, Share2 } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import type { Job } from '../types';
import { useState } from 'react';
import ShareJobModal from './ShareJobModal';

interface JobCardProps {
    job: Job;
}

export default function JobCard({ job }: JobCardProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: job.id,
    });
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
        zIndex: 1000,
    } : undefined;

    const daysActive = Math.floor((new Date().getTime() - new Date(job.startedAt).getTime()) / (1000 * 3600 * 24));

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className="glass-panel p-4 rounded-xl cursor-grab active:cursor-grabbing neon-border-hover transition-all duration-300 mb-3 group relative hover:-translate-y-1 hover:shadow-xl"
            >
                {/* Share Button - Absolute Positioned */}
                <button
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent drag/click propagation
                        setIsShareModalOpen(true);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-gray-400 hover:text-white hover:bg-brand-red hover:shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all opacity-0 group-hover:opacity-100 z-10"
                    title="Share Status"
                >
                    <Share2 className="h-3.5 w-3.5" />
                </button>

                <div className="flex justify-between items-start pr-6">
                    <h4 className="font-bold text-white mb-3 font-rajdhani tracking-wide text-lg group-hover:text-brand-neon transition-colors truncate w-full">{job.vehicle}</h4>
                </div>

                <div className="space-y-2.5 text-xs text-zinc-400">
                    <div className="flex items-center group-hover:text-zinc-300 transition-colors">
                        <User className="h-3.5 w-3.5 mr-2.5 text-brand-red" />
                        {job.customerName}
                    </div>
                    <div className="flex items-center group-hover:text-zinc-300 transition-colors">
                        <Calendar className="h-3.5 w-3.5 mr-2.5 text-brand-red" />
                        Started: {new Date(job.startedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-zinc-300 font-medium bg-black/40 p-2 rounded-lg border border-white/5 mt-3 group-hover:border-white/10 transition-colors">
                        <Clock className="h-3.5 w-3.5 mr-2 text-brand-red" />
                        <span className="font-mono text-[10px] uppercase tracking-wider">{daysActive} days active</span>
                    </div>
                </div>
            </div>

            <ShareJobModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                job={job}
            />
        </>
    );
}
