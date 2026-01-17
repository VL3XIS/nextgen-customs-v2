import { useEffect, useState, useCallback } from 'react';
import { DndContext, useDroppable, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import api from '../services/api';
import JobCard from '../components/JobCard';
import AddJobModal from '../components/AddJobModal';
import { Plus } from 'lucide-react';
import type { Job } from '../types';

const COLUMNS = [
    { id: 'ESTIMATE', title: 'Estimate' },
    { id: 'APPROVED', title: 'Approved' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'PAINT', title: 'Paint' },
    { id: 'QUALITY_CHECK', title: 'QC' },
    { id: 'COMPLETE', title: 'Complete' },
];

function Column({ id, title, jobs }: { id: string, title: string, jobs: Job[] }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col h-full min-w-[280px] w-72 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-xl">
                <h3 className="font-bold text-white font-rajdhani uppercase tracking-wider">{title}</h3>
                <span className="text-xs font-bold bg-brand-red/20 text-brand-red px-2 py-1 rounded-full border border-brand-red/20">{jobs.length}</span>
            </div>
            <div ref={setNodeRef} className="flex-1 p-3 overflow-y-auto custom-scrollbar">
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
                    <h1 className="text-3xl font-bold text-white font-rajdhani uppercase tracking-widest glowing-text">Job Status Tracker</h1>
                    <p className="text-gray-400 text-sm mt-1">Drag and drop jobs to update status</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-red hover:bg-brand-darkRed text-white px-6 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(255,42,60,0.3)] hover:shadow-[0_0_25px_rgba(255,42,60,0.5)] flex items-center font-bold font-rajdhani uppercase tracking-wider border border-brand-red"
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
