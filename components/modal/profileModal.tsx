'use client';

import { useEffect, useState, useCallback } from 'react';
import { FormInput } from '../form/FormInput';
import { FormSelect } from '../form/FormSelect';
import { FormTextarea } from '../form/FormTextarea';
import { FormImageUpload } from '../form/FormImageUpload';
import { FormError } from '../form/FormError';
import { ModalHeader } from '../form/ModalHeader';
import { ModalActions } from '../form/ModalActions';


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
    (profile as Profile) || ({
      id: '',
      ...DEFAULT_PROFILE,
    } as Profile)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setImagePreview(profile.photoURL || null);
    } else {
      setFormData({
        id: '',
        ...DEFAULT_PROFILE,
      } as Profile);
      setImagePreview(null);
    }
    setError('');
  }, [profile, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'experienceYears' || name === 'lat' || name === 'lng'
          ? value
            ? Number(value)
            : undefined
          : value,
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

      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = (await res.json()) as { url: string };
      setFormData((prev) => ({ ...prev, photoURL: data.url }));
      setImagePreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
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
    setImagePreview(null);
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
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader
          title={profile ? 'Edit Profile' : 'Add Profile'}
          onClose={handleCloseModal}
          disabled={isSubmitting}
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormError message={error} />
          {/* Category Select */}
          <div className="md:col-span-2">
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
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required Fields */}
            <FormInput
              label="Name"
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., herry"
              disabled={isSubmitting}
            />

            <FormInput
              label="Full Name"
              required
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g., Herry Sanjaya"
              disabled={isSubmitting}
            />

            <FormSelect
              label="Gender"
              required
              name="jenisKelamin"
              value={formData.jenisKelamin}
              onChange={handleChange}
              options={[
                { value: 'PRIA', label: 'Male' },
                { value: 'WANITA', label: 'Female' },
              ]}
              disabled={isSubmitting}
            />

            <FormInput
              label="Role"
              required
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Full Stack Developer"
              disabled={isSubmitting}
            />

            <div className="md:col-span-2">
              <FormTextarea
                label="Quote"
                required
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                placeholder="Your inspirational quote"
                rows={2}
                disabled={isSubmitting}
              />
            </div>

            {/* Photo Upload */}
            <FormImageUpload
              imagePreview={imagePreview}
              isUploading={isUploadingImage}
              onUpload={handleImageUpload}
              onRemove={() => {
                setFormData((prev) => ({ ...prev, photoURL: undefined }));
                setImagePreview(null);
              }}
              disabled={isSubmitting}
            />

            {/* Optional Fields */}
            <FormInput
              label="Birth Place"
              type="text"
              name="birthPlace"
              value={formData.birthPlace || ''}
              onChange={handleChange}
              placeholder="e.g., Jakarta"
              disabled={isSubmitting}
            />

            <FormInput
              label="Birth Date"
              type="date"
              name="birthDate"
              value={formData.birthDate ? formData.birthDate.split('T')[0] : ''}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <FormInput
              label="Experience Years"
              type="number"
              name="experienceYears"
              value={formData.experienceYears || ''}
              onChange={handleChange}
              placeholder="5"
              disabled={isSubmitting}
            />

            <div className="md:col-span-2">
              <FormTextarea
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="About yourself..."
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <FormInput
              label="Address"
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Your address"
              disabled={isSubmitting}
            />

            <FormInput
              label="Latitude"
              type="number"
              name="lat"
              value={formData.lat || ''}
              onChange={handleChange}
              placeholder="-6.2088"
              step="0.0001"
              disabled={isSubmitting}
            />

            <FormInput
              label="Longitude"
              type="number"
              name="lng"
              value={formData.lng || ''}
              onChange={handleChange}
              placeholder="106.8456"
              step="0.0001"
              disabled={isSubmitting}
            />

            <div className="md:col-span-2">
              <FormInput
                label="Map URL"
                type="url"
                name="mapURL"
                value={formData.mapURL || ''}
                onChange={handleChange}
                placeholder="https://..."
                disabled={isSubmitting}
              />
            </div>

            
          </div>

          <ModalActions
            isSubmitting={isSubmitting}
            onCancel={handleCloseModal}
            submitLabel="Save Profile"
          />
        </form>
      </div>
    </div>
  );
}
