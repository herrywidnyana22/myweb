'use client';

import { useEffect, useState, useCallback } from 'react';
import { FormInput } from '../form/FormInput';
import { FormSelect } from '../form/FormSelect';
import { FormImageUpload } from '../form/FormImageUpload';
import { FormError } from '../form/FormError';
import { ModalHeader } from '../form/ModalHeader';
import { ModalActions } from '../form/ModalActions';
import { MultiLangInput } from '../form/MultiLangInput';
import { MultiLangText, createMultiLangText } from '@/lib/constants/languages';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalizedText } from '@/hooks/useLocalizedText';

const DEFAULT_EDUCATION: Omit<Education, 'id'> = {
  school: '',
  major: '',
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear(),
  schoolLogo: '',
  icon: '',
  categoryId: '',
};

export const EducationModal = ({
  isOpen,
  onClose,
  onSave,
  education,
  categories = [],
}: EducationModalProps) => {
  const [formData, setFormData] = useState<Education>(
    (education as Education) || ({
      id: '',
      ...DEFAULT_EDUCATION,
    } as Education)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { selectedTranslationLanguages, getLanguageInfo } = useLanguage();
  const { getText } = useLocalizedText();

  useEffect(() => {
    if (education) {
      setFormData(education);
      setIconPreview(education.icon || null);
      setLogoPreview(education.schoolLogo || null);
    } else {
      setFormData({
        id: '',
        ...DEFAULT_EDUCATION,
      } as Education);
      setIconPreview(null);
      setLogoPreview(null);
    }
    setError('');
  }, [education, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'startYear' || name === 'endYear'
          ? value
            ? Number(value)
            : undefined
          : value,
    }));
  };

  const handleMultiLangChange = (field: string, value: MultiLangText) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file: File, type: 'icon' | 'logo') => {
    if (type === 'icon') {
      setIsUploadingIcon(true);
    } else {
      setIsUploadingLogo(true);
    }
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = (await res.json()) as { url: string };
      if (type === 'icon') {
        setFormData((prev) => ({ ...prev, icon: data.url }));
        setIconPreview(data.url);
      } else {
        setFormData((prev) => ({ ...prev, schoolLogo: data.url }));
        setLogoPreview(data.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      if (type === 'icon') {
        setIsUploadingIcon(false);
      } else {
        setIsUploadingLogo(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { school, major, startYear, endYear, categoryId } = formData;
      
      // Extract source text for validation
      const majorValue = typeof major === 'string' ? major : major?.source || '';
      
      if (!school || !majorValue.trim() || !startYear || !endYear || !categoryId) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      if (startYear > endYear) {
        setError('Start year cannot be greater than end year');
        setIsSubmitting(false);
        return;
      }

      await onSave(formData);
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save education');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = useCallback(() => {
    setError('');
    setIsSubmitting(false);
    setIsUploadingIcon(false);
    setIsUploadingLogo(false);
    setIconPreview(null);
    setLogoPreview(null);
    setFormData({
      id: '',
      ...DEFAULT_EDUCATION,
    } as Education);
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader
          title={education ? 'Edit Education' : 'Add Education'}
          onClose={handleCloseModal}
          disabled={isSubmitting}
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormError message={error} />

          <div className="space-y-4">
            <FormSelect
              label="Category"
              required
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select a category' },
                ...categories.map((cat) => ({
                  value: cat.id,
                  label: typeof cat.name === 'string' ? cat.name : getText(cat.name),
                })),
              ]}
              disabled={isSubmitting}
            />
            <FormInput
              label="School"
              required
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="e.g., STIKOM Bali"
              disabled={isSubmitting}
            />

            <MultiLangInput
              label="Major"
              value={formData.major || createMultiLangText('')}
              onChange={(val) => handleMultiLangChange('major', val)}
              selectedLanguages={selectedTranslationLanguages}
              placeholder="e.g., Computer Science"
              disabled={isSubmitting}
              type="input"
              getLanguageInfo={getLanguageInfo}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Start Year"
                required
                type="number"
                name="startYear"
                value={formData.startYear || ''}
                onChange={handleChange}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear()}
                disabled={isSubmitting}
              />

              <FormInput
                label="End Year"
                required
                type="number"
                name="endYear"
                value={formData.endYear || ''}
                onChange={handleChange}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear() + 10}
                disabled={isSubmitting}
              />
            </div>

            <FormImageUpload
              label="Icon"
              imagePreview={iconPreview}
              isUploading={isUploadingIcon}
              onUpload={(file) => handleImageUpload(file, 'icon')}
              onRemove={() => {
                setFormData((prev) => ({ ...prev, icon: undefined }));
                setIconPreview(null);
              }}
              disabled={isSubmitting}
            />

            <FormImageUpload
              label="School Logo"
              imagePreview={logoPreview}
              isUploading={isUploadingLogo}
              onUpload={(file) => handleImageUpload(file, 'logo')}
              onRemove={() => {
                setFormData((prev) => ({ ...prev, schoolLogo: undefined }));
                setLogoPreview(null);
              }}
              disabled={isSubmitting}
            />
          </div>

          <ModalActions
            isSubmitting={isSubmitting}
            onCancel={handleCloseModal}
            submitLabel="Save Education"
          />
        </form>
      </div>
    </div>
  );
}

