import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { ProjectModal } from "../modal/projectModal";
import { ProjectEntryModal } from "../modal/projectEntryModal";
import { DeleteConfirmModal } from "../modal/deleteConfirmModal";
import { Icon } from "../icon";
import { ChevronDown, ChevronRight, Folder, File } from "lucide-react";
import { ButtonActionGroup } from "./buttonActionGroup";
import { getEffectiveIcon } from "@/lib/utils";


interface ProjectDashboardProps {
    categories: Category[];
    data: Project[];
    setData: Dispatch<SetStateAction<Project[]>>;
    isDataLoading?: boolean;
}

export const Project = ({categories, data, setData, isDataLoading = false}: ProjectDashboardProps) => {
    
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<ProjectEntry | null>(null);
    const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
    const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

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

            if (res.ok) {
                const newProject = (await res.json()) as Project;

                if (projectData.id) {
                    // Update existing project
                    setData((prev) =>
                        prev.map((p) => (p.id === newProject.id ? newProject : p))
                    );
                } else {
                    // Add new project
                    setData((prev) => [...prev, newProject]);
                }
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to save project');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddEntry = (projectId: string, parentId?: string) => {
        setSelectedEntry(null);
        // Store parent info in a ref or state
        const projectData = data.find(p => p.id === projectId);
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

            if (res.ok) {
                // Remove project from local state
                setData((prev) => prev.filter((p) => p.id !== deletingProjectId));
                setIsDeleteProjectModalOpen(false);
                setDeletingProjectId(null);
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to delete project');
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
            const url = entryData.id ? `/api/projects/entries/${entryData.id}` : '/api/projects/entries';
            const method = entryData.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...entryData,
                    projectId: selectedProject.id,
                }),
            });

            if (res.ok) {
                const newEntry = (await res.json()) as ProjectEntry;

                // Update the project data
                setData((prev) =>
                    prev.map((p) =>
                        p.id === selectedProject.id
                            ? {
                                ...p,
                                entries: entryData.id
                                    ? p.entries?.map((e) => (e.id === newEntry.id ? newEntry : e))
                                    : [...(p.entries || []), newEntry],
                            }
                            : p
                    )
                );

                setIsEntryModalOpen(false);
                setSelectedEntry(null);
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to save project entry');
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

            if (res.ok) {
                // Update the project data
                const deleteEntryRecursive = (entries: ProjectEntry[], idToDelete: string): ProjectEntry[] => {
                    return entries
                        .filter(e => e.id !== idToDelete)
                        .map(e => ({
                            ...e,
                            children: deleteEntryRecursive(e.children || [], idToDelete),
                        }));
                };

                setData((prev) =>
                    prev.map((p) =>
                        p.id === selectedProject.id
                            ? {
                                ...p,
                                entries: deleteEntryRecursive(p.entries || [], deletingEntryId),
                            }
                            : p
                    )
                );

                setIsDeleteModalOpen(false);
                setDeletingEntryId(null);
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to delete project entry');
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

    const getFileExtension = (fileType?: string) => {
        if (!fileType) return '';
        const extensions: Record<string, string> = {
            'TXT': '.txt',
            'IMG': '.img',
            'PDF': '.pdf',
            'URL': '.url',
            'FIG': '.fig',
            'TECHSTACK': '.tech',
            'PROJECT_INFO': '.info',
            'OTHER': '.file',
        };
        return extensions[fileType] || '';
    };
    
    console.log({data});

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
                                <div className="w-10 h-10 bg-gray-500 rounded-full" />
                                <div className="h-5 w-32 bg-gray-500 rounded" />
                            </div>
                            <div className="ml-13 space-y-2">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-500 rounded" />
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
                        <button
                            onClick={handleAddProject}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-sm transition"
                        >
                            + Add
                        </button>
                    </div>
                </div>

                {data.length === 0 ? (
                    <p className="text-gray-400 text-sm">No projects found. Click "Add" to create one.</p>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {data.map((project) => (
                            <div key={project.id} className="bg-gray-600 rounded p-4 border border-gray-500">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {project.icon && (
                                            <div className="rounded-full bg-white size-10 sm:size-12 flex items-center justify-center shrink-0">
                                                <Image
                                                    src={project.icon}
                                                    alt="Project Icon"
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-semibold">{project.name}</p>
                                            { project.techStack && project.techStack.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                    {project.techStack.map((tech, i) => (
                                                        <Icon
                                                            key={i}
                                                            tooltipLabel={tech.label}
                                                            src={tech.techIcon}
                                                            size={14}
                                                            className="rounded-full bg-gray-900/10 sm:bg-gray-900/20 p-0.5 sm:p-1 border border-white/20"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <ButtonActionGroup
                                        onEdit={() => handleEditProject(project)}
                                        onDelete={() => handleDeleteProject(project.id)}
                                        isLoading={isLoading}
                                    />
                                </div>
                                <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600">
                                    {/* Project Entries Explorer View */}
                                    <div className="flex justify-between">
                                        <h3>Project Files Items</h3>
                                        <button
                                            onClick={() => handleAddEntry(project.id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded text-xs transition"
                                        >
                                            + Entry
                                        </button>
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
                categories={categories}
            />
            <ProjectEntryModal
                isOpen={isEntryModalOpen}
                onClose={() => {
                    setIsEntryModalOpen(false);
                    setSelectedEntry(null);
                }}
                onSave={handleSaveEntry}
                projectEntry={selectedEntry || undefined}
                projectId={selectedProject?.id || ''}
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

    return (
        <div>
            <div
                style={{ paddingLeft }}
                className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-500/30 group transition"
            >
                {/* Expand/Collapse Button */}
                {hasChildren ? (
                    <button
                        onClick={() => onToggleExpand(entry.id)}
                        className="p-0 hover:bg-gray-500/50 rounded transition flex-shrink-0"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
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
                            alt={entry.name}
                            width={18}
                            height={18}
                            className="object-contain"
                        />
                    ) : hasChildren ? (
                        <Folder className="w-4 h-4 text-blue-400" />
                    ) : (
                        <File className="w-4 h-4 text-gray-400" />
                    )}
                </div>

                {/* Entry Name */}
                <span className="text-gray-300 text-sm grow">
                    {entry.name}
                </span>

                {/* Action Buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
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


