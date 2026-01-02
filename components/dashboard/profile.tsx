import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { CategoryModal } from "../modal/categoryModal";
import { ProfileModal } from "../modal/profileModal";


interface CategoryProps {
    categories: Category[];
    data: Profile[];
    setData: Dispatch<SetStateAction<Profile[]>>;
    isDataLoading?: boolean;
}

export const Profile = ({categories, data, setData, isDataLoading = false}: CategoryProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
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

                if (profileData.id) {
                    // Update existing profile
                    setData((prev) =>
                    prev.map((p) => (p.id === newProfile.id ? newProfile : p))
                    );
                } else {
                    // Add new profile
                    setData((prev) => [...prev, newProfile]);
                }
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
                            data.length === 0 && (
                                <button
                                    onClick={handleAddProfile}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-sm transition"
                                >
                                    + Add
                                </button>
                            )
                        }
                    </div>
                </div>

                {data.length === 0 
                ? (
                    <p className="text-gray-400 text-sm">No profiles found. Click "Add" to create one.</p>
                ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                    {data.map((profile) => (
                        <div key={profile.id} className="bg-gray-600 rounded p-3 border border-gray-500">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {profile.photoURL &&(
                                        <Image
                                            src={profile.photoURL}
                                            alt="Photo profile"
                                            width={36}
                                            height={36}
                                            className="inline-block rounded-2xl object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="text-white font-semibold">{profile.fullName}</p>
                                        <p className="text-gray-300 text-sm">{profile.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleEditProfile(profile)}
                                    className="bg-primary hover:bg-primary-hover text-white font-semibold py-1 px-2 rounded text-xs transition"
                                >
                                    Edit
                                </button>
                                </div>
                                    <p className="text-gray-300 text-xs italic">"{profile.quote}"</p>
                                    {profile.experienceYears && (
                                        <p className="text-gray-400 text-xs mt-1">
                                            Experience: {profile.experienceYears} years
                                        </p>
                                    )}
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
                categories={categories}
            />
        </>
    )
}
