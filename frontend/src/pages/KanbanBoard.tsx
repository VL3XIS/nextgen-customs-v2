import { useEffect, useState, useCallback } from 'react';
import { DndContext, useDroppable, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import api from '../services/api';
import JobCard from '../components/JobCard';
import ImportJobModal from '../components/ImportJobModal';
import AddJobModal from '../components/AddJobModal';
import { Plus, Upload } from 'lucide-react';
import type { Job } from '../types';

const COLUMNS = [
    { id: 'ESTIMATE', title: 'ESTIMATE' },
    { id: 'APPROVED', title: 'APPROVED' },
    { id: 'IN_PROGRESS', title: 'IN PROGRESS' },
    { id: 'PAINT', title: 'PAINT' },
    { id: 'QUALITY_CHECK', title: 'QUALITY CHECK' },
    { id: 'COMPLETE', title: 'COMPLETE' },
];

function Column({ id, title, jobs }: { id: string, title: string, jobs: Job[] }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col h-full min-w-[300px] w-80 glass-panel rounded-xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="font-bold text-white font-rajdhani uppercase tracking-wider text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
                    {title}
                </h3>
                <span className="text-[10px] font-bold bg-black/40 text-gray-400 px-2.5 py-0.5 rounded border border-white/10 font-mono">{jobs.length}</span>
            </div>
            <div ref={setNodeRef} className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
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
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importedData, setImportedData] = useState<any>(null);

    const triggerRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    const handleImport = (data: any) => {
        setImportedData(data);
        setIsModalOpen(true);
    };

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
                    <h1 className="text-3xl font-bold text-white font-rajdhani uppercase tracking-wider flex items-center gap-3">
                        JOBS
                        <div className="h-px w-12 bg-gradient-to-r from-brand-red to-transparent"></div>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-light tracking-wide">Manage vehicle jobs and workflow</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white px-4 py-2.5 rounded-lg border border-white/10 hover:border-white/30 transition-all flex items-center font-rajdhani uppercase tracking-wider text-sm font-bold"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Import Estimate
                    </button>
                    <button
                        onClick={() => {
                            setImportedData(null);
                            setIsModalOpen(true);
                        }}
                        className="btn-neon px-6 py-2.5 rounded-xl flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Job
                    </button>
                </div>
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
                onClose={() => {
                    setIsModalOpen(false);
                    setImportedData(null);
                }}
                onJobAdded={triggerRefresh}
                initialData={importedData}
            />
            <ImportJobModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />
        </div>
    );
}
