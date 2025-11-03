import { SendHorizonal } from 'lucide-react';
import { memo } from 'react';

export const ChatInput = memo(({ sendMessage, input, setInput, onFocus, onBlur }: ChatInputProps) => {
  return (
    <form onSubmit={sendMessage} className='flex items-center w-full px-2 py-1 sm:px-4 sm:py-2'>
      {/* Input Field */}
      <input
        type='text'
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Sini-sini kenalan sama aku...'
        className='w-full bg-transparent text-white placeholder-white/50 text-base sm:text-lg focus:outline-none'
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {/* Right side icons */}
      {/* Send Button */}
      <button
        type='submit'
        disabled={input === ''}
        className={`size-7 sm:size-8 flex items-center justify-center rounded-full transition-colors 
        ${
          input === ''
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-white hover:bg-gray-100 cursor-pointer'
        }`}
      >
        <SendHorizonal size={14} className='text-gray-800' />
      </button>
    </form>
  )
})

ChatInput.displayName = 'ChatInput'
