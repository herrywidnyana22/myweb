import { useAppStore } from "@/store/app";

export const Overlay = () => {
    const { isInputFocused } = useAppStore();
    return ( 
        <>
            {isInputFocused && (
                <div className="absolute inset-0 z-50 backdrop-blur-sm bg-black/30 transition-opacity" />
            )}
        </>
    );
}