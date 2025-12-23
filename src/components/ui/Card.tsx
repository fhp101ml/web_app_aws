import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    title?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    headerAction?: React.ReactNode;
}

export const Card = ({ title, children, footer, className = '', headerAction }: CardProps) => {
    return (
        <div className={`${styles.card} ${className}`}>
            {title && (
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className={styles.content}>
                {children}
            </div>
            {footer && (
                <div className={styles.footer}>
                    {footer}
                </div>
            )}
        </div>
    );
};
