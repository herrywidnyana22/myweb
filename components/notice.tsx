interface NoticeProps {
  text: string | React.ReactNode;
}

export const Notice = ({ text }: NoticeProps) => {
  return (
    <div className='rounded border border-blue-200 bg-blue-50 p-4'>
      <p className='text-sm text-blue-800'>{text}</p>
    </div>
  );
};
