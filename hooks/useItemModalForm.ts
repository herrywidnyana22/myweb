import { useState, useEffect } from 'react';

type ItemType = ProjectEntry | ProfileItem;
type OwnerType = 'project' | 'profile';

export const useItemModalForm = (
  isOpen: boolean,
  item: ItemType | undefined,
  ownerId: string,
  ownerType: OwnerType,
  parentId?: string
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [isUploadingSubIcon, setIsUploadingSubIcon] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getDefaultFormData = () => ({
    name: '',
    kind: 'FILE' as const,
    fileType: 'OTHER' as const,
    ...(ownerType === 'project'
      ? { projectId: ownerId }
      : { profileId: ownerId }),
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
  const [techItems, setTechItems] = useState<
    Array<{ category: string; items: string[] }>
  >(
    ownerType === 'project' && item && 'techStack' in item
      ? (item.techStack as any) || []
      : []
  );

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
        setErrors({});
      }
    }
  }, [isOpen, item, ownerId, ownerType, parentId]);

  const handleChange = (field: string, value: any) => {
    const actualValue =
      value?.target?.value !== undefined ? value.target.value : value;

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

  const handleMultiLangChange = (field: string, value: any) => {
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
        [field]:
          error instanceof Error ? error.message : 'Failed to upload image',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameValue =
      typeof formData.name === 'string'
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

  return {
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
  };
};
