import clsx from 'clsx';
import { parseHighlight } from '@/lib/utils/parseHighlight';
import { useLocalizedText } from '@/hooks/useLocalizedText';

type ConfirmCardProps = {
  onConfirm: () => void;
  onCancel: () => void;
} & ActionCardProps;

export const ConfirmCard = ({
  action,
  message,
  onConfirm,
  onCancel,
}: ConfirmCardProps) => {
  const { getUIText } = useLocalizedText();

  return (
    <div className='flex justify-start text-sm md:text-base'>
      <div className='rounded-md'>
        <p className='mb-3 text-slate-900'>{parseHighlight(message ?? '')}</p>

        <div className='flex flex-row gap-3'>
          <button
            className='w-full cursor-pointer rounded-md bg-gray-700 px-3 py-1 text-white hover:bg-gray-500'
            onClick={onCancel}
          >
            {parseHighlight(getUIText('cancel') ?? '')}
          </button>

          <button
            className={clsx(
              'w-full cursor-pointer rounded-md px-3 py-1 text-white',
              action === 'telegram'
                ? 'bg-telegram hover:bg-telegram-secondary'
                : 'bg-primary-hover hover:bg-primary-light'
            )}
            onClick={onConfirm}
          >
            {getUIText('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};
