
declare type UILanguage = string
declare type Action = "language" | "telegram"
declare type ConfirmAction = 'yes' | 'no'
declare type ChatMode = "default" | "telegram"
declare type ChatRole = 'user' | 'bot' | 'herry_telegram' | 'bot_telegram';
declare type WindowControlAction = 'close' | 'minimize' | 'maximize';
declare type FileType = 'PROJECT_INFO' | 'TECHSTACK' | 'FIG' | 'URL' | 'TXT' | 'IMG' | 'PDF' | 'OTHER' | 'CONTACT';
declare type FileKind = 'FOLDER' | 'FILE';

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
  // language: string;
  // ui: Record<string, string>;
  chatMode: ChatMode;
  messages: ChatResponseProps[];
  isMinimized: boolean;
  isInputFocused: boolean;
  openedDockId: Record<string, boolean>;
  targetedDockId: Record<string, DOMRect | null>;

  // setLanguage: (l: string) => void;
  // setUI: (ui: Record<string, string>) => void;
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
  activeLocation: LocationValue | null;
  setActiveLocation: (location: LocationValue | null) => void;
  resetActiveLocation: () => void;
}

declare type DataItemProps =
  | ({ type: 'project' } & Project)
  | ({ type: 'contact' } & Contact)
  | ({ type: 'address' } & Address)
  | ({ type: 'education' } & Education)
  | ({ type: 'experience' } & Experience)
  | ({ type: 'action' } & ActionCardProps)
  | ({ type: 'default' } & DefaultCardData);

// Import MultiLangText type for multilingual fields
type MultiLangText = import('@/lib/constants/languages').MultiLangText;
  
declare interface Category {
  id: string;
  name: string | MultiLangText; // Multilingual (JsonValue from Prisma can be null)
  icon?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

declare interface Contact {
  id: string;
  title: string;
  description: string | MultiLangText; // Multilingual
  tooltipText?: string | MultiLangText; // Multilingual
  icon?: string;
  bgColor?: string;
  contactURL?: string;
  categoryId: string;
  category?: { id: string; name: string | MultiLangText };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

declare interface Profile {
  id: string;
  name: string;
  fullName: string;
  jenisKelamin: 'PRIA' | 'WANITA';
  role: string | MultiLangText; // Multilingual (required in DB)
  quote: string | MultiLangText; // Multilingual (required in DB)
  photoURL?: string;
  cvURL?: string;
  birthDate?: string | Date;
  birthPlace?: string;
  experienceYears?: number;
  description?: string | MultiLangText; // Multilingual
  address?: string | MultiLangText; // Multilingual
  lat?: number;
  lng?: number;
  mapURL?: string;
  preferredLanguages?: any; // Json from Prisma
  items?: ProfileItem[];
  categoryId: string;
  category?: { id: string; name: string | MultiLangText };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

declare interface ProfileItem {
  id: string;
  name: string | MultiLangText; // Multilingual (required in DB)
  kind: FileKind;
  fileType?: FileType;
  parentId?: string;
  profileId: string;
  icon?: string;
  imageUrl?: string;
  href?: string;
  subtitle?: string | MultiLangText; // Multilingual
  description?: string | MultiLangText; // Multilingual
  tooltipText?: string | MultiLangText; // Multilingual
  extra?: any; // Json from Prisma
  createdAt?: string | Date;
  updatedAt?: string | Date;
  children?: ProfileItem[];
}

declare interface Address {
  address?: string | MultiLangText; // Multilingual
  lat?: number;
  lng?: number;
  mapURL?: string;
}

declare interface Education {
  id: string;
  school: string;
  major: string | MultiLangText; // Multilingual (required in DB)
  startYear: number;
  endYear: number;
  schoolLogo?: string;
  icon?: string;
  categoryId: string;
  category?: { id: string; name: string | MultiLangText };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

declare interface Experience {
  id: string;
  company: string;
  role: string | MultiLangText; // Multilingual (required in DB)
  location: string;
  start: string;
  end: string;
  jobdesk?: string | MultiLangText; // Multilingual
  description?: string | MultiLangText; // Multilingual
  icon?: string;
  categoryId: string;
  category?: { id: string; name: string | MultiLangText };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

declare interface Project {
  id: string;
  name: string | MultiLangText; // Multilingual (required in DB)
  icon: string;
  subIcon?: string;
  tooltipText?: string | MultiLangText; // Multilingual
  description: string | MultiLangText; // Multilingual (required in DB)
  progressValue: number;
  demoURL?: string;
  repoURL?: string;
  techStack?: any; // Json from Prisma
  categoryId: string;
  category?: { id: string; name: string | MultiLangText };
  entries?: ProjectEntry[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

declare interface ProjectEntry {
  id: string;
  name: string | MultiLangText; // Multilingual (required in DB)
  kind: FileKind;
  fileType?: FileType;
  parentId?: string;
  projectId: string;
  icon?: string;
  subIcon?: string;
  tooltipText?: string | MultiLangText; // Multilingual
  href?: string;
  imageUrl?: string;
  subtitle?: string | MultiLangText; // Multilingual
  progress?: number;
  description?: string | MultiLangText; // Multilingual
  techStack?: any; // Json from Prisma
  extra?: any; // Json from Prisma
  createdAt?: string | Date;
  updatedAt?: string | Date;
  children?: ProjectEntry[];
}

declare interface TechStack {
  techIcon: string;
  label: string;
}

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

declare interface BuildPromptProps {
  message: string;
  projects: Project[];
  profile: Profile | null;
  address: Address | null;
  contacts: DefaultCardData[];
  educations: Education[];
  experiences: Experience[];
  memory?: ChatMemory;
  language: UILanguage,
  chatMode: ChatMode
  action: Action
}


declare interface PortfolioCache {
  profile: Profile | null;
  address: Address | null;
  projects: Project[];
  contacts: DefaultCardData[];
  educations: Education[];
  experiences: Experience[];
  timestamp: number;
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
  style?: React.CSSProperties;
  newTab?: boolean;
}

declare interface AIResponse {
  text: string;
  cards: DataItemProps[];
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
  flagCode?: string;
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

declare type ResumeWindowProps = {
    resumeURL: string
}

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

declare interface ProfileDashboardProps {
    categories: Category[];
    data: Profile[];
    setData: Dispatch<SetStateAction<Profile[]>>;
    isDataLoading?: boolean;
}

declare interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => Promise<void>;
  project?: Project;
  categories?: Array<{ id: string; name: string }>;
}

declare interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: Experience) => Promise<void>;
  experience?: Experience;
  categories?: Array<{ id: string; name: string }>;
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

declare interface FormFileUploadProps {
  label?: string;
  fileUrl: string | null;
  isUploading: boolean;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  error?: string;
  disabled?: boolean;
  accept?: string;
  description?: string;
}

declare interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

declare interface EducationDashboardProps {
    categories: Category[];
    data: Education[];
    setData: Dispatch<SetStateAction<Education[]>>;
    isDataLoading?: boolean;
}

declare interface ExperienceDashboardProps {
    categories: Category[];
    data: Experience[];
    setData: Dispatch<SetStateAction<Experience[]>>;
    isDataLoading?: boolean;
}

declare interface CategoryDashboardProps {
    data: Category[];
    setData: Dispatch<SetStateAction<Category[]>>;
    isDataLoading?: boolean;
}

declare interface ContactDashboardProps {
    categories: Category[];
    data: Contact[];
    setData: Dispatch<SetStateAction<Contact[]>>;
    isDataLoading?: boolean;
}
