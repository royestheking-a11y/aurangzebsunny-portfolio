import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Slider } from './slider';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Upload Image',
  aspectRatio,
  maxWidth = 1200,
  maxHeight = 1200,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || '');
  const [showEditor, setShowEditor] = useState(false);
  const [tempImage, setTempImage] = useState<string>('');
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setTempImage(imageUrl);
      setShowEditor(true);
      setScale(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlInput = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setPreview(url);
      onChange(url);
    }
  };

  const processImage = useCallback(() => {
    if (!tempImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Calculate dimensions
      let width = img.width;
      let height = img.height;

      // Apply aspect ratio if specified
      if (aspectRatio) {
        const currentRatio = width / height;
        if (currentRatio > aspectRatio) {
          width = height * aspectRatio;
        } else {
          height = width / aspectRatio;
        }
      }

      // Scale down if too large
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Apply scale
      width *= scale;
      height *= scale;

      canvas.width = width;
      canvas.height = height;

      // Apply transformations
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const processedImage = canvas.toDataURL('image/jpeg', 0.9);
      setPreview(processedImage);
    };
    img.src = tempImage;
  }, [tempImage, scale, rotation, aspectRatio, maxWidth, maxHeight]);

  const handleSaveImage = () => {
    processImage();
    onChange(preview);
    setShowEditor(false);
    setTempImage('');
  };

  const handleRemoveImage = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {!preview ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleUrlInput}
            >
              Use URL
            </Button>
          </>
        ) : (
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg border"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Change
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Image Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Adjust Image</DialogTitle>
            <DialogDescription>Make adjustments to the image before saving.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: '400px' }}>
              {tempImage && (
                <img
                  src={tempImage}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s',
                  }}
                />
              )}
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Zoom</label>
                  <span className="text-sm text-muted-foreground">{Math.round(scale * 100)}%</span>
                </div>
                <Slider
                  value={[scale]}
                  onValueChange={(value) => setScale(value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRotation((r) => r - 90)}
                  className="flex-1"
                >
                  <RotateCw className="w-4 h-4 mr-2 rotate-180" />
                  Rotate Left
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRotation((r) => r + 90)}
                  className="flex-1"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate Right
                </Button>
              </div>
            </div>

            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditor(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveImage}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}