import LegalAcknowledge from "@/components/legal/LegalAcknowledge";
import { Shield, Lock, Eye, FileText, UserCheck, Server, Database, Fingerprint } from "lucide-react";
import styles from '../legal-theme.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            {/* Ambient Effects */}
            <div className={styles.ambientGlow} />
            <div className={styles.ambientSecondary} />

            <div className={styles.wrapper}>
                {/* Hero Header */}
                <header className={styles.header}>
                    <div className={styles.badge}>
                        <Shield size={14} strokeWidth={2.5} />
                        <span>Security First</span>
                    </div>
                    <h1 className={styles.title}>
                        Política de Privacidad
                    </h1>
                    <p className={styles.subtitle}>
                        En ExoCluster, la privacidad no es una opción, es la arquitectura base.
                        Cumplimos estrictamente con el RGPD y garantizamos la soberanía total de tus datos.
                    </p>
                </header>

                {/* Main Content Grid */}
                <div className={styles.grid}>

                    {/* Sección 1: Responsable */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={`${styles.iconWrapper} ${styles.iconBlue}`}>
                                <UserCheck size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className={styles.sectionTitle}>1. Responsable del Tratamiento</h2>
                                <div className={styles.text}>
                                    <p>
                                        <strong>ExoCluster Inc.</strong> actúa como garante y custodio de la información.
                                        Operamos bajo un marco de cumplimiento que alinea nuestras operaciones de ingeniería
                                        con el <strong>RGPD (UE 2016/679)</strong> y la Ley Orgánica 3/2018.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección 2: Datos Recopilados */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={`${styles.iconWrapper} ${styles.iconPurple}`}>
                                <Database size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className={styles.sectionTitle}>2. Datos que Procesamos</h2>
                                <div className={styles.text}>
                                    <p>
                                        Minimizamos la recolección de datos al estricto necesario para la operatividad técnica:
                                    </p>
                                    <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
                                        <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc' }} />
                                            Credenciales de acceso y tokens de sesión seguros.
                                        </li>
                                        <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc' }} />
                                            Registros de auditoría (logs) de operaciones críticas.
                                        </li>
                                        <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc' }} />
                                            Configuraciones del entorno cloud del usuario.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección 3: Derechos ARCO */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={`${styles.iconWrapper} ${styles.iconTeal}`}>
                                <Fingerprint size={24} strokeWidth={1.5} />
                            </div>
                            <div style={{ width: '100%' }}>
                                <h2 className={styles.sectionTitle}>3. Tus Derechos Soberanos</h2>
                                <p className={styles.text} style={{ marginBottom: '1.5rem' }}>
                                    La soberanía de tus datos es inalienable. Dispones de herramientas automatizadas
                                    en tu panel de control para ejercer tus derechos en tiempo real.
                                </p>
                                <div className={styles.rightsGrid}>
                                    {['Acceso', 'Rectificación', 'Supresión (Olvido)', 'Portabilidad JSON', 'Limitación', 'Oposición'].map((right) => (
                                        <span key={right} className={styles.rightTag}>
                                            {right}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección 4: Seguridad */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={`${styles.iconWrapper} ${styles.iconEmerald}`}>
                                <Lock size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className={styles.sectionTitle}>4. Seguridad e Infraestructura</h2>
                                <div className={styles.text}>
                                    <p>
                                        Toda comunicación se cifra en tránsito mediante <strong>TLS 1.3</strong> y en reposo usando
                                        algoritmos <strong>AES-256</strong>. Nuestra infraestructura se audita continuamente para
                                        prevenir vulnerabilidades de día cero.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer Action */}
                <div className={styles.footer}>
                    <div className={styles.divider} />
                    <LegalAcknowledge id="privacy" title="Política de Privacidad" />
                </div>
            </div>
        </div>
    )
}
