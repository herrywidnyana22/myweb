import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { ExperienceModal } from "../modal/experienceModal";
import { DeleteConfirmModal } from "../modal/deleteConfirmModal";
import { ButtonActionGroup } from "./buttonActionGroup";


export const Experience = ({categories, data, setData, isDataLoading = false}: ExperienceDashboardProps) => {
    
    const [isLoading, setIsLoading] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleEditExperience = (experience: Experience) => {
        setSelectedExperience(experience);
        setIsModalOpen(true);
    };

    const handleAddExperience = () => {
        setSelectedExperience(null);
        setIsModalOpen(true);
    };

    const handleSaveExperience = async (experienceData: Experience) => {
        setIsLoading(true);
        try {
            const url = experienceData.id ? `/api/experiences/${experienceData.id}` : '/api/experiences';
            const method = experienceData.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(experienceData),
            });

            if (res.ok) {
                const newExperience = (await res.json()) as Experience;

                if (experienceData.id) {
                    // Update existing experience
                    setData((prev: Experience[]) =>
                        prev.map((e) => (e.id === newExperience.id ? newExperience : e))
                    );
                } else {
                    // Add new experience
                    setData((prev: Experience[]) => [...prev, newExperience]);
                }
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to save experience');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteExperience = async (id: string) => {
        setDeletingId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingId) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/experiences/${deletingId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                // Remove experience from local state
                setData((prev: Experience[]) => prev.filter((e) => e.id !== deletingId));
                setIsDeleteModalOpen(false);
                setDeletingId(null);
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to delete experience');
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
                    <div className="h-7 w-28 bg-gray-600 rounded animate-pulse" />
                    <div className="h-7 w-16 bg-gray-600 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-600 rounded p-3 border border-gray-500 flex justify-between items-center animate-pulse">
                            <div className='flex items-center gap-2'>
                                <div className="w-9 h-9 bg-gray-500 rounded-md" />
                                <div>
                                    <div className="h-5 w-32 bg-gray-500 rounded mb-1" />
                                    <div className="h-3 w-40 bg-gray-500 rounded" />
                                </div>
                            </div>
                            <div className="h-6 w-12 bg-gray-500 rounded" />
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
                    <h2 className="text-xl font-bold text-white">Experience</h2>
                    <div className="flex gap-2">
                    <button
                        onClick={handleAddExperience}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-sm transition"
                    >
                        + Add
                    </button>
                    </div>
                </div>

                {data.length === 0 ? (
                    <p className="text-gray-400 text-sm">No experience found. Click "Add" to create one.</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.map((experience) => (
                        <div key={experience.id} className="bg-gray-600 rounded p-3 border border-gray-500 flex justify-between items-center">
                            <div className='flex items-center gap-2'>
                                {experience.icon &&(
                                    <Image
                                        src={experience.icon}
                                        alt="Experience Icon"
                                        width={36}
                                        height={36}
                                        className="inline-block rounded-md object-cover"
                                    />
                                )}
                                <div>
                                    <p className="text-white font-semibold">
                                        {experience.company}
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        {experience.role} ({experience.start} - {experience.end})
                                    </p>
                                </div>
                            </div>
                           <ButtonActionGroup
                                onEdit={() => handleEditExperience(experience)}
                                onDelete={() => handleDeleteExperience(experience.id)}
                                isLoading={isLoading}
                            />
                        </div>
                    ))}
                    </div>
                )}
            </div>
            <ExperienceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveExperience}
                experience={selectedExperience || undefined}
                categories={categories}
            />
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Experience"
                message="Are you sure you want to delete this experience? This action cannot be undone."
                isLoading={isLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingId(null);
                }}
            />
    
        </>
    )
}

