import { useState } from 'react';
import { FormInput } from '../form/FormInput';
import { FormSelect } from '../form/FormSelect';
import { Trash2, Plus, X } from 'lucide-react';

interface TechStackManagerProps {
  techItems: Array<{ category: string; items: string[] }>;
  setTechItems: React.Dispatch<
    React.SetStateAction<Array<{ category: string; items: string[] }>>
  >;
  disabled?: boolean;
}

export const TechStackManager = ({
  techItems,
  setTechItems,
  disabled = false,
}: TechStackManagerProps) => {
  const [newCategory, setNewCategory] = useState('');
  const [newItem, setNewItem] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<
    number | null
  >(null);

  const handleAddTech = () => {
    if (newItem.trim()) {
      if (selectedCategoryIndex !== null) {
        setTechItems(prev => {
          const updated = [...prev];
          updated[selectedCategoryIndex].items.push(newItem);
          return updated;
        });
      } else if (newCategory.trim()) {
        setTechItems(prev => [
          ...prev,
          { category: newCategory, items: [newItem] },
        ]);
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

  return (
    <div className='space-y-3 rounded border border-gray-200 bg-gray-50 p-4'>
      <label className='block text-sm font-medium text-gray-700'>
        Technologies by Category
      </label>

      {techItems.length > 0 && (
        <div className='space-y-3'>
          {techItems.map((category, catIndex) => (
            <div
              key={catIndex}
              className='rounded border border-gray-300 bg-white p-3'
            >
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-semibold text-gray-800'>
                  {category.category}
                </span>
                <button
                  type='button'
                  onClick={() => handleRemoveCategory(catIndex)}
                  className='text-error hover:text-error-dark'
                  disabled={disabled}
                >
                  <Trash2 className='h-4 w-4' />
                </button>
              </div>
              <div className='space-y-1'>
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className='flex items-center justify-between rounded bg-gray-100 p-2 text-sm'
                  >
                    <span className='text-gray-700'>{item}</span>
                    <button
                      type='button'
                      onClick={() => handleRemoveTech(catIndex, itemIndex)}
                      className='text-error hover:text-error-dark'
                      disabled={disabled}
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='space-y-2 border-t border-gray-200 pt-3'>
        {selectedCategoryIndex === null ? (
          <FormInput
            label='New Category'
            value={newCategory}
            onChange={value => setNewCategory(value?.target?.value || '')}
            placeholder='e.g., Frontend, Backend'
            disabled={disabled}
          />
        ) : (
          <div className='rounded primary-light p-2 text-sm text-blue-800'>
            Adding to:{' '}
            <strong>{techItems[selectedCategoryIndex]?.category}</strong>
            <button
              type='button'
              onClick={() => setSelectedCategoryIndex(null)}
              className='ml-2 text-blue-600 underline hover:text-blue-800'
            >
              (change)
            </button>
          </div>
        )}

        <FormInput
          label='Technology Name'
          value={newItem}
          onChange={value => setNewItem(value?.target?.value || '')}
          placeholder='e.g., React.js, TypeScript'
          disabled={disabled}
        />

        {selectedCategoryIndex === null && techItems.length > 0 && (
          <FormSelect
            label='Or Add to Existing Category'
            value={
              selectedCategoryIndex !== null
                ? String(selectedCategoryIndex)
                : ''
            }
            onChange={value => {
              const actualValue =
                typeof value === 'string' ? value : value?.target?.value || '';
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
            disabled={disabled}
          />
        )}

        <button
          type='button'
          onClick={handleAddTech}
          className='flex w-full items-center justify-center gap-2 rounded bg-blue-500 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-600'
          disabled={
            !newItem.trim() ||
            (!newCategory.trim() && selectedCategoryIndex === null) ||
            disabled
          }
        >
          <Plus className='h-4 w-4' />
          Add Technology
        </button>
      </div>
    </div>
  );
};
