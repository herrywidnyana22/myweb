import clsx from "clsx";

import { parseHighlight } from "@/lib/utils/parseHighlight";

export const ChatItemTelegram = ({message, headerText, icon:Icon, className}: ChatTelegramProps) => {
    return ( 
        <div className="whitespace-pre-wrap flex flex-col gap-2">
          <div className={clsx("flex gap-1 items-center italic", className)}>
            <Icon size={16}/>
            <p className="text-xs">{headerText}</p>
          </div>
          {parseHighlight(message || '')}
        </div>
    );
}