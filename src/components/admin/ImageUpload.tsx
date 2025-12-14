import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

declare global {
    interface Window {
        cloudinary: any;
    }
}

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    aspectRatio?: number;
    maxWidth?: number;
    maxHeight?: number;
}

export function ImageUpload({
    value,
    onChange,
    aspectRatio = 16 / 9,
    maxWidth = 800,
    maxHeight = 450
}: ImageUploadProps) {
    const [preview, setPreview] = useState(value);
    const [loading, setLoading] = useState(false);
    const [inputType, setInputType] = useState<'url' | 'file'>('url');

    // Update preview when value changes
    useEffect(() => {
        setPreview(value);
    }, [value]);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        onChange(url);
        // Simple validation to check if it looks like an image URL
        if (url && (url.match(/\.(jpeg|jpg|gif|png|webp)|cloudinary|unsplash/i) || url.startsWith('data:image'))) {
            setPreview(url);
        }
    };

    const handleClear = () => {
        onChange('');
        setPreview('');
    };

    const handleImageError = () => {
        // Only show error toast if there was a value
        if (preview) {
            // quiet fail or show indicator?
            // toast.error('Failed to load image preview');
        }
    };

    const handleUpload = () => {
        if (!window.cloudinary) {
            toast.error("Cloudinary widget not loaded. Please check your script tag.");
            return;
        }

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "do5jdaaef";
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "AurangPortfolio";

        setLoading(true);

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: cloudName,
                uploadPreset: uploadPreset,
                cropping: true,
                croppingAspectRatio: aspectRatio,
                croppingShowDimensions: true,
                croppingValidateDimensions: true,
                showSkipCropButton: false,
                sources: ['local', 'url', 'camera'],
                clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
                maxImageFileSize: 5000000, // 5MB
                maxImageWidth: maxWidth,
                maxImageHeight: maxHeight,
                folder: 'portfolio_uploads', // Optional: specify a folder
            },
            (error: any, result: any) => {
                if (result?.event === 'close') {
                    setLoading(false);
                }
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    toast.error('Image upload failed.');
                    setLoading(false);
                } else if (result.event === 'success') {
                    const imageUrl = result.info.secure_url;
                    onChange(imageUrl);
                    setPreview(imageUrl);
                    toast.success('Image uploaded successfully!');
                    setLoading(false);
                }
            }
        );

        widget.open();
    };

    return (
        <div className="space-y-4">
            {preview ? (
                <div className="relative group rounded-xl overflow-hidden border border-border/50 bg-black/20">
                    <div
                        className="w-full relative"
                        style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
                    >
                        <img
                            src={preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-full"
                                onClick={handleClear}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onClick={handleUpload}
                    className="cursor-pointer border-2 border-dashed border-border/50 rounded-xl p-8 transition-colors hover:border-primary/50 hover:bg-primary/5 group relative"
                >
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 rounded-xl">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    )}
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <ImageIcon className="h-8 w-8 text-primary/60 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg">Click to Upload</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Upload image via Cloudinary
                            </p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
