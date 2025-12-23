'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading = false,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary'
}: ConfirmationModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, isLoading]);

    // Prevent scrolling when modal is open
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

    const modalContent = (
        <div className={styles.overlay} onClick={!isLoading ? onClose : undefined}>
            <div
                className={styles.modal}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                ref={modalRef}
            >
                <div className={styles.header}>
                    <div className={styles.titleContainer}>
                        {variant === 'danger' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                        <h3 className={styles.title}>{title}</h3>
                    </div>
                    {!isLoading && (
                        <button onClick={onClose} className={styles.closeButton}>
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className={styles.body}>
                    <p>{message}</p>
                </div>

                <div className={styles.footer}>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={styles.cancelButton}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`${styles.confirmButton} ${variant === 'danger' ? styles.danger : styles.primary}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            confirmLabel
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    // Use createPortal to render the modal at the root of the document body
    // This avoids z-index issues
    if (typeof document === 'undefined') return null;
    return createPortal(modalContent, document.body);
}
