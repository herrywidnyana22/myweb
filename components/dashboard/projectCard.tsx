import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Icon } from '../icon';
import { ActionButtonGroup } from './actionButtonGroup';
import { ActionButton } from './actionButton';
import { ProjectEntryItem } from './projectEntryItem';
import { useLocalizedText } from '@/hooks/useLocalizedText';

interface ProjectCardProps {
  project: Project;
  expandedEntries: Set<string>;
  isLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddEntry: () => void;
  onToggleExpand: (id: string) => void;
  onEditEntry: (entry: ProjectEntry, project: Project) => void;
  onDeleteEntry: (id: string, project: Project) => void;
  onAddChild: (projectId: string, parentId?: string) => void;
}

export const ProjectCard = ({
  project,
  expandedEntries,
  isLoading,
  onEdit,
  onDelete,
  onAddEntry,
  onToggleExpand,
  onEditEntry,
  onDeleteEntry,
  onAddChild,
}: ProjectCardProps) => {
  const { getText } = useLocalizedText();

  return (
    <div className='group rounded border border-gray-500 bg-gray-600 p-4'>
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {project.icon && (
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-white sm:size-12'>
              <Image
                src={project.icon}
                alt='Project Icon'
                width={40}
                height={40}
                className='size-auto rounded-full object-cover'
              />
            </div>
          )}
          <div>
            <p className='font-semibold text-white'>{getText(project.name)}</p>
            {project.techStack && project.techStack.length > 0 && (
              <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                {project.techStack.map((tech: TechStack, i: number) => (
                  <Icon
                    key={i}
                    tooltipLabel={tech.label}
                    src={tech.techIcon}
                    size={14}
                    className='rounded-full border border-gray-900/20 bg-gray-300 p-0.5 sm:p-1'
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <ActionButtonGroup
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      </div>

      <div className='rounded-lg border border-gray-600 bg-gray-700 p-6 shadow-lg'>
        {/* Project Entries Explorer View */}
        <div className='flex justify-between'>
          <h3>Project Files Items</h3>
          <ActionButton
            onClick={onAddEntry}
            variant='add'
            icon={
              <>
                {' '}
                <Plus className='size-3' /> Item{' '}
              </>
            }
            title='File Explorer'
          />
        </div>
        {project.entries && project.entries.length > 0 && (
          <div className='mt-4 border-t border-gray-500 pt-3'>
            <div className='ml-2 space-y-1'>
              {project.entries
                .filter(entry => !entry.parentId)
                .map(entry => (
                  <ProjectEntryItem
                    key={entry.id}
                    entry={entry}
                    project={project}
                    level={0}
                    isExpanded={expandedEntries.has(entry.id)}
                    expandedEntries={expandedEntries}
                    onToggleExpand={onToggleExpand}
                    onEdit={onEditEntry}
                    onDelete={onDeleteEntry}
                    onAddChild={onAddChild}
                    isLoading={isLoading}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
