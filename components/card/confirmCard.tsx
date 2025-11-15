import { useLang } from "@/context/LanguageContext";
import { parseHighlight } from "@/utils/parseHighlight";

type ConfirmCardProps = {
    target: UILanguage;
    onConfirm: (lang: UILanguage) => void;
    onCancel: () => void;
}

export const ConfirmCard = ({target, onConfirm, onCancel}: ConfirmCardProps) => {
    const { t } = useLang();
    
    return ( 
        <div className="flex justify-start sm:text-sm md:text-base">
            <div className="rounded-xl">
                <p className="mb-3 text-slate-900">
                {target === 'en'
                    ? parseHighlight(t.confirmLangEN)
                    : parseHighlight(t.confirmLangID)
                }
                </p>

                <div className="flex gap-3">
                <button
                    className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-500 text-white cursor-pointer"
                     onClick={onCancel}
                >
                   {parseHighlight(t.cancel ?? '')}
                </button>

                <button
                    className="px-3 py-1 rounded-lg bg-primary-hover hover:bg-primary-light text-white cursor-pointer"
                    onClick={() => onConfirm(target)}
                >
                     {parseHighlight(t.confirm ?? '')}
                </button>
                </div>
            </div>
        </div>
    );
}