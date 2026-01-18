import { useRef, useState } from 'react';
import { X, ImagePlus, ArrowRight, Loader2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface BeforeAfterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (file: File) => void;
}

export default function BeforeAfterModal({ isOpen, onClose, onSave }: BeforeAfterModalProps) {
    const [beforeImage, setBeforeImage] = useState<string | null>(null);
    const [afterImage, setAfterImage] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    // We need a ref to the collage container to capture it
    const collageRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (type === 'before') setBeforeImage(ev.target?.result as string);
                else setAfterImage(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateCollage = async () => {
        if (!beforeImage || !afterImage || !collageRef.current) return;

        setProcessing(true);
        try {
            // Wait a moment for images to fully render if mostly loaded
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(collageRef.current, {
                useCORS: true, // If we're using job images from URL later
                scale: 2, // Higher quality
                backgroundColor: '#000000'
            });

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `collage-${Date.now()}.png`, { type: 'image/png' });
                    onSave(file);
                    toast.success("Before/After collage created!");
                    onClose();
                    // Reset
                    setBeforeImage(null);
                    setAfterImage(null);
                }
            }, 'image/png');

        } catch (error) {
            console.error(error);
            toast.error("Failed to generate collage");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Left: Controls */}
                <div className="w-full md:w-1/3 p-6 border-r border-white/10 bg-zinc-900/50 flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-bold font-rajdhani uppercase tracking-wider text-white mb-2">Comparison Tool</h2>
                        <p className="text-xs text-gray-500">Upload two photos to generate a professional branded comparison asset.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Before Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Before Photo</label>
                            <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-lg hover:border-brand-red/50 hover:bg-white/5 cursor-pointer transition-all overflow-hidden relative">
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'before')} />
                                {beforeImage ? (
                                    <img src={beforeImage} className="w-full h-full object-cover opacity-60" alt="Before Preview" />
                                ) : (
                                    <div className="text-center">
                                        <ImagePlus className="h-6 w-6 mx-auto mb-1 text-gray-500" />
                                        <span className="text-[10px] text-gray-500">Select Image</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* After Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">After Photo</label>
                            <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-lg hover:border-brand-red/50 hover:bg-white/5 cursor-pointer transition-all overflow-hidden relative">
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'after')} />
                                {afterImage ? (
                                    <img src={afterImage} className="w-full h-full object-cover opacity-60" alt="After Preview" />
                                ) : (
                                    <div className="text-center">
                                        <ImagePlus className="h-6 w-6 mx-auto mb-1 text-gray-500" />
                                        <span className="text-[10px] text-gray-500">Select Image</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={generateCollage}
                            disabled={!beforeImage || !afterImage || processing}
                            className="w-full py-3 bg-brand-red hover:bg-brand-red/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            {processing ? <Loader2 className="animate-spin h-5 w-5" /> : <Download className="h-5 w-5" />}
                            Generate Asset
                        </button>
                    </div>
                </div>

                {/* Right: Live Preview (Hidden Canvas Capture Area) */}
                <div className="w-full md:w-2/3 bg-black flex items-center justify-center p-8 overflow-hidden relative">
                    <div className="absolute top-4 left-4 z-10 bg-black/60 px-3 py-1 rounded text-xs text-gray-400 uppercase font-mono">
                        Preview
                    </div>

                    {/* THIS IS WHAT GETS CAPTURED */}
                    <div
                        ref={collageRef}
                        className="relative w-[800px] h-[800px] bg-black flex flex-col shadow-2xl transform scale-[0.6] origin-center" // scalable container
                    >
                        {/* Header Branding */}
                        <div className="h-16 bg-zinc-950 flex items-center justify-between px-8 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-1 bg-brand-red"></div>
                                <span className="text-white font-rajdhani font-bold text-xl tracking-widest uppercase">Next Gen Customs</span>
                            </div>
                            <span className="text-gray-500 text-sm tracking-wide">Transformation</span>
                        </div>

                        <div className="flex-1 flex relative">
                            {/* Before Side */}
                            <div className="w-1/2 h-full relative border-r border-white/10">
                                {beforeImage && <img src={beforeImage} className="w-full h-full object-cover" alt="Before" />}
                                <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md px-4 py-2 border-l-4 border-gray-500">
                                    <span className="text-white font-bold text-2xl uppercase tracking-widest font-rajdhani">Before</span>
                                </div>
                            </div>

                            {/* Center Divider Icon */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-brand-red p-3 rounded-full shadow-[0_0_30px_rgba(255,42,60,0.5)] border-4 border-black">
                                <ArrowRight className="h-8 w-8 text-white" />
                            </div>

                            {/* After Side */}
                            <div className="w-1/2 h-full relative">
                                {afterImage && <img src={afterImage} className="w-full h-full object-cover" alt="After" />}
                                <div className="absolute bottom-6 right-6 bg-brand-red/90 backdrop-blur-md px-4 py-2 border-r-4 border-white">
                                    <span className="text-white font-bold text-2xl uppercase tracking-widest font-rajdhani">After</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Branding */}
                        <div className="h-12 bg-zinc-950 flex items-center justify-center border-t border-white/10">
                            <span className="text-gray-600 uppercase tracking-[0.2em] text-xs">Quality Craftsmanship • Premium Results</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
