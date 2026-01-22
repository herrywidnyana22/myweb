import Image from 'next/image';
import { Plus } from 'lucide-react';
import { ActionButton } from './actionButton';
import { ProfileItemComponent } from './profileItemComponent';
import { useLocalizedText } from '@/hooks/useLocalizedText';

interface ProfileCardProps {
  profile: Profile;
  expandedItems: Set<string>;
  isLoading: boolean;
  onEdit: () => void;
  onAddItem: () => void;
  onToggleExpand: (id: string) => void;
  onEditItem: (item: ProfileItem, profile: Profile) => void;
  onDeleteItem: (id: string, profile: Profile) => void;
  onAddChild: (profileId: string, parentId?: string) => void;
}

export const ProfileCard = ({
  profile,
  expandedItems,
  isLoading,
  onEdit,
  onAddItem,
  onToggleExpand,
  onEditItem,
  onDeleteItem,
  onAddChild,
}: ProfileCardProps) => {
  const { getText } = useLocalizedText();

  return (
    <div className='rounded border border-gray-500 bg-gray-600 p-4'>
      {/* Profile Header */}
      <div className='mb-3 flex items-start justify-between'>
        <div className='flex items-center gap-2'>
          {profile.photoURL && (
            <Image
              src={profile.photoURL}
              alt='Photo profile'
              width={32}
              height={32}
              className='inline-block size-8 rounded-2xl object-cover'
            />
          )}
          <div>
            <p className='font-semibold text-white'>{profile.fullName}</p>
            <p className='text-sm text-gray-300'>{getText(profile.role)}</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className='bg-primary hover:bg-primary-hover rounded px-2 py-1 text-xs font-semibold text-white transition'
        >
          Edit
        </button>
      </div>

      <p className='mb-2 text-xs text-gray-300 italic'>
        "{getText(profile.quote)}"
      </p>
      {profile.experienceYears && (
        <p className='text-xs text-gray-400'>
          Experience: {profile.experienceYears} years
        </p>
      )}

      {/* Profile Items */}
      <div className='mt-4 border-t border-gray-500 pt-4'>
        <div className='mb-2 flex items-center justify-between'>
          <h4 className='mb-2 text-sm font-semibold text-gray-300'>
            File Explorer:
          </h4>
          <ActionButton
            onClick={onAddItem}
            variant='add'
            icon={
              <>
                <Plus className='size-4' /> Item
              </>
            }
            title='Add Profile Item'
          />
        </div>
        {profile.items && profile.items.length > 0 && (
          <div className='space-y-1'>
            {profile.items.map(item => (
              <ProfileItemComponent
                key={item.id}
                item={item}
                profile={profile}
                level={0}
                isExpanded={expandedItems.has(item.id)}
                expandedItems={expandedItems}
                onToggleExpand={onToggleExpand}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
                onAddChild={onAddChild}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
