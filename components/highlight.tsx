import clsx from "clsx"

export const Highlight = ({title, label, className}: HighlightProps) => {
    return ( 
        <div className={clsx('py-1 px-1.5 rounded-2xl bg-white/10 border border-white/20 shadow-2xl', className)}>
            <span className="relative flex sm:flex-col gap-1 justify-center items-center">
                <p className="text-sm sm:text-md font-semibold">{title}</p>
                <p className="text-[10px] text-text-muted capitalize">{label}</p>
            </span>
        </div>
    );
}