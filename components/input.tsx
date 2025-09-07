import { SendHorizonal } from 'lucide-react';

export const ChatInput = ({ sendMessage, input, setInput }: ChatInputProps) => {
  return (
    <form onSubmit={sendMessage} className='flex items-center w-full px-4 py-2'>
      {/* Input Field */}
      <input
        type='text'
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Sini-sini kenalan sama aku...'
        className='w-full bg-transparent text-white placeholder-white/50 text-lg focus:outline-none'
      />

      {/* Right side icons */}
      {/* Send Button */}
      <button
        type='submit'
        disabled={input === ''}
        className={`size-8 flex items-center justify-center rounded-full transition-colors 
        ${
          input === ''
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-white hover:bg-gray-100 cursor-pointer'
        }`}
      >
        <SendHorizonal size={16} className='text-gray-800' />
      </button>
    </form>
  );
};
