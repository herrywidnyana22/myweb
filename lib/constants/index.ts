export const DEFAULT_FILE_TYPE_ICONS: Record<string, string> = {
  PROJECT_INFO: "/icons/txt.png",
  TECHSTACK: "/icons/terminal.png",
  FIG: "/icons/figma.png",
  URL: "/icons/safari.png",
  TXT: "/icons/txt.png",
  IMG: "/icons/image.png",
  PDF: "/icons/pdf.png",
  OTHER: "/icons/plain.png",
  CONTACT: "/icons/contact.png",
};

export const DEFAULT_FILE_KIND_ICONS: Record<string, string> = {
  FOLDER: "/icons/folder.png",
  FILE: "/icons/plain.png",
};


export const navUtilsIcons = [
  {
    id: 1,
    imgSrc: "/icons/wifi.svg",
  },
  {
    id: 2,
    imgSrc: "/icons/search.svg",
  },
  {
    id: 3,
    imgSrc: "/icons/user.svg",
  },
  {
    id: 4,
    imgSrc: "/icons/mode.svg",
  },
];

// Transform projects to location children format
function getProjectLocation(projects: Project[]) {
  return {
    id: 1,
    type: "project",
    name: 'myWork', //fieldName for language
    icon: "/icons/work.svg",
    kind: "folder",
    tooltipText: "Lihat semua project",
    children: (Array.isArray(projects) ? projects : []).map((project: Project) => ({
      type: "project",
      ...project,
      kind: "folder", // Explicitly mark projects as folders
      children: (Array.isArray(project.entries) ? project.entries : []).map((entry: ProjectEntry) => ({
        ...entry,
        icon: entry.icon || (entry.fileType ? DEFAULT_FILE_TYPE_ICONS[entry.fileType.toUpperCase()] : undefined) || (entry.kind ? DEFAULT_FILE_KIND_ICONS[entry.kind.toUpperCase()] : DEFAULT_FILE_KIND_ICONS.FILE),
      })),
    })),
  };
}

// Transform profiles to location children format
function getAboutLocation(profiles: Profile[]) {
  return {
    id: 2,
    type: "about",
    name: 'aboutMe', //fieldName for language
    icon: "/icons/info.svg",
    kind: "folder",
    children: (profiles || []).flatMap((profile: Profile) => 
      (profile.items || []).map((item: any) => ({
        ...item,
        icon: item.icon || (item.fileType ? DEFAULT_FILE_TYPE_ICONS[item.fileType.toUpperCase()] : undefined) || (item.kind ? DEFAULT_FILE_KIND_ICONS[item.kind.toUpperCase()] : DEFAULT_FILE_KIND_ICONS.FILE),
      }))
    ),
  };
}

const RESUME_LOCATION = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/icons/pdf.png",
      kind: "file",
      fileType: "pdf",
      href: "/files/resume.pdf",
    },
  ],
};

// Dynamic locations generator function
export function getLocations(projects: Project[], profiles: Profile[]) {
  return {
    project: getProjectLocation(projects),
    about: getAboutLocation(profiles),
    // resume: RESUME_LOCATION,
  };
}

export const INITIAL_Z_INDEX = 1000;

export const WINDOW_CONFIG = {
  explorer: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  contact: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  resume: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  photos: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  txtfile: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  imgfile: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  techstack: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
  projectInfo: { isOpen: false, isMinimize: false, zIndex: INITIAL_Z_INDEX, data: null },
}

export const FONT_WEIGHTS:FontWeightMap  = {
    title: {min: 400, max: 900, base: 400},
    subtitle: {min: 100, max: 400, base: 100},
}
