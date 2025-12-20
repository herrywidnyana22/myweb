import { useAppStore } from "@/store/app";

export const Overlay = () => {
    const { isInputFocused, isMinimized } = useAppStore();
    return ( 
        <>
            {(isInputFocused || !isMinimized) && (
                <div className="absolute inset-0 z-50 backdrop-blur-sm bg-black/30 transition-opacity" />
            )}
        </>
    );
}