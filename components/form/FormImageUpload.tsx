'use client';

import Image from 'next/image';

import { X, Upload } from 'lucide-react';

export function FormImageUpload({
  label = 'Photo',
  imagePreview,
  isUploading,
  onUpload,
  onRemove,
  error,
  disabled,
}: FormImageUploadProps) {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !disabled) {
      try {
        await onUpload(file);
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
  };

  const isDisabled = disabled || isUploading;

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-3">
        {imagePreview && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
            <Image
              src={imagePreview}
              alt="Preview"
              height={40}
              width={40}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onRemove}
              disabled={isDisabled}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <label className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg transition ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
          <div className="flex items-center gap-2 text-gray-700">
            <Upload size={20} />
            <span className="text-sm">
              {isUploading ? 'Uploading...' : 'Click to upload image'}
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={isDisabled}
            className="hidden"
          />
        </label>
        <p className="text-xs text-gray-500">
          Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
        </p>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    </div>
  );
}
