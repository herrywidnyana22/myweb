import Image from 'next/image';
import { ChevronDown, ChevronRight, Folder, File } from 'lucide-react';
import { getEffectiveIcon } from '@/lib/utils';
import { useLocalizedText } from '@/hooks/useLocalizedText';

interface ProjectEntryItemProps {
  entry: ProjectEntry;
  project: Project;
  level: number;
  isExpanded: boolean;
  expandedEntries: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: (entry: ProjectEntry, project: Project) => void;
  onDelete: (id: string, project: Project) => void;
  onAddChild: (projectId: string, parentId?: string) => void;
  isLoading: boolean;
}

export const ProjectEntryItem = ({
  entry,
  project,
  level,
  isExpanded,
  expandedEntries,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddChild,
  isLoading,
}: ProjectEntryItemProps) => {
  const hasChildren = entry.children && entry.children.length > 0;
  const paddingLeft = `${level * 1.5}rem`;
  const { getText } = useLocalizedText();

  return (
    <div>
      <div
        style={{ paddingLeft }}
        className='group/item flex items-center gap-2 rounded px-2 py-1 transition hover:bg-gray-500/30'
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            onClick={() => onToggleExpand(entry.id)}
            className='shrink-0 rounded p-0 transition hover:bg-gray-500/50'
          >
            {isExpanded ? (
              <ChevronDown className='size-4 text-gray-400' />
            ) : (
              <ChevronRight className='size-4 text-gray-400' />
            )}
          </button>
        ) : (
          <div className='w-4' />
        )}

        {/* File/Folder Icon */}
        <div className='shrink-0'>
          {entry.icon || getEffectiveIcon(entry.icon, entry.fileType) ? (
            <Image
              src={
                entry.icon || getEffectiveIcon(entry.icon, entry.fileType) || ''
              }
              alt={
                typeof entry.name === 'string'
                  ? entry.name
                  : getText(entry.name)
              }
              width={18}
              height={18}
              className='object-contain'
            />
          ) : hasChildren ? (
            <Folder className='size-4 text-blue-400' />
          ) : (
            <File className='size-4 text-gray-400' />
          )}
        </div>

        {/* Entry Name */}
        <span className='grow text-sm text-gray-300'>
          {getText(entry.name)}
        </span>

        {/* Action Buttons */}
        <div className='flex gap-1 opacity-0 transition group-hover/item:opacity-100'>
          <button
            onClick={() => onEdit(entry, project)}
            disabled={isLoading}
            className='bg-primary hover:bg-primary-hover rounded px-2 py-0.5 text-xs text-white disabled:opacity-50'
          >
            Edit
          </button>
          {hasChildren && (
            <button
              onClick={() => onAddChild(project.id, entry.id)}
              disabled={isLoading}
              className='rounded bg-blue-600 px-2 py-0.5 text-xs text-white hover:bg-blue-700 disabled:opacity-50'
            >
              +
            </button>
          )}
          <button
            onClick={() => onDelete(entry.id, project)}
            disabled={isLoading}
            className='bg-error hover:bg-error-dark rounded px-2 py-0.5 text-xs text-white disabled:opacity-50'
          >
            Del
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className='space-y-0'>
          {entry.children!.map(child => (
            <ProjectEntryItem
              key={child.id}
              entry={child}
              project={project}
              level={level + 1}
              isExpanded={expandedEntries.has(child.id)}
              expandedEntries={expandedEntries}
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
