import userWindowStore from "@/store/window";
import { Maximize, Minus, X } from "lucide-react";


export const WindowControls = ({ target }: WindowControlProps) => {
    const {closeWindow} = userWindowStore()
    
    return (
        <div id="window-controls">
            <div className="close" onClick={() => closeWindow(target)}>
                <X className="size-3 text-white font-bold"/>
            </div>
            <div className="minimize">
                <Minus className="size-3 text-white font-bold"/>
            </div>
            <div className="maximize">
                <Maximize className="size-3 text-black font-bold"/>
            </div>
        </div>
    );
};

