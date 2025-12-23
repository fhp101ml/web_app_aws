import { GripVertical, X, ExternalLink, MoreVertical } from 'lucide-react';
import { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from '../overview.module.css';

interface WidgetCardProps {
    id?: string; // ID for DnD
    title: string;
    children: ReactNode;
    footerLink?: { label: string; href: string };
    className?: string;
    onRemove?: () => void;
}

export function WidgetCard({ id, title, children, footerLink, className = '', onRemove }: WidgetCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id || 'unknown' });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto', // Bring to front when dragging
        opacity: isDragging ? 0.8 : 1
    };

    return (
        <div ref={setNodeRef} style={style} className={`${styles.widget} ${className} ${isDragging ? styles.dragging : ''}`}>
            <div className={styles.widgetHeader}>
                <div className="flex items-center gap-3">
                    {/* Drag Handle */}
                    {id && (
                        <div {...attributes} {...listeners} className="cursor-grab hover:text-[hsl(var(--text-primary))] text-[hsl(var(--text-muted))] touch-none transition-colors">
                            <GripVertical className="w-5 h-5" />
                        </div>
                    )}
                    <h3 className={styles.widgetTitle}>{title}</h3>
                </div>

                <div className="flex items-center gap-1">
                    {onRemove && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded-full text-[hsl(var(--text-muted))] hover:text-red-500 transition-colors"
                            title="Remove widget"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    {!onRemove && (
                        <button className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))] transition-colors">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.widgetContent}>
                {children}
            </div>

            {footerLink && (
                <div className={styles.widgetFooter}>
                    <a href={footerLink.href} className="flex items-center gap-1 text-[hsl(var(--aws-blue))] hover:underline hover:opacity-80 transition-opacity">
                        {footerLink.label}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            )}
        </div>
    );
}
