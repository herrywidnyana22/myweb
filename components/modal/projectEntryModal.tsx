'use client';

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { FormInput } from "../form/FormInput";
import { FormSelect } from "../form/FormSelect";
import { FormTextarea } from "../form/FormTextarea";
import { FormImageUpload } from "../form/FormImageUpload";
import { ModalHeader } from "../form/ModalHeader";
import { ModalActions } from "../form/ModalActions";

interface ProjectEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProjectEntry) => Promise<void>;
    projectEntry?: ProjectEntry;
    projectId: string;
    parentId?: string;
}

export const ProjectEntryModal = ({
    isOpen,
    onClose,
    onSave,
    projectEntry,
    projectId,
    parentId,
}: ProjectEntryModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingIcon, setIsUploadingIcon] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<Partial<ProjectEntry>>(
        projectEntry || {
            name: '',
            kind: 'FILE',
            fileType: 'OTHER',
            projectId,
            parentId: parentId || undefined,
            icon: undefined,
            subIcon: undefined,
            tooltipText: '',
            href: '',
            imageUrl: undefined,
            subtitle: '',
            progress: undefined,    
            description: '',    
            techStack: undefined,
            extra: undefined,
        }
    );
    const [techItems, setTechItems] = useState<Array<{ category: string; items: string[] }>>(
        (projectEntry?.techStack as any) || []
    );
    const [newCategory, setNewCategory] = useState('');
    const [newItem, setNewItem] = useState('');
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);

    // Reset form when modal opens/closes or when projectEntry changes
    useEffect(() => {
        if (isOpen) {
            if (projectEntry) {
                // Editing existing entry
                setFormData(projectEntry);
                setTechItems((projectEntry?.techStack as any) || []);
            } else {
                // Adding new entry - reset to defaults
                setFormData({
                    name: '',
                    kind: 'FILE',
                    fileType: 'OTHER',
                    projectId,
                    parentId: parentId || undefined,
                    icon: undefined,
                    subIcon: undefined,
                    tooltipText: '',
                    href: '',
                    imageUrl: undefined,
                    subtitle: '',
                    progress: undefined,    
                    description: '',    
                    techStack: undefined,
                    extra: undefined,
                });
                setTechItems([]);
                setNewCategory('');
                setNewItem('');
                setSelectedCategoryIndex(null);
                setErrors({});
            }
        }
    }, [isOpen, projectEntry, projectId, parentId]);

    const handleImageUpload = async (field: 'icon' | 'imageUrl' | 'subIcon', file: File) => {
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formDataUpload,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }
            const data = await response.json();
            handleChange(field, data.url);
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [field]: error instanceof Error ? error.message : 'Failed to upload image',
            }));
        }
    };

    const handleIconUpload = async (file: File): Promise<void> => {
        setIsUploadingIcon(true);
        try {
            await handleImageUpload('icon', file);
        } finally {
            setIsUploadingIcon(false);
        }
    };

    const handleImageUploadFile = async (file: File): Promise<void> => {
        setIsUploadingImage(true);
        try {
            await handleImageUpload('imageUrl', file);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleRemoveIcon = () => {
        handleChange('icon', undefined);
    };

    const handleRemoveImage = () => {
        handleChange('imageUrl', undefined);
    };

    const handleChange = (field: string, value: any) => {
        // Handle both event objects and direct values
        const actualValue = value?.target?.value !== undefined ? value.target.value : value;
        
        setFormData(prev => ({
            ...prev,
            [field]: actualValue || undefined,
        }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleAddTech = () => {
        if (newItem.trim()) {
            if (selectedCategoryIndex !== null) {
                // Add item to existing category
                setTechItems(prev => {
                    const updated = [...prev];
                    updated[selectedCategoryIndex].items.push(newItem);
                    return updated;
                });
            } else if (newCategory.trim()) {
                // Create new category with item
                setTechItems(prev => [...prev, { category: newCategory, items: [newItem] }]);
                setNewCategory('');
            }
            setNewItem('');
        }
    };

    const handleRemoveTech = (categoryIndex: number, itemIndex: number) => {
        setTechItems(prev => {
            const updated = [...prev];
            updated[categoryIndex].items.splice(itemIndex, 1);
            // Remove category if empty
            if (updated[categoryIndex].items.length === 0) {
                updated.splice(categoryIndex, 1);
                setSelectedCategoryIndex(null);
            }
            return updated;
        });
    };

    const handleRemoveCategory = (categoryIndex: number) => {
        setTechItems(prev => prev.filter((_, i) => i !== categoryIndex));
        setSelectedCategoryIndex(null);
    };

    const handleFileTypeChange = (value: any) => {
        const actualValue = value?.target?.value || value;
        handleChange('fileType', actualValue);
        // Reset tech items when changing type
        if (actualValue !== 'TECHSTACK') {
            setTechItems([]);
        } else if (techItems.length === 0) {
            // Initialize with existing tech stack if available
            if (projectEntry?.techStack) {
                setTechItems((projectEntry.techStack as any) || []);
            }
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.kind) {
            newErrors.kind = 'Kind is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const submitData = {
                ...formData,
                techStack: formData.fileType === 'TECHSTACK' ? techItems : undefined,
            };
            await onSave(submitData as ProjectEntry);
            onClose();
        } catch (error) {
            console.error('Error saving project entry:', error);
            setErrors({
                submit: error instanceof Error ? error.message : 'Failed to save project entry',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <ModalHeader
                    title={projectEntry ? 'Edit Item' : 'Add Item'}
                    onClose={onClose}
                    disabled={isLoading}
                />

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Name */}
                    <FormInput
                        label="Name"
                        value={formData.name || ''}
                        onChange={(value) => handleChange('name', value)}
                        placeholder="Entry name"
                        error={errors.name}
                        disabled={isLoading}
                    />

                    {/* Kind and FileType */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormSelect
                            label="Kind"
                            value={formData.kind || 'FILE'}
                            onChange={(value) => handleChange('kind', value)}
                            options={[
                                { value: 'FILE', label: 'File' },
                                { value: 'FOLDER', label: 'Folder' },
                            ]}
                            error={errors.kind}
                            disabled={isLoading}
                        />

                        <FormSelect
                            label="File Type"
                            value={formData.fileType || 'OTHER'}
                            onChange={(value) => handleFileTypeChange(value)}
                            options={[
                                { value: 'PROJECT_INFO', label: 'Project Info' },
                                { value: 'TECHSTACK', label: 'Tech Stack' },
                                { value: 'FIG', label: 'Figma' },
                                { value: 'URL', label: 'URL' },
                                { value: 'TXT', label: 'Text' },
                                { value: 'IMG', label: 'Image' },
                                { value: 'PDF', label: 'PDF' },
                                { value: 'OTHER', label: 'Other' },
                                { value: 'CONTACT', label: 'Contact' },
                            ]}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Dynamic fields based on fileType */}

                    {/* PROJECT_INFO */}
                    {formData.fileType === 'PROJECT_INFO' && (
                        <>
                            <FormImageUpload
                                label="File Icon"
                                imagePreview={formData.icon || null}
                                isUploading={isUploadingIcon}
                                onUpload={handleIconUpload}
                                onRemove={handleRemoveIcon}
                                error={errors.icon}
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Tooltip Text"
                                value={formData.tooltipText || ''}
                                onChange={(value) => handleChange('tooltipText', value)}
                                placeholder="Hover tooltip text"
                                disabled={isLoading}
                            />
                        </>
                    )}

                    {/* TECHSTACK */}
                    {formData.fileType === 'TECHSTACK' && (
                        <>
                            <FormImageUpload
                                label="File Icon"
                                imagePreview={formData.icon || null}
                                isUploading={isUploadingIcon}
                                onUpload={handleIconUpload}
                                onRemove={handleRemoveIcon}
                                error={errors.icon}
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Tooltip Text"
                                value={formData.tooltipText || ''}
                                onChange={(value) => handleChange('tooltipText', value)}
                                placeholder="Hover tooltip text"
                                disabled={isLoading}
                            />
                            
                            {/* Tech Stack Categories */}
                            <div className="space-y-3 bg-gray-50 p-4 rounded border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700">
                                    Technologies by Category
                                </label>
                                
                                {/* Categories List */}
                                {techItems.length > 0 && (
                                    <div className="space-y-3">
                                        {techItems.map((category, catIndex) => (
                                            <div key={catIndex} className="bg-white p-3 rounded border border-gray-300">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-800 text-sm">{category.category}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveCategory(catIndex)}
                                                        className="text-error hover:text-error-dark"
                                                        disabled={isLoading}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    {category.items.map((item, itemIndex) => (
                                                        <div key={itemIndex} className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm">
                                                            <span className="text-gray-700">{item}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveTech(catIndex, itemIndex)}
                                                                className="text-error hover:text-error-dark"
                                                                disabled={isLoading}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Technology */}
                                <div className="space-y-2 pt-3 border-t border-gray-200">
                                    {selectedCategoryIndex === null ? (
                                        <FormInput
                                            label="New Category"
                                            value={newCategory}
                                            onChange={(value) => setNewCategory(value?.target?.value || '')}
                                            placeholder="e.g., Frontend, Backend, Dev Tools"
                                            disabled={isLoading}
                                        />
                                    ) : (
                                        <div className="p-2 bg-blue-100 rounded text-sm text-blue-800">
                                            Adding to: <strong>{techItems[selectedCategoryIndex]?.category}</strong>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedCategoryIndex(null)}
                                                className="ml-2 text-blue-600 hover:text-blue-800 underline"
                                            >
                                                (change)
                                            </button>
                                        </div>
                                    )}
                                    
                                    <FormInput
                                        label="Technology Name"
                                        value={newItem}
                                        onChange={(value) => setNewItem(value?.target?.value || '')}
                                        placeholder="e.g., React.js, TypeScript"
                                        disabled={isLoading}
                                    />

                                    {selectedCategoryIndex === null && techItems.length > 0 && (
                                        <FormSelect
                                            label="Or Add to Existing Category"
                                            value={selectedCategoryIndex !== null ? (selectedCategoryIndex as unknown as number).toString() : ''}
                                            onChange={(value) => {
                                                const actualValue = value?.target?.value || value;
                                                if (actualValue) {
                                                    setSelectedCategoryIndex(actualValue as unknown as number);
                                                    setNewCategory('');
                                                }
                                            }}
                                            options={[
                                                { value: '', label: 'Create new category' },
                                                ...techItems.map((cat, idx) => ({
                                                    value: idx.toString(),
                                                    label: cat.category,
                                                })),
                                            ]}
                                            disabled={isLoading}
                                        />
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleAddTech}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm transition-colors"
                                        disabled={!newItem.trim() || (!newCategory.trim() && selectedCategoryIndex === null) || isLoading}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Technology
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* FIG / FIGMA */}
                    {formData.fileType === 'FIG' && (
                        <>
                            <FormImageUpload
                                label="File Icon"
                                imagePreview={formData.icon || null}
                                isUploading={isUploadingIcon}
                                onUpload={handleIconUpload}
                                onRemove={handleRemoveIcon}
                                error={errors.icon}
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Tooltip Text"
                                value={formData.tooltipText || ''}
                                onChange={(value) => handleChange('tooltipText', value)}
                                placeholder="Hover tooltip text"
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Demo URL"
                                value={formData.href || ''}
                                onChange={(value) => handleChange('href', value)}
                                placeholder="https://..."
                                disabled={isLoading}
                            />
                        </>
                    )}

                    {/* URL */}
                    {formData.fileType === 'URL' && (
                        <>
                            <FormImageUpload
                                label="File Icon"
                                imagePreview={formData.icon || null}
                                isUploading={isUploadingIcon}
                                onUpload={handleIconUpload}
                                onRemove={handleRemoveIcon}
                                error={errors.icon}
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Tooltip Text"
                                value={formData.tooltipText || ''}
                                onChange={(value) => handleChange('tooltipText', value)}
                                placeholder="Hover tooltip text"
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Demo URL"
                                value={formData.href || ''}
                                onChange={(value) => handleChange('href', value)}
                                placeholder="https://..."
                                disabled={isLoading}
                            />
                        </>
                    )}

                    {/* TXT / TEXT */}
                    {formData.fileType === 'TXT' && (
                        <>
                            <FormImageUpload
                                label="File Icon"
                                imagePreview={formData.icon || null}
                                isUploading={isUploadingIcon}
                                onUpload={handleIconUpload}
                                onRemove={handleRemoveIcon}
                                error={errors.icon}
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Tooltip Text"
                                value={formData.tooltipText || ''}
                                onChange={(value) => handleChange('tooltipText', value)}
                                placeholder="Hover tooltip text"
                                disabled={isLoading}
                            />
                            <FormTextarea
                                label="Content"
                                value={formData.description || ''}
                                onChange={(value) => handleChange('description', value)}
                                placeholder="Enter text content"
                                rows={4}
                                disabled={isLoading}
                            />
                        </>
                    )}

                    {/* IMG / IMAGE */}
                    {formData.fileType === 'IMG' && (
                        <>
                            <FormImageUpload
                                label="File Icon"
                                imagePreview={formData.icon || null}
                                isUploading={isUploadingIcon}
                                onUpload={handleIconUpload}
                                onRemove={handleRemoveIcon}
                                error={errors.icon}
                                disabled={isLoading}
                            />
                            <FormImageUpload
                                label="File Image"
                                imagePreview={formData.imageUrl || null}
                                isUploading={isUploadingImage}
                                onUpload={handleImageUploadFile}
                                onRemove={handleRemoveImage}
                                error={errors.imageUrl}
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Tooltip Text"
                                value={formData.tooltipText || ''}
                                onChange={(value) => handleChange('tooltipText', value)}
                                placeholder="Hover tooltip text"
                                disabled={isLoading}
                            />
                        </>
                    )}

                    {/* PDF */}
                    {formData.fileType === 'PDF' && (
                        <>
                            <FormImageUpload
                                label="File Icon"
                                imagePreview={formData.icon || null}
                                isUploading={isUploadingIcon}
                                onUpload={handleIconUpload}
                                onRemove={handleRemoveIcon}
                                error={errors.icon}
                                disabled={isLoading}
                            />
                            <FormInput
                                label="File URL"
                                value={formData.href || ''}
                                onChange={(value) => handleChange('href', value)}
                                placeholder="https://..."
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Tooltip Text"
                                value={formData.tooltipText || ''}
                                onChange={(value) => handleChange('tooltipText', value)}
                                placeholder="Hover tooltip text"
                                disabled={isLoading}
                            />
                        </>
                    )}

                    {/* OTHER */}
                    {formData.fileType === 'OTHER' && (
                        <>
                            <FormImageUpload
                                label="File Icon"
                                imagePreview={formData.icon || null}
                                isUploading={isUploadingIcon}
                                onUpload={handleIconUpload}
                                onRemove={handleRemoveIcon}
                                error={errors.icon}
                                disabled={isLoading}
                            />
                            <FormInput
                                label="File URL"
                                value={formData.href || ''}
                                onChange={(value) => handleChange('href', value)}
                                placeholder="https://..."
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Tooltip Text"
                                value={formData.tooltipText || ''}
                                onChange={(value) => handleChange('tooltipText', value)}
                                placeholder="Hover tooltip text"
                                disabled={isLoading}
                            />
                        </>
                    )}

                    {/* CONTACT */}
                    {formData.fileType === 'CONTACT' && (
                        <>
                            <FormImageUpload
                                label="File Icon"
                                imagePreview={formData.icon || null}
                                isUploading={isUploadingIcon}
                                onUpload={handleIconUpload}
                                onRemove={handleRemoveIcon}
                                error={errors.icon}
                                disabled={isLoading}
                            />
                            <FormInput
                                label="Tooltip Text"
                                value={formData.tooltipText || ''}
                                onChange={(value) => handleChange('tooltipText', value)}
                                placeholder="Hover tooltip text"
                                disabled={isLoading}
                            />
                        </>
                    )}

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="bg-red-900/20 border border-error rounded p-3">
                            <p className="text-red-300 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <ModalActions
                        isSubmitting={isLoading}
                        onCancel={onClose}
                        submitLabel="Save item"
                    />
                </form>
            </div>
        </div>
    );
};
