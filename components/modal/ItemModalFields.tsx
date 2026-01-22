import { FormImageUpload } from '../form/FormImageUpload';
import { FormInput } from '../form/FormInput';
import { MultiLangInput } from '../form/MultiLangInput';
import { MultiLangText } from '@/lib/constants/languages';

interface CommonFieldsProps {
  formData: any;
  errors: Record<string, string>;
  isLoading: boolean;
  isUploadingIcon: boolean;
  selectedTranslationLanguages: string[];
  getLanguageInfo: (code: string) => { name: string; flag: string } | undefined;
  onIconUpload: (file: File) => Promise<void>;
  onIconRemove: () => void;
  onChange: (field: string, value: any) => void;
  onMultiLangChange: (field: string, value: MultiLangText) => void;
}

export const CommonIconAndTooltipFields = ({
  formData,
  errors,
  isLoading,
  isUploadingIcon,
  selectedTranslationLanguages,
  getLanguageInfo,
  onIconUpload,
  onIconRemove,
  onMultiLangChange,
}: CommonFieldsProps) => (
  <>
    <FormImageUpload
      label='File Icon'
      imagePreview={formData.icon || null}
      isUploading={isUploadingIcon}
      onUpload={onIconUpload}
      onRemove={onIconRemove}
      error={errors.icon}
      disabled={isLoading}
    />
    <MultiLangInput
      label='Tooltip Text'
      value={formData.tooltipText || { source: '' }}
      onChange={val => onMultiLangChange('tooltipText', val)}
      selectedLanguages={selectedTranslationLanguages}
      placeholder='Hover tooltip text'
      disabled={isLoading}
      type='input'
      getLanguageInfo={getLanguageInfo}
    />
  </>
);

export const UrlField = ({
  formData,
  isLoading,
  onChange,
  label = 'URL',
  placeholder = 'https://...',
}: Pick<CommonFieldsProps, 'formData' | 'isLoading' | 'onChange'> & {
  label?: string;
  placeholder?: string;
}) => (
  <FormInput
    label={label}
    value={formData.href || ''}
    onChange={value => onChange('href', value)}
    placeholder={placeholder}
    disabled={isLoading}
  />
);

export const SubtitleAndDescriptionFields = ({
  formData,
  isLoading,
  selectedTranslationLanguages,
  getLanguageInfo,
  onMultiLangChange,
}: Omit<
  CommonFieldsProps,
  'errors' | 'isUploadingIcon' | 'onIconUpload' | 'onIconRemove' | 'onChange'
>) => (
  <>
    <MultiLangInput
      label='Subtitle'
      value={formData.subtitle || { source: '' }}
      onChange={val => onMultiLangChange('subtitle', val)}
      selectedLanguages={selectedTranslationLanguages}
      placeholder='Subtitle'
      disabled={isLoading}
      type='input'
      getLanguageInfo={getLanguageInfo}
    />
    <MultiLangInput
      label='Description'
      value={formData.description || { source: '' }}
      onChange={val => onMultiLangChange('description', val)}
      selectedLanguages={selectedTranslationLanguages}
      placeholder='Enter description'
      disabled={isLoading}
      type='textarea'
      rows={4}
      getLanguageInfo={getLanguageInfo}
    />
  </>
);
