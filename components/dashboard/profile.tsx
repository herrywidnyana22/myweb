import Image from "next/image";
import useDataStore from "@/store/data";
import { useState } from "react";
import { ProfileModal } from "../modal/profileModal";
import { ItemModal } from "../modal/itemModal";
import { DeleteConfirmModal } from "../modal/deleteConfirmModal";
import { writeCache } from "@/lib/cache";
import { ChevronDown, ChevronRight, Plus, Trash2, Edit } from "lucide-react";
import { ActionButton } from "./actionButton";
import { DEFAULT_FILE_TYPE_ICONS, DEFAULT_FILE_KIND_ICONS } from "@/lib/constants";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { get } from "node:http";


export const Profile = ({isDataLoading = false}: {isDataLoading?: boolean}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ProfileItem | null>(null);
    const [parentItemId, setParentItemId] = useState<string | undefined>(undefined);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
    
    // Get profiles from global store
    const { profiles, setProfiles, categories } = useDataStore();
    const { getText } = useLocalizedText();

    const handleEditProfile = (profile: Profile) => {
        setSelectedProfile(profile);
        setIsModalOpen(true);
    };

    const handleAddProfile = () => {
        setSelectedProfile(null);
        setIsModalOpen(true);
    };

    const handleSaveProfile = async (profileData: Profile) => {
        setIsLoading(true);
        try {
            const url = profileData.id ? `/api/profiles/${profileData.id}` : '/api/profiles';
            const method = profileData.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            if (res.ok) {
                const newProfile = (await res.json()) as Profile;

                // Update global store and cache
                let updatedProfiles: Profile[];
                if (profileData.id) {
                    // Update existing profile
                    updatedProfiles = profiles.map((p) => (p.id === newProfile.id ? newProfile : p));
                } else {
                    // Add new profile
                    updatedProfiles = [...profiles, newProfile];
                }
                
                setProfiles(updatedProfiles);
                writeCache('profiles_cache', updatedProfiles);
                setIsModalOpen(false);
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to save profile');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddItem = (profileId: string, parentId?: string) => {
        setSelectedItem(null);
        setParentItemId(parentId);
        const profileData = profiles.find(p => p.id === profileId);
        if (profileData) {
            setSelectedProfile(profileData);
        }
        setIsItemModalOpen(true);
    };

    const handleEditItem = (item: ProfileItem, profile: Profile) => {
        setSelectedItem(item);
        setSelectedProfile(profile);
        setIsItemModalOpen(true);
    };

    const handleSaveItem = async (itemData: ProfileItem) => {
        console.log("OKKKKKKK")

        if (!selectedProfile) return;

        setIsLoading(true);
        try {
            const url = itemData.id ? `/api/profiles/items/${itemData.id}` : '/api/profiles/items';
            const method = itemData.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...itemData,
                    profileId: selectedProfile.id,
                }),
            });

            if (res.ok) {
                const newItem = (await res.json()) as ProfileItem;

                // Update global store and cache
                const updatedProfiles = profiles.map((p) => {
                    if (p.id === selectedProfile.id) {
                        const items = p.items || [];
                        let updatedItems: ProfileItem[];
                        if (itemData.id) {
                            // Update existing item (recursive)
                            const updateItemRecursive = (items: ProfileItem[]): ProfileItem[] => {
                                return items.map((item) => {
                                    if (item.id === newItem.id) {
                                        return newItem;
                                    }
                                    if (item.children && item.children.length > 0) {
                                        return {
                                            ...item,
                                            children: updateItemRecursive(item.children),
                                        };
                                    }
                                    return item;
                                });
                            };
                            updatedItems = updateItemRecursive(items);
                        } else {
                            // Add new item
                            if (newItem.parentId) {
                                // Add as child of parent
                                const addToParent = (items: ProfileItem[]): ProfileItem[] => {
                                    return items.map((item) => {
                                        if (item.id === newItem.parentId) {
                                            return {
                                                ...item,
                                                children: [...(item.children || []), newItem],
                                            };
                                        }
                                        if (item.children && item.children.length > 0) {
                                            return {
                                                ...item,
                                                children: addToParent(item.children),
                                            };
                                        }
                                        return item;
                                    });
                                };
                                updatedItems = addToParent(items);
                            } else {
                                // Add to root level
                                updatedItems = [...items, newItem];
                            }
                        }
                        return { ...p, items: updatedItems };
                    }
                    return p;
                });

                setProfiles(updatedProfiles);
                writeCache('profiles_cache', updatedProfiles);
                setIsItemModalOpen(false);
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to save profile item');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteItem = (itemId: string) => {
        setDeletingItemId(itemId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDeleteItem = async () => {
        if (!deletingItemId || !selectedProfile) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/profiles/items/${deletingItemId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                // Remove item from global store (recursive)
                const updatedProfiles = profiles.map((p) => {
                    if (p.id === selectedProfile.id) {
                        const removeItemRecursive = (items: ProfileItem[]): ProfileItem[] => {
                            return items
                                .filter((item) => item.id !== deletingItemId)
                                .map((item) => {
                                    if (item.children && item.children.length > 0) {
                                        return {
                                            ...item,
                                            children: removeItemRecursive(item.children),
                                        };
                                    }
                                    return item;
                                });
                        };
                        return { ...p, items: removeItemRecursive(p.items || []) };
                    }
                    return p;
                });

                setProfiles(updatedProfiles);
                writeCache('profiles_cache', updatedProfiles);
                setIsDeleteModalOpen(false);
                setDeletingItemId(null);
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to delete profile item');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const toggleExpand = (itemId: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    if (isDataLoading) {
        return (
            <div className="bg-gray-700 rounded-lg shadow-lg p-6 border border-gray-600">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-7 w-20 bg-gray-600 rounded animate-pulse" />
                    <div className="h-7 w-16 bg-gray-600 rounded animate-pulse" />
                </div>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-gray-600 rounded p-3 border border-gray-500 animate-pulse">
                            <div className="flex justify-between items-start mb-2">
                                <div className="w-9 h-9 bg-gray-500 rounded-2xl" />
                                <div className="flex-1 ml-2">
                                    <div className="h-4 w-32 bg-gray-500 rounded mb-2" />
                                    <div className="h-3 w-24 bg-gray-500 rounded" />
                                </div>
                                <div className="h-6 w-12 bg-gray-500 rounded" />
                            </div>
                            <div className="h-3 w-full bg-gray-500 rounded mb-1" />
                            <div className="h-3 w-20 bg-gray-500 rounded" />
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
                    <h2 className="text-xl font-bold text-white">Profile</h2>
                    <div className="flex gap-2">
                        {
                            profiles.length === 0 && (
                                <ActionButton
                                    onClick={handleAddProfile}
                                    variant="add"
                                    icon={<> <Plus className="size-3"/> Add </>}
                                    title="Add Profile"
                                />
                            )
                        }
                    </div>
                </div>

                { profiles.length === 0 
                ? (
                    <p className="text-gray-400 text-sm">No profiles found. Click "Add" to create one.</p>
                ) : (
                    <div className="space-y-4 max-h-150 overflow-y-auto">
                    {profiles.map((profile) => (
                        <div key={profile.id} className="bg-gray-600 rounded p-4 border border-gray-500">
                            {/* Profile Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    {profile.photoURL &&(
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
                                    onClick={() => handleEditProfile(profile)}
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
                                            onClick={() => handleAddItem(profile.id)}
                                            variant="add"
                                            icon={
                                                <><Plus className="size-4"/> Item</>
                                            }
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
                                                    onToggleExpand={toggleExpand}
                                                    onEdit={handleEditItem}
                                                    onDelete={handleDeleteItem}
                                                    onAddChild={handleAddItem}
                                                    isLoading={isLoading}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                        </div>
                    ))}
                    </div>
                )}
            </div>

            
            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProfile}
                profile={selectedProfile || undefined}
                categories={categories.map(cat => ({
                    id: cat.id,
                    name: getText(cat.name)
                }))}
            />

            <ItemModal
                isOpen={isItemModalOpen}
                onClose={() => {
                    setIsItemModalOpen(false);
                    setSelectedItem(null);
                    setParentItemId(undefined);
                }}
                onSave={handleSaveItem}
                item={selectedItem || undefined}
                ownerId={selectedProfile?.id || ''}
                ownerType="profile"
                parentId={parentItemId}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Profile Item"
                message="Are you sure you want to delete this profile item and all its sub-items? This action cannot be undone."
                isLoading={isLoading}
                onConfirm={handleConfirmDeleteItem}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingItemId(null);
                }}
            />
        </>
    )
}

// Helper component for rendering profile items as a tree
interface ProfileItemComponentProps {
    item: ProfileItem;
    profile: Profile;
    level: number;
    isExpanded: boolean;
    expandedItems: Set<string>;
    onToggleExpand: (id: string) => void;
    onEdit: (item: ProfileItem, profile: Profile) => void;
    onDelete: (id: string) => void;
    onAddChild: (parentId: string) => void;
    isLoading: boolean;
}

const ProfileItemComponent = ({
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
                            onClick={() => onAddChild(item.id)}
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
                        onClick={() => onDelete(item.id)}
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
}
