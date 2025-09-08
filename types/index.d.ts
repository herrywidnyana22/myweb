declare interface DataItemProps {
  id?: string;
  title: string;
  description: string;
  tech?: string[];
  icon?: string;
  icon2?: string;
  image?: string;
  link?: string;
  mapUrl?: string;
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
