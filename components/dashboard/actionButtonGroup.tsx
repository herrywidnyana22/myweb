import { Pencil, Trash2 } from "lucide-react";
import { ActionButton } from "./actionButton";

interface ActionButtonGroupProps {
    onEdit: () => void;
    onDelete: () => void;
    isLoading?: boolean;
}

export const ActionButtonGroup = ({onEdit, onDelete, isLoading = false}: ActionButtonGroupProps) => {
    return (
        <div className="hidden group-hover:flex gap-1">
            <ActionButton
                onClick={onEdit}
                disabled={isLoading}
                variant="edit"
                icon={<Pencil className="size-4"/>}
                title="Edit"
            />
            <ActionButton
                onClick={onDelete}
                disabled={isLoading}
                variant="delete"
                icon={<Trash2 className="size-4"/>}
                title="Delete"
            />

        </div>
    )
}
