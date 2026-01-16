import { useDraggable } from '@dnd-kit/core';
import { Clock, User, Calendar } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';

interface JobCardProps {
    job: any;
}

export default function JobCard({ job }: JobCardProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: job.id,
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    const daysActive = Math.floor((new Date().getTime() - new Date(job.startedAt).getTime()) / (1000 * 3600 * 24));

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow mb-3"
        >
            <h4 className="font-bold text-gray-900 mb-1">{job.vehicle}</h4>

            <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center">
                    <User className="h-3 w-3 mr-1.5" />
                    {job.customerName}
                </div>
                <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1.5" />
                    Started: {new Date(job.startedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-brand-red font-medium">
                    <Clock className="h-3 w-3 mr-1.5" />
                    {daysActive} days in stage
                </div>
            </div>
        </div>
    );
}
