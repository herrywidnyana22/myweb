
declare type UILanguage = string
declare type Action = "language" | "telegram"
declare type ConfirmAction = 'yes' | 'no'
declare type ChatMode = "default" | "telegram"
declare type ChatRole = 'user' | 'bot' | 'herry_telegram' | 'bot_telegram';
declare type WindowControlAction = 'close' | 'minimize' | 'maximize';

declare interface AppContextProps {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;

  ui: Record<string, string>;
  setUI: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  chatMode: ChatMode;
  setChatMode: React.Dispatch<React.SetStateAction<ChatMode>>;

  messages: ChatResponseProps[];
  setMessages: React.Dispatch<React.SetStateAction<ChatResponseProps[]>>;

  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;

  isInputFocused: boolean;
  setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>;

  openedDockId: Record<string, boolean>;
  setOpenedDockId: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  targetedDockId: Record<string, DOMRect | null>;
  setTargetedDockId: React.Dispatch<React.SetStateAction<Record<string, DOMRect | null>>>;
}

type Updater<T> = T | ((prev: T) => T);

declare interface AppStore {
  language: string;
  ui: Record<string, string>;
  chatMode: ChatMode;
  messages: ChatResponseProps[];
  isMinimized: boolean;
  isInputFocused: boolean;
  openedDockId: Record<string, boolean>;
  targetedDockId: Record<string, DOMRect | null>;

  setLanguage: (l: string) => void;
  setUI: (ui: Record<string, string>) => void;
  setChatMode: (m: ChatMode) => void;
  setMessages: (v: Updater<ChatResponseProps[]>) => void;
  setIsMinimized: (v: Updater<boolean>) => void;
  setIsInputFocused: (v: boolean) => void;

  setOpenedDockId: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  setTargetedDockId: (updater: (prev: Record<string, DOMRect | null>) => Record<string, DOMRect | null>) => void;
}


declare type WindowKey = keyof typeof WINDOW_CONFIG;

declare type WindowMap = Record<WindowKey, WindowState>;

declare interface WindowStore {
  windows: WindowMap;
  nextZIndex: number;

  openWindow: (key: WindowKey, data?: unknown) => void;
  closeWindow: (key: WindowKey) => void;
  minimizeWindow: (key: WindowKey) => void;
  restoreWindow: (key: WindowKey) => void;
  focusWindow: (key: WindowKey) => void;
}

declare type WindowControlProps = {
  target: WindowKey;
}

declare type LocationKey = keyof typeof locations;
declare type LocationValue = (typeof locations)[LocationKey];

declare interface LocationStore {
  activeLocation: LocationValue;
  setActiveLocation: (location: LocationValue | null) => void;
  resetActiveLocation: () => void;
}

declare type DataItemProps =
  | ({ type: 'project' } & ProjectProps)
  | ({ type: 'contact' } & ContactProps)
  | ({ type: 'address' } & AddressProps)
  | ({ type: 'education' } & EducationProps)
  | ({ type: 'experience' } & ExperienceProps)
  | ({ type: 'action' } & ActionCardProps)
  | ({ type: 'default' } & DefaultCardData);

// Default card
declare interface DefaultCardData {
  id?: string;
  title: string;
  description: string;
  icon?: string | React.ReactNode;
  subIcon?: string | React.ReactNode;
  href?: string;
}

declare interface ActionCardProps {
  action: Action;
  targetLanguage?: UILanguage;
  message?: string; 
}


declare interface ProfileProps {
  name: string;
  fullName: string;
  role: string;
  summary: string;
  image: string;
  birth_place: string;
  birth_date: string
}

declare interface AddressProps {
  address: string;
  lat: number | string;
  lng: number | string;
  mapUrl?: string;
}


declare interface ExperienceProps {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  jobdesk: string;
  description: string;
  icon: string | React.ReactNode;
}

declare interface EducationProps {
  school: string;
  major: string;
  startYear: number;
  endYear: number;
  icon?: string | React.ReactNode;
  schoolLogo?: string | React.ReactNode;
}

declare interface ProjectProps {
  name: string;
  description: string;
  icon: string | React.ReactNode;
  subicon?: string | React.ReactNode;
  tooltipText?: string;
  progressValue: number;
  demoURL?: string;
  repoURL: string;
  techStack: TechStackProps[];
}

declare interface ContactProps {
  id?: string;
  title: string;
  description: string;
  icon?: string | React.ReactNode;
  bgColor?: string
  href?: string;
  tooltipText: string
}

declare interface TechStackProps {
  techIcon: string;
  label: string;
}

declare interface BuildPromptProps {
  message: string;
  projects: ProjectProps[];
  profile: ProfileProps;
  address: AddressProps;
  contacts: DefaultCardData[];
  educations: EducationProps[];
  experiences: ExperienceProps[];
  memory?: ChatMemory;
  language: UILanguage,
  chatMode: ChatMode
  action: Action
}

declare interface DockItemProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

declare interface ChatStore {
  messages: ChatResponseProps[];
  addMessage: (msg: ChatResponseProps) => void;
  updateLast: (msg: Partial<ChatResponseProps>) => void;
  reset: () => void;
}

declare interface ChatResponseProps {
  role: ChatRole
  text?: string;
  cards?: DataItemProps[];
  isStreaming?: boolean;
  isLoading?: boolean;
}

declare interface ChatMemory {
  name?: string;
  location?: string;
  job?: string;
  lastMessageTime?: number;
}

declare interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>
  sendMessage: (e: React.FormEvent) => Promise<void>
  isActive?: boolean
  disabled?: boolean
}

declare interface DialogConfirmProps {
  text: string;
  onCancel: () => void;
  onConfirm: () => void;
}

