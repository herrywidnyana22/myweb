import { useChatStore } from '@/store/chat';
import { dockItems } from './dock/dockItems';
import { WidgetItem } from './widget/widgetItem';

export const Widget = () => {
  const { openedDockId, targetedDockId } = useChatStore();

  return (
    <div className='grid w-full grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-6 xl:grid-cols-8'>
      {dockItems.map(item => (
        <WidgetItem
          key={item.id}
          dockTarget={targetedDockId[item.id] ?? null}
          isOpen={!!openedDockId[item.id]}
          className={item.className}
        >
          {item.children}
        </WidgetItem>
      ))}
    </div>
  );
};
