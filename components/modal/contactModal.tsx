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
    (contact as Contact) ||
      ({
        id: '',
        ...DEFAULT_CONTACT,
      } as Contact)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const { selectedTranslationLanguages, getLanguageInfo } = useLanguage();
  const { getText } = useLocalizedText();

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiLangChange = (field: string, value: MultiLangText) => {
    setFormData(prev => ({
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
      setFormData(prev => ({ ...prev, icon: data.url }));
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
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div className='max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl'>
        <ModalHeader
          title={contact ? 'Edit Contact' : 'Add Contact'}
          onClose={handleCloseModal}
          disabled={isSubmitting}
        />

        <form onSubmit={handleSubmit} className='space-y-6 p-6'>
          <FormError message={error} />

          <div className='space-y-4'>
            <FormSelect
              label='Category'
              required
              name='categoryId'
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isSubmitting}
              options={[
                { value: '', label: 'Select a category' },
                ...(Array.isArray(categories) ? categories : []).map(cat => ({
                  value: cat.id,
                  label:
                    typeof cat.name === 'string' ? cat.name : getText(cat.name),
                })),
              ]}
            />

            <FormInput
              label='Title'
              required
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='e.g., Email, GitHub, LinkedIn'
              disabled={isSubmitting}
            />

            <MultiLangInput
              label='Description'
              value={formData.description || createMultiLangText('')}
              onChange={val => handleMultiLangChange('description', val)}
              selectedLanguages={selectedTranslationLanguages}
              placeholder='e.g., testing@gmail.com, 123-456-7890'
              disabled={isSubmitting}
              type='input'
              getLanguageInfo={getLanguageInfo}
            />

            <MultiLangInput
              label='Tooltip Text'
              value={formData.tooltipText || createMultiLangText('')}
              onChange={val => handleMultiLangChange('tooltipText', val)}
              selectedLanguages={selectedTranslationLanguages}
              placeholder='e.g., Click to send email'
              disabled={isSubmitting}
              type='input'
              getLanguageInfo={getLanguageInfo}
            />

            <FormInput
              label='Contact URL'
              type='url'
              name='contactURL'
              value={formData.contactURL}
              onChange={handleChange}
              placeholder='e.g., https://github.com/username'
              disabled={isSubmitting}
            />

            <FormInput
              label='Background Color'
              type='text'
              name='bgColor'
              value={formData.bgColor}
              onChange={handleChange}
              placeholder='e.g., #0066cc or bg-blue-500'
              disabled={isSubmitting}
            />

            <FormImageUpload
              label='Icon'
              imagePreview={iconPreview}
              isUploading={isUploadingIcon}
              onUpload={handleImageUpload}
              onRemove={() => {
                setFormData(prev => ({ ...prev, icon: undefined }));
                setIconPreview(null);
              }}
              disabled={isSubmitting}
            />
          </div>

          <ModalActions
            isSubmitting={isSubmitting}
            onCancel={handleCloseModal}
            submitLabel='Save Contact'
          />
        </form>
      </div>
    </div>
  );
}
