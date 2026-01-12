import Image from "next/image";
import { Plus } from "lucide-react";
import { Icon } from "../icon";
import { ActionButtonGroup } from "./actionButtonGroup";
import { ActionButton } from "./actionButton";
import { ProjectEntryItem } from "./projectEntryItem";
import { useLocalizedText } from "@/hooks/useLocalizedText";

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
        <div className="group bg-gray-600 rounded p-4 border border-gray-500">
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
                        {project.techStack && project.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {project.techStack.map((tech: TechStack, i: number) => (
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
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isLoading={isLoading}
                />
            </div>

            <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600">
                {/* Project Entries Explorer View */}
                <div className="flex justify-between">
                    <h3>Project Files Items</h3>
                    <ActionButton
                        onClick={onAddEntry}
                        variant="add"
                        icon={<> <Plus className="size-3" /> Item </>}
                        title="File Explorer"
                    />
                </div>
                {project.entries && project.entries.length > 0 && (
                    <div className="mt-4 border-t border-gray-500 pt-3">
                        <div className="space-y-1 ml-2">
                            {project.entries
                                .filter(entry => !entry.parentId)
                                .map((entry) => (
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
