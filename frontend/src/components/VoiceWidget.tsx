import { useConversation } from '@11labs/react';
import { Mic, Volume2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import api from '../services/api';
import { cn } from '../utils/cn';
import { toast } from 'sonner';

export default function VoiceWidget() {

    // Executive Tools (Mode 2) - "Alex" Dashboard Capabilities
    // These run LOCALLY in the browser, replacing the need for Webhooks during the demo.
    const clientTools = {
        // --- OPERATIONS ---
        list_active_jobs: async ({ filter }: { filter?: string }) => {
            console.log("Alex: List Active Jobs", filter);
            try {
                const { data } = await api.post('/agent/list-active-jobs', { filter });
                return JSON.stringify(data);
            } catch (err) {
                console.error("Tool Error", err);
                return "Error fetching jobs.";
            }
        },

        // --- ANALYTICS ---
        analyze_revenue: async ({ time_period }: { time_period: string }) => {
            console.log("Alex: Analyze Revenue", time_period);
            try {
                const { data } = await api.post('/agent/analyze-revenue', { time_period });
                return JSON.stringify(data);
            } catch (err) {
                return "Error analyzing revenue.";
            }
        },

        // --- CUSTOMER SERVICE ---
        check_status: async ({ vehicle, customerName }: { vehicle?: string, customerName?: string }) => {
            // Handle variations in parameters from LLM
            const query = vehicle || customerName || "Unknown";
            console.log("Alex: Check Status", query);
            try {
                const { data } = await api.post('/agent/check-status', { vehicle: query });
                return JSON.stringify(data);
            } catch (err) {
                return "Error checking status.";
            }
        },

        search_customer_history: async ({ customer_identifier }: { customer_identifier: string }) => {
            console.log("Alex: Search History", customer_identifier);
            try {
                const { data } = await api.post('/agent/search-history', { customer_identifier });
                return JSON.stringify(data);
            } catch (err) {
                return "Error searching history.";
            }
        },

        // --- SCHEDULING ---
        check_availability: async ({ date, appointment_type }: { date: string, appointment_type?: string }) => {
            console.log("Alex: Check Avail", date);
            try {
                const { data } = await api.post('/agent/check-availability', { date, appointment_type });
                return JSON.stringify(data);
            } catch (err) {
                return "Error checking availability.";
            }
        },

        book_appointment: async (params: any) => {
            console.log("Alex: Book Appt", params);
            const toastId = toast.loading("Securely booking your appointment...");
            try {
                const { data } = await api.post('/agent/book-appointment', params);

                if (data.success) {
                    toast.success("Appointment Booked!", { id: toastId });
                } else {
                    toast.error("Booking Failed: " + data.message, { id: toastId });
                }

                return JSON.stringify(data);
            } catch (err) {
                console.error(err);
                toast.error("Connection Error: Could not book.", { id: toastId });
                return "Error booking appointment.";
            }
        },

        generate_report: async ({ report_type }: { report_type: string }) => {
            console.log("Alex: Generate Report", report_type);
            try {
                const { data } = await api.post('/agent/generate-report', { report_type });
                return JSON.stringify(data);
            } catch (err) {
                return "Error generating report.";
            }
        },

        reschedule_appointment: async ({ appointment_id, new_date, new_time }: { appointment_id: string, new_date: string, new_time: string }) => {
            console.log("Alex: Reschedule Appt", { appointment_id, new_date, new_time });
            try {
                const { data } = await api.post('/agent/reschedule-appointment', { appointment_id, new_date, new_time });
                return JSON.stringify(data);
            } catch (err) {
                return "Error rescheduling appointment.";
            }
        },

        cancel_appointment: async ({ appointment_id, cancellation_reason }: { appointment_id: string, cancellation_reason: string }) => {
            console.log("Alex: Cancel Appt", { appointment_id, cancellation_reason });
            try {
                const { data } = await api.post('/agent/cancel-appointment', { appointment_id, cancellation_reason });
                return JSON.stringify(data);
            } catch (err) {
                return "Error cancelling appointment.";
            }
        },

        get_staff_schedule: async ({ date, staff_member }: { date: string, staff_member?: string }) => {
            console.log("Alex: Get Staff Schedule", { date, staff_member });
            try {
                const { data } = await api.post('/agent/get-staff-schedule', { date, staff_member });
                return JSON.stringify(data);
            } catch (err) {
                return "Error fetching staff schedule.";
            }
        }
    };

    // DEBUG LOGGING STATE
    const [lastLog, setLastLog] = useState<string>("");

    // Enhanced Conversation Hook
    const conversation = useConversation({
        onConnect: () => setLastLog('Connected to Alex'),
        onDisconnect: () => setLastLog('Disconnected'),
        onMessage: (message: any) => {
            console.log('Message:', message);
            // Detect "tool calls" in the message stream if possible, or just raw text
            if (message.source === 'user') setLastLog(`You: ${message.message}`);
            if (message.source === 'ai') setLastLog(`Alex: ${message.message}`);
        },
        onUnhandledClientToolCall: (toolCall: any) => {
            const msg = `UNHANDLED TOOL: "${toolCall.toolName}"`;
            console.error(msg, toolCall);
            toast.error(msg + " - Check Console for details");
            setLastLog(msg);
        },
        onError: (error) => {
            console.error('Error:', error);
            setLastLog(`Error: ${error}`);
        },
        clientTools: clientTools // This connects the SDK to your code
    });

    const startConversation = useCallback(async () => {
        try {
            setLastLog("Requesting Token...");
            // 1. Get the ephemeral token from our backend (secures the API Key)
            const { data } = await api.get('/elevenlabs/token');
            const signedUrl = data.signedUrl;

            setLastLog("Starting Session...");

            // Calculate Dynamic Date (Single Source of Truth)
            const now = new Date();
            const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

            const dynamicDate = now.toLocaleDateString('en-US', dateOptions); // "Monday, January 19, 2026"
            const dynamicTime = now.toLocaleTimeString('en-US', timeOptions); // "6:15 PM"

            // 2. Start the session with the signed URL and Dynamic Identity
            const startConfig: any = {
                signedUrl: signedUrl,
                // Pass identity variables to the Agent's prompt
                // clientTools: clientTools, // Removing this from here to rely on useConversation default to avoid conflicts
                dynamicVariables: {
                    user_name: "Alexis (Owner)",
                    user_role: "ADMIN",
                    current_time: `${dynamicDate} at ${dynamicTime} (Current Year is 2026)`
                }
            };

            await conversation.startSession(startConfig);
            setLastLog("Session Active. Speak now.");
        } catch (error) {
            console.error('Failed to start conversation:', error);
            toast.error("Could not start Voice Agent");
            setLastLog("Failed to Start.");
        }
    }, [conversation]);

    const stopConversation = useCallback(async () => {
        await conversation.endSession();
    }, [conversation]);

    const toggleListening = () => {
        if (conversation.status === 'connected') {
            stopConversation();
        } else {
            startConversation();
        }
    };

    const runManualTest = async () => {
        const testData = {
            customer_name: "TEST USER",
            customer_phone: "555-0199",
            scheduled_date: "2026-01-21",
            scheduled_time: "10:00",
            transaction_id: "test-" + Date.now(),
            vehicle_model: "Test Car"
        };
        const tid = toast.loading("Running Diagnostic Test...");
        try {
            console.log("Running Manual Test:", testData);
            const { data } = await api.post('/agent/book-appointment', testData);
            if (data.success) {
                toast.success("DIAGNOSTIC PASS: Backend is Working!", { id: tid });
            } else {
                toast.error("DIAGNOSTIC FAIL: Backend rejected.", { id: tid });
            }
        } catch (e) {
            console.error(e);
            toast.error("DIAGNOSTIC FAIL: Connection Error.", { id: tid });
        }
    };

    return (
        <>
            {/* DEBUG LOG OVERLAY - Bottom Left */}
            <div className="fixed bottom-6 left-6 z-[100] max-w-sm pointer-events-none font-mono text-[10px] text-green-500 bg-black/80 p-2 rounded border border-green-900/50">
                <span className="opacity-50">AGENT LOG:</span><br />
                {lastLog}
            </div>

            <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">

                {/* DIAGNOSTIC BUTTON - visible only when disconnected for sanity check */}
                {conversation.status !== 'connected' && (
                    <button
                        onClick={runManualTest}
                        className="text-[10px] text-gray-500 hover:text-white underline mb-2 bg-black/50 px-2 py-1 rounded cursor-pointer"
                    >
                        Test Booking Connection
                    </button>
                )}

                {/* Status Bubble (Only shows when active) */}
                {conversation.status === 'connected' && (
                    <div className="bg-black/80 backdrop-blur-md border border-brand-red protocol-text text-white px-4 py-2 rounded-lg shadow-2xl animate-in fade-in slide-in-from-bottom-5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                            <span className="font-rajdhani uppercase tracking-wider text-xs font-bold text-brand-red">
                                {conversation.isSpeaking ? 'ALEX SPEAKING' : 'LISTENING...'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Main Button */}
                <button
                    onClick={toggleListening}
                    className={cn(
                        "h-14 w-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all duration-300 border border-white/10 relative overflow-hidden group",
                        conversation.status === 'connected'
                            ? "bg-brand-red animate-pulse-slow"
                            : "bg-zinc-900 hover:bg-zinc-800"
                    )}
                >
                    {/* Holographic clean effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {conversation.status === 'connected' ? (
                        <Volume2 className="h-6 w-6 text-white relative z-10" />
                    ) : (
                        <Mic className="h-6 w-6 text-white group-hover:text-brand-red transition-colors relative z-10" />
                    )}
                </button>
            </div>
        </>
    );
}
