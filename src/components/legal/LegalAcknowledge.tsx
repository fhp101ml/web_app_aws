"use client"
import { useState, useEffect } from 'react'
import { Check, X, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react'
import styles from './LegalAcknowledge.module.css'

interface LegalAcknowledgeProps {
    id: string // 'privacy' | 'terms'
    title: string
}

export default function LegalAcknowledge({ id, title }: LegalAcknowledgeProps) {
    const [accepted, setAccepted] = useState(false)

    useEffect(() => {
        // Check if already accepted
        if (localStorage.getItem(`legal_${id}_read`)) {
            setAccepted(true)
        }
    }, [id])

    const handleAccept = () => {
        localStorage.setItem(`legal_${id}_read`, 'true')
        setAccepted(true)
        // Dispatch event for other tabs/components
        window.dispatchEvent(new Event('storage'))
    }

    return (
        <div className={`${styles.container} ${accepted ? styles.containerSuccess : ''}`}>
            {/* Status Icon or Header */}
            <div className={`
                p-3 rounded-full mb-2 transition-colors duration-500
                ${accepted ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}
            `}>
                {accepted ? <ShieldCheck size={32} strokeWidth={1.5} /> : <ArrowRight size={32} strokeWidth={1.5} className={styles.pulse} />}
            </div>

            <p className={styles.description}>
                {accepted
                    ? `Has confirmado la lectura de ${title}. Tu registro puede continuar.`
                    : "Para completar tu registro en ExoCluster, es obligatorio confirmar que has comprendido este documento."
                }
            </p>

            <div className={styles.actions}>
                <button
                    onClick={handleAccept}
                    disabled={accepted}
                    className={`${styles.button} ${accepted ? styles.buttonSuccess : styles.buttonPrimary}`}
                >
                    {accepted ? (
                        <>
                            <Check className={styles.icon} strokeWidth={3} />
                            <span>Leído y Comprendido</span>
                        </>
                    ) : (
                        <>
                            <span>Confirmar Lectura</span>
                        </>
                    )}
                </button>

                {accepted && (
                    <button
                        onClick={() => window.close()}
                        className={`${styles.button} ${styles.buttonSecondary}`}
                    >
                        <span>Cerrar pestaña y volver</span>
                        <ExternalLink size={14} />
                    </button>
                )}
            </div>
        </div>
    )
}
