'use client';

import { useEffect, useState, useCallback } from 'react';
import { FormInput } from '../form/FormInput';
import { FormImageUpload } from '../form/FormImageUpload';
import { FormError } from '../form/FormError';
import { ModalHeader } from '../form/ModalHeader';
import { ModalActions } from '../form/ModalActions';
import { MultiLangInput } from '../form/MultiLangInput';
import { MultiLangText, createMultiLangText } from '@/lib/constants/languages';
import { useLanguage } from '@/contexts/LanguageContext';

const DEFAULT_CATEGORY: Omit<Category, 'id'> = {
  name: '',
  icon: '',
};

export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  category,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<Category>(
    (category as Category) || ({
      id: '',
      ...DEFAULT_CATEGORY,
    } as Category)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const { selectedTranslationLanguages, getLanguageInfo } = useLanguage();

  useEffect(() => {
    if (category) {
      setFormData(category);
      setIconPreview(category.icon || null);
    } else {
      setFormData({
        id: '',
        ...DEFAULT_CATEGORY,
      } as Category);
      setIconPreview(null);
    }
    setError('');
  }, [category, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiLangChange = (field: string, value: MultiLangText) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingIcon(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await res.json();

      if (result.status !== 'ok') {
        throw new Error(result.msg || result.error || 'Failed to upload image');
      }

      const data = result.data as { url: string };
      setFormData((prev) => ({ ...prev, icon: data.url }));
      setIconPreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploadingIcon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { name } = formData;
      if (!name) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      await onSave(formData);
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = useCallback(() => {
    setError('');
    setIsSubmitting(false);
    setIsUploadingIcon(false);
    setIconPreview(null);
    setFormData({
      id: '',
      ...DEFAULT_CATEGORY,
    } as Category);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        handleCloseModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isSubmitting, handleCloseModal]);

  if (!isOpen) return null;


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <ModalHeader
          title={category ? 'Edit Category' : 'Add Category'}
          onClose={handleCloseModal}
          disabled={isSubmitting}
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormError message={error} />

          <div className="space-y-4">
            <MultiLangInput
              label="Name"
              value={formData.name || createMultiLangText('')}
              onChange={(val) => handleMultiLangChange('name', val)}
              selectedLanguages={selectedTranslationLanguages}
              placeholder="e.g., Kontak, Profil, Proyek"
              disabled={isSubmitting}
              type="input"
              getLanguageInfo={getLanguageInfo}
            />

            <FormImageUpload
              label="Icon"
              imagePreview={iconPreview}
              isUploading={isUploadingIcon}
              onUpload={handleImageUpload}
              onRemove={() => {
                setFormData((prev) => ({ ...prev, icon: undefined }));
                setIconPreview(null);
              }}
              disabled={isSubmitting}
            />
          </div>

          <ModalActions
            isSubmitting={isSubmitting}
            onCancel={handleCloseModal}
            submitLabel="Save Category"
          />
        </form>
      </div>
    </div>
  );
}
