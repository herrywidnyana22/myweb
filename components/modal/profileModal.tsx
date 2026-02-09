'use client';

import { useEffect, useState, useCallback } from 'react';
import { FormInput } from '../form/FormInput';
import { FormSelect } from '../form/FormSelect';
import { FormImageUpload } from '../form/FormImageUpload';
import { FormFileUpload } from '../form/FormFileUpload';
import { FormError } from '../form/FormError';
import { ModalHeader } from '../form/ModalHeader';
import { ModalActions } from '../form/ModalActions';
import { MultiLangInput } from '../form/MultiLangInput';
import { MultiLangText, createMultiLangText } from '@/lib/constants/languages';
import { useLanguageStore } from '@/store/language';

const DEFAULT_PROFILE: Omit<Profile, 'id'> = {
  name: '',
  fullName: '',
  jenisKelamin: 'PRIA',
  role: '',
  quote: '',
  categoryId: '',
};

export function ProfileModal({
  isOpen,
  onClose,
  onSave,
  profile,
  categories = [],
}: ProfileModalProps) {
  const [formData, setFormData] = useState<Profile>(
    (profile as Profile) ||
      ({
        id: '',
        ...DEFAULT_PROFILE,
      } as Profile)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [cvPreview, setCVPreview] = useState<string | null>(null);

  // Use global language context
  const { selectedTranslationLanguages, getLanguageInfo } = useLanguageStore();

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setImagePreview(profile.photoURL || null);
      setCVPreview(profile.cvURL || null);
    } else {
      setFormData({
        id: '',
        ...DEFAULT_PROFILE,
      } as Profile);
      setImagePreview(null);
      setCVPreview(null);
    }
    setError('');
  }, [profile, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'experienceYears' || name === 'lat' || name === 'lng'
          ? value
            ? Number(value)
            : undefined
          : value,
    }));
  };

  const handleMultiLangChange = (field: string, value: MultiLangText) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
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
      setFormData(prev => ({ ...prev, photoURL: data.url }));
      setImagePreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCVUpload = async (file: File) => {
    setIsUploadingCV(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const res = await fetch('/api/upload/file', {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await res.json();

      if (result.status !== 'ok') {
        throw new Error(result.msg || result.error || 'Failed to upload CV');
      }

      const data = result.data as { url: string };
      setFormData(prev => ({ ...prev, cvURL: data.url }));
      setCVPreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload CV');
    } finally {
      setIsUploadingCV(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { name, fullName, role, quote, categoryId } = formData;
      if (!name || !fullName || !role || !quote || !categoryId) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      await onSave(formData);
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = useCallback(() => {
    setError('');
    setIsSubmitting(false);
    setIsUploadingImage(false);
    setIsUploadingCV(false);
    setImagePreview(null);
    setCVPreview(null);
    setFormData({
      id: '',
      ...DEFAULT_PROFILE,
    } as Profile);
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
      <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl'>
        <ModalHeader
          title={profile ? 'Edit Profile' : 'Add Profile'}
          onClose={handleCloseModal}
          disabled={isSubmitting}
        />

        <form onSubmit={handleSubmit} className='space-y-6 p-6'>
          <FormError message={error} />
          {/* Category Select */}
          <div className='md:col-span-2'>
            <FormSelect
              label='Category'
              required
              name='categoryId'
              value={formData.categoryId}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select a category' },
                ...(Array.isArray(categories) ? categories : []).map(cat => ({
                  value: cat.id,
                  label: cat.name,
                })),
              ]}
              disabled={isSubmitting}
            />
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Required Fields */}
            <FormInput
              label='Name'
              required
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='e.g., herry'
              disabled={isSubmitting}
            />

            <div className='md:col-span-2'>
              <FormInput
                label='Full Name'
                required
                type='text'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                placeholder='e.g., Herry Sanjaya'
                disabled={isSubmitting}
              />
            </div>

            <FormSelect
              label='Gender'
              required
              name='jenisKelamin'
              value={formData.jenisKelamin}
              onChange={handleChange}
              options={[
                { value: 'PRIA', label: 'Male' },
                { value: 'WANITA', label: 'Female' },
              ]}
              disabled={isSubmitting}
            />

            <div className='md:col-span-2'>
              <MultiLangInput
                label='Role'
                value={formData.role || createMultiLangText('')}
                onChange={val => handleMultiLangChange('role', val)}
                selectedLanguages={selectedTranslationLanguages}
                placeholder='e.g., Full Stack Developer'
                disabled={isSubmitting}
                type='input'
                getLanguageInfo={getLanguageInfo}
              />
            </div>

            <div className='md:col-span-2'>
              <MultiLangInput
                label='Quote'
                value={formData.quote || createMultiLangText('')}
                onChange={val => handleMultiLangChange('quote', val)}
                selectedLanguages={selectedTranslationLanguages}
                placeholder='Your inspirational quote'
                disabled={isSubmitting}
                type='textarea'
                rows={2}
                getLanguageInfo={getLanguageInfo}
              />
            </div>

            {/* Photo Upload */}
            <FormImageUpload
              imagePreview={imagePreview}
              isUploading={isUploadingImage}
              onUpload={handleImageUpload}
              onRemove={() => {
                setFormData(prev => ({ ...prev, photoURL: undefined }));
                setImagePreview(null);
              }}
              disabled={isSubmitting}
            />

            {/* CV Upload */}
            <FormFileUpload
              label='CV / Resume'
              fileUrl={cvPreview}
              isUploading={isUploadingCV}
              onUpload={handleCVUpload}
              onRemove={() => {
                setFormData(prev => ({ ...prev, cvURL: undefined }));
                setCVPreview(null);
              }}
              disabled={isSubmitting}
              accept='.pdf'
              description='Supported format: PDF. Max size: 10MB'
            />

            {/* Optional Fields */}
            <div className='md:col-span-2'>
              <FormInput
                label='Birth Place'
                type='text'
                name='birthPlace'
                value={formData.birthPlace || ''}
                onChange={handleChange}
                placeholder='e.g., Jakarta'
                disabled={isSubmitting}
              />
            </div>

            <FormInput
              label='Birth Date'
              type='date'
              name='birthDate'
              value={
                formData.birthDate
                  ? typeof formData.birthDate === 'string'
                    ? formData.birthDate.split('T')[0]
                    : formData.birthDate.toISOString().split('T')[0]
                  : ''
              }
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <FormInput
              label='Experience Years'
              type='number'
              name='experienceYears'
              value={formData.experienceYears || ''}
              onChange={handleChange}
              placeholder='5'
              disabled={isSubmitting}
            />

            <div className='md:col-span-2'>
              <MultiLangInput
                label='Description'
                value={formData.description || createMultiLangText('')}
                onChange={val => handleMultiLangChange('description', val)}
                selectedLanguages={selectedTranslationLanguages}
                placeholder='About yourself...'
                disabled={isSubmitting}
                type='textarea'
                rows={3}
                getLanguageInfo={getLanguageInfo}
              />
            </div>

            <div className='md:col-span-2'>
              <MultiLangInput
                label='Address'
                value={formData.address || createMultiLangText('')}
                onChange={val => handleMultiLangChange('address', val)}
                selectedLanguages={selectedTranslationLanguages}
                placeholder='Your address'
                disabled={isSubmitting}
                type='input'
                getLanguageInfo={getLanguageInfo}
              />
            </div>

            <FormInput
              label='Latitude'
              type='number'
              name='lat'
              value={formData.lat || ''}
              onChange={handleChange}
              placeholder='-6.2088'
              step='0.0001'
              disabled={isSubmitting}
            />

            <FormInput
              label='Longitude'
              type='number'
              name='lng'
              value={formData.lng || ''}
              onChange={handleChange}
              placeholder='106.8456'
              step='0.0001'
              disabled={isSubmitting}
            />

            <div className='md:col-span-2'>
              <FormInput
                label='Map URL'
                type='url'
                name='mapURL'
                value={formData.mapURL || ''}
                onChange={handleChange}
                placeholder='https://...'
                disabled={isSubmitting}
              />
            </div>
          </div>

          <ModalActions
            isSubmitting={isSubmitting}
            onCancel={handleCloseModal}
            submitLabel='Save Profile'
          />
        </form>
      </div>
    </div>
  );
}
