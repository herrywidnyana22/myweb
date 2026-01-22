import Image from 'next/image';
import useDataStore from '@/store/data';

import { useState } from 'react';
import { writeCache } from '@/lib/cache';
import { EducationModal } from '../modal/educationModal';
import { DeleteConfirmModal } from '../modal/deleteConfirmModal';
import { ActionButtonGroup } from './actionButtonGroup';
import { CollapsibleCard } from './collapsibleCard';
import { Plus } from 'lucide-react';
import { ActionButton } from './actionButton';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const Education = ({
  isDataLoading = false,
}: {
  isDataLoading?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { educations, setEducations, categories } = useDataStore();
  const { getText } = useLocalizedText();

  const handleEditEducation = (education: Education) => {
    setSelectedEducation(education);
    setIsModalOpen(true);
  };

  const handleAddEducation = () => {
    setSelectedEducation(null);
    setIsModalOpen(true);
  };

  const handleSaveEducation = async (educationData: Education) => {
    setIsLoading(true);
    try {
      const url = educationData.id
        ? `/api/educations/${educationData.id}`
        : '/api/educations';
      const method = educationData.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(educationData),
      });
      const result = await res.json();

      if (result.status === 'ok') {
        const newEducation = result.data as Education;

        // Update global store and cache
        let updatedEducations: Education[];
        if (educationData.id) {
          // Update existing education
          updatedEducations = educations.map(e =>
            e.id === newEducation.id ? newEducation : e
          );
        } else {
          // Add new education
          updatedEducations = [...educations, newEducation];
        }

        setEducations(updatedEducations);
        writeCache('educations_cache', updatedEducations);
        setIsModalOpen(false);
      } else {
        throw new Error(
          result.msg || result.error || 'Failed to save education'
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/educations/${deletingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (result.status === 'ok') {
        // Remove education from global store and update cache
        const updatedEducations = educations.filter(e => e.id !== deletingId);
        setEducations(updatedEducations);
        writeCache('educations_cache', updatedEducations);

        setIsDeleteModalOpen(false);
        setDeletingId(null);
      } else {
        throw new Error(
          result.msg || result.error || 'Failed to delete education'
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className='rounded-lg border border-gray-600 bg-gray-700 p-6 shadow-lg'>
        <div className='mb-4 flex items-start justify-between'>
          <div className='h-7 w-28 animate-pulse rounded bg-gray-600' />
          <div className='h-7 w-16 animate-pulse rounded bg-gray-600' />
        </div>
        <div className='space-y-2'>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className='flex animate-pulse items-center justify-between rounded border border-gray-500 bg-gray-600 p-3'
            >
              <div className='flex items-center gap-2'>
                <div className='h-9 w-9 rounded-md bg-gray-500' />
                <div>
                  <div className='mb-1 h-5 w-32 rounded bg-gray-500' />
                  <div className='h-3 w-24 rounded bg-gray-500' />
                </div>
              </div>
              <div className='h-6 w-12 rounded bg-gray-500' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <CollapsibleCard title='Education'>
        <div className='mb-4 flex items-start justify-end'>
          <ActionButton
            onClick={handleAddEducation}
            variant='add'
            icon={
              <>
                {' '}
                <Plus className='size-3' /> Add{' '}
              </>
            }
            title='Add Education'
          />
        </div>

        {!Array.isArray(educations) || educations.length === 0 ? (
          <p className='text-sm text-gray-400'>
            No education found. Click "Add" to create one.
          </p>
        ) : (
          <div className='max-h-64 space-y-2 overflow-y-auto'>
            {educations.map(education => (
              <div
                key={education.id}
                className='group flex items-center justify-between rounded border border-gray-500 bg-gray-600 p-3'
              >
                <div className='flex items-center gap-2'>
                  {education.schoolLogo && (
                    <Image
                      src={education.schoolLogo}
                      alt='Education Icon'
                      width={32}
                      height={32}
                      className='inline-block size-8 rounded-md object-cover'
                    />
                  )}
                  <div>
                    <p className='font-semibold text-white'>
                      {education.school}
                    </p>
                    <p className='text-sm text-gray-300'>
                      ({education.startYear} - {education.endYear})
                    </p>
                  </div>
                </div>
                <ActionButtonGroup
                  onEdit={() => handleEditEducation(education)}
                  onDelete={() => handleDeleteEducation(education.id)}
                  isLoading={isLoading}
                />
              </div>
            ))}
          </div>
        )}
      </CollapsibleCard>
      <EducationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEducation}
        education={selectedEducation || undefined}
        categories={categories.map(cat => ({
          id: cat.id,
          name: typeof cat.name === 'string' ? cat.name : getText(cat.name),
        }))}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title='Delete Education'
        message='Are you sure you want to delete this education? This action cannot be undone.'
        isLoading={isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingId(null);
        }}
      />
    </>
  );
};
