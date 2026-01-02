import Image from "next/image";
import { useState } from "react";
import { EducationModal } from "../modal/educationModal";
import { DeleteConfirmModal } from "../modal/deleteConfirmModal";
import { ButtonActionGroup } from "./buttonActionGroup";
import { writeCache } from "@/lib/cache";


export const Education = ({categories, data, setData, isDataLoading = false}: EducationDashboardProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

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

            if (res.ok) {
                const newEducation = (await res.json()) as Education;

                if (educationData.id) {
                    // Update existing education
                    setData((prev: Education[]) =>
                        prev.map((e) => (e.id === newEducation.id ? newEducation : e))
                    );
                } else {
                    // Add new education
                    setData((prev: Education[] ) => [...prev, newEducation]);
                }

                // Invalidate cache after save
                localStorage.removeItem('educations_cache');
                setIsModalOpen(false);
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to save education');
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

            if (res.ok) {
                // Remove education from local state
                setData((prev: Education[]) => prev.filter((e) => e.id !== deletingId));
                
                // Invalidate cache after delete
                localStorage.removeItem('educations_cache');
                setIsDeleteModalOpen(false);
                setDeletingId(null);
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to delete education');
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
                    <button
                        onClick={handleAddEducation}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-sm transition"
                    >
                        + Add
                    </button>
                    </div>
                </div>

                {data.length === 0 ? (
                    <p className="text-gray-400 text-sm">No education found. Click "Add" to create one.</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.map((education) => (
                        <div key={education.id} className="bg-gray-600 rounded p-3 border border-gray-500 flex justify-between items-center">
                            <div className='flex items-center gap-2'>
                                {education.schoolLogo &&(
                                    <Image
                                        src={education.schoolLogo}
                                        alt="Education Icon"
                                        width={36}
                                        height={36}
                                        className="inline-block rounded-md object-cover"
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
                           <ButtonActionGroup
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
                categories={categories}
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

