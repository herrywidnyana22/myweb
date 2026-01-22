import useDataStore from '@/store/data';
import { useState } from 'react';
import { writeCache } from '@/lib/cache';

export const useProjectManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ProjectEntry | null>(null);
  const [parentEntryId, setParentEntryId] = useState<string | undefined>(
    undefined
  );
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(
    new Set()
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] =
    useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null
  );

  const { projects, setProjects } = useDataStore();

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (projectData: Project) => {
    setIsLoading(true);
    try {
      const url = projectData.id
        ? `/api/projects/${projectData.id}`
        : '/api/projects';
      const method = projectData.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const result = await res.json();

      if (result.status === 'ok') {
        const newProject = result.data as Project;

        let updatedProjects: Project[];
        if (projectData.id) {
          updatedProjects = projects.map(p =>
            p.id === newProject.id ? newProject : p
          );
        } else {
          updatedProjects = [...projects, newProject];
        }

        setProjects(updatedProjects);
        writeCache('projects_cache', updatedProjects);
        setIsModalOpen(false);
      } else {
        throw new Error(result.msg || result.error || 'Failed to save project');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setDeletingProjectId(projectId);
    setIsDeleteProjectModalOpen(true);
  };

  const handleConfirmDeleteProject = async () => {
    if (!deletingProjectId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${deletingProjectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (result.status === 'ok') {
        const updatedProjects = projects.filter(
          p => p.id !== deletingProjectId
        );
        setProjects(updatedProjects);
        writeCache('projects_cache', updatedProjects);

        setIsDeleteProjectModalOpen(false);
        setDeletingProjectId(null);
      } else {
        throw new Error(
          result.msg || result.error || 'Failed to delete project'
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = (projectId: string, parentId?: string) => {
    setSelectedEntry(null);
    setParentEntryId(parentId);
    const projectData = projects.find(p => p.id === projectId);
    if (projectData) {
      setSelectedProject(projectData);
    }
    setIsEntryModalOpen(true);
  };

  const handleEditEntry = (entry: ProjectEntry, project: Project) => {
    setSelectedEntry(entry);
    setSelectedProject(project);
    setIsEntryModalOpen(true);
  };

  const handleSaveEntry = async (entryData: ProjectEntry) => {
    if (!selectedProject) return;

    setIsLoading(true);
    try {
      let dataToSave = { ...entryData };

      if (entryData.fileType === 'PROJECT_INFO') {
        const projectData = projects.find(p => p.id === selectedProject.id);
        if (projectData) {
          dataToSave = {
            ...dataToSave,
            techStack: projectData.techStack,
            progress: projectData.progressValue,
            description: projectData.description,
            subtitle: projectData.name,
            subIcon: projectData.icon,
          };
        }
      }

      const url = entryData.id
        ? `/api/projects/entries/${entryData.id}`
        : '/api/projects/entries';
      const method = entryData.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dataToSave,
          projectId: selectedProject.id,
        }),
      });
      const result = await res.json();

      if (result.status === 'ok') {
        const newEntry = result.data as ProjectEntry;

        const updatedProjects = projects.map(p =>
          p.id === selectedProject.id
            ? {
                ...p,
                entries: entryData.id
                  ? p.entries?.map(e => (e.id === newEntry.id ? newEntry : e))
                  : [...(p.entries || []), newEntry],
              }
            : p
        );

        setProjects(updatedProjects);
        writeCache('projects_cache', updatedProjects);

        setIsEntryModalOpen(false);
        setSelectedEntry(null);
      } else {
        throw new Error(
          result.msg || result.error || 'Failed to save project entry'
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = (entryId: string, project: Project) => {
    setDeletingEntryId(entryId);
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteEntry = async () => {
    if (!deletingEntryId || !selectedProject) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/entries/${deletingEntryId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (result.status === 'ok') {
        const deleteEntryRecursive = (
          entries: ProjectEntry[],
          idToDelete: string
        ): ProjectEntry[] => {
          return entries
            .filter(e => e.id !== idToDelete)
            .map(e => ({
              ...e,
              children: deleteEntryRecursive(e.children || [], idToDelete),
            }));
        };

        const updatedProjects = projects.map(p =>
          p.id === selectedProject.id
            ? {
                ...p,
                entries: deleteEntryRecursive(p.entries || [], deletingEntryId),
              }
            : p
        );

        setProjects(updatedProjects);
        writeCache('projects_cache', updatedProjects);

        setIsDeleteModalOpen(false);
        setDeletingEntryId(null);
      } else {
        throw new Error(
          result.msg || result.error || 'Failed to delete project entry'
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (entryId: string) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  return {
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
  };
};
