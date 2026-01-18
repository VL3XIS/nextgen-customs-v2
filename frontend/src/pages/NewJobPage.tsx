// ... imports ...
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, X, Loader2, FileImage } from 'lucide-react';

export default function NewJobPage() {
    const [photos, setPhotos] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        vehicle: '',
        customerName: '',
        customerEmail: '',
        estimatedValue: '',
        services: '',
        notes: ''
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPhotos([...photos, ...Array.from(e.target.files)]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Create Job with FormData for photo support
            const data = new FormData();
            data.append('vehicle', formData.vehicle);
            data.append('customerName', formData.customerName);
            data.append('customerEmail', formData.customerEmail);
            data.append('estimatedValue', formData.estimatedValue);
            data.append('services', formData.services);
            data.append('notes', formData.notes);

            photos.forEach(photo => {
                data.append('photos', photo);
            });

            await api.post('/jobs', data);

            // 3. Navigate to active jobs board (Kanban)
            navigate('/dashboard/jobs');
        } catch (error) {
            console.error('Error creating job:', error);
            alert('Failed to create job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-wider font-rajdhani uppercase">
                    JOB INTAKE
                </h1>
                <p className="text-gray-500 mt-1 text-sm">Create a new vehicle job and generate social media posts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Photo Upload Section - Glass Card */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-black/60 backdrop-blur-md rounded-xl border border-brand-red/20 p-6 text-center">
                        <div className="border-2 border-dashed border-brand-red/30 rounded-xl p-8 hover:border-brand-red hover:bg-brand-red/5 transition-all cursor-pointer relative group">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="relative z-0">
                                <div className="mx-auto h-16 w-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-brand-red/30">
                                    <Upload className="h-8 w-8 text-brand-red" />
                                </div>
                                <p className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">Drop photos here</p>
                                <p className="text-xs text-gray-500 mt-1">or click to browse</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {photos.length > 0 && <p className="text-xs text-gray-400 text-left font-medium uppercase tracking-wider">Uploaded Files</p>}
                            {photos.map((photo, index) => (
                                <div key={index} className="flex items-center justify-between text-sm bg-white/5 border border-white/5 p-3 rounded-lg group hover:border-white/20 transition-colors">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <FileImage className="h-4 w-4 text-brand-neon flex-shrink-0" />
                                        <span className="truncate text-gray-300 group-hover:text-white transition-colors">{photo.name}</span>
                                    </div>
                                    <button onClick={() => removePhoto(index)} className="text-gray-500 hover:text-brand-red transition-colors">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Section - Glass Panel */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-black/60 backdrop-blur-md rounded-xl border border-brand-red/20 p-8 space-y-6">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">CUSTOMER NAME</label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">CUSTOMER EMAIL</label>
                                    <input
                                        type="email"
                                        value={formData.customerEmail}
                                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">ESTIMATED VALUE ($)</label>
                                    <input
                                        type="number"
                                        value={formData.estimatedValue}
                                        onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">VEHICLE INFO</label>
                                <input
                                    type="text"
                                    value={formData.vehicle}
                                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                                    placeholder="e.g. 2022 Honda Accord"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">SERVICES PERFORMED</label>
                                <textarea
                                    value={formData.services}
                                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl h-28 resize-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                                    placeholder="e.g. Front bumper repair, color matching, clear coat..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">ADDITIONAL NOTES (OPTIONAL)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl h-20 resize-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 outline-none transition-all"
                                    placeholder="Any specific details to highlight?"
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex items-center justify-end space-x-4 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="text-gray-400 hover:text-white font-medium transition-colors text-sm px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brand-red hover:bg-brand-red/80 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-rajdhani uppercase tracking-wider border border-brand-red/50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span>Create Job Entry</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
