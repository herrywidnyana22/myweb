import { useState } from "react";
import useDataStore from "@/store/data";
import { writeCache } from "@/lib/cache";

export const useProfileManager = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ProfileItem | null>(null);
    const [parentItemId, setParentItemId] = useState<string | undefined>(undefined);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
    
    const { profiles, setProfiles } = useDataStore();

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
            const result = await res.json();

            if (result.status === 'ok') {
                const newProfile = result.data as Profile;

                let updatedProfiles: Profile[];
                if (profileData.id) {
                    updatedProfiles = profiles.map((p) => (p.id === newProfile.id ? newProfile : p));
                } else {
                    updatedProfiles = [...profiles, newProfile];
                }
                
                setProfiles(updatedProfiles);
                writeCache('profiles_cache', updatedProfiles);
                setIsModalOpen(false);
            } else {
                throw new Error(result.msg || result.error || 'Failed to save profile');
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
            const result = await res.json();

            if (result.status === 'ok') {
                const newItem = result.data as ProfileItem;

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
                throw new Error(result.msg || result.error || 'Failed to save profile item');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteItem = (itemId: string, profile: Profile) => {
        setDeletingItemId(itemId);
        setSelectedProfile(profile);
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
            const result = await res.json();

            if (result.status === 'ok') {
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
                throw new Error(result.msg || result.error || 'Failed to delete profile item');
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

    return {
        isLoading,
        selectedProfile,
        isModalOpen,
        isItemModalOpen,
        selectedItem,
        parentItemId,
        expandedItems,
        isDeleteModalOpen,
        profiles,
        handleEditProfile,
        handleAddProfile,
        handleSaveProfile,
        handleAddItem,
        handleEditItem,
        handleSaveItem,
        handleDeleteItem,
        handleConfirmDeleteItem,
        toggleExpand,
        setIsModalOpen,
        setIsItemModalOpen,
        setSelectedItem,
        setParentItemId,
        setIsDeleteModalOpen,
        setDeletingItemId,
    };
};
