import { useState, useEffect, useRef } from 'react';
import { Upload, X, Play, Wand2, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VideoCreatorProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function VideoCreatorModal({ isOpen, onClose }: VideoCreatorProps) {
    const [beforeImage, setBeforeImage] = useState<string | null>(null);
    const [afterImage, setAfterImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState<boolean>(false);

    // Ref to track open state inside async closures
    const isOpenRef = useRef(isOpen);
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    if (!isOpen) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'before') setBeforeImage(reader.result as string);
                else setAfterImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Safety check for resets
    useEffect(() => {
        if (!isOpen) {
            setIsGenerating(false);
            setGeneratedVideo(false);
        }
    }, [isOpen]);

    const handleGenerate = () => {
        if (!beforeImage || !afterImage) {
            toast.error('Missing Assets', { description: 'Please upload both Before and After images.' });
            return;
        }

        setIsGenerating(true);
        // Simulate "AI Processing" time
        setTimeout(() => {
            // Check the Ref, not the stale closure variable
            if (isOpenRef.current) {
                setIsGenerating(false);
                setGeneratedVideo(true);
                toast.success('Video Generated', { description: 'Your Reel has been created successfully!' });
            }
        }, 3500);
    };

    // Handle Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-[#121212] w-full max-w-4xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[600px] relative"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Left: Input Panel */}
                <div className="w-full md:w-1/2 p-6 flex flex-col border-r border-white/10 bg-black/20">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold font-rajdhani uppercase tracking-wider text-white flex items-center gap-2">
                            <Play className="h-5 w-5 text-brand-red" />
                            Reel Creator <span className="text-[10px] bg-brand-neon/20 text-brand-neon px-2 py-0.5 rounded border border-brand-neon/30">BETA</span>
                        </h2>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">1. Before Image</label>
                            <div className="relative h-40 border-2 border-dashed border-white/10 rounded-xl overflow-hidden hover:border-brand-neon/50 transition-colors group">
                                {beforeImage ? (
                                    <>
                                        <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setBeforeImage(null)}
                                            className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                                        <Upload className="h-6 w-6 text-gray-600 mb-2" />
                                        <span className="text-xs text-gray-500">Upload Base Photo</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'before')} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">2. After Image</label>
                            <div className="relative h-40 border-2 border-dashed border-white/10 rounded-xl overflow-hidden hover:border-brand-neon/50 transition-colors group">
                                {afterImage ? (
                                    <>
                                        <img src={afterImage} alt="After" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setAfterImage(null)}
                                            className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                                        <Upload className="h-6 w-6 text-gray-600 mb-2" />
                                        <span className="text-xs text-gray-500">Upload Result Photo</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'after')} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!beforeImage || !afterImage || isGenerating}
                        className="mt-6 w-full bg-brand-red hover:bg-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        {isGenerating ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                                Generating Magic...
                            </>
                        ) : (
                            <>
                                <Wand2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                Generate 15s Reel
                            </>
                        )}
                        {/* Shimmer Effect */}
                        {!isGenerating && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
                    </button>
                </div>

                {/* Right: Preview Panel */}
                <div className="w-full md:w-1/2 bg-black/80 flex items-center justify-center relative overflow-hidden">
                    {(generatedVideo && beforeImage && afterImage) ? (
                        <VideoPreviewPlayer before={beforeImage} after={afterImage} />
                    ) : (
                        <div className="text-center p-8">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                <Play className="h-8 w-8 text-gray-600 ml-1" />
                            </div>
                            <h3 className="text-white font-bold mb-2">Detailed Preview</h3>
                            <p className="text-sm text-gray-500">Generate a video to see the magic happen.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function VideoPreviewPlayer({ before, after }: { before: string, after: string }) {
    const [showAfter, setShowAfter] = useState(false);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowAfter(prev => !prev);
        }, 2200);
        return () => clearInterval(interval);
    }, []);

    const handleExport = () => {
        setExporting(true);
        setTimeout(() => {
            setExporting(false);
            toast.success('Video Exported', { description: 'Reel saved to device gallery.' });
        }, 2000);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
            {/* Phone Frame */}
            <div className="relative w-[300px] h-[580px] overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black">

                {/* Layer 1: Before Image (Always present at bottom) */}
                <div className="absolute inset-0">
                    <img
                        src={before}
                        className="w-full h-full object-cover animate-[kenburnsPunch_3s_linear_forwards]"
                        alt="Before"
                    />
                </div>

                {/* Layer 2: After Image (Fades in/out) */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${showAfter ? 'opacity-100' : 'opacity-0'}`}>
                    <img
                        src={after}
                        className="w-full h-full object-cover animate-[kenburnsPunch_3s_linear_forwards]"
                        alt="After"
                    />
                </div>

                {/* Flash Overlay */}
                <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 ${showAfter ? 'opacity-40' : 'opacity-0'}`} />

                {/* UI Overlay */}
                <div className="absolute top-4 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-10 flex justify-between items-start">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span className="text-[10px] font-bold text-white tracking-widest uppercase transition-all duration-300">
                            {showAfter ? 'AFTER ✨' : 'BEFORE'}
                        </span>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center border-2 border-white/20">
                            <span className="font-rajdhani font-bold text-white text-xs">NX</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white shadow-black drop-shadow-md">NextGen Customs</p>
                            <p className="text-[10px] text-gray-300">Original Audio • Trending</p>
                        </div>
                    </div>
                    <p className="text-sm text-white font-medium drop-shadow-md leading-tight mb-4">
                        Wait for the result... 🤯 The transformation is insane! #Detailing #AutoBody
                    </p>

                    {/* Fake Music Visualizer */}
                    <div className="flex items-end gap-1 h-6 opacity-80">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-1 bg-brand-red rounded-full animate-music-bar" style={{
                                height: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.1}s`
                            }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Export Button floating outside phone frame */}
            <div className="absolute bottom-8 right-8 z-50">
                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="bg-brand-red hover:bg-brand-red/80 text-white p-3 rounded-full shadow-lg shadow-brand-red/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Export Reel"
                >
                    {exporting ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        <Download className="h-6 w-6" />
                    )}
                </button>
            </div>

            <style>{`
                @keyframes kenburnsPunch {
                    0% { transform: scale(1); filter: brightness(1); }
                    100% { transform: scale(1.15); filter: brightness(1.1); }
                }
                @keyframes music-bar {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
                .animate-music-bar {
                    animation: music-bar 0.8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
