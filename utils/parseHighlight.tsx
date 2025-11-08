import clsx from 'clsx';
import React from 'react';

export function parseHighlight(text: string): React.ReactNode[] {
  if (!text) return [];

  const parts = text.split(/(<mark.*?<\/mark>)/g);

  return parts.map((part, i) => {
    const match = part.match(/<mark\s+data-type=['"](\w+)['"]>(.*?)<\/mark>/i);
    if (!match) return part;

    const [, type, value] = match;
    let color = '';

    switch (type) {
      case 'name':
        color = 'text-primary-hover font-semibold'; 
        break;
      case 'role':
        color = 'text-indigo-600 font-semibold'; 
        break;
      case 'location':
        color = 'text-emerald-600 font-semibold';
        break;
      case 'skill':
        color = 'text-blue-700 font-medium'; 
        break;
      case 'contact':
        color = 'text-rose-600 font-semibold underline'; 
        break;
      case 'project':
        color = 'text-teal-700 font-semibold';
        break;
      case 'education':
        color = 'text-yellow-700 font-semibold';
        break;
      case 'experience':
        color = 'text-violet-700 font-semibold'; 
        break;
      default:
        color = 'text-gray-800 font-medium';
    }

    return (
      <span key={i} className={clsx('transition-colors duration-300', color)}>
        {value}
      </span>
    );
  });
}
