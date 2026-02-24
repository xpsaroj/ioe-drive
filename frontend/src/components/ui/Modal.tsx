import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    preventCloseOnOutsideClick?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    preventCloseOnOutsideClick = false,
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !preventCloseOnOutsideClick) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div
                className={clsx(
                    'bg-white rounded-lg w-full shadow-xl animate-in zoom-in-95 duration-200',
                    {
                        'max-w-sm': size === 'sm',
                        'max-w-md': size === 'md',
                        'max-w-lg': size === 'lg',
                        'max-w-xl': size === 'xl',
                    }
                )}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        disabled={preventCloseOnOutsideClick}
                        className={clsx(
                            'text-gray-400 hover:text-gray-600 transition-colors',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
            </div>
        </div>
    );
}