import Image from "next/image";
import useDataStore from "@/store/data";

import { useState } from "react";
import { writeCache } from "@/lib/cache";
import { EducationModal } from "../modal/educationModal";
import { DeleteConfirmModal } from "../modal/deleteConfirmModal";
import { ActionButtonGroup } from "./actionButtonGroup";
import { Plus } from "lucide-react";
import { ActionButton } from "./actionButton";
import { useLocalizedText } from "@/hooks/useLocalizedText";


export const Education = ({isDataLoading = false}: {isDataLoading?: boolean}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { educations, setEducations, categories } = useDataStore();
    const { getText } = useLocalizedText();

    const handleEditEducation = (education: Education) => {
        setSelectedEducation(education);
        setIsModalOpen(true);
    };

    const handleAddEducation = () => {
        setSelectedEducation(null);
        setIsModalOpen(true);
    };

    const handleSaveEducation = async (educationData: Education) => {
        setIsLoading(true);
        try {
            const url = educationData.id ? `/api/educations/${educationData.id}` : '/api/educations';
            const method = educationData.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(educationData),
            });
            const result = await res.json();

            if (result.status === 'ok') {
                const newEducation = result.data as Education;

                // Update global store and cache
                let updatedEducations: Education[];
                if (educationData.id) {
                    // Update existing education
                    updatedEducations = educations.map((e) => (e.id === newEducation.id ? newEducation : e));
                } else {
                    // Add new education
                    updatedEducations = [...educations, newEducation];
                }
                
                setEducations(updatedEducations);
                writeCache('educations_cache', updatedEducations);
                setIsModalOpen(false);
            } else {
                throw new Error(result.msg || result.error || 'Failed to save education');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteEducation = async (id: string) => {
        setDeletingId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingId) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/educations/${deletingId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await res.json();

            if (result.status === 'ok') {
                // Remove education from global store and update cache
                const updatedEducations = educations.filter((e) => e.id !== deletingId);
                setEducations(updatedEducations);
                writeCache('educations_cache', updatedEducations);
                
                setIsDeleteModalOpen(false);
                setDeletingId(null);
            } else {
                throw new Error(result.msg || result.error || 'Failed to delete education');
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
                                    <div className="h-3 w-24 bg-gray-500 rounded" />
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
                    <h2 className="text-xl font-bold text-white">Education</h2>
                    <div className="flex gap-2">
                        <ActionButton
                            onClick={handleAddEducation}
                            variant="add"
                            icon={<> <Plus className="size-3"/> Add </>}
                            title="Add Education"
                        />
                    </div>
                </div>

                {!Array.isArray(educations) || educations.length === 0 ? (
                    <p className="text-gray-400 text-sm">No education found. Click "Add" to create one.</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                    {educations.map((education) => (
                        <div key={education.id} className="group bg-gray-600 rounded p-3 border border-gray-500 flex justify-between items-center">
                            <div className='flex items-center gap-2'>
                                {education.schoolLogo &&(
                                    <Image
                                        src={education.schoolLogo}
                                        alt="Education Icon"
                                        width={32}
                                        height={32}
                                        className="size-8 inline-block rounded-md object-cover"
                                    />
                                )}
                                <div>
                                    <p className="text-white font-semibold">
                                        {education.school}
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        ({education.startYear} - {education.endYear})
                                    </p>
                                </div>
                            </div>
                           <ActionButtonGroup
                                onEdit={() => handleEditEducation(education)}
                                onDelete={() => handleDeleteEducation(education.id)}
                                isLoading={isLoading}
                            />
                        </div>
                    ))}
                    </div>
                )}
            </div>
            <EducationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEducation}
                education={selectedEducation || undefined}
                categories={categories.map(cat => ({
                    id: cat.id,
                    name: typeof cat.name === 'string' ? cat.name : getText(cat.name)
                }))}
            />
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Education"
                message="Are you sure you want to delete this education? This action cannot be undone."
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

