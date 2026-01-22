'use client';

import { X, Upload, FileText } from 'lucide-react';

export function FormFileUpload({
  label = 'File',
  fileUrl,
  isUploading,
  onUpload,
  onRemove,
  error,
  disabled,
  accept = '.pdf',
  description = 'Supported format: PDF. Max size: 10MB',
}: FormFileUploadProps) {
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
        {fileUrl && (
          <div className='relative flex w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-4 py-3'>
            <div className='flex items-center gap-2 text-gray-700'>
              <FileText size={20} />
              <span className='truncate text-sm'>
                {fileUrl.split('/').pop()}
              </span>
            </div>
            <button
              type='button'
              onClick={onRemove}
              disabled={isDisabled}
              className='rounded bg-red-600 p-1 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
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
              {isUploading
                ? 'Uploading...'
                : `Click to upload ${label.toLowerCase()}`}
            </span>
          </div>
          <input
            type='file'
            accept={accept}
            onChange={handleChange}
            disabled={isDisabled}
            className='hidden'
          />
        </label>
        <p className='text-xs text-gray-500'>{description}</p>
        {error && <p className='text-xs text-red-600'>{error}</p>}
      </div>
    </div>
  );
}
