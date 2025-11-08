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
        color = 'text-primary-hover font-semibold'; // lebih deep, masih sesuai brand
        break;
      case 'role':
        color = 'text-indigo-600 font-semibold'; // kontras bagus di putih
        break;
      case 'location':
        color = 'text-emerald-600 font-semibold'; // natural, nyaman di light bg
        break;
      case 'skill':
        color = 'text-blue-700 font-medium'; // tetap kuat tapi tidak silau
        break;
      case 'contact':
        color = 'text-rose-600 font-semibold underline'; // untuk link-like
        break;
      case 'project':
        color = 'text-teal-700 font-semibold'; // tambahan, jika nanti dipakai
        break;
      case 'education':
        color = 'text-yellow-700 font-semibold'; // tambahan
        break;
      case 'experience':
        color = 'text-violet-700 font-semibold'; // tambahan
        break;
      default:
        color = 'text-gray-800 font-medium'; // fallback netral
    }

    return (
      <span key={i} className={`${color} transition-colors duration-300`}>
        {value}
      </span>
    );
  });
}
