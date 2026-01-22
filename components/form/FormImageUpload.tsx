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
    <div className='md:col-span-2'>
      <label className='mb-2 block text-sm font-medium text-gray-700'>
        {label}
      </label>
      <div className='space-y-3'>
        {imagePreview && (
          <div className='relative h-48 w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-100'>
            <Image
              src={imagePreview}
              alt='Preview'
              height={40}
              width={40}
              className='h-full w-full object-cover'
            />
            <button
              type='button'
              onClick={onRemove}
              disabled={isDisabled}
              className='absolute top-2 right-2 rounded bg-red-600 p-1 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <X size={16} />
            </button>
          </div>
        )}
        <label
          className={`flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 transition ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}
        >
          <div className='flex items-center gap-2 text-gray-700'>
            <Upload size={20} />
            <span className='text-sm'>
              {isUploading ? 'Uploading...' : 'Click to upload image'}
            </span>
          </div>
          <input
            type='file'
            accept='image/*'
            onChange={handleChange}
            disabled={isDisabled}
            className='hidden'
          />
        </label>
        <p className='text-xs text-gray-500'>
          Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
        </p>
        {error && <p className='text-error text-xs'>{error}</p>}
      </div>
    </div>
  );
}
