import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data for the Demo
const UPCOMING_APPOINTMENTS = [
    {
        id: 1,
        time: '09:00 AM',
        customer: 'John Doe',
        vehicle: '1969 Camaro',
        type: 'Inspection',
        status: 'Confirmed',
        color: 'bg-green-500'
    },
    {
        id: 2,
        time: '11:30 AM',
        customer: 'Alice Smith',
        vehicle: '2022 Tesla Model S',
        type: 'Ceramic Coating Consultation',
        status: 'Pending',
        color: 'bg-yellow-500'
    },
    {
        id: 3,
        time: '02:00 PM',
        customer: 'Mike Ross',
        vehicle: '2018 Ford Mustang GT',
        type: 'Pickup',
        status: 'Confirmed',
        color: 'bg-blue-500'
    },
    {
        id: 4,
        time: '04:15 PM',
        customer: 'Sarah Connor',
        vehicle: 'Toyota Supra MK4',
        type: 'Wrap Design Review',
        status: 'Confirmed',
        color: 'bg-purple-500'
    }
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SchedulePage() {
    const [currentDate] = useState(new Date());

    // Simple calendar generation logic (static for Jan 2026 for demo stability or dynamic)
    // Let's make it dynamic but simple
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const calendarGrid = [];
    for (let i = 0; i < firstDay; i++) {
        calendarGrid.push(null); // Empty slots
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarGrid.push(i);
    }

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
                <button className="bg-brand-red hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,42,60,0.3)] hover:shadow-[0_0_30px_rgba(255,42,60,0.5)]">
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
                                className={`
                                    h-24 rounded-xl border border-white/5 p-2 flex flex-col justify-between transition-all hover:bg-white/5 cursor-pointer relative
                                    ${day === currentDate.getDate() ? 'bg-white/10 border-brand-neon/50 shadow-[0_0_15px_rgba(110,231,183,0.1)]' : ''}
                                    ${!day ? 'invisible' : ''}
                                `}
                            >
                                {day && (
                                    <>
                                        <span className={`text-sm font-bold ${day === currentDate.getDate() ? 'text-brand-neon' : 'text-gray-300'}`}>{day}</span>
                                        {/* Mock Dots for activity */}
                                        <div className="flex gap-1 mt-1 flex-wrap">
                                            {day === 18 && <div className="w-2 h-2 rounded-full bg-brand-red" />}
                                            {(day === 20 || day === 22) && <div className="w-2 h-2 rounded-full bg-brand-blue" />}
                                            {day === currentDate.getDate() && (
                                                <>
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                                </>
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
                        Today's Agenda
                    </h3>

                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {UPCOMING_APPOINTMENTS.map((apt, index) => (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-brand-neon font-mono font-bold text-sm">{apt.time}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold text-black ${apt.color}`}>
                                        {apt.status}
                                    </span>
                                </div>
                                <h4 className="text-white font-bold">{apt.vehicle}</h4>
                                <p className="text-gray-400 text-sm mb-3">Client: {apt.customer}</p>

                                <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-white/10 pt-3">
                                    <MapPin className="h-3 w-3" />
                                    <span>{apt.type}</span>
                                </div>
                            </motion.div>
                        ))}

                        <div className="p-4 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 gap-2 hover:bg-white/5 transition-colors cursor-pointer">
                            <Plus className="h-6 w-6" />
                            <span className="text-sm font-medium">Add Free Slot</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
