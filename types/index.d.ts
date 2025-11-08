
declare type DataItemProps = 
  | ({ type: 'project' } & ProjectProps)
  | ({ type: 'contact' } & ContactProps)
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

declare interface ExperienceProps{
  company: string
  role: string
  location: string
  year: string
  jobdesk: string
  description: string
  icon: string | React.ReactNode
}

declare interface EducationProps{
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

declare interface ContactProps {
  title: string
  description: string 
  icon?: string | React.ReactNode
  href?: string
}

declare interface IconCategoryProps{
  src: string
  label: string
}

declare interface BuildPromptProps{
  message: string
  projects: ProjectProps[]
  profile: ProfileProps
  address: AddressProps
  contacts: DefaultCardData[]
  educations: EducationProps[]
  experiences: ExperienceProps[]
}

declare interface ProfileProps{
  name: string
  fullName: string 
  role: string 
  summary: string 
  image: string
  birth: BirthdayProps
}

type BirthdayProps = {
  date: string
  place: string
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

declare interface ChatProps {
  messages: ChatResponseProps[];
  setMessages: React.Dispatch<React.SetStateAction<messages>>
  isInputFocused: boolean
  setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>
  isMinimized: boolean
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>
}

declare interface ChatResponseProps {
  role: 'user' | 'bot';
  text?: string;
  cards?: DataItemProps[];
  isStreaming?: boolean
  isLoading?: boolean
  children?: React.ReactNode;
}

declare interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
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

declare interface IconProps{
  label?: string;
  href?: string;
  src?: string;
  IconComponent?: LucideIcon;
  size?: number;
  className?: string;
  newTab?: boolean;
}

declare interface AIResponse {
  text: string;
  cards: Partial<DataItemProps>[];
}

declare interface ApiResponse {
  text: string;
  cards: DataItemProps[];
}

declare interface PortfolioCache {
  profile: ProfileProps;
  address: AddressProps;
  projects: ProjectProps[];
  contacts: ContactProps[];
  educations: EducationProps[];
  experiences: ExperienceProps[];
  timestamp: number;
}

declare interface ChatCache {
  text: string;
  timestamp: number;
}

