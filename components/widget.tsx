
import { useAppStore } from "@/store/app";
import { dockItems } from "./dock/dockItems";
import { WidgetItem } from "./widgetItem";

type Props = {
 
}
export const Widget = ({}: Props) => {
  const { openedDockId, targetedDockId } = useAppStore()

  return ( 
    <div
      className="
        w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 
        gap-3 sm:gap-4 lg:gap-6
      "
    >
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
}