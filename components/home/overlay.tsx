import { useAppStore } from '@/store/app';

export const Overlay = () => {
  const { isInputFocused } = useAppStore();
  return (
    <>
      {isInputFocused && (
        <div className='absolute inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity' />
      )}
    </>
  );
};
