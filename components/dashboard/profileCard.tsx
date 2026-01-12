import Image from "next/image";
import { Plus } from "lucide-react";
import { ActionButton } from "./actionButton";
import { ProfileItemComponent } from "./profileItemComponent";
import { useLocalizedText } from "@/hooks/useLocalizedText";

interface ProfileCardProps {
    profile: Profile;
    expandedItems: Set<string>;
    isLoading: boolean;
    onEdit: () => void;
    onAddItem: () => void;
    onToggleExpand: (id: string) => void;
    onEditItem: (item: ProfileItem, profile: Profile) => void;
    onDeleteItem: (id: string, profile: Profile) => void;
    onAddChild: (profileId: string, parentId?: string) => void;
}

export const ProfileCard = ({
    profile,
    expandedItems,
    isLoading,
    onEdit,
    onAddItem,
    onToggleExpand,
    onEditItem,
    onDeleteItem,
    onAddChild,
}: ProfileCardProps) => {
    const { getText } = useLocalizedText();

    return (
        <div className="bg-gray-600 rounded p-4 border border-gray-500">
            {/* Profile Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    {profile.photoURL && (
                        <Image
                            src={profile.photoURL}
                            alt="Photo profile"
                            width={32}
                            height={32}
                            className="size-8 inline-block rounded-2xl object-cover"
                        />
                    )}
                    <div>
                        <p className="text-white font-semibold">{profile.fullName}</p>
                        <p className="text-gray-300 text-sm">{getText(profile.role)}</p>
                    </div>
                </div>
                <button
                    onClick={onEdit}
                    className="bg-primary hover:bg-primary-hover text-white font-semibold py-1 px-2 rounded text-xs transition"
                >
                    Edit
                </button>
            </div>
            
            <p className="text-gray-300 text-xs italic mb-2">"{getText(profile.quote)}"</p>
            {profile.experienceYears && (
                <p className="text-gray-400 text-xs">
                    Experience: {profile.experienceYears} years
                </p>
            )}

            {/* Profile Items */}
            <div className="mt-4 pt-4 border-t border-gray-500">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">File Explorer:</h4>
                    <ActionButton
                        onClick={onAddItem}
                        variant="add"
                        icon={<><Plus className="size-4"/> Item</>}
                        title="Add Profile Item"
                    />
                </div>
                {profile.items && profile.items.length > 0 && (
                    <div className="space-y-1">
                        {profile.items.map((item) => (
                            <ProfileItemComponent
                                key={item.id}
                                item={item}
                                profile={profile}
                                level={0}
                                isExpanded={expandedItems.has(item.id)}
                                expandedItems={expandedItems}
                                onToggleExpand={onToggleExpand}
                                onEdit={onEditItem}
                                onDelete={onDeleteItem}
                                onAddChild={onAddChild}
                                isLoading={isLoading}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
