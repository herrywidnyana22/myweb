'use client';

import { FormInput } from '../form/FormInput';
import { FormSelect } from '../form/FormSelect';
import { FormImageUpload } from '../form/FormImageUpload';
import { FormError } from '../form/FormError';
import { ModalHeader } from '../form/ModalHeader';
import { ModalActions } from '../form/ModalActions';
import { MultiLangInput } from '../form/MultiLangInput';
import { createMultiLangText } from '@/lib/constants/languages';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContactList } from '../contactList';
import { Notice } from '../notice';
import { CommonIconAndTooltipFields, UrlField, SubtitleAndDescriptionFields } from './ItemModalFields';
import { useItemModalForm } from '@/hooks/useItemModalForm';
import { getFileTypeOptions } from '@/lib/utils/fileTypeOptions';
import { TechStackManager } from './TechStackManager';

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
    const { selectedTranslationLanguages, getLanguageInfo } = useLanguage();
    
    const {
        formData,
        setFormData,
        techItems,
        setTechItems,
        errors,
        setErrors,
        isLoading,
        setIsLoading,
        isUploadingIcon,
        setIsUploadingIcon,
        isUploadingSubIcon,
        setIsUploadingSubIcon,
        isUploadingImage,
        setIsUploadingImage,
        handleChange,
        handleMultiLangChange,
        handleImageUpload,
        validateForm,
    } = useItemModalForm(isOpen, item, ownerId, ownerType, parentId);

    const handleIconUpload = async (file: File) => {
        setIsUploadingIcon(true);
        try {
            await handleImageUpload('icon', file);
        } finally {
            setIsUploadingIcon(false);
        }
    };

    const handleSubIconUpload = async (file: File) => {
        setIsUploadingSubIcon(true);
        try {
            await handleImageUpload('subIcon', file);
        } finally {
            setIsUploadingSubIcon(false);
        }
    };

    const handleImageUploadFile = async (file: File) => {
        setIsUploadingImage(true);
        try {
            await handleImageUpload('imageUrl', file);
        } finally {
            setIsUploadingImage(false);
        }
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
                            options={getFileTypeOptions(ownerType)}
                            error={errors.fileType}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Dynamic fields based on fileType */}

                    {/* PROJECT_INFO - Project only */}
                    {isProject && formData.fileType === 'PROJECT_INFO' && (
                    <>
                        <CommonIconAndTooltipFields
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            isUploadingIcon={isUploadingIcon}
                            selectedTranslationLanguages={selectedTranslationLanguages}
                            getLanguageInfo={getLanguageInfo}
                            onIconUpload={handleIconUpload}
                            onIconRemove={() => handleChange('icon', undefined)}
                            onChange={handleChange}
                            onMultiLangChange={handleMultiLangChange}
                        />
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
                        <CommonIconAndTooltipFields
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            isUploadingIcon={isUploadingIcon}
                            selectedTranslationLanguages={selectedTranslationLanguages}
                            getLanguageInfo={getLanguageInfo}
                            onIconUpload={handleIconUpload}
                            onIconRemove={() => handleChange('icon', undefined)}
                            onChange={handleChange}
                            onMultiLangChange={handleMultiLangChange}
                        />
                        <TechStackManager
                            techItems={techItems}
                            setTechItems={setTechItems}
                            disabled={isLoading}
                        />
                    </>
                    )}

                    {/* FIG / FIGMA - Project only */}
                    {isProject && formData.fileType === 'FIG' && (
                    <>
                        <CommonIconAndTooltipFields
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            isUploadingIcon={isUploadingIcon}
                            selectedTranslationLanguages={selectedTranslationLanguages}
                            getLanguageInfo={getLanguageInfo}
                            onIconUpload={handleIconUpload}
                            onIconRemove={() => handleChange('icon', undefined)}
                            onChange={handleChange}
                            onMultiLangChange={handleMultiLangChange}
                        />
                        <UrlField
                            formData={formData}
                            isLoading={isLoading}
                            onChange={handleChange}
                            label="Demo URL"
                        />
                    </>
                    )}

                    {/* URL */}
                    {formData.fileType === 'URL' && (
                    <>
                        <CommonIconAndTooltipFields
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            isUploadingIcon={isUploadingIcon}
                            selectedTranslationLanguages={selectedTranslationLanguages}
                            getLanguageInfo={getLanguageInfo}
                            onIconUpload={handleIconUpload}
                            onIconRemove={() => handleChange('icon', undefined)}
                            onChange={handleChange}
                            onMultiLangChange={handleMultiLangChange}
                        />
                        <UrlField
                            formData={formData}
                            isLoading={isLoading}
                            onChange={handleChange}
                        />
                    </>
                    )}

                    {/* TXT / TEXT */}
                    {formData.fileType === 'TXT' && (
                    <>
                        <CommonIconAndTooltipFields
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            isUploadingIcon={isUploadingIcon}
                            selectedTranslationLanguages={selectedTranslationLanguages}
                            getLanguageInfo={getLanguageInfo}
                            onIconUpload={handleIconUpload}
                            onIconRemove={() => handleChange('icon', undefined)}
                            onChange={handleChange}
                            onMultiLangChange={handleMultiLangChange}
                        />
                        <SubtitleAndDescriptionFields
                            formData={formData}
                            isLoading={isLoading}
                            selectedTranslationLanguages={selectedTranslationLanguages}
                            getLanguageInfo={getLanguageInfo}
                            onMultiLangChange={handleMultiLangChange}
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
                            onRemove={() => handleChange('imageUrl', undefined)}
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
                        <CommonIconAndTooltipFields
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            isUploadingIcon={isUploadingIcon}
                            selectedTranslationLanguages={selectedTranslationLanguages}
                            getLanguageInfo={getLanguageInfo}
                            onIconUpload={handleIconUpload}
                            onIconRemove={() => handleChange('icon', undefined)}
                            onChange={handleChange}
                            onMultiLangChange={handleMultiLangChange}
                        />
                        <UrlField
                            formData={formData}
                            isLoading={isLoading}
                            onChange={handleChange}
                            label="PDF URL"
                            placeholder="https://... or /files/..."
                        />
                    </>
                    )}

                    {/* CONTACT - Profile only */}
                    {!isProject && formData.fileType === 'CONTACT' && (
                    <>
                        <CommonIconAndTooltipFields
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            isUploadingIcon={isUploadingIcon}
                            selectedTranslationLanguages={selectedTranslationLanguages}
                            getLanguageInfo={getLanguageInfo}
                            onIconUpload={handleIconUpload}
                            onIconRemove={() => handleChange('icon', undefined)}
                            onChange={handleChange}
                            onMultiLangChange={handleMultiLangChange}
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
                        <CommonIconAndTooltipFields
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            isUploadingIcon={isUploadingIcon}
                            selectedTranslationLanguages={selectedTranslationLanguages}
                            getLanguageInfo={getLanguageInfo}
                            onIconUpload={handleIconUpload}
                            onIconRemove={() => handleChange('icon', undefined)}
                            onChange={handleChange}
                            onMultiLangChange={handleMultiLangChange}
                        />
                        <SubtitleAndDescriptionFields
                            formData={formData}
                            isLoading={isLoading}
                            selectedTranslationLanguages={selectedTranslationLanguages}
                            getLanguageInfo={getLanguageInfo}
                            onMultiLangChange={handleMultiLangChange}
                        />
                        <UrlField
                            formData={formData}
                            isLoading={isLoading}
                            onChange={handleChange}
                            label="Link (optional)"
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
                        onRemove={() => handleChange('subIcon', undefined)}
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

