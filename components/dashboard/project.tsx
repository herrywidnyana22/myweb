import Image from "next/image";
import useDataStore from "@/store/data";
import { useState } from "react";
import { ProjectModal } from "../modal/projectModal";
import { ItemModal } from "../modal/itemModal";
import { DeleteConfirmModal } from "../modal/deleteConfirmModal";
import { Icon } from "../icon";
import { ChevronDown, ChevronRight, Folder, File, Plus } from "lucide-react";
import { ActionButtonGroup } from "./actionButtonGroup";
import { getEffectiveIcon } from "@/lib/utils";
import { writeCache } from "@/lib/cache";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { ActionButton } from "./actionButton";


interface ProjectDashboardProps {
    isDataLoading?: boolean;
}

export const Project = ({isDataLoading = false}: ProjectDashboardProps) => {
    
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<ProjectEntry | null>(null);
    const [parentEntryId, setParentEntryId] = useState<string | undefined>(undefined);
    const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
    const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

    // Get projects and categories from global store
    const { projects, setProjects, categories } = useDataStore();
    const { getText } = useLocalizedText();

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
            const url = projectData.id ? `/api/projects/${projectData.id}` : '/api/projects';
            const method = projectData.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });
            const result = await res.json();

            if (result.status === 'ok') {
                const newProject = result.data as Project;

                // Update global store and cache
                let updatedProjects: Project[];
                if (projectData.id) {
                    // Update existing project
                    updatedProjects = projects.map((p) => (p.id === newProject.id ? newProject : p));
                } else {
                    // Add new project
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

    const handleAddEntry = (projectId: string, parentId?: string) => {
        setSelectedEntry(null);
        setParentEntryId(parentId);
        // Store parent info in a ref or state
        const projectData = projects.find(p => p.id === projectId);
        if (projectData) {
            setSelectedProject(projectData);
        }
        setIsEntryModalOpen(true);
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
                // Remove project from global store and update cache
                const updatedProjects = projects.filter((p) => p.id !== deletingProjectId);
                setProjects(updatedProjects);
                writeCache('projects_cache', updatedProjects);
                
                setIsDeleteProjectModalOpen(false);
                setDeletingProjectId(null);
            } else {
                throw new Error(result.msg || result.error || 'Failed to delete project');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
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
            // Auto-populate PROJECT_INFO fields from project data
            let dataToSave = { ...entryData };
            
            if (entryData.fileType === 'PROJECT_INFO') {
                const projectData = projects.find(p => p.id === selectedProject.id);
                if (projectData) {
                    dataToSave = {
                        ...dataToSave,
                        techStack: projectData.techStack,
                        progress: projectData.progressValue,
                        description: projectData.description,
                        subtitle: projectData.name, // Save project name to subtitle
                        subIcon: projectData.icon, // Save project icon to subIcon
                    };
                }
            }

            const url = entryData.id ? `/api/projects/entries/${entryData.id}` : '/api/projects/entries';
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

                // Update the project data in global store and cache
                const updatedProjects = projects.map((p) =>
                    p.id === selectedProject.id
                        ? {
                            ...p,
                            entries: entryData.id
                                ? p.entries?.map((e) => (e.id === newEntry.id ? newEntry : e))
                                : [...(p.entries || []), newEntry],
                        }
                        : p
                );
                
                setProjects(updatedProjects);
                writeCache('projects_cache', updatedProjects);

                setIsEntryModalOpen(false);
                setSelectedEntry(null);
            } else {
                throw new Error(result.msg || result.error || 'Failed to save project entry');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteEntry = (entryId: string) => {
        setDeletingEntryId(entryId);
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
                // Update the project data in global store and cache
                const deleteEntryRecursive = (entries: ProjectEntry[], idToDelete: string): ProjectEntry[] => {
                    return entries
                        .filter(e => e.id !== idToDelete)
                        .map(e => ({
                            ...e,
                            children: deleteEntryRecursive(e.children || [], idToDelete),
                        }));
                };

                const updatedProjects = projects.map((p) =>
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
                throw new Error(result.msg || result.error || 'Failed to delete project entry');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const toggleExpand = (entryId: string) => {
        setExpandedEntries((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(entryId)) {
                newSet.delete(entryId);
            } else {
                newSet.add(entryId);
            }
            return newSet;
        });
    };

    console.log({projects});

    if (isDataLoading) {
        return (
            <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-7 w-24 bg-gray-600 rounded animate-pulse" />
                    <div className="h-7 w-16 bg-gray-600 rounded animate-pulse" />
                </div>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-gray-600 rounded p-4 border border-gray-500 animate-pulse">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="size-10 bg-gray-500 rounded-full" />
                                <div className="h-5 w-32 bg-gray-500 rounded" />
                            </div>
                            <div className="ml-13 space-y-2">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="flex items-center gap-2">
                                        <div className="size-6 bg-gray-500 rounded" />
                                        <div className="h-4 w-24 bg-gray-500 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white">Projects</h2>
                    <div className="flex gap-2">
                        <ActionButton
                            onClick={handleAddProject}
                            variant="add"  
                            icon={<> <Plus className="size-3"/> Add </>}
                            title="Add Project"
                        />
                    </div>
                </div>

                {!Array.isArray(projects) || projects.length === 0 ? (
                    <p className="text-gray-400 text-sm">No projects found. Click "Add" to create one.</p>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {projects.map((project) => (
                            <div key={project.id} className="group bg-gray-600 rounded p-4 border border-gray-500">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {project.icon && (
                                            <div className="rounded-full bg-white size-10 sm:size-12 flex items-center justify-center shrink-0">
                                                <Image
                                                    src={project.icon}
                                                    alt="Project Icon"
                                                    width={40}
                                                    height={40}
                                                    className="size-auto rounded-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-semibold">{getText(project.name)}</p>
                                            { project.techStack && project.techStack.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                    {project.techStack.map((tech:TechStack, i: number) => (
                                                        <Icon
                                                            key={i}
                                                            tooltipLabel={tech.label}
                                                            src={tech.techIcon}
                                                            size={14}
                                                            className="rounded-full bg-gray-300 p-0.5 sm:p-1 border border-gray-900/20"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <ActionButtonGroup
                                        onEdit={() => handleEditProject(project)}
                                        onDelete={() => handleDeleteProject(project.id)}
                                        isLoading={isLoading}
                                    />
                                </div>
                                <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600">
                                    {/* Project Entries Explorer View */}
                                    <div className="flex justify-between">
                                        <h3>Project Files Items</h3>
                                        <ActionButton
                                            onClick={() => handleAddEntry(project.id)}
                                            variant="add"                                                        
                                            icon={<> <Plus className="size-3"/> Add Entry </>}
                                            title="File Explorer"
                                        />
                                    </div>
                                    {project.entries && project.entries.length > 0 && (
                                        <div className="mt-4 border-t border-gray-500 pt-3">
                                            <div className="space-y-1 ml-2">
                                                {project.entries
                                                    .filter(entry => !entry.parentId) // Only show root entries
                                                    .map((entry) => (
                                                        <ProjectEntryItem
                                                            key={entry.id}
                                                            entry={entry}
                                                            project={project}
                                                            level={0}
                                                            isExpanded={expandedEntries.has(entry.id)}
                                                            expandedEntries={expandedEntries}
                                                            onToggleExpand={toggleExpand}
                                                            onEdit={handleEditEntry}
                                                            onDelete={handleDeleteEntry}
                                                            onAddChild={(parentId) => handleAddEntry(project.id, parentId)}
                                                            isLoading={isLoading}
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProject}
                project={selectedProject || undefined}
                categories={categories.map(cat => ({
                    id: cat.id,
                    name: typeof cat.name === 'string' ? cat.name : getText(cat.name)
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
                ownerType="project"
                parentId={parentEntryId}
            />
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Project Entry"
                message="Are you sure you want to delete this project entry and all its sub-entries? This action cannot be undone."
                isLoading={isLoading}
                onConfirm={handleConfirmDeleteEntry}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingEntryId(null);
                }}
            />
            <DeleteConfirmModal
                isOpen={isDeleteProjectModalOpen}
                title="Delete Project"
                message="Are you sure you want to delete this project and all its entries? This action cannot be undone."
                isLoading={isLoading}
                onConfirm={handleConfirmDeleteProject}
                onCancel={() => {
                    setIsDeleteProjectModalOpen(false);
                    setDeletingProjectId(null);
                }}
            />
        </>
    )
}

// Helper component for rendering project entries as a tree
interface ProjectEntryItemProps {
    entry: ProjectEntry;
    project: Project;
    level: number;
    isExpanded: boolean;
    expandedEntries: Set<string>;
    onToggleExpand: (id: string) => void;
    onEdit: (entry: ProjectEntry, project: Project) => void;
    onDelete: (id: string) => void;
    onAddChild: (parentId: string) => void;
    isLoading: boolean;
}

const ProjectEntryItem = ({
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
                className="group/item flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-500/30 transition"
            >
                {/* Expand/Collapse Button */}
                {hasChildren ? (
                    <button
                        onClick={() => onToggleExpand(entry.id)}
                        className="p-0 hover:bg-gray-500/50 rounded transition shrink-0"
                    >
                        {isExpanded ? (
                            <ChevronDown className="size-4 text-gray-400" />
                        ) : (
                            <ChevronRight className="size-4 text-gray-400" />
                        )}
                    </button>
                ) : (
                    <div className="w-4" />
                )}

                {/* File/Folder Icon */}
                <div className="shrink-0">
                    {entry.icon || getEffectiveIcon(entry.icon, entry.fileType) ? (
                        <Image
                            src={entry.icon || getEffectiveIcon(entry.icon, entry.fileType) || ''}
                            alt={typeof entry.name === 'string' ? entry.name : getText(entry.name)}
                            width={18}
                            height={18}
                            className="object-contain"
                        />
                    ) : hasChildren ? (
                        <Folder className="size-4 text-blue-400" />
                    ) : (
                        <File className="size-4 text-gray-400" />
                    )}
                </div>

                {/* Entry Name */}
                <span className="text-gray-300 text-sm grow">
                    {getText(entry.name)}
                </span>

                {/* Action Buttons */}
                <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition">
                    <button
                        onClick={() => onEdit(entry, project)}
                        disabled={isLoading}
                        className="px-2 py-0.5 text-xs bg-primary hover:bg-primary-hover text-white rounded disabled:opacity-50"
                    >
                        Edit
                    </button>
                    {hasChildren && (
                        <button
                            onClick={() => onAddChild(entry.id)}
                            disabled={isLoading}
                            className="px-2 py-0.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                        >
                            +
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(entry.id)}
                        disabled={isLoading}
                        className="px-2 py-0.5 text-xs bg-error hover:bg-error-dark text-white rounded disabled:opacity-50"
                    >
                        Del
                    </button>
                </div>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div className="space-y-0">
                    {entry.children!.map((child) => (
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
}


