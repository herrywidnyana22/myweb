// ===========================
// GLOBAL LANGUAGE TYPE
// ===========================
declare type UILanguage = string
declare type Action = "language" | "telegram"
declare type ConfirmAction = 'yes' | 'no'
declare type ChatMode = "default" | "telegram"
declare type ChatRole = 'user' | 'bot' | 'herry_telegram' | 'bot_telegram';
// ===========================
// DATA CARD TYPES
// ===========================
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

// ===========================
// NEW — ACTION CARD
// ===========================
declare interface ActionCardProps {
  action: Action;
  targetLanguage?: UILanguage;
  message?: string; 
}

// ===========================
// PORTFOLIO TYPES
// ===========================
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
  year: string;
  jobdesk: string;
  description: string;
  icon: string | React.ReactNode;
}

declare interface EducationProps {
  school: string;
  major: string;
  year: string;
  icon?: string | React.ReactNode;
  subIcon?: string | React.ReactNode;
}

declare interface ProjectProps {
  title: string;
  description: string;
  icon: string;
  progressValue: number;
  demoLink?: string;
  githubLink: string;
  iconCategory: IconCategoryProps[];
}

declare interface ContactProps {
  title: string;
  description: string;
  icon?: string | React.ReactNode;
  href?: string;
}

declare interface IconCategoryProps {
  src: string;
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

declare interface ProfileProps {
  name: string;
  fullName: string;
  role: string;
  summary: string;
  image: string;
  birth_place: string;
  birth_date: string
}

// ===========================
// UI + COMPONENT TYPES
// ===========================

declare interface DockProps {
  items: DockItemProps[];
  onIconClick: (id: string, rect: DOMRect) => void;
  isOpenById?: Record<string, boolean>;
}

declare interface DockItemProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

declare interface ChatProps {
  messages: ChatResponseProps[];
  setMessages: React.Dispatch<React.SetStateAction<ChatResponseProps[]>>;
  isInputFocused: boolean;
  setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
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
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: (e: React.FormEvent) => Promise<void>;
  onFocus?: () => void;
  onBlur?: () => void;
  isActive?: boolean
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

declare interface ProgressCircleProps {
  value: number;
  label: string;
  className?: string;
}

declare interface TooltipProps {
  children: ReactNode;
  label: string;
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


