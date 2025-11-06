import Image from 'next/image';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatItemProps extends ChatResponseProps {
  isLast?: boolean;
}

export const ChatItem = memo(({ role, text, children }: ChatItemProps) => {
  const isUser = role === 'user';

  const wrapperClass = `flex items-start gap-3 pb-3 ${
    isUser ? 'justify-end' : 'justify-start'
  }`

  const bubbleClass = [
    'relative',
    'max-w-[80%] sm:max-w-[70%]',
    'px-3 py-2 sm:px-4 sm:py-3',
    'rounded-3xl text-sm sm:text-base md:text-[17px]',
    'leading-relaxed sm:leading-7 tracking-normal sm:tracking-tight font-normal',
    isUser
      ? 'bg-blue-500 text-white rounded-tr-none'
      : 'bg-white border text-slate-900 rounded-tl-none',
  ].join(' ')

  const avatar = (src: string, alt: string, className: string) => (
    <Image src={src} alt={alt} height={240} width={240} className={className} />
  )

  return (
    <div className={wrapperClass}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className='relative flex items-center justify-center'>
          <div className='absolute inset-0 rounded-full ring-1 ring-white/30' />
          {avatar(
            '/images/profile.webp',
            'Bot',
            'rounded-full size-10 object-cover relative z-10'
          )}
        </div>
      )}

      {/* Chat Bubble */}
      <div className={bubbleClass}>
        {/* Curved Tail */}
        <span
          className={`absolute top-0 w-3 h-4 ${
            isUser
              ? '-right-2 bg-blue-500 rounded-tr-[1px]'
              : '-left-2 bg-white rounded-tl-[1px]'
          }`}
          style={{
            clipPath: isUser
              ? 'polygon(110% 0, 0 0, 20% 70%)'
              : 'polygon(-10% 0, 100% 0, 80% 70%)',
          }}
        />
        {children}
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className='rounded-full size-10 bg-white/30 p-1 flex items-center justify-center'>
          {avatar('/icons/user.webp', 'User', 'size-6 object-contain')}
        </div>
      )}
    </div>
  )
})

ChatItem.displayName = 'ChatItem';
