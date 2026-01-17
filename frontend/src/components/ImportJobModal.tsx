import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';

interface ImportJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: any) => void;
}

export default function ImportJobModal({ isOpen, onClose, onImport }: ImportJobModalProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        if (file.type === 'text/xml' || file.name.endsWith('.xml') || file.name.endsWith('.ems')) {
            setFile(file);
            setError(null);
        } else {
            setError('Please upload a valid CIECA EMS/BMS XML file.');
            setFile(null);
        }
    };

    const parseXML = async () => {
        if (!file) return;
        setLoading(true);

        try {
            const text = await file.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");

            // Helper to safe extract text
            const val = (tag: string) => {
                const el = xmlDoc.getElementsByTagName(tag)[0];
                return el ? el.textContent : '';
            };

            // Heuristics for different formats (CIECA, Mitchell, CCC)
            const year = val('Year') || val('VehicleYear');
            const make = val('MakeDescription') || val('VehicleMake');
            const model = val('ModelDescription') || val('VehicleModel');
            const vin = val('VIN') || val('VehicleIdentificationNumber');

            const clientFirst = val('FirstName') || val('PersonName');
            const clientLast = val('LastName');
            const company = val('CompanyName'); // Commercial clients

            const customerName = company
                ? company
                : (clientFirst && clientLast ? `${clientFirst} ${clientLast}` : 'Unknown Client');

            const vehicle = (year && make && model)
                ? `${year} ${make} ${model}`
                : (vin ? `VIN: ${vin}` : 'Unknown Vehicle');

            const total = val('TotalAmount') || val('GrandTotal');

            // Generate parsed data object
            const importedData = {
                customerName: customerName,
                vehicle: vehicle,
                services: `Imported Estimate (${file.name})\nVIN: ${vin || 'N/A'}\nTotal Estimate: $${total || '0.00'}\n\nReview required.`,
                notes: 'Imported via EMS/BMS integration.'
            };

            onImport(importedData);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to parse estimate file. Is it a valid XML?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-bold text-white font-rajdhani uppercase tracking-wider">Import Estimate</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {!file ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-brand-red bg-brand-red/10' : 'border-white/20 hover:border-brand-red hover:bg-white/5'}`}
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                                <Upload className={`h-8 w-8 ${isDragging ? 'text-brand-red' : 'text-gray-400'}`} />
                            </div>
                            <p className="text-white font-bold text-lg mb-2">Drop Estimate File Here</p>
                            <p className="text-gray-500 text-sm text-center max-w-xs">Supports CCC, Mitchell, Audatex (EMS/BMS XML formats)</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".xml,.ems"
                                onChange={handleFileSelect}
                            />
                        </div>
                    ) : (
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex items-center justify-between">
                            <div className="flex items-center">
                                <FileText className="h-8 w-8 text-brand-red mr-4" />
                                <div>
                                    <p className="text-white font-medium">{file.name}</p>
                                    <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400 text-sm">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={parseXML}
                            disabled={!file || loading}
                            className="bg-brand-red hover:bg-brand-red/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg font-bold shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all font-rajdhani uppercase tracking-wider flex items-center"
                        >
                            {loading ? 'Processing...' : 'Import Data'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
