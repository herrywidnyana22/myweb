'use client';

import { useEffect, useState } from 'react';
import { FormInput } from '../form/FormInput';
import { FormSelect } from '../form/FormSelect';
import { FormTextarea } from '../form/FormTextarea';
import { FormImageUpload } from '../form/FormImageUpload';
import { FormError } from '../form/FormError';
import { ModalHeader } from '../form/ModalHeader';
import { ModalActions } from '../form/ModalActions';
import { MultiLangInput } from '../form/MultiLangInput';
import { MultiLangText, createMultiLangText } from '@/lib/constants/languages';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trash2, Plus, X } from 'lucide-react';
import { ContactList } from '../contactList';
import { Notice } from '../notice';

type ItemType = ProjectEntry | ProfileItem;
type OwnerType = 'project' | 'profile';

interface ItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    item?: ItemType;
    ownerId: string;
    ownerType: OwnerType;
    parentId?: string;
}

export const ItemModal = ({
    isOpen,
    onClose,
    onSave,
    item,
    ownerId,
    ownerType,
    parentId,
}: ItemModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingIcon, setIsUploadingIcon] = useState(false);
    const [isUploadingSubIcon, setIsUploadingSubIcon] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const { selectedTranslationLanguages, getLanguageInfo } = useLanguage();
    
    const getDefaultFormData = () => ({
        name: '',
        kind: 'FILE' as const,
        fileType: 'OTHER' as const,
        ...(ownerType === 'project' ? { projectId: ownerId } : { profileId: ownerId }),
        parentId: parentId || undefined,
        icon: undefined,
        ...(ownerType === 'project' ? { subIcon: undefined } : {}),
        tooltipText: '',
        href: '',
        imageUrl: undefined,
        subtitle: '',
        ...(ownerType === 'project' ? { progress: undefined } : {}),
        description: '',
        ...(ownerType === 'project' ? { techStack: undefined } : {}),
        extra: undefined,
    });

    const [formData, setFormData] = useState<any>(item || getDefaultFormData());
    const [techItems, setTechItems] = useState<Array<{ category: string; items: string[] }>>(
        ownerType === 'project' && item && 'techStack' in item ? (item.techStack as any) || [] : []
    );
    const [newCategory, setNewCategory] = useState('');
    const [newItem, setNewItem] = useState('');
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);

    // Get fileType options based on ownerType
    const getFileTypeOptions = () => {
        const baseOptions = [
            { value: 'TXT', label: 'Text' },
            { value: 'IMG', label: 'Image' },
            { value: 'PDF', label: 'PDF' },
            { value: 'URL', label: 'URL' },
            { value: 'OTHER', label: 'Other' },
        ];

        if (ownerType === 'project') {
            return [
                { value: 'PROJECT_INFO', label: 'Project Info' },
                { value: 'TECHSTACK', label: 'Tech Stack' },
                { value: 'FIG', label: 'Figma' },
                ...baseOptions,
            ];
        } else {
            return [
                { value: 'CONTACT', label: 'Contact' },
                ...baseOptions,
            ];
        }
    };

    // Reset form when modal opens/closes or when item changes
    useEffect(() => {
        if (isOpen) {
            if (item) {
                setFormData(item);
                if (ownerType === 'project' && 'techStack' in item) {
                    setTechItems((item.techStack as any) || []);
                }
            } else {
                setFormData(getDefaultFormData());
                setTechItems([]);
                setNewCategory('');
                setNewItem('');
                setSelectedCategoryIndex(null);
                setErrors({});
            }
        }
    }, [isOpen, item, ownerId, ownerType, parentId]);

    const handleImageUpload = async (field: string, file: File) => {
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formDataUpload,
            });
            const result = await response.json();

            if (result.status !== 'ok') {
                throw new Error(result.msg || result.error || 'Upload failed');
            }
            const data = result.data as { url: string };
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

    const handleSubIconUpload = async (file: File): Promise<void> => {
        setIsUploadingSubIcon(true);
        try {
            await handleImageUpload('subIcon', file);
        } finally {
            setIsUploadingSubIcon(false);
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

    const handleRemoveIcon = () => handleChange('icon', undefined);
    const handleRemoveSubIcon = () => handleChange('subIcon', undefined);
    const handleRemoveImage = () => handleChange('imageUrl', undefined);

    const handleChange = (field: string, value: any) => {
        const actualValue = value?.target?.value !== undefined ? value.target.value : value;
        
        setFormData((prev: any) => ({
            ...prev,
            [field]: actualValue || undefined,
        }));
        
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleMultiLangChange = (field: string, value: MultiLangText) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value,
        }));
        
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
                setTechItems(prev => {
                    const updated = [...prev];
                    updated[selectedCategoryIndex].items.push(newItem);
                    return updated;
                });
            } else if (newCategory.trim()) {
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
        if (ownerType === 'project' && actualValue !== 'TECHSTACK') {
            setTechItems([]);
        } else if (ownerType === 'project' && actualValue === 'TECHSTACK' && techItems.length === 0) {
            if (item && 'techStack' in item && item.techStack) {
                setTechItems((item.techStack as any) || []);
            }
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Check if name has content (handle both string and MultiLangText)
        const nameValue = typeof formData.name === 'string' 
            ? formData.name 
            : formData.name?.source || '';
        
        if (!nameValue.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.kind) {
            newErrors.kind = 'Kind is required';
        }

        if (!formData.fileType) {
            newErrors.fileType = 'File Type is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const submitData: any = { ...formData };
            if (ownerType === 'project' && formData.fileType === 'TECHSTACK') {
                submitData.techStack = techItems;
            }
            console.log({submitData})
            await onSave(submitData);
            onClose();
        } catch (error) {
            console.error('Error saving item:', error);
            setErrors({
                submit: error instanceof Error ? error.message : 'Failed to save item',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const isProject = ownerType === 'project';
    const title = item ? 'Edit Item' : 'Add Item';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <ModalHeader
                    title={title}
                    onClose={onClose}
                    disabled={isLoading}
                />

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <FormError message={errors.submit} />

                    {/* Name - Always multilingual for both Project and Profile */}
                    <MultiLangInput
                        label="Name"
                        value={formData.name || createMultiLangText('')}
                        onChange={(val) => handleMultiLangChange('name', val)}
                        selectedLanguages={selectedTranslationLanguages}
                        placeholder="Item name"
                        disabled={isLoading}
                        type="input"
                        getLanguageInfo={getLanguageInfo}
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
                            options={getFileTypeOptions()}
                            error={errors.fileType}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Dynamic fields based on fileType */}

                    {/* PROJECT_INFO - Project only */}
                    {isProject && formData.fileType === 'PROJECT_INFO' && (
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
                        <MultiLangInput
                            label="Tooltip Text"
                            value={formData.tooltipText || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('tooltipText', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Hover tooltip text (optional)"
                            disabled={isLoading}
                            type="input"
                            getLanguageInfo={getLanguageInfo}
                        />
                        {/* NOTICE */}
                        <Notice
                            text={<>
                                <strong>Note:</strong> Project data (Tech Stack, Progress, Description) will be automatically populated from the project. The project icon will be saved to subIcon field.
                            </> }
                        />
                    </>
                    )}

                    {/* TECHSTACK - Project only */}
                    {isProject && formData.fileType === 'TECHSTACK' && (
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
                        <MultiLangInput
                            label="Tooltip Text"
                            value={formData.tooltipText || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('tooltipText', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Hover tooltip text"
                            disabled={isLoading}
                            type="input"
                            getLanguageInfo={getLanguageInfo}
                        />
                        
                        {/* Tech Stack Categories */}
                        <div className="space-y-3 bg-gray-50 p-4 rounded border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700">
                                Technologies by Category
                            </label>
                            
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

                            <div className="space-y-2 pt-3 border-t border-gray-200">
                                {selectedCategoryIndex === null ? (
                                    <FormInput
                                        label="New Category"
                                        value={newCategory}
                                        onChange={(value) => setNewCategory(value?.target?.value || '')}
                                        placeholder="e.g., Frontend, Backend"
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
                                        value={selectedCategoryIndex !== null ? String(selectedCategoryIndex) : ''}
                                        onChange={(value) => {
                                            const actualValue = typeof value === 'string' ? value : value?.target?.value || '';
                                            if (actualValue) {
                                                setSelectedCategoryIndex(parseInt(actualValue, 10));
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

                    {/* FIG / FIGMA - Project only */}
                    {isProject && formData.fileType === 'FIG' && (
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
                        <MultiLangInput
                            label="Tooltip Text"
                            value={formData.tooltipText || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('tooltipText', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Hover tooltip text"
                            disabled={isLoading}
                            type="input"
                            getLanguageInfo={getLanguageInfo}
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
                        <MultiLangInput
                            label="Tooltip Text"
                            value={formData.tooltipText || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('tooltipText', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Hover tooltip text"
                            disabled={isLoading}
                            type="input"
                            getLanguageInfo={getLanguageInfo}
                        />
                        <FormInput
                            label="URL"
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
                        <MultiLangInput
                            label="Tooltip Text"
                            value={formData.tooltipText || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('tooltipText', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Hover tooltip text"
                            disabled={isLoading}
                            type="input"
                            getLanguageInfo={getLanguageInfo}
                        />
                        <MultiLangInput
                            label="Subtitle"
                            value={formData.subtitle || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('subtitle', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Subtitle"
                            disabled={isLoading}
                            type="input"
                            getLanguageInfo={getLanguageInfo}
                        />
                        <MultiLangInput
                            label="Content"
                            value={formData.description || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('description', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Enter text content"
                            disabled={isLoading}
                            type="textarea"
                            rows={4}
                            getLanguageInfo={getLanguageInfo}
                        />
                    </>
                    )}

                    {/* IMG / IMAGE */}
                    {formData.fileType === 'IMG' && (
                    <>
                        <FormImageUpload
                            label="File Image"
                            imagePreview={formData.imageUrl || null}
                            isUploading={isUploadingImage}
                            onUpload={handleImageUploadFile}
                            onRemove={handleRemoveImage}
                            error={errors.imageUrl}
                            disabled={isLoading}
                        />
                        <MultiLangInput
                            label="Tooltip Text"
                            value={formData.tooltipText || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('tooltipText', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Hover tooltip text"
                            disabled={isLoading}
                            type="input"
                            getLanguageInfo={getLanguageInfo}
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
                        <MultiLangInput
                            label="Tooltip Text"
                            value={formData.tooltipText || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('tooltipText', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Hover tooltip text"
                            disabled={isLoading}
                            type="input"
                            getLanguageInfo={getLanguageInfo}
                        />
                        <FormInput
                            label="PDF URL"
                            value={formData.href || ''}
                            onChange={(value) => handleChange('href', value)}
                            placeholder="https://... or /files/..."
                            disabled={isLoading}
                        />
                    </>
                    )}

                    {/* CONTACT - Profile only */}
                    {!isProject && formData.fileType === 'CONTACT' && (
                    <>
                        <FormImageUpload
                            label="Contact Icon"
                            imagePreview={formData.icon || null}
                            isUploading={isUploadingIcon}
                            onUpload={handleIconUpload}
                            onRemove={handleRemoveIcon}
                            error={errors.icon}
                            disabled={isLoading}
                        />
                        <MultiLangInput
                            label="Tooltip Text"
                            value={formData.tooltipText || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('tooltipText', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Hover tooltip text"
                            disabled={isLoading}
                            type="input"
                            getLanguageInfo={getLanguageInfo}
                        />
                        <ContactList />
                        <Notice
                            text={
                            <>
                                <strong>Note:</strong> The list above shows available contacts for reference.
                            </>}
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
                        <MultiLangInput
                            label="Tooltip Text"
                            value={formData.tooltipText || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('tooltipText', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Hover tooltip text"
                            disabled={isLoading}
                            type="input"
                            getLanguageInfo={getLanguageInfo}
                        />
                        <MultiLangInput
                            label="Subtitle"
                            value={formData.subtitle || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('subtitle', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Subtitle"
                            disabled={isLoading}
                            type="input"
                            getLanguageInfo={getLanguageInfo}
                        />
                        <MultiLangInput
                            label="Description"
                            value={formData.description || createMultiLangText('')}
                            onChange={(val) => handleMultiLangChange('description', val)}
                            selectedLanguages={selectedTranslationLanguages}
                            placeholder="Enter description"
                            disabled={isLoading}
                            type="textarea"
                            rows={4}
                            getLanguageInfo={getLanguageInfo}
                        />
                        <FormInput
                            label="Link (optional)"
                            value={formData.href || ''}
                            onChange={(value) => handleChange('href', value)}
                            placeholder="https://..."
                            disabled={isLoading}
                        />
                    </>
                    )}

                    {/* SubIcon - Project only */}
                    {isProject && formData.fileType === 'PROJECT_INFO' && (
                    <FormImageUpload
                        label="Sub Icon"
                        imagePreview={formData.subIcon || null}
                        isUploading={isUploadingSubIcon}
                        onUpload={handleSubIconUpload}
                        onRemove={handleRemoveSubIcon}
                        disabled={isLoading}
                    />
                    )}

                    {/* Progress - Project only */}
                    {isProject && formData.fileType === 'PROJECT_INFO' && (
                        <FormInput
                            label="Progress"
                            type="number"
                            value={formData.progress || ''}
                            onChange={(value) => handleChange('progress', value)}
                            placeholder="0-100"
                            disabled={isLoading}
                        />
                    )}

                    <ModalActions
                        isSubmitting={isLoading}
                        onCancel={onClose}
                        submitLabel="Save Item"
                    />
                </form>
            </div>
        </div>
    );
};

