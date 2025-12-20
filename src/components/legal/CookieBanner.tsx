"use client";

import Link from 'next/link';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
    const {
        isVisible,
        consent,
        isLoaded,
        acceptAll,
        denyAll,
        saveConsent,
        toggleCategory
    } = useCookieConsent();

    if (!isLoaded || !isVisible) return null;

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="cookie-title">
            <div className={styles.modal}>

                {/* Main Content */}
                <div className={styles.content}>
                    <header className={styles.header}>
                        <h2 id="cookie-title" className={styles.title}>
                            Este sitio web usa cookies
                        </h2>
                        <p className={styles.description}>
                            Utilizamos cookies propias y de terceros para mejorar la experiencia de usuario,
                            analizar el tráfico y ofrecer funciones de redes sociales.
                            Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias.
                            Consulta nuestra <Link href="/legal/cookies" className={styles.link}>Política de Cookies</Link> para más información.
                        </p>
                    </header>

                    {/* Toggles */}
                    <div className={styles.toggles} role="group" aria-label="Preferencias de cookies">

                        {/* Necessary */}
                        <div className={styles.toggleItem}>
                            <div className={styles.checkboxWrapper}>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={consent.necessary}
                                        disabled
                                        aria-label="Cookies necesarias"
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                                <span className={styles.label}>Necesarias</span>
                            </div>
                            <small className={styles.description} style={{ fontSize: '0.75rem' }}>
                                Esenciales para que la web funcione. No se pueden desactivar.
                            </small>
                        </div>

                        {/* Preferences */}
                        <div className={styles.toggleItem}>
                            <div className={styles.checkboxWrapper}>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={consent.preferences}
                                        onChange={() => toggleCategory('preferences')}
                                        aria-label="Cookies de preferencia"
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                                <span className={styles.label}>Preferencias</span>
                            </div>
                            <small className={styles.description} style={{ fontSize: '0.75rem' }}>
                                Recuerdan configuración regional e idioma.
                            </small>
                        </div>

                        {/* Statistics */}
                        <div className={styles.toggleItem}>
                            <div className={styles.checkboxWrapper}>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={consent.statistics}
                                        onChange={() => toggleCategory('statistics')}
                                        aria-label="Cookies de estadística"
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                                <span className={styles.label}>Estadística</span>
                            </div>
                            <small className={styles.description} style={{ fontSize: '0.75rem' }}>
                                Nos ayudan a entender cómo interactúas con la web de forma anónima.
                            </small>
                        </div>

                        {/* Marketing */}
                        <div className={styles.toggleItem}>
                            <div className={styles.checkboxWrapper}>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={consent.marketing}
                                        onChange={() => toggleCategory('marketing')}
                                        aria-label="Cookies de marketing"
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                                <span className={styles.label}>Marketing</span>
                            </div>
                            <small className={styles.description} style={{ fontSize: '0.75rem' }}>
                                Utilizadas para rastrear visitantes y mostrar anuncios relevantes.
                            </small>
                        </div>

                    </div>
                </div>

                {/* Footer / Actions */}
                <footer className={styles.actions}>
                    <button onClick={denyAll} className={`${styles.btn} ${styles.btnDeny}`}>
                        Denegar
                    </button>
                    <button onClick={() => saveConsent(consent)} className={`${styles.btn} ${styles.btnSelection}`}>
                        Permitir la selección
                    </button>
                    <button onClick={acceptAll} className={`${styles.btn} ${styles.btnAllow}`}>
                        Permitir todas
                    </button>
                </footer>

            </div>
        </div>
    );
}
