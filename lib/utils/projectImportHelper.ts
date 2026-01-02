/**
 * Helper function to transform nested project data from constants
 * into the format expected by the API
 */

export interface SimpleEntry {
  id: string;
  name: string;
  kind: string;
  icon?: string;
  subIcon?: string;
  fileType?: string;
  tooltipText?: string;
  href?: string;
  imageUrl?: string;
  projectName?: string;
  projectIcon?: string;
  progressValue?: number;
  subtitle?: string;
  description?: string | string[];
  techStack?: any;
  children?: SimpleEntry[];
}

export interface SimpleProject {
  id: string;
  name: string;
  icon?: string;
  subIcon?: string;
  tooltipText?: string;
  children?: SimpleEntry[];
}

/**
 * Transform project data from constants/static format to API format
 * @param projectsData - The nested projects data from constants
 * @returns Array of projects in the format expected by the import API
 */
export function transformProjectsData(
  projectsData: any
): SimpleProject[] {
  if (!projectsData.children) {
    return [];
  }

  return projectsData.children
    .filter((item: any) => item.type === 'project')
    .map((project: any) => ({
      id: project.id,
      name: project.name,
      icon: project.icon || '/icons/folder.png',
      subIcon: project.subIcon,
      tooltipText: project.tooltipText,
      children: transformEntries(project.children || []),
    }));
}

/**
 * Transform entries recursively
 */
function transformEntries(entries: any[]): SimpleEntry[] {
  return entries.map((entry: any) => ({
    id: entry.id,
    name: entry.name,
    kind: entry.kind || 'FILE',
    icon: entry.icon,
    subIcon: entry.subIcon,
    fileType: entry.fileType,
    tooltipText: entry.tooltipText,
    href: entry.href,
    imageUrl: entry.imageUrl,
    projectName: entry.projectName,
    projectIcon: entry.projectIcon,
    progressValue: entry.progressValue,
    subtitle: entry.subtitle,
    description: entry.description,
    techStack: entry.techStack,
    children: entry.children ? transformEntries(entry.children) : undefined,
  }));
}

/**
 * Count total entries in a project (including nested)
 */
export function countProjectEntries(project: SimpleProject): number {
  let count = 0;

  const countRecursive = (entries?: SimpleEntry[]) => {
    if (!entries) return;
    entries.forEach((entry) => {
      count++;
      if (entry.children) {
        countRecursive(entry.children);
      }
    });
  };

  countRecursive(project.children);
  return count;
}
