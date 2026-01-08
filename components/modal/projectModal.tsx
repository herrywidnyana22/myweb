'use client';

import Image from 'next/image';

import { useEffect, useState, useCallback } from 'react';
import { FormInput } from '../form/FormInput';
import { FormSelect } from '../form/FormSelect';
import { FormImageUpload } from '../form/FormImageUpload';
import { FormError } from '../form/FormError';
import { ModalHeader } from '../form/ModalHeader';
import { ModalActions } from '../form/ModalActions';
import { MultiLangInput } from '../form/MultiLangInput';
import { MultiLangText, createMultiLangText } from '@/lib/constants/languages';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalizedText } from '@/hooks/useLocalizedText';
import { X } from 'lucide-react';

interface TechStackItem {
  techIcon: string;
  label: string;
}

const DEFAULT_PROJECT: Omit<Project, 'id'> = {
  name: '',
  icon: '',
  subIcon: '',
  tooltipText: '',
  description: '',
  progressValue: 0,
  techStack: [],
  categoryId: '',
};

export const ProjectModal = ({
  isOpen,
  onClose,
  onSave,
  project,
  categories = [],
}: ProjectModalProps) => {
  const [formData, setFormData] = useState<Project>(
    (project as Project) || ({
      id: '',
      ...DEFAULT_PROJECT,
    } as Project)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isUploadingSubIcon, setIsUploadingSubIcon] = useState(false);
  const [subIconPreview, setSubIconPreview] = useState<string | null>(null);

  const [techStack, setTechStack] = useState<TechStackItem[]>(
    (project?.techStack as TechStackItem[]) || []
  );
  const [newTechLabel, setNewTechLabel] = useState('');
  const [isUploadingTechIcon, setIsUploadingTechIcon] = useState(false);

  const { selectedTranslationLanguages, getLanguageInfo } = useLanguage();
  const { getText } = useLocalizedText();

  useEffect(() => {
    if (project) {
      setFormData(project);
      setIconPreview(project.icon || null);
      setSubIconPreview(project.subIcon || null);
      setTechStack((project.techStack as TechStackItem[]) || []);
    } else {
      setFormData({
        id: '',
        ...DEFAULT_PROJECT,
      } as Project);
      setIconPreview(null);
      setSubIconPreview(null);
      setTechStack([]);
    }
    setError('');
    setNewTechLabel('');
  }, [project, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiLangChange = (field: string, value: MultiLangText) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file: File, type: 'icon' | 'subIcon') => {
    if (type === 'icon') {
      setIsUploadingIcon(true);
    } else {
      setIsUploadingSubIcon(true);
    }
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await res.json();

      if (result.status !== 'ok') {
        throw new Error(result.msg || result.error || 'Failed to upload image');
      }

      const data = result.data as { url: string };
      if (type === 'icon') {
        setFormData((prev) => ({ ...prev, icon: data.url }));
        setIconPreview(data.url);
      } else {
        setFormData((prev) => ({ ...prev, subIcon: data.url }));
        setSubIconPreview(data.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      if (type === 'icon') {
        setIsUploadingIcon(false);
      } else {
        setIsUploadingSubIcon(false);
      }
    }
  };

  const handleTechIconUpload = async (file: File, index: number) => {
    setIsUploadingTechIcon(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await res.json();

      if (result.status !== 'ok') {
        throw new Error(result.msg || result.error || 'Failed to upload image');
      }

      const data = result.data as { url: string };
      const updatedTechStack = [...techStack];
      updatedTechStack[index] = {
        ...updatedTechStack[index],
        techIcon: data.url,
      };
      setTechStack(updatedTechStack);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploadingTechIcon(false);
    }
  };

  const handleAddTechStack = async (file: File) => {
    if (!newTechLabel.trim()) {
      setError('Please enter a tech stack label');
      return;
    }

    setIsUploadingTechIcon(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await res.json();

      if (result.status !== 'ok') {
        throw new Error(result.msg || result.error || 'Failed to upload image');
      }

      const data = result.data as { url: string };
      setTechStack([
        ...techStack,
        {
          techIcon: data.url,
          label: newTechLabel.trim(),
        },
      ]);
      setNewTechLabel('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploadingTechIcon(false);
    }
  };

  const handleRemoveTechStack = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  const handleUpdateTechLabel = (index: number, label: string) => {
    const updatedTechStack = [...techStack];
    updatedTechStack[index] = {
      ...updatedTechStack[index],
      label,
    };
    setTechStack(updatedTechStack);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { name, icon, categoryId } = formData;
      if (!name || !icon || !categoryId) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      await onSave({
        ...formData,
        techStack: techStack.length > 0 ? techStack : undefined,
      });
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = useCallback(() => {
    setError('');
    setIsSubmitting(false);
    setIsUploadingIcon(false);
    setIsUploadingSubIcon(false);
    setIsUploadingTechIcon(false);
    setIconPreview(null);
    setSubIconPreview(null);
    setTechStack([]);
    setNewTechLabel('');
    setFormData({
      id: '',
      ...DEFAULT_PROJECT,
    } as Project);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        handleCloseModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isSubmitting, handleCloseModal]);

  if (!isOpen) return null;


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader
          title={project ? 'Edit Project' : 'Add Project'}
          onClose={handleCloseModal}
          disabled={isSubmitting}
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormError message={error} />

          <div className="space-y-4">
            <FormSelect
              label="Category"
              required
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select a category' },
                ...(Array.isArray(categories) ? categories : []).map((cat) => ({
                  value: cat.id,
                  label: typeof cat.name === 'string' ? cat.name : getText(cat.name),
                })),
              ]}
              disabled={isSubmitting}
            />

            <MultiLangInput
              label="Project Name"
              value={formData.name || createMultiLangText('')}
              onChange={(val) => handleMultiLangChange('name', val)}
              selectedLanguages={selectedTranslationLanguages}
              placeholder="e.g., MyDrive"
              disabled={isSubmitting}
              type="input"
              getLanguageInfo={getLanguageInfo}
            />

            <MultiLangInput
              label="Tooltip Text"
              value={formData.tooltipText || createMultiLangText('')}
              onChange={(val) => handleMultiLangChange('tooltipText', val)}
              selectedLanguages={selectedTranslationLanguages}
              placeholder="e.g., Cloud Storage Project"
              disabled={isSubmitting}
              type="input"
              getLanguageInfo={getLanguageInfo}
            />

            <FormInput
              label="Demo URL"
              type="url"
              name="demoURL"
              value={formData.demoURL || ''}
              onChange={handleChange}
              placeholder="e.g., https://demo.example.com"
              disabled={isSubmitting}
            />

            <FormInput
              label="Repository URL"
              type="url"
              name="repoURL"
              value={formData.repoURL || ''}
              onChange={handleChange}
              placeholder="e.g., https://github.com/username/project"
              disabled={isSubmitting}
            />

            <FormInput
              label="Progress Value (%)"
              type="number"
              name="progressValue"
              value={formData.progressValue || 0}
              onChange={handleChange}
              placeholder="0-100"
              min="0"
              max="100"
              disabled={isSubmitting}
            />

            <FormImageUpload
              label="Project Icon"
              imagePreview={iconPreview}
              isUploading={isUploadingIcon}
              onUpload={(file) => handleImageUpload(file, 'icon')}
              onRemove={() => {
                setFormData((prev) => ({ ...prev, icon: '' }));
                setIconPreview(null);
              }}
              disabled={isSubmitting}
            />

            <FormImageUpload
              label="Sub Icon (for Explorer view)"
              imagePreview={subIconPreview}
              isUploading={isUploadingSubIcon}
              onUpload={(file) => handleImageUpload(file, 'subIcon')}
              onRemove={() => {
                setFormData((prev) => ({ ...prev, subIcon: undefined }));
                setSubIconPreview(null);
              }}
              disabled={isSubmitting}
            />

            <MultiLangInput
              label="Highlighted Description"
              value={formData.description || createMultiLangText('')}
              onChange={(val) => handleMultiLangChange('description', val)}
              selectedLanguages={selectedTranslationLanguages}
              placeholder="Enter the project highlighted description"
              disabled={isSubmitting}
              type="textarea"
              rows={5}
              getLanguageInfo={getLanguageInfo}
            />

            {/* Tech Stack Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Tech Stack
              </label>
              
              {/* Existing Tech Stack Items */}
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="relative">
                    {tech.techIcon ? (
                      <Image
                        src={tech.techIcon}
                        alt={tech.label}
                        width={32}
                        height={32}
                        className="rounded object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleTechIconUpload(file, index);
                      }}
                      disabled={isSubmitting || isUploadingTechIcon}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </div>
                  <input
                    type="text"
                    value={tech.label}
                    onChange={(e) => handleUpdateTechLabel(index, e.target.value)}
                    placeholder="e.g., React.js"
                    disabled={isSubmitting}
                    className="flex-1 px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTechStack(index)}
                    disabled={isSubmitting}
                    className="text-error hover:text-error-dark disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}

              {/* Add New Tech Stack */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                <label className="relative cursor-pointer disabled:cursor-not-allowed">
                  <div className={`size-8 bg-gray-300 rounded flex items-center justify-center text-gray-500 text-xs ${isUploadingTechIcon ? 'opacity-50' : ''}`}>
                    {isUploadingTechIcon ? '...' : '+'}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && newTechLabel.trim()) {
                        handleAddTechStack(file);
                      } else if (file) {
                        setError('Please enter a tech name first');
                      }
                    }}
                    disabled={isSubmitting || isUploadingTechIcon || !newTechLabel.trim()}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={newTechLabel}
                  onChange={(e) => setNewTechLabel(e.target.value)}
                  placeholder="Enter tech name, then click + icon to upload"
                  disabled={isSubmitting || isUploadingTechIcon}
                  className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed "
                />
              </div>
            </div>
          </div>

          <ModalActions
            isSubmitting={isSubmitting}
            onCancel={handleCloseModal}
            submitLabel="Save Project"
          />
        </form>
      </div>
    </div>
  );
}

