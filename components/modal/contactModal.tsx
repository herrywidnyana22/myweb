'use client';

import { useEffect, useState, useCallback } from 'react';
import { FormInput } from '../form/FormInput';
import { FormSelect } from '../form/FormSelect';
import { FormTextarea } from '../form/FormTextarea';
import { FormImageUpload } from '../form/FormImageUpload';
import { FormError } from '../form/FormError';
import { ModalHeader } from '../form/ModalHeader';
import { ModalActions } from '../form/ModalActions';

const DEFAULT_CONTACT: Omit<Contact, 'id'> = {
  title: '',
  description: '',
  tooltipText: '',
  icon: '',
  bgColor: '',
  contactURL: '',
  categoryId: '',
};

export function ContactModal({
  isOpen,
  onClose,
  onSave,
  contact,
  categories,
}: ContactModalProps) {
  const [formData, setFormData] = useState<Contact>(
    (contact as Contact) || ({
      id: '',
      ...DEFAULT_CONTACT,
    } as Contact)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    if (contact) {
      setFormData(contact);
      setIconPreview(contact.icon || null);
    } else {
      setFormData({
        id: '',
        ...DEFAULT_CONTACT,
      } as Contact);
      setIconPreview(null);
    }
    setError('');
  }, [contact, isOpen]);

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
      const { title, categoryId, description } = formData;
      if (!title || !categoryId || !description) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      await onSave(formData);
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contact');
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
      ...DEFAULT_CONTACT,
    } as Contact);
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
          title={contact ? 'Edit Contact' : 'Add Contact'}
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
              disabled={isSubmitting}
              options={[
                { value: '', label: 'Select a category' },
                ...(categories || []).map(cat => ({ value: cat.id, label: cat.name }))
              ]}
            />

            <FormInput
              label="Title"
              required
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Email, GitHub, LinkedIn"
              disabled={isSubmitting}
            />

            <FormInput
              label="Description"
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., testing@gmail.com, 123-456-7890"
              disabled={isSubmitting}
            />

            <FormInput
              label="Tooltip Text"
              type="text"
              name="tooltipText"
              value={formData.tooltipText}
              onChange={handleChange}
              placeholder="e.g., Click to send email"
              disabled={isSubmitting}
            />

            <FormInput
              label="Contact URL"
              type="url"
              name="contactURL"
              value={formData.contactURL}
              onChange={handleChange}
              placeholder="e.g., https://github.com/username"
              disabled={isSubmitting}
            />

            <FormInput
              label="Background Color"
              type="text"
              name="bgColor"
              value={formData.bgColor}
              onChange={handleChange}
              placeholder="e.g., #0066cc or bg-blue-500"
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
            submitLabel="Save Contact"
          />
        </form>
      </div>
    </div>
  );
}
