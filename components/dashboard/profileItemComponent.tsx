import Image from "next/image";
import { ChevronDown, ChevronRight, Plus, Trash2, Edit } from "lucide-react";
import { DEFAULT_FILE_TYPE_ICONS, DEFAULT_FILE_KIND_ICONS } from "@/lib/constants";
import { useLocalizedText } from "@/hooks/useLocalizedText";

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
                className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-500/30 group transition"
            >
                {/* Expand/Collapse Button */}
                {hasChildren && (
                    <button
                        onClick={() => onToggleExpand(item.id)}
                        className="text-gray-400 hover:text-white transition"
                    >
                        {isExpanded ? (
                            <ChevronDown className="size-4" />
                        ) : (
                            <ChevronRight className="size-4" />
                        )}
                    </button>
                )}

                {/* Item Icon */}
                <Image
                    src={displayIcon}
                    alt={getText(item.name)}
                    width={16}
                    height={16}
                    className="size-4 object-contain"
                />

                {/* Item Name */}
                <span className="text-gray-300 text-sm flex-1">{getText(item.name)}</span>

                {/* Item Type Badge */}
                <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-700 rounded">
                    {item.fileType || item.kind}
                </span>

                {/* Action Buttons */}
                <div className="hidden group-hover:flex gap-1">
                    {item.kind === 'FOLDER' && (
                        <button
                            onClick={() => onAddChild(profile.id, item.id)}
                            className="text-green-400 hover:text-green-300 transition p-1"
                            title="Add sub-item"
                            disabled={isLoading}
                        >
                            <Plus className="size-4" />
                        </button>
                    )}
                    <button
                        onClick={() => onEdit(item, profile)}
                        className="text-blue-400 hover:text-blue-300 transition p-1"
                        title="Edit"
                        disabled={isLoading}
                    >
                        <Edit className="size-4" />
                    </button>
                    <button
                        onClick={() => onDelete(item.id, profile)}
                        className="text-red-400 hover:text-red-300 transition p-1"
                        title="Delete"
                        disabled={isLoading}
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div className="space-y-0">
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
