import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    isDeleting?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Item",
    message = "Are you sure you want to remove this item? This action cannot be undone and will affect your fiscal metrics.",
    isDeleting = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                <div className="p-8 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-danger/10 rounded-2xl flex items-center justify-center border border-danger/10 mb-2">
                        <AlertTriangle className="w-8 h-8 text-danger" />
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest italic">Inventory Removal Request</p>
                    </div>

                    <p className="text-sm text-slate-500 font-medium leading-relaxed px-2">
                        {message}
                    </p>
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all text-sm disabled:opacity-50"
                    >
                        Keep Item
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 bg-danger hover:bg-danger/90 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-danger/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 text-sm"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
