import { X, Copy, Smartphone, Link as LinkIcon, Printer } from 'lucide-react';
import QRCode from 'react-qr-code';
import type { Job } from '../types';
import { toast } from 'sonner';

interface ShareJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
}

export default function ShareJobModal({ isOpen, onClose, job }: ShareJobModalProps) {
    if (!isOpen) return null;

    // Use window.location to detect current host, but fallback for safety.
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/status/${job.id}`;

    // Message for SMS/Email
    const shareMessage = `You can track the progress of your ${job.vehicle} here: ${shareUrl}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
    };

    const handleCopyMessage = () => {
        navigator.clipboard.writeText(shareMessage);
        toast.success("Message copied to clipboard");
    };

    const handlePrint = () => {
        // Create a new window for printing the QR code and details
        const printWindow = window.open('', '', 'width=600,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Print Job QR Code</title>
                    <style>
                        body { font-family: sans-serif; text-align: center; padding: 40px; }
                        .qr-container { margin: 20px auto; }
                        h1 { font-size: 24px; margin-bottom: 10px; }
                        p { font-size: 14px; color: #555; }
                        .footer { margin-top: 30px; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <h1>${job.vehicle}</h1>
                    <p>Scan to view repair status</p>
                    <div class="qr-container">
                        ${document.getElementById('qr-code-svg')?.outerHTML || ''}
                    </div>
                    <p>${job.customerName}</p>
                    <div class="footer">Powered by Next Gen Customs</div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/40">
                    <div>
                        <h2 className="text-xl font-bold font-rajdhani uppercase tracking-wider text-white flex items-center gap-2">
                            Target Customer Portal
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Share live status with your client</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">

                    {/* QR Code Section */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-lg" id="qr-code-container">
                            <QRCode
                                id="qr-code-svg"
                                value={shareUrl}
                                size={180}
                                level="M"
                                fgColor="#000000"
                                bgColor="#FFFFFF"
                            />
                        </div>
                        <p className="text-sm text-gray-400 text-center max-w-[200px]">
                            Scan to instantly view the <span className="text-brand-red font-bold">{job.vehicle}</span> status page.
                        </p>
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleCopyLink}
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-red/50 transition-all group"
                        >
                            <LinkIcon className="h-5 w-5 text-brand-red mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-gray-300">Copy Link</span>
                        </button>
                        <button
                            onClick={handleCopyMessage}
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-red/50 transition-all group"
                        >
                            <Smartphone className="h-5 w-5 text-brand-red mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-gray-300">Copy SMS Text</span>
                        </button>
                    </div>

                    <button
                        onClick={handlePrint}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-brand-red hover:bg-brand-red/80 text-white font-bold uppercase tracking-wider text-sm rounded-xl transition-all shadow-lg shadow-brand-red/20"
                    >
                        <Printer className="h-4 w-4" />
                        Print QR Code for Dashboard
                    </button>

                    {/* URL Preview */}
                    <div className="bg-black/50 rounded-lg p-3 flex items-center justify-between border border-white/5">
                        <span className="text-xs text-gray-500 truncate max-w-[280px] font-mono">{shareUrl}</span>
                        <button onClick={handleCopyLink} className="text-gray-400 hover:text-white">
                            <Copy className="h-4 w-4" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
