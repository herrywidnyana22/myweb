
import clsx from "clsx";
import { useApp } from "@/context/AppContextProps";
import { parseHighlight } from "@/lib/utils/parseHighlight";

type ConfirmCardProps = {
    onConfirm: () => void
    onCancel: () => void
} & ActionCardProps

export const ConfirmCard = ({action, message, onConfirm, onCancel}: ConfirmCardProps) => {
    const { ui } = useApp()
    
    return ( 
        <div className="flex justify-start text-sm md:text-base">
            <div className="rounded-md">
                <p className="mb-3 text-slate-900">
                    {parseHighlight(message ?? '')}
                </p>

                <div className="flex flex-row gap-3">
                    <button
                        className="w-full px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-500 text-white cursor-pointer"
                        onClick={onCancel}
                    >
                        {parseHighlight(ui.cancel ?? '')}
                    </button>

                    <button
                        className={clsx("w-full px-3 py-1 rounded-md text-white cursor-pointer",
                            action === 'telegram'
                            ? 'bg-telegram hover:bg-telegram-secondary'
                            : 'bg-primary-hover hover:bg-primary-light'
                        )}
                        onClick={onConfirm}
                    >
                        {ui.confirm}
                    </button>
                </div>
            </div>
        </div>

    );
}