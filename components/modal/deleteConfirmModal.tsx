'use client';

import { Loader2, X } from "lucide-react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    isLoading: boolean;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

export const DeleteConfirmModal = ({
    isOpen,
    title,
    message,
    isLoading,
    onConfirm,
    onCancel,
}: DeleteConfirmModalProps) => {
    if (!isOpen) return null;

    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-white transition disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-700 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 rounded font-semibold text-sm transition bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded font-semibold text-sm transition bg-red-600 hover:bg-red-700 disabled:bg-red-500 text-white flex items-center gap-2 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};
