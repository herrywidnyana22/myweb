import Image from 'next/image';
import useDataStore from '@/store/data';
import { useState } from 'react';
import { writeCache } from '@/lib/cache';
import { CategoryModal } from '../modal/categoryModal';
import { DeleteConfirmModal } from '../modal/deleteConfirmModal';
import { ActionButtonGroup } from './actionButtonGroup';
import { CollapsibleCard } from './collapsibleCard';
import { Plus } from 'lucide-react';
import { ActionButton } from './actionButton';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const Category = ({
  isDataLoading = false,
}: {
  isDataLoading?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Get categories from global store
  const { categories, setCategories } = useDataStore();
  const { getText } = useLocalizedText();

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (categoryData: Category) => {
    setIsLoading(true);
    try {
      const url = categoryData.id
        ? `/api/categories/${categoryData.id}`
        : '/api/categories';
      const method = categoryData.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      const result = await res.json();

      if (result.status === 'ok') {
        const newCategory = result.data as Category;

        // Update global store and cache
        let updatedCategories: Category[];
        if (categoryData.id) {
          updatedCategories = categories.map(c =>
            c.id === newCategory.id ? newCategory : c
          );
        } else {
          updatedCategories = [...categories, newCategory];
        }

        setCategories(updatedCategories);
        writeCache('categories_cache', updatedCategories);
        setIsModalOpen(false);
      } else {
        throw new Error(
          result.msg || result.error || 'Failed to save category'
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/categories/${deletingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (result.status === 'ok') {
        // Remove category from global store and update cache
        const updatedCategories = categories.filter(c => c.id !== deletingId);
        setCategories(updatedCategories);
        writeCache('categories_cache', updatedCategories);

        setIsDeleteModalOpen(false);
        setDeletingId(null);
      } else {
        throw new Error(
          result.msg || result.error || 'Failed to delete category'
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
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className='flex animate-pulse items-center justify-between rounded border border-gray-500 bg-gray-600 p-3'
            >
              <div className='flex items-center gap-2'>
                <div className='h-9 w-9 rounded-md bg-gray-500' />
                <div className='h-5 w-24 rounded bg-gray-500' />
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
      <CollapsibleCard title='Categories'>
        <div className='mb-4 flex items-start justify-end'>
          <ActionButton
            onClick={handleAddCategory}
            variant='add'
            icon={
              <>
                <Plus className='size-3' /> Add
              </>
            }
            title='Add Category'
          />
        </div>

        {!Array.isArray(categories) || categories.length === 0 ? (
          <p className='text-sm text-gray-400'>
            No categories found. Click "Add" to create one.
          </p>
        ) : (
          <div className='max-h-64 space-y-2 overflow-y-auto'>
            {categories.map(cat => (
              <div
                key={cat.id}
                className='group flex items-center justify-between rounded border border-gray-500 bg-gray-600 p-3'
              >
                <div className='flex items-center gap-2'>
                  {cat.icon && (
                    <Image
                      src={cat.icon}
                      alt='Category Icon'
                      width={32}
                      height={32}
                      className='inline-block size-8 rounded-md object-cover'
                    />
                  )}
                  <p className='font-semibold text-white'>
                    {getText(cat.name)}
                  </p>
                </div>
                <ActionButtonGroup
                  onEdit={() => handleEditCategory(cat)}
                  onDelete={() => handleDeleteCategory(cat.id)}
                  isLoading={isLoading}
                />
              </div>
            ))}
          </div>
        )}
      </CollapsibleCard>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={selectedCategory || undefined}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title='Delete Category'
        message='Are you sure you want to delete this category? This will also delete all related educations, experiences, profiles, and contacts. This action cannot be undone.'
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
