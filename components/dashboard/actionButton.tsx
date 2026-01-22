import clsx from 'clsx';
import { ReactNode } from 'react';

interface ActionButtonProps {
  id?: string;
  onClick?: (id?: string) => void;
  icon: ReactNode;
  variant?: 'add' | 'edit' | 'delete';
  disabled?: boolean;
  className?: string;
  title?: string;
}

export const ActionButton = ({
  id,
  onClick,
  icon,
  variant = 'add',
  disabled = false,
  className,
  title,
}: ActionButtonProps) => {
  const handleClick = () => {
    onClick?.(id);
  };

  const base =
    'font-semibold py-1 px-2 rounded text-xs transition flex items-center justify-center';

  const variants = {
    add: 'bg-green-600 hover:bg-green-700 text-white',
    edit: 'bg-primary hover:bg-primary-hover text-white',
    delete: 'bg-error hover:bg-error-dark disabled:bg-error-light text-white',
  };

  return (
    <button
      type='button'
      title={title}
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        base,
        variants[variant],
        disabled && 'cursor-not-allowed opacity-70',
        className
      )}
    >
      {icon}
    </button>
  );
};
