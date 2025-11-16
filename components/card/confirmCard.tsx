
import { useApp } from "@/context/AppContextProps";
import { parseHighlight } from "@/utils/parseHighlight";
import clsx from "clsx";

type ConfirmCardProps = {
    onConfirm: () => void
    onCancel: () => void
} & ActionCardProps

export const ConfirmCard = ({action, message, onConfirm, onCancel}: ConfirmCardProps) => {
    const { t } = useApp()


    return ( 
        <div className="flex justify-start text-sm md:text-base">
            <div className="rounded-xl">
                <p className="mb-3 text-slate-900">
                    {parseHighlight(message ?? '')}
                </p>

                <div className="flex flex-row gap-3">
                    <button
                        className="w-full px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-500 text-white cursor-pointer"
                        onClick={onCancel}
                    >
                        {parseHighlight(t.cancel ?? '')}
                    </button>

                    <button
                        className={clsx("w-full px-3 py-1 rounded-lg text-white cursor-pointer",
                            action === 'telegram'
                            ? 'bg-telegram hover:bg-telegram-secondary'
                            : 'bg-primary-hover hover:bg-primary-light'
                        )}
                        onClick={onConfirm}
                    >
                        {parseHighlight(t.confirm ?? '')}
                    </button>
                </div>
            </div>
        </div>

    );
}