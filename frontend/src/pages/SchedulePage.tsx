import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import AddAppointmentModal from '../components/AddAppointmentModal';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SchedulePage() {
    const [currentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAppointments();
        // Optional: Poll every 30s to see voice agent updates live
        const interval = setInterval(fetchAppointments, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/appointments');
            console.log("Fetched appointments:", data); // Debug log
            if (Array.isArray(data)) {
                setAppointments(data);
            } else {
                console.error("API returned non-array:", data);
                setAppointments([]); // Fallback to empty array to prevent crash
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error);
            setAppointments([]); // Safety fallback
        }
    };

    // Helper to format time
    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-500';
            case 'PENDING': return 'bg-yellow-500';
            case 'CANCELLED': return 'bg-red-500';
            default: return 'bg-blue-500';
        }
    };

    // Calendar logic
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const calendarGrid = [];
    for (let i = 0; i < firstDay; i++) {
        calendarGrid.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarGrid.push(i);
    }

    // Check if a day has appointments
    const hasAppointment = (day: number) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return appointments.some(a => {
            const apptDate = new Date(a.date);
            return apptDate.getDate() === day &&
                apptDate.getMonth() === checkDate.getMonth() &&
                apptDate.getFullYear() === checkDate.getFullYear();
        });
    };

    // Filter appointments for the selected date
    const selectedAppointments = appointments.filter(a => {
        const apptDate = new Date(a.date);
        return apptDate.getDate() === selectedDate.getDate() &&
            apptDate.getMonth() === selectedDate.getMonth() &&
            apptDate.getFullYear() === selectedDate.getFullYear();
    });

    const isSelected = (day: number) => {
        return selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold font-rajdhani text-white uppercase tracking-wider flex items-center gap-3">
                        <CalendarIcon className="h-8 w-8 text-brand-neon" />
                        Shop Schedule
                    </h1>
                    <p className="text-gray-400 mt-1">Manage appointments, inspections, and delivery dates.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-red hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,42,60,0.3)] hover:shadow-[0_0_30px_rgba(255,42,60,0.5)]"
                >
                    <Plus className="h-5 w-5" />
                    New Appointment
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Calendar */}
                <div className="lg:col-span-2 bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-network/10 blur-[80px] rounded-full pointer-events-none" />

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white font-rajdhani">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                            <button className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><ChevronRight className="h-5 w-5" /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-4 text-center mb-4">
                        {DAYS.map(day => (
                            <div key={day} className="text-gray-500 font-bold uppercase text-sm">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-4">
                        {calendarGrid.map((day, index) => (
                            <div
                                key={index}
                                onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                className={`
                                    h-24 rounded-xl border border-white/5 p-2 flex flex-col justify-between transition-all hover:bg-white/5 cursor-pointer relative
                                    ${(day && isSelected(day)) ? 'bg-white/20 border-brand-neon shadow-[0_0_20px_rgba(110,231,183,0.2)]' : ''}
                                    ${(!day) ? 'invisible' : ''}
                                    ${(day && day === new Date().getDate() && !isSelected(day)) ? 'border-brand-neon/30' : ''}
                                `}
                            >
                                {day && (
                                    <>
                                        <span className={`text-sm font-bold ${isSelected(day) ? 'text-brand-neon' : 'text-gray-300'}`}>{day}</span>
                                        {/* Status Dots */}
                                        <div className="flex gap-1 mt-1 flex-wrap">
                                            {hasAppointment(day) && (
                                                <div className="w-2 h-2 rounded-full bg-brand-red" />
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Agenda View */}
                <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col h-full">
                    <h3 className="text-xl font-bold text-white font-rajdhani mb-6 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-brand-blue" />
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </h3>

                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {selectedAppointments.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                                <p className="italic">No appointments.</p>
                                <p className="text-xs mt-1">Select another date.</p>
                            </div>
                        )}
                        {selectedAppointments.map((apt, index) => (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-brand-neon font-mono font-bold text-sm">{formatTime(apt.date)}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold text-black ${getStatusColor(apt.status)}`}>
                                        {apt.status}
                                    </span>
                                </div>
                                <h4 className="text-white font-bold">{apt.vehicleModel || "Unknown Vehicle"}</h4>
                                <p className="text-gray-400 text-sm mb-3">Client: {apt.customerName}</p>

                                <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-white/10 pt-3">
                                    <MapPin className="h-3 w-3" />
                                    <span>{apt.appointmentType}</span>
                                </div>
                            </motion.div>
                        ))}

                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="p-4 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 gap-2 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <Plus className="h-6 w-6" />
                            <span className="text-sm font-medium">Add Free Slot</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Booking Modal */}
            <AddAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAppointments}
                preselectedDate={selectedDate}
            />
        </div>
    );
}
