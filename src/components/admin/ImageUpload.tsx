import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, RefreshCw, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    aspectRatio?: number; // e.g., 16/9
    maxWidth?: number;
    maxHeight?: number;
}

export function ImageUpload({
    value,
    onChange,
    aspectRatio = 16 / 9,
}: ImageUploadProps) {
    const [preview, setPreview] = useState(value);
    const [loading, setLoading] = useState(false);
    const [cropperModalOpen, setCropperModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const cropperRef = useRef<ReactCropperElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update preview when value changes
    React.useEffect(() => {
        setPreview(value);
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setCropperModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const onCrop = async () => {
        if (!cropperRef.current) return;
        const cropper = cropperRef.current.cropper;

        // Get cropped canvas
        const canvas = cropper.getCroppedCanvas();
        if (!canvas) {
            toast.error("Could not crop image");
            return;
        }

        setLoading(true);
        setCropperModalOpen(false);

        try {
            // Convert to blob
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    throw new Error("Canvas is empty");
                }

                // Upload to Cloudinary
                const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "do5jdaaef";
                const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "AurangPortfolio";

                const formData = new FormData();
                formData.append('file', blob);
                formData.append('upload_preset', uploadPreset);
                formData.append('folder', 'portfolio_uploads');

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();
                const imageUrl = data.secure_url;

                onChange(imageUrl);
                setPreview(imageUrl);
                toast.success('Image uploaded successfully!');
                setLoading(false);
            }, 'image/jpeg', 0.9);

        } catch (error) {
            console.error('Upload Error:', error);
            toast.error('Image upload failed.');
            setLoading(false);
        }
    };

    const handleClear = () => {
        onChange('');
        setPreview('');
    };

    return (
        <div className="space-y-4">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {preview ? (
                <div className="relative group rounded-xl overflow-hidden border border-border/50 bg-black/5 hover:border-primary/50 transition-all">
                    <div
                        className="w-full relative"
                        style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
                    >
                        <img
                            src={preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-contain bg-black/20"
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-10 px-4 gap-2"
                            >
                                <RefreshCw className="h-4 w-4" /> Change
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-10 w-10"
                                onClick={handleClear}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => loading ? null : fileInputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed border-border/50 rounded-xl p-8 transition-colors hover:border-primary/50 hover:bg-primary/5 group relative ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    )}
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <ImageIcon className="h-8 w-8 text-primary/60 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg">Click to Upload</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Select an image to crop and upload
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Cropper Modal */}
            <Dialog open={cropperModalOpen} onOpenChange={setCropperModalOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-screen-md h-[90vh] md:h-auto flex flex-col p-0 gap-0 overflow-hidden">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>Edit Image</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 min-h-[400px] bg-black relative">
                        {imageSrc && (
                            <Cropper
                                src={imageSrc}
                                style={{ height: '100%', width: '100%' }}
                                initialAspectRatio={aspectRatio}
                                aspectRatio={aspectRatio}
                                guides={true}
                                ref={cropperRef}
                                viewMode={1}
                                dragMode="move"
                                className="h-[400px] md:h-[500px]"
                            />
                        )}
                    </div>

                    <DialogFooter className="p-4 border-t bg-card flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="flex gap-2 w-full sm:w-auto justify-center">
                            <Button variant="outline" size="icon" onClick={() => cropperRef.current?.cropper.rotate(-90)}>
                                <RefreshCw className="w-4 h-4 -scale-x-100" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => cropperRef.current?.cropper.rotate(90)}>
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => cropperRef.current?.cropper.zoom(0.1)}>
                                <ZoomIn className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => cropperRef.current?.cropper.zoom(-0.1)}>
                                <ZoomOut className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setCropperModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="flex-1 sm:flex-none" onClick={onCrop}>
                                <Check className="w-4 h-4 mr-2" /> Upload
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
