import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

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

    return (
        <div className="space-y-4">
            {/* Input Type Toggle (Hidden for now as we focus on URL, but structure is ready) */}
            <div className="flex bg-muted/50 p-1 rounded-lg w-fit hidden">
                <button
                    type="button"
                    onClick={() => setInputType('url')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${inputType === 'url' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Image URL
                </button>
                <button
                    type="button"
                    onClick={() => setInputType('file')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${inputType === 'file' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Upload
                </button>
            </div>

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
                            onError={handleImageError}
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
                            <a
                                href={preview}
                                target="_blank"
                                rel="noreferrer"
                                className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                            >
                                <LinkIcon className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-dashed border-border/50 rounded-xl p-8 transition-colors hover:border-primary/50 hover:bg-primary/5 group">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <ImageIcon className="h-8 w-8 text-primary/60 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg">Add an Image</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Paste an image URL below to preview
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* URL Input */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LinkIcon className="h-4 w-4" />
                </div>
                <Input
                    value={value || ''} // Handle null/undefined
                    onChange={handleUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="pl-9 bg-background/50 border-white/10 focus:border-primary/50 transition-all font-mono text-xs"
                />
            </div>

            {/* Helper text */}
            <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>Supported: JPG, PNG, WEBP</span>
                <span>Aspect Ratio: {aspectRatio}:1</span>
            </div>
        </div>
    );
}
