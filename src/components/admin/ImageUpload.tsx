import React, { useState, useRef } from 'react';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
}

// Cloudinary configuration
const CLOUD_NAME = 'do5jdaaef';
const UPLOAD_PRESET = 'AurangPortfolio';

export function ImageUpload({ value, onChange, aspectRatio, maxWidth, maxHeight }: ImageUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB for Cloudinary)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          onChange(data.secure_url);
        } else {
          console.error('Upload failed', data);
          alert('Upload failed: ' + (data.error?.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        alert('Error uploading image');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
      onChange(urlInput);
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-border"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <p className="text-white text-xs font-mono break-all px-4 text-center">{value}</p>
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUrlInput(!showUrlInput)}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              URL
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {showUrlInput && (
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter image URL"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
              />
              <Button type="button" onClick={handleUrlSubmit}>
                Add
              </Button>
            </div>
          )}
          {uploading && (
            <p className="text-xs text-muted-foreground animate-pulse">Uploading to Cloudinary...</p>
          )}
        </div>
      )}
      {value && !value.includes('cloudinary') && (
        <div className="text-xs text-yellow-500">
          ⚠️ Using legacy/external URL
        </div>
      )}
    </div>
  );
}
