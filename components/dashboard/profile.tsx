import useDataStore from '@/store/data';

import { Plus } from 'lucide-react';
import { ProfileModal } from '../modal/profileModal';
import { ItemModal } from '../modal/itemModal';
import { DeleteConfirmModal } from '../modal/deleteConfirmModal';
import { ActionButton } from './actionButton';
import { ProfileCard } from './profileCard';
import { ProfileLoadingSkeleton } from './profileLoadingSkeleton';
import { CollapsibleCard } from './collapsibleCard';
import { useProfileManager } from '@/hooks/useProfileManager';
import { useLocalizedText } from '@/hooks/useLocalizedText';

export const Profile = ({
  isDataLoading = false,
}: {
  isDataLoading?: boolean;
}) => {
  const { categories } = useDataStore();
  const { getText } = useLocalizedText();

  const {
    isLoading,
    selectedProfile,
    isModalOpen,
    isItemModalOpen,
    selectedItem,
    parentItemId,
    expandedItems,
    isDeleteModalOpen,
    profiles,
    handleEditProfile,
    handleAddProfile,
    handleSaveProfile,
    handleAddItem,
    handleEditItem,
    handleSaveItem,
    handleDeleteItem,
    handleConfirmDeleteItem,
    toggleExpand,
    setIsModalOpen,
    setIsItemModalOpen,
    setSelectedItem,
    setParentItemId,
    setIsDeleteModalOpen,
    setDeletingItemId,
  } = useProfileManager();

  if (isDataLoading) {
    return <ProfileLoadingSkeleton />;
  }

  return (
    <>
      <CollapsibleCard title='Profile'>
        <div className='mb-4 flex items-start justify-end'>
          {profiles.length === 0 && (
            <ActionButton
              onClick={handleAddProfile}
              variant='add'
              icon={
                <>
                  {' '}
                  <Plus className='size-3' /> Add{' '}
                </>
              }
              title='Add Profile'
            />
          )}
        </div>

        {profiles.length === 0 ? (
          <p className='text-sm text-gray-400'>
            No profiles found. Click "Add" to create one.
          </p>
        ) : (
          <div className='max-h-150 space-y-4 overflow-y-auto'>
            {profiles.map(profile => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                expandedItems={expandedItems}
                isLoading={isLoading}
                onEdit={() => handleEditProfile(profile)}
                onAddItem={() => handleAddItem(profile.id)}
                onToggleExpand={toggleExpand}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onAddChild={handleAddItem}
              />
            ))}
          </div>
        )}
      </CollapsibleCard>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
        profile={selectedProfile || undefined}
        categories={categories.map(cat => ({
          id: cat.id,
          name: getText(cat.name),
        }))}
      />

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setSelectedItem(null);
          setParentItemId(undefined);
        }}
        onSave={handleSaveItem}
        item={selectedItem || undefined}
        ownerId={selectedProfile?.id || ''}
        ownerType='profile'
        parentId={parentItemId}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title='Delete Profile Item'
        message='Are you sure you want to delete this profile item and all its sub-items? This action cannot be undone.'
        isLoading={isLoading}
        onConfirm={handleConfirmDeleteItem}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingItemId(null);
        }}
      />
    </>
  );
};
