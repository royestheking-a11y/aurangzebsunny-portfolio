import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, Check, File } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
    value: string;
    onChange: (url: string) => void;
    accept?: string;
    maxSizeMB?: number;
}

export function FileUpload({
    value,
    onChange,
    accept = ".pdf,.pptx,.doc,.docx",
    maxSizeMB = 10,
}: FileUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        setLoading(true);

        try {
            // Upload to Cloudinary
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "do5jdaaef";
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "AurangPortfolio";

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', 'portfolio_documents');
            // resource_type 'auto' lets Cloudinary decide if it's raw (pdf/ppt) or image
            formData.append('resource_type', 'auto');

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Upload failed');
            }

            const data = await response.json();
            const fileUrl = data.secure_url;

            onChange(fileUrl);
            toast.success('File uploaded successfully!');
        } catch (error: any) {
            console.error('Upload Error:', error);
            toast.error(`File upload failed: ${error.message}`);
        } finally {
            setLoading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClear = () => {
        onChange('');
    };

    const getFileName = (url: string) => {
        if (!url) return '';
        try {
            const parts = url.split('/');
            return decodeURIComponent(parts[parts.length - 1]);
        } catch {
            return 'Attached File';
        }
    };

    return (
        <div className="space-y-4">
            <input
                type="file"
                accept={accept}
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {value ? (
                <div className="relative flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{getFileName(value)}</p>
                            <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                View File
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-muted-foreground hover:text-primary"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Replace
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={handleClear}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => loading ? null : fileInputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed border-border/50 rounded-xl p-6 transition-colors hover:border-primary/50 hover:bg-primary/5 group relative ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    )}
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Upload className="h-6 w-6 text-primary/60 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">Click to upload resume</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PDF, PPTX, or DOCX up to {maxSizeMB}MB
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
