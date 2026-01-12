import { useState } from 'react';
import { FormInput } from '../form/FormInput';
import { FormSelect } from '../form/FormSelect';
import { Trash2, Plus, X } from 'lucide-react';

interface TechStackManagerProps {
    techItems: Array<{ category: string; items: string[] }>;
    setTechItems: React.Dispatch<React.SetStateAction<Array<{ category: string; items: string[] }>>>;
    disabled?: boolean;
}

export const TechStackManager = ({ techItems, setTechItems, disabled = false }: TechStackManagerProps) => {
    const [newCategory, setNewCategory] = useState('');
    const [newItem, setNewItem] = useState('');
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);

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

    return (
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
                                    disabled={disabled}
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
                                            disabled={disabled}
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
                        disabled={disabled}
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
                    disabled={disabled}
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
                        disabled={disabled}
                    />
                )}

                <button
                    type="button"
                    onClick={handleAddTech}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm transition-colors"
                    disabled={!newItem.trim() || (!newCategory.trim() && selectedCategoryIndex === null) || disabled}
                >
                    <Plus className="w-4 h-4" />
                    Add Technology
                </button>
            </div>
        </div>
    );
};
