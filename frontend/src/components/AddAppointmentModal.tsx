import { useState } from 'react';
import { X, Calendar, Clock, Car, User, Phone, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface AddAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    preselectedDate?: Date;
}

export default function AddAppointmentModal({ isOpen, onClose, onSuccess, preselectedDate }: AddAppointmentModalProps) {
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '', // Added email field
        date: preselectedDate ? preselectedDate.toISOString().split('T')[0] : '',
        time: '09:00',
        type: 'consultation',
        vehicleModel: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Create a proper ISO string that includes the user's local timezone
            const localDateTime = new Date(`${formData.date}T${formData.time}:00`);

            await api.post('/appointments', {
                customer_name: formData.customerName,
                customer_phone: formData.customerPhone,
                customer_email: formData.customerEmail,
                full_date_iso: localDateTime.toISOString(), // Send the full UTC point in time
                appointment_type: formData.type,
                vehicle_info: { model: formData.vehicleModel },
                special_notes: formData.notes
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to book appointment.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                >
                    <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
                        <h2 className="text-xl font-bold text-white font-rajdhani">New Appointment</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-brand-neon" />
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:border-brand-neon focus:outline-none"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 w-4 h-4 text-brand-neon" />
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:border-brand-neon focus:outline-none"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Client Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:border-brand-neon focus:outline-none"
                                        value={formData.customerName}
                                        onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="(555) 000-0000"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:border-brand-neon focus:outline-none"
                                        value={formData.customerPhone}
                                        onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Field Added */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email (for confirmation)</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="client@example.com"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:border-brand-neon focus:outline-none"
                                    value={formData.customerEmail}
                                    onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vehicle</label>
                            <div className="relative">
                                <Car className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 2024 Ford Mustang"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:border-brand-neon focus:outline-none"
                                    value={formData.vehicleModel}
                                    onChange={e => setFormData({ ...formData, vehicleModel: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                            <select
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:border-brand-neon focus:outline-none"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="consultation">Consultation</option>
                                <option value="drop_off">Drop Off</option>
                                <option value="inspection">Inspection</option>
                                <option value="pickup">Pickup</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notes</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <textarea
                                    rows={2}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 text-white focus:border-brand-neon focus:outline-none resize-none"
                                    placeholder="Reason for visit..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brand-red hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Booking...' : 'Book Appointment'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
