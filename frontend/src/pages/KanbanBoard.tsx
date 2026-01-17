import { useEffect, useState, useCallback } from 'react';
import { DndContext, useDroppable, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import api from '../services/api';
import JobCard from '../components/JobCard';
import AddJobModal from '../components/AddJobModal';
import { Plus } from 'lucide-react';
import type { Job } from '../types';

const COLUMNS = [
    { id: 'ESTIMATE', title: 'ESTIMATE' },
    { id: 'APPROVED', title: 'APPROVED' },
    { id: 'IN_PROGRESS', title: 'IN PROGRESS' },
    { id: 'PAINT', title: 'PAINT' },
];

function Column({ id, title, jobs }: { id: string, title: string, jobs: Job[] }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col h-full min-w-[300px] w-80 bg-gradient-to-b from-brand-red/10 to-black/60 backdrop-blur-md rounded-xl border border-brand-red/30 shadow-xl">
            <div className="p-4 border-b border-brand-red/30 flex justify-between items-center bg-brand-red/10">
                <h3 className="font-bold text-white font-rajdhani uppercase tracking-wider text-sm">{title}</h3>
                <span className="text-xs font-bold bg-brand-red/30 text-white px-2.5 py-1 rounded-full border border-brand-red/50">{jobs.length}</span>
            </div>
            <div ref={setNodeRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
}

export default function KanbanBoard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeId, setActiveId] = useState<string | null>(null);

    const triggerRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/jobs?limit=100');
                setJobs(res.data.jobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
        fetchJobs();
    }, [refreshKey]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (over && active.id) {
            const newStatus = over.id as Job['status'];

            // Optimistic update
            setJobs((prev) =>
                prev.map(job => job.id === active.id ? { ...job, status: newStatus } : job)
            );

            try {
                await api.put(`/jobs/${active.id}/status`, { status: newStatus });
            } catch (error) {
                console.error('Failed to update status:', error);
                triggerRefresh(); // Revert on error
            }
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white font-rajdhani uppercase tracking-wider">JOBS</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage vehicle jobs and workflow</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-red hover:bg-brand-red/80 text-white px-6 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] flex items-center font-bold font-rajdhani uppercase tracking-wider border border-brand-red/50"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Job
                </button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div className="flex space-x-4 h-full min-w-max px-1">
                        {COLUMNS.map((col) => (
                            <Column
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                jobs={jobs.filter(j => (j.status || 'ESTIMATE') === col.id)}
                            />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeId ? (
                            <JobCard job={jobs.find(j => j.id === activeId)!} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            <AddJobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onJobAdded={triggerRefresh}
            />
        </div>
    );
}
