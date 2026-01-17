import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';

interface AddJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJobAdded: () => void;
    initialData?: {
        vehicle?: string;
        customerName?: string;
        services?: string;
        notes?: string;
    };
}

export default function AddJobModal({ isOpen, onClose, onJobAdded, initialData }: AddJobModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vehicle: initialData?.vehicle || '',
        customerName: initialData?.customerName || '',
        services: initialData?.services || '',
        notes: initialData?.notes || ''
    });

    // Update form data when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                vehicle: initialData.vehicle || '',
                customerName: initialData.customerName || '',
                services: initialData.services || '',
                notes: initialData.notes || ''
            });
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('vehicle', formData.vehicle);
            data.append('customerName', formData.customerName);
            data.append('services', formData.services);
            data.append('notes', formData.notes);

            await api.post('/jobs', data);
            onJobAdded();
            onClose();
            setFormData({ vehicle: '', customerName: '', services: '', notes: '' });
        } catch (error) {
            console.error('Error adding job:', error);
            alert('Failed to add job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Job</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                        <input
                            required
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                        <input
                            required
                            type="text"
                            value={formData.vehicle}
                            onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                            placeholder="2024 Toyota Camry"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                        <textarea
                            required
                            value={formData.services}
                            onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none h-20 resize-none"
                            placeholder="Bumper repair..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none h-20 resize-none"
                            placeholder="Optional notes..."
                        />
                    </div>

                    <div className="pt-2 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-darkRed font-medium flex items-center"
                        >
                            {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                            Create Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
