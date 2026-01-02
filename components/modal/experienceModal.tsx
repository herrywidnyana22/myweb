'use client';

import { useEffect, useState, useCallback } from 'react';
import { FormInput } from '../form/FormInput';
import { FormSelect } from '../form/FormSelect';
import { FormTextarea } from '../form/FormTextarea';
import { FormImageUpload } from '../form/FormImageUpload';
import { FormError } from '../form/FormError';
import { ModalHeader } from '../form/ModalHeader';
import { ModalActions } from '../form/ModalActions';

const DEFAULT_EXPERIENCE: Omit<Experience, 'id'> = {
  company: '',
  role: '',
  location: '',
  start: '',
  end: '',
  jobdesk: '',
  description: '',
  icon: '',
  categoryId: '',
};

export const ExperienceModal = ({
  isOpen,
  onClose,
  onSave,
  experience,
  categories = [],
}: ExperienceModalProps) => {
  const [formData, setFormData] = useState<Experience>(
    (experience as Experience) || ({
      id: '',
      ...DEFAULT_EXPERIENCE,
    } as Experience)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    if (experience) {
      setFormData(experience);
      setIconPreview(experience.icon || null);
    } else {
      setFormData({
        id: '',
        ...DEFAULT_EXPERIENCE,
      } as Experience);
      setIconPreview(null);
    }
    setError('');
  }, [experience, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = (await res.json()) as { url: string };
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
      const { company, role, location, start, end, categoryId } = formData;
      if (!company || !role || !location || !start || !end || !categoryId) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      await onSave(formData);
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save experience');
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
      ...DEFAULT_EXPERIENCE,
    } as Experience);
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader
          title={experience ? 'Edit Experience' : 'Add Experience'}
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
                  label: cat.name,
                })),
              ]}
              disabled={isSubmitting}
            />

            <FormInput
              label="Company"
              required
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g., Google"
              disabled={isSubmitting}
            />

            <FormInput
              label="Role"
              required
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Senior Software Engineer"
              disabled={isSubmitting}
            />

            <FormInput
              label="Location"
              required
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., San Francisco, CA"
              disabled={isSubmitting}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Start Date"
                required
                type="text"
                name="start"
                value={formData.start}
                onChange={handleChange}
                placeholder="e.g., Jan 2020"
                disabled={isSubmitting}
              />

              <FormInput
                label="End Date"
                required
                type="text"
                name="end"
                value={formData.end}
                onChange={handleChange}
                placeholder="e.g., Dec 2023 or Present"
                disabled={isSubmitting}
              />
            </div>

            <FormTextarea
              label="Job Description"
              name="jobdesk"
              value={formData.jobdesk || ''}
              onChange={handleChange}
              placeholder="Brief job description..."
              rows={3}
              disabled={isSubmitting}
            />

            <FormTextarea
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Additional details..."
              rows={3}
              disabled={isSubmitting}
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
            submitLabel="Save Experience"
          />
        </form>
      </div>
    </div>
  );
}

