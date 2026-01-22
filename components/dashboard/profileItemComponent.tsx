import Image from 'next/image';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit } from 'lucide-react';
import {
  DEFAULT_FILE_TYPE_ICONS,
  DEFAULT_FILE_KIND_ICONS,
} from '@/lib/constants';
import { useLocalizedText } from '@/hooks/useLocalizedText';

interface ProfileItemComponentProps {
  item: ProfileItem;
  profile: Profile;
  level: number;
  isExpanded: boolean;
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: (item: ProfileItem, profile: Profile) => void;
  onDelete: (id: string, profile: Profile) => void;
  onAddChild: (profileId: string, parentId?: string) => void;
  isLoading: boolean;
}

export const ProfileItemComponent = ({
  item,
  profile,
  level,
  isExpanded,
  expandedItems,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddChild,
  isLoading,
}: ProfileItemComponentProps) => {
  const { getText } = useLocalizedText();
  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = `${level * 1.5}rem`;

  // Get default icon based on fileType or kind
  const getDefaultIcon = () => {
    if (item.icon) return item.icon;
    if (item.fileType && DEFAULT_FILE_TYPE_ICONS[item.fileType.toUpperCase()]) {
      return DEFAULT_FILE_TYPE_ICONS[item.fileType.toUpperCase()];
    }
    if (item.kind && DEFAULT_FILE_KIND_ICONS[item.kind.toUpperCase()]) {
      return DEFAULT_FILE_KIND_ICONS[item.kind.toUpperCase()];
    }
    return DEFAULT_FILE_KIND_ICONS.FILE;
  };

  const displayIcon = getDefaultIcon();

  return (
    <div>
      <div
        style={{ paddingLeft }}
        className='group flex items-center gap-2 rounded px-2 py-1 transition hover:bg-gray-500/30'
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => onToggleExpand(item.id)}
            className='text-gray-400 transition hover:text-white'
          >
            {isExpanded ? (
              <ChevronDown className='size-4' />
            ) : (
              <ChevronRight className='size-4' />
            )}
          </button>
        )}

        {/* Item Icon */}
        <Image
          src={displayIcon}
          alt={getText(item.name)}
          width={16}
          height={16}
          className='size-4 object-contain'
        />

        {/* Item Name */}
        <span className='flex-1 text-sm text-gray-300'>
          {getText(item.name)}
        </span>

        {/* Item Type Badge */}
        <span className='rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-400'>
          {item.fileType || item.kind}
        </span>

        {/* Action Buttons */}
        <div className='hidden gap-1 group-hover:flex'>
          {item.kind === 'FOLDER' && (
            <button
              onClick={() => onAddChild(profile.id, item.id)}
              className='p-1 text-green-400 transition hover:text-green-300'
              title='Add sub-item'
              disabled={isLoading}
            >
              <Plus className='size-4' />
            </button>
          )}
          <button
            onClick={() => onEdit(item, profile)}
            className='p-1 text-blue-400 transition hover:text-blue-300'
            title='Edit'
            disabled={isLoading}
          >
            <Edit className='size-4' />
          </button>
          <button
            onClick={() => onDelete(item.id, profile)}
            className='p-1 text-red-400 transition hover:text-red-300'
            title='Delete'
            disabled={isLoading}
          >
            <Trash2 className='size-4' />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className='space-y-0'>
          {item.children!.map((child: ProfileItem) => (
            <ProfileItemComponent
              key={child.id}
              item={child}
              profile={profile}
              level={level + 1}
              isExpanded={expandedItems.has(child.id)}
              expandedItems={expandedItems}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};
