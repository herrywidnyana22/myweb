import Image from "next/image";

import { useState } from "react";
import { CategoryModal } from "../modal/categoryModal";
import { DeleteConfirmModal } from "../modal/deleteConfirmModal";
import { ButtonActionGroup } from "./buttonActionGroup";


export const Category = ({data, setData, isDataLoading = false}: CategoryDashboardProps) => {
    
    const [isLoading, setIsLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleAddCategory = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleSaveCategory = async (categoryData: Category) => {
        setIsLoading(true);
        try {
            const url = categoryData.id ? `/api/categories/${categoryData.id}` : '/api/categories';
            const method = categoryData.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData),
            });

            if (res.ok) {
                const newCategory = (await res.json()) as Category;

                if (categoryData.id) {
                    setData((prev: Category[]) =>
                        prev.map((c) => (c.id === newCategory.id ? newCategory : c))
                    );
                } else {
                    setData((prev: Category[]) => [...prev, newCategory]);
                }
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to save category');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        setDeletingId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingId) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/categories/${deletingId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                setData((prev: Category[]) => prev.filter((c) => c.id !== deletingId));
                setIsDeleteModalOpen(false);
                setDeletingId(null);
            } else {
                const error = (await res.json()) as { error?: string };
                throw new Error(error.error || 'Failed to delete category');
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
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-600 rounded p-3 border border-gray-500 flex justify-between items-center animate-pulse">
                            <div className='flex items-center gap-2'>
                                <div className="w-9 h-9 bg-gray-500 rounded-md" />
                                <div className="h-5 w-24 bg-gray-500 rounded" />
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
                    <h2 className="text-xl font-bold text-white">Categories</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddCategory}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-sm transition"
                        >
                            + Add
                        </button>
                    </div>
                </div>

                {data.length === 0 ? (
                    <p className="text-gray-400 text-sm">No categories found. Click "Add" to create one.</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.map((cat) => (
                        <div key={cat.id} className="bg-gray-600 rounded p-3 border border-gray-500 flex justify-between items-center">
                            <div className='flex items-center gap-2'>
                                {cat.icon &&(
                                    <Image
                                        src={cat.icon}
                                        alt="Category Icon"
                                        width={36}
                                        height={36}
                                        className="inline-block rounded-md object-cover"
                                    />
                                )}
                                <p className="text-white font-semibold">
                                    {cat.name}
                                </p>
                            </div>
                            <ButtonActionGroup
                                onEdit={() => handleEditCategory(cat)}
                                onDelete={() => handleDeleteCategory(cat.id)}
                                isLoading={isLoading}
                            />
                        </div>
                    ))}
                    </div>
                )}
            </div>
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCategory}
                category={selectedCategory || undefined}
            />
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Category"
                message="Are you sure you want to delete this category? This will also delete all related educations, experiences, profiles, and contacts. This action cannot be undone."
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