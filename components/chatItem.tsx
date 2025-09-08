import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export const ChatItem = ({
  role,
  text,
  children,
}: ChatResponseProps & { isLast?: boolean }) => {
  const isUser = role === 'user';

  return (
    <div
      className={`flex items-start gap-2 pb-3 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <Image
          src='/images/profile.jpg'
          alt='Bot'
          height={240}
          width={240}
          className='rounded-full size-8 object-cover'
        />
      )}

      {/* Chat Bubble */}
      <div
        className={`max-w-[80%] sm:max-w-[70%] px-3 py-2 sm:px-4 sm:py-3 rounded-3xl text-sm sm:text-base md:text-[17px] leading-relaxed sm:leading-7 tracking-normal sm:tracking-tight ${
          isUser
            ? 'bg-blue-500 text-white rounded-tr-none font-normal'
            : 'bg-white border text-slate-900 rounded-tl-none font-normal'
        }`}
      >
        {children && children}
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className='rounded-full size-8 bg-white/30 p-1 flex items-center justify-center'>
          <Image
            src='/images/user.png'
            alt='User'
            height={240}
            width={240}
            className='size-6 object-contain'
          />
        </div>
      )}
    </div>
  );
};
