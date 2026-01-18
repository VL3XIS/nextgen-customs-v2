import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';
import { z } from 'zod';
import { toast } from 'sonner';

const jobSchema = z.object({
    customerName: z.string().min(2, "Name must be at least 2 characters"),
    customerEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
    vehicle: z.string().min(3, "Vehicle details too short"),
    services: z.string().min(5, "Please detail the services"),
    notes: z.string().optional(),
    estimatedValue: z.coerce.number().optional()
});

interface AddJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJobAdded: () => void;
    initialData?: {
        vehicle?: string;
        customerName?: string;
        customerEmail?: string;
        services?: string;
        notes?: string;
        estimatedValue?: string | number;
    };
}

export default function AddJobModal({ isOpen, onClose, onJobAdded, initialData }: AddJobModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vehicle: initialData?.vehicle || '',
        customerName: initialData?.customerName || '',
        customerEmail: initialData?.customerEmail || '',
        services: initialData?.services || '',
        notes: initialData?.notes || '',
        estimatedValue: initialData?.estimatedValue?.toString() || ''
    });

    // Update form data when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                vehicle: initialData.vehicle || '',
                customerName: initialData.customerName || '',
                customerEmail: initialData.customerEmail || '',
                services: initialData.services || '',
                notes: initialData.notes || '',
                estimatedValue: initialData.estimatedValue?.toString() || ''
            });
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Zod Validation
        const result = jobSchema.safeParse(formData);
        if (!result.success) {
            const errorMsg = result.error.issues[0].message;
            toast.error(errorMsg);
            return;
        }

        setLoading(true);
        try {
            const data = {
                vehicle: formData.vehicle,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                services: formData.services,
                notes: formData.notes || '',
                estimatedValue: formData.estimatedValue
            };

            // Using JSON instead of FormData unless we are actively uploading files in this modal
            // If file upload is needed, we revert to FormData but for now generic JSON is cleaner for text
            await api.post('/jobs', data);

            toast.success('Job created successfully');
            onJobAdded();
            onClose();
            onJobAdded();
            onClose();
            setFormData({ vehicle: '', customerName: '', customerEmail: '', services: '', notes: '', estimatedValue: '' });
        } catch (error) {
            console.error('Error adding job:', error);
            toast.error('Failed to create job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="glass-panel-neon w-full max-w-md p-6 relative animate-fade-in border border-white/10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold font-display text-white mb-6 uppercase tracking-wider">Add New Job</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-red uppercase tracking-wider mb-1">Customer Name</label>
                        <input
                            required
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            className="input-neon w-full px-4 py-2"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer Email (Optional)</label>
                        <input
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                            className="input-neon w-full px-4 py-2"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Estimated Value ($)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.estimatedValue}
                            onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                            className="input-neon w-full px-4 py-2"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-red uppercase tracking-wider mb-1">Vehicle</label>
                        <input
                            required
                            type="text"
                            value={formData.vehicle}
                            onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                            className="input-neon w-full px-4 py-2"
                            placeholder="2024 Toyota Camry"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Services</label>
                        <textarea
                            required
                            value={formData.services}
                            onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                            className="input-neon w-full px-4 py-2 h-24 resize-none"
                            placeholder="Bumper repair, full detail..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="input-neon w-full px-4 py-2 h-20 resize-none"
                            placeholder="Insurance claim #..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center"
                        >
                            {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                            Create Job
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
