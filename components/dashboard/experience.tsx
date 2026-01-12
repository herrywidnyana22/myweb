import Image from "next/image";
import useDataStore from "@/store/data";
import { useState } from "react";
import { writeCache } from "@/lib/cache";
import { ExperienceModal } from "../modal/experienceModal";
import { DeleteConfirmModal } from "../modal/deleteConfirmModal";
import { ActionButtonGroup } from "./actionButtonGroup";
import { CollapsibleCard } from "./collapsibleCard";
import { Plus } from "lucide-react";
import { ActionButton } from "./actionButton";
import { useLocalizedText } from "@/hooks/useLocalizedText";


export const Experience = ({isDataLoading = false}: {isDataLoading?: boolean}) => {
    
    const [isLoading, setIsLoading] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Get experiences from global store
    const { experiences, setExperiences, categories } = useDataStore();
    const { getText } = useLocalizedText();

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
            const result = await res.json();

            if (result.status === 'ok') {
                const newExperience = result.data as Experience;

                // Update global store and cache
                let updatedExperiences: Experience[];
                if (experienceData.id) {
                    // Update existing experience
                    updatedExperiences = experiences.map((e) => (e.id === newExperience.id ? newExperience : e));
                } else {
                    // Add new experience
                    updatedExperiences = [...experiences, newExperience];
                }
                
                setExperiences(updatedExperiences);
                writeCache('experiences_cache', updatedExperiences);
                setIsModalOpen(false);
            } else {
                throw new Error(result.msg || result.error || 'Failed to save experience');
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
            const result = await res.json();

            if (result.status === 'ok') {
                // Remove experience from global store and update cache
                const updatedExperiences = experiences.filter((e) => e.id !== deletingId);
                setExperiences(updatedExperiences);
                writeCache('experiences_cache', updatedExperiences);
                
                setIsDeleteModalOpen(false);
                setDeletingId(null);
            } else {
                throw new Error(result.msg || result.error || 'Failed to delete experience');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }


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
            <CollapsibleCard title="Experience">
                <div className="flex justify-end items-start mb-4">
                    <ActionButton
                        onClick={handleAddExperience}
                        variant="add"
                        icon={<> <Plus className="size-3"/> Add </>}
                        title="Add Experience"
                    />    
                </div>

                {!Array.isArray(experiences) || experiences.length === 0 ? (
                    <p className="text-gray-400 text-sm">No experience found. Click "Add" to create one.</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                    {experiences.map((experience) => (
                        <div key={experience.id} className="group bg-gray-600 rounded p-3 border border-gray-500 flex justify-between items-center">
                            <div className='flex items-center gap-2'>
                                {experience.icon &&(
                                    <Image
                                        src={experience.icon}
                                        alt="Experience Icon"
                                        width={32}
                                        height={32}
                                        className="size-8 inline-block rounded-md object-cover"
                                    />
                                )}
                                <div>
                                    <p className="text-white font-semibold">
                                        {experience.company}
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        {getText(experience.role)} ({experience.start} - {experience.end})
                                    </p>
                                </div>
                            </div>
                           <ActionButtonGroup
                                onEdit={() => handleEditExperience(experience)}
                                onDelete={() => handleDeleteExperience(experience.id)}
                                isLoading={isLoading}
                            />
                        </div>
                    ))}
                    </div>
                )}
            </CollapsibleCard>
            <ExperienceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveExperience}
                experience={selectedExperience || undefined}
                categories={categories.map(cat => ({
                    id: cat.id,
                    name: typeof cat.name === 'string' ? cat.name : getText(cat.name)
                }))}
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

