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
                className="bg-brand-black/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/5 cursor-grab active:cursor-grabbing hover:border-brand-red/50 hover:shadow-[0_0_15px_rgba(255,42,60,0.15)] transition-all duration-300 mb-3 group relative"
            >
                {/* Share Button - Absolute Positioned */}
                <button
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent drag/click propagation
                        setIsShareModalOpen(true);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-brand-red hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 z-10"
                    title="Share Status"
                >
                    <Share2 className="h-4 w-4" />
                </button>

                <h4 className="font-bold text-white mb-2 font-rajdhani tracking-wide text-lg group-hover:text-brand-red transition-colors pr-8">{job.vehicle}</h4>

                <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex items-center">
                        <User className="h-3 w-3 mr-2 text-brand-red" />
                        {job.customerName}
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2 text-brand-red" />
                        Started: {new Date(job.startedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-300 font-medium bg-white/5 p-1.5 rounded border border-white/5 mt-2">
                        <Clock className="h-3 w-3 mr-2 text-brand-red" />
                        {daysActive} days in stage
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
