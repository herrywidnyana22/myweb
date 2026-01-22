import { Chat } from '../chat/chat';
import { Dock } from '../dock/dock';
import { Widget } from '../widget';

export const Home = () => {
  return (
    <div className='relative mx-auto flex w-full max-w-3xl flex-col space-y-2 sm:space-y-4 md:max-w-4xl md:space-y-8 lg:max-w-5xl'>
      <Chat />
      <Widget />
      <Dock />
    </div>
  );
};
