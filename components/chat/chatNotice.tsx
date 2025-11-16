import { useApp } from "@/context/AppContextProps";
import { Power } from "lucide-react";

export const ChatNotice = () => {
    const { setChatMode } = useApp()
    return ( 
        <div className='flex items-center justify-center flex-col text-white pt-4'>
            <p className='text-xs font-light'>Anda sedang terhubung langsung ke Telegram @herrywidnyana, semua chat akan diteruskan</p>
            <button 
                onClick={() => setChatMode("default")}
                className='flex gap-1 items-center justify-center p-2 border rounded-md text-xs mt-2 cursor-pointer bg-gray-600/90 hover:bg-rose-500 hover:font-semibold transition'
            >
                <Power size={14}/>  
                Putuskan
            </button>
        </div>
    );
}