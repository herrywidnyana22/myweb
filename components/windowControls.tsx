
import useWindowStore from "@/store/window";

import { useAppStore } from "@/store/app";
import { Minus, X } from "lucide-react";


export const WindowControls = ({ target }: WindowControlProps) => {
    const { closeWindow, minimizeWindow} = useWindowStore()
    const { setOpenedDockId } = useAppStore();

    const onAction = (action: WindowControlAction) => {
        if (action === 'minimize') {
            minimizeWindow(target)
            return
        }

        if(target === 'resume' || target === 'explorer'){
            setOpenedDockId(prev => ({ ...prev, [target]: !prev[target as string] }))
        }

        closeWindow(target)
    }
    
    return (
        <div className="flex gap-2">
            <div 
                onClick={() => onAction('close')}
                className="flex items-center justify-center p-0.5 size-3.5 rounded-full bg-rose-500 cursor-pointer" 
            >
                <X className="size-3 text-white font-bold"/>
            </div>
            <div 
                onClick={() => onAction('minimize')}
                className="flex items-center justify-center p-0.5 size-3.5 rounded-full bg-orange-300 cursor-pointer"
            >
                <Minus className="size-3 text-white font-bold"/>
            </div>
        </div>
    );
};

