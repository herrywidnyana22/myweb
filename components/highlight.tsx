import clsx from "clsx"

export const Highlight = ({title, label, className}: HighlightProps) => {
    return ( 
        <div className={clsx('py-1 px-1.5 sm:px-2 rounded-2xl bg-white/10 border border-white/20 shadow-2xl', className)}>
            <span className="relative flex flex-col justify-center items-center">
                <p className="text-sm sm:text-md font-semibold">{title}</p>
                <p className="text-[8px] sm:text-[10px] text-text-muted">{label}</p>
            </span>
        </div>
    );
}