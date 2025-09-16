// declare interface DataItemProps {
//   id?: string;
//   title: string;
//   description: string;
//   tech?: string[];
//   icon?: string;
//   icon2?: string;
//   image?: string;
//   link?: string;
//   mapUrl?: string;
// }
declare type DataItemProps = 
  | ({ type: 'project' } & ProjectProps)
  | ({ type: 'address' } & AddressProps)
  | ({ type: 'education' } & EducationProps)
  | ({ type: 'experience' } & ExperienceProps)
  | ({ type: 'default' } & DefaultCardData)

declare interface DefaultCardData{
  id?: string 
  title: string 
  description: string 
  icon?: string | React.ReactNode 
  subIcon?: string | React.ReactNode 
  href?: string
}

declare interface AddressProps{
  address: string
  lat: number | string
  lng: number | string
  mapUrl?: string
}

declare interface ExperiencesProps{
  company: string
  role: string
  location: string
  year: string
  jobdesk: string
  description: string
  icon: string | React.ReactNode
}

declare interface EducationsProps{
  school: string
  major: string
  year: string
  icon?: string | React.ReactNode 
  subIcon?: string | React.ReactNode 
}

declare interface ProjectProps{
  title: string
  description: string
  icon: string
  progressValue: number
  demoLink?: string
  githubLink: string
  iconCategory: IconCategoryProps[]
}

declare interface IconCategoryProps{
  src: string
  label: string
}

declare interface BuildPromptProps{
  message: string
  projects: ProjectProps[]
  profile: unknown
  address: AddressProps
  contacts: DefaultCardData[]
  educations: EducationsProps[]
  experiences: ExperiencesProps[]
}


declare interface DockProps {
  items: DockItemProps[];
  onIconClick: (id: string, rect: DOMRect) => void;
  isOpenById?: Record<string, boolean>;
};

declare interface DockItemProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

declare interface ChatResponseProps {
  role: 'user' | 'bot';
  text?: string;
  cards?: DataItemProps[];
  children?: React.ReactNode;
}

declare interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (e: React.FormEvent) => Promise<void>;
  onFocus?: () => void;
  onBlur?: () => void;
}

declare interface DialogConfirmProps {
  text: string;
  onCancel: () => void;
  onConfirm: () => void;
}

declare interface ChatHeaderProps {
  onMinimize: () => void;
  onClear: () => void;
  isMinimized: boolean;
}

declare interface WidgetProps {
  dockTarget: DOMRect | null;
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

declare interface ProgressCircleProps{
  value: number
  label: string
  className?: string
}

declare interface TooltipProps{
  children: ReactNode;
  label: string;
};
