import { getColor } from '@/lib/utils';
import { Tooltip } from '../tooltip';

export const BarProgressChart = ({ value, label }: BarProgressProps) => {
  const progressValue = value ?? 0;
  console.log({ value, label, progressValue });
  return (
    <Tooltip label={label}>
      <div className='mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-900 sm:h-2'>
        <div
          className='h-full rounded-full transition-all duration-500'
          style={{
            width: `${Math.min(progressValue, 100)}%`,
            backgroundColor: getColor(progressValue),
          }}
        />
      </div>
    </Tooltip>
  );
};
