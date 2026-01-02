import { Pencil, Trash2 } from "lucide-react";

interface ButtonActionGroupProps {
    onEdit: () => void;
    onDelete: () => void;
    isLoading?: boolean;
}

export const ButtonActionGroup = ({onEdit, onDelete, isLoading}: ButtonActionGroupProps) => {
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onEdit}
                disabled={isLoading}
                className="bg-primary hover:bg-primary-hover text-white font-semibold py-1 px-2 rounded text-xs transition"
            >
                <Pencil className="size-4"/>
            </button>
            <button
                onClick={onDelete}
                disabled={isLoading}
                className="bg-error hover:bg-error-dark disabled:bg-error-light text-white font-semibold py-1 px-2 rounded text-xs transition"
            >
                <Trash2 className="size-4"/>
            </button>

        </div>
    )
}
