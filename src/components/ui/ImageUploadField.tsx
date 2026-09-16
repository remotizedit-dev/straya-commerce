'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  X,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://...',
  required = false,
  helperText,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [triedProxy, setTriedProxy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasError(false);
    setTriedProxy(false);
  }, [value]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);

    // Instant local preview from browser memory
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);
    setHasError(false);
    setTriedProxy(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image to S3');
      }

      onChange(data.url);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Network error during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleClear = () => {
    setLocalPreview(null);
    setHasError(false);
    setTriedProxy(false);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine S3 key if value is an AWS S3 URL
  const s3Key = value && value.includes('.amazonaws.com/') ? value.split('.amazonaws.com/')[1] : null;

  // Active image source for preview
  const imageSrc = localPreview || (triedProxy && s3Key ? `/api/media/${s3Key}` : value);

  const handleImageError = () => {
    // If not tried proxy yet and it is an S3 URL, try proxying through Next.js server
    if (!localPreview && !triedProxy && s3Key) {
      setTriedProxy(true);
      return;
    }
    setHasError(true);
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="block text-slate-700 font-bold">
          {label} {required && <span className="text-[#FF007A]">*</span>}
        </label>
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all flex items-center space-x-1 cursor-pointer ${
              mode === 'upload'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('url');
              setLocalPreview(null);
            }}
            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all flex items-center space-x-1 cursor-pointer ${
              mode === 'url'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Paste URL</span>
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              required={required && !value}
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                setLocalPreview(null);
                onChange(e.target.value);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900 pr-10 text-xs font-mono"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Upload Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
              isDragOver
                ? 'border-[#FF007A] bg-[#FF007A]/5'
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400'
            } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {isUploading ? (
              <div className="flex flex-col items-center space-y-2 py-2">
                <Loader2 className="w-7 h-7 text-[#FF007A] animate-spin" />
                <span className="font-bold text-slate-800 text-xs">Uploading to S3...</span>
                <span className="text-[10px] text-slate-400 font-mono">Storing high-res compound image</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-slate-200/70 flex items-center justify-center text-slate-700">
                  <UploadCloud className="w-5 h-5 text-[#FF007A]" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">
                    Click to browse or drag & drop image
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    PNG, JPG, WEBP, or SVG (Up to 25MB)
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-start space-x-2">
              <span className="font-bold">Error:</span>
              <span className="flex-1">{uploadError}</span>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="text-red-500 hover:text-red-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Image Preview & Details */}
      {(value || localPreview) && (
        <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl border border-slate-200 gap-3">
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            {hasError && !localPreview ? (
              <div className="relative w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 overflow-hidden shrink-0 flex items-center justify-center text-amber-600">
                <ImageIcon className="w-5 h-5" />
              </div>
            ) : (
              <div className="relative w-12 h-12 rounded-xl bg-white overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {hasError && !localPreview ? (
                <>
                  <div className="flex items-center space-x-1 text-amber-700 font-bold text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>S3 Object Stored</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono truncate max-w-[240px] sm:max-w-xs">
                    {value}
                  </p>
                  <p className="text-[9px] text-amber-600 mt-0.5">
                    Uploaded to S3! Set bucket policy to public-read for public view.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-1 text-emerald-600 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Image Active & Ready</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono truncate max-w-[240px] sm:max-w-xs">
                    {value || 'Local Preview'}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {value && (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
                title="Open full image in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {helperText && <p className="text-[10px] text-slate-400">{helperText}</p>}
    </div>
  );
};

