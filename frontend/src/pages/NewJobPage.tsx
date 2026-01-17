import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, X, Loader2 } from 'lucide-react';

export default function NewJobPage() {
    const [photos, setPhotos] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        vehicle: '',
        customerName: '',
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
            data.append('services', formData.services);
            data.append('notes', formData.notes);

            photos.forEach(photo => {
                data.append('photos', photo);
            });

            const jobResponse = await api.post('/jobs', data);
            const jobId = jobResponse.data.job.id;

            // 2. Generate Posts immediately
            await api.post('/posts/generate', { jobId });

            // 3. Navigate to review
            navigate(`/dashboard/jobs/${jobId}/review`);
        } catch (error) {
            console.error('Error creating job:', error);
            alert('Failed to create job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Job</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Photo Upload Section */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-brand-red transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 font-medium">Click to upload photos</p>
                            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                        </div>

                        <div className="mt-4 space-y-2">
                            {photos.map((photo, index) => (
                                <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                    <span className="truncate max-w-[150px]">{photo.name}</span>
                                    <button onClick={() => removePhoto(index)} className="text-red-500 hover:text-red-700">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                            <input
                                type="text"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                                placeholder="e.g. John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Info</label>
                            <input
                                type="text"
                                value={formData.vehicle}
                                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                                placeholder="e.g. 2023 Honda Accord"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Services Performed</label>
                            <textarea
                                value={formData.services}
                                onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none h-32"
                                placeholder="e.g. Front bumper repair, color matching, clear coat..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none h-24"
                                placeholder="Any specific details to highlight?"
                            />
                        </div>

                        <div className="pt-4 flex items-center justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brand-red hover:bg-brand-darkRed text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-red-500/30 flex items-center disabled:opacity-50"
                            >
                                {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                                Generate AI Posts
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
