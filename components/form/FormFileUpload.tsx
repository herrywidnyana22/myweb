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
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-3">
        {fileUrl && (
          <div className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <FileText size={20} />
              <span className="text-sm truncate">
                {fileUrl.split('/').pop()}
              </span>
            </div>
            <button
              type="button"
              onClick={onRemove}
              disabled={isDisabled}
              className="bg-red-600 hover:bg-red-700 text-white p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <label className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg transition ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}>
          <div className="flex items-center gap-2 text-gray-700">
            <Upload size={20} />
            <span className="text-sm">
              {isUploading ? 'Uploading...' : `Click to upload ${label.toLowerCase()}`}
            </span>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={isDisabled}
            className="hidden"
          />
        </label>
        <p className="text-xs text-gray-500">{description}</p>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
