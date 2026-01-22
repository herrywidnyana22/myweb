import useDataStore from '@/store/data';

import { Plus } from 'lucide-react';
import { ProjectModal } from '../modal/projectModal';
import { ItemModal } from '../modal/itemModal';
import { DeleteConfirmModal } from '../modal/deleteConfirmModal';
import { ActionButton } from './actionButton';
import { ProjectCard } from './projectCard';
import { ProjectLoadingSkeleton } from './projectLoadingSkeleton';
import { CollapsibleCard } from './collapsibleCard';
import { useProjectManager } from '@/hooks/useProjectManager';
import { useLocalizedText } from '@/hooks/useLocalizedText';

interface ProjectDashboardProps {
  isDataLoading?: boolean;
}

export const Project = ({ isDataLoading = false }: ProjectDashboardProps) => {
  const { categories } = useDataStore();
  const { getText } = useLocalizedText();

  const {
    isLoading,
    selectedProject,
    isModalOpen,
    isEntryModalOpen,
    selectedEntry,
    parentEntryId,
    expandedEntries,
    isDeleteModalOpen,
    isDeleteProjectModalOpen,
    projects,
    handleEditProject,
    handleAddProject,
    handleSaveProject,
    handleDeleteProject,
    handleConfirmDeleteProject,
    handleAddEntry,
    handleEditEntry,
    handleSaveEntry,
    handleDeleteEntry,
    handleConfirmDeleteEntry,
    toggleExpand,
    setIsModalOpen,
    setIsEntryModalOpen,
    setSelectedEntry,
    setParentEntryId,
    setIsDeleteModalOpen,
    setDeletingEntryId,
    setIsDeleteProjectModalOpen,
    setDeletingProjectId,
  } = useProjectManager();

  if (isDataLoading) {
    return <ProjectLoadingSkeleton />;
  }

  return (
    <>
      <CollapsibleCard title='Projects'>
        <div className='mb-4 flex items-start justify-end'>
          <ActionButton
            onClick={handleAddProject}
            variant='add'
            icon={
              <>
                {' '}
                <Plus className='size-3' /> Add{' '}
              </>
            }
            title='Add Project'
          />
        </div>

        {!Array.isArray(projects) || projects.length === 0 ? (
          <p className='text-sm text-gray-400'>
            No projects found. Click "Add" to create one.
          </p>
        ) : (
          <div className='max-h-96 space-y-4 overflow-y-auto'>
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                expandedEntries={expandedEntries}
                isLoading={isLoading}
                onEdit={() => handleEditProject(project)}
                onDelete={() => handleDeleteProject(project.id)}
                onAddEntry={() => handleAddEntry(project.id)}
                onToggleExpand={toggleExpand}
                onEditEntry={handleEditEntry}
                onDeleteEntry={handleDeleteEntry}
                onAddChild={handleAddEntry}
              />
            ))}
          </div>
        )}
      </CollapsibleCard>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        project={selectedProject || undefined}
        categories={categories.map(cat => ({
          id: cat.id,
          name: typeof cat.name === 'string' ? cat.name : getText(cat.name),
        }))}
      />

      <ItemModal
        isOpen={isEntryModalOpen}
        onClose={() => {
          setIsEntryModalOpen(false);
          setSelectedEntry(null);
          setParentEntryId(undefined);
        }}
        onSave={handleSaveEntry}
        item={selectedEntry || undefined}
        ownerId={selectedProject?.id || ''}
        ownerType='project'
        parentId={parentEntryId}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title='Delete Project Entry'
        message='Are you sure you want to delete this project entry and all its sub-entries? This action cannot be undone.'
        isLoading={isLoading}
        onConfirm={handleConfirmDeleteEntry}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingEntryId(null);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteProjectModalOpen}
        title='Delete Project'
        message='Are you sure you want to delete this project and all its entries? This action cannot be undone.'
        isLoading={isLoading}
        onConfirm={handleConfirmDeleteProject}
        onCancel={() => {
          setIsDeleteProjectModalOpen(false);
          setDeletingProjectId(null);
        }}
      />
    </>
  );
};
