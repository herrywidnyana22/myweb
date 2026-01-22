type OwnerType = 'project' | 'profile';

export const getFileTypeOptions = (ownerType: OwnerType) => {
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
    return [{ value: 'CONTACT', label: 'Contact' }, ...baseOptions];
  }
};