declare interface ChatHeaderProps {
  onClear: () => void;
}

declare interface WidgetProps {
  dockTarget: DOMRect | null;
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

declare interface CircleProgressProps {
  value: number;
  label: string;
  className?: string;
}

declare interface BarProgressProps {
  value: number;
  label: string;
  className?: string;
}

declare interface TooltipProps {
  children: ReactNode;
  label: string;
  bgColor?: string
  textColor?: string
}

declare interface IconProps {
  tooltipLabel?: string;
  textLabel?: string;
  href?: string;
  src?: string;
  IconComponent?: LucideIcon;
  size?: number;
  className?: string;
  newTab?: boolean;
}

declare interface AIResponse {
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

declare interface HighlightProps {
  title: string;
  label: string;
  className?: string;
}
declare interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
}

declare type ChatType = "private" | "group" | "supergroup" | "channel";

declare interface TelegramChat { id: number; type: ChatType; }

declare interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  reply_to_message?: { message_id: number; text?: string; from?: TelegramUser };
}

declare interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

declare interface TelegramPayload {
  id: number;
  text: string;
  from: string;
}

declare type FlagIconProps = {
  code: string;
  size?: number; 
}

declare type ChatTelegramProps = {
  message: string
  headerText: string
  className?: string
  icon: LucideIcon
}

declare type MenuProps = {
  items: LocationValue[];
  title?: string
  className?: string
  activeLocation?:LocationValue
  onClick?: (item: LocationValue) => void;
};

declare type LocationItem = {
  id: number;
  name: string;
  icon: string;
  kind: string; // "folder" | "file" kalau mau strict
  position?: string;
  windowPosition?: string;
  fileType?: string;
  href?: string;
  description?: string[];
  imageUrl?: string;
  children?: LocationItem[];
};

declare type TextRenderProps = {
    text: string
    className?: string
    weight?: number
}

declare type SetHoverText = (
    container: HTMLElement | null,
    type: HoverTextType
) => (() => void) | void;

declare type FontWeightMap = Record<string, FontWeightConfig>;

declare type HoverTextType = keyof FontWeightMap;

declare interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

declare interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  disabled?: boolean;
}

declare interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => Promise<void>;
  category?: Category;
}

declare interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => Promise<void>;
  contact?: Contact;
  categories?: Array<{ id: string; name: string }>;
}

declare interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Profile) => Promise<void>;
  profile?: Profile;
  categories?: Array<{ id: string; name: string }>;
}

declare interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (education: Education) => Promise<void>;
  education?: Education;
  categories?: Array<{ id: string; name: string }>;
}

declare interface FormImageUploadProps {
  label?: string;
  imagePreview: string | null;
  isUploading: boolean;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  error?: string;
  disabled?: boolean;
}

declare interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

declare interface Category {
  id: string;
  name: string;
  icon?: string;
}

declare interface Contact {
  id: string;
  title: string;
  description: string;
  tooltipText?: string;
  icon?: string;
  bgColor?: string;
  contactURL?: string;
  categoryId: string;
  category?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

declare interface Profile {
  id: string;
  name: string;
  fullName: string;
  jenisKelamin: 'PRIA' | 'WANITA';
  role: string;
  quote: string;
  photoURL?: string;
  birthDate?: string;
  birthPlace?: string;
  experienceYears?: number;
  description?: string;
  address?: string;
  lat?: number;
  lng?: number;
  mapURL?: string;
  categoryId: string;
  category?: { id: string; name: string };
}

declare interface Education {
  id: string;
  school: string;
  major: string;
  startYear: number;
  endYear: number;
  schoolLogo?: string;
  icon?: string;
  categoryId: string;
  category?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

declare interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  jobdesk?: string;
  description?: string;
  icon?: string;
  categoryId: string;
  category?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

declare interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: Experience) => Promise<void>;
  experience?: Experience;
  categories?: Array<{ id: string; name: string }>;
}

declare interface ProjectEntry {
  id: string;
  name: string;
  kind: 'FILE' | 'CONTACT';
  fileType?: 'PROJECT_INFO' | 'TECHSTACK' | 'FIG' | 'URL' | 'TXT' | 'IMG' | 'PDF' | 'OTHER' | 'CONTACT';
  parentId?: string;
  projectId: string;
  icon?: string;
  subIcon?: string;
  tooltipText?: string;
  href?: string;
  imageUrl?: string;
  subtitle?: string;
  progress?: number;
  description?: string;
  techStack?: any;
  extra?: any;
  createdAt?: string;
  updatedAt?: string;
  children?: ProjectEntry[];
}

declare interface Project {
  id: string;
  name: string;
  icon: string;
  subIcon?: string;
  tooltipText?: string;
  description?: string;
  progressValue?: number;
  demoURL?: string;
  repoURL?: string;
  techStack?: Array<{ techIcon: string; label: string }> | null;
  categoryId: string;
  category?: { id: string; name: string };
  entries?: ProjectEntry[];
  createdAt?: string;
  updatedAt?: string;
}

declare interface EducationDashboardProps {
    categories: Category[];
    data: Education[];
    setData: Dispatch<SetStateAction<Education[]>>;
    isDataLoading?: boolean;
}

interface ExperienceDashboardProps {
    categories: Category[];
    data: Experience[];
    setData: Dispatch<SetStateAction<Experience[]>>;
    isDataLoading?: boolean;
}

interface CategoryDashboardProps {
    data: Category[];
    setData: Dispatch<SetStateAction<Category[]>>;
    isDataLoading?: boolean;
}

declare interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => Promise<void>;
  project?: Project;
  categories?: Array<{ id: string; name: string }>;
}


