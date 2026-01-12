import Image from "next/image";
import { ChevronDown, ChevronRight, Folder, File } from "lucide-react";
import { getEffectiveIcon } from "@/lib/utils";
import { useLocalizedText } from "@/hooks/useLocalizedText";

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
                            onClick={() => onAddChild(project.id, entry.id)}
                            disabled={isLoading}
                            className="px-2 py-0.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                        >
                            +
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(entry.id, project)}
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
};
