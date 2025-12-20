import LegalAcknowledge from "@/components/legal/LegalAcknowledge";
import { Scale, Copyright, AlertTriangle, ShieldCheck, Gavel, FileText } from "lucide-react";
import styles from '../legal-theme.module.css';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            {/* Ambient Effects (Purple/Pink for Terms) */}
            <div className={styles.ambientGlow} style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)' }} />
            <div className={styles.ambientSecondary} style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)' }} />

            <div className={styles.wrapper}>
                {/* Hero Header */}
                <header className={styles.header}>
                    <div className={styles.badgePurple}>
                        <Scale size={14} strokeWidth={2.5} />
                        <span>Regulaciones</span>
                    </div>
                    <h1 className={styles.title} style={{ backgroundImage: 'linear-gradient(to right, #ffffff, #f3e8ff, #d8b4fe)' }}>
                        Términos y Condiciones
                    </h1>
                    <p className={styles.subtitle}>
                        Establecemos las bases para una relación transparente, segura y profesional.
                        El uso de ExoCluster implica la aceptación de este marco operativo.
                    </p>
                </header>

                {/* Main Content Grid */}
                <div className={styles.grid}>

                    {/* Sección 1: Aceptación */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={`${styles.iconWrapper} ${styles.iconPurple}`}>
                                <Gavel size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className={styles.sectionTitle}>1. Aceptación Vinculante</h2>
                                <div className={styles.text}>
                                    <p>
                                        El acceso a <strong>ExoCluster</strong> constituye un acuerdo legal vinculante.
                                        Nuestra plataforma está diseñada estrictamente para uso profesional, DevOps e ingeniería cloud.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección 2: Propiedad Intelectual */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={`${styles.iconWrapper} ${styles.iconPink}`}>
                                <Copyright size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className={styles.sectionTitle}>2. Propiedad Intelectual</h2>
                                <div className={styles.text}>
                                    <p>
                                        El código fuente, algoritmos y marca son propiedad exclusiva.
                                        Concedemos una licencia limitada para el uso previsto de la plataforma.
                                    </p>

                                    <div className={styles.warningBox} style={{ marginTop: '1.5rem' }}>
                                        <AlertTriangle size={20} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                                        <span>
                                            Prohibida la ingeniería inversa, descompilación o uso de recursos para entrenar modelos de IA competitivos.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección 3: Garantía y SLA */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={`${styles.iconWrapper} ${styles.iconCyan}`}>
                                <ShieldCheck size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className={styles.sectionTitle}>3. Garantía y Responsabilidad</h2>
                                <div className={styles.text}>
                                    <p>
                                        Ofrecemos un <strong>SLA del 99.9%</strong> anual. Sin embargo, no nos responsabilizamos
                                        de interrupciones de proveedores cloud externos (AWS, Azure).
                                    </p>
                                    <ul className={styles.list}>
                                        <li className={styles.listItem}>
                                            <div className={`${styles.dot} ${styles.dotCyan}`} />
                                            <span>El usuario custodia sus propias claves API.</span>
                                        </li>
                                        <li className={styles.listItem}>
                                            <div className={`${styles.dot} ${styles.dotCyan}`} />
                                            <span>Recomendamos backups propios de configuraciones críticas.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer Action */}
                <div className={styles.footer}>
                    <div className={styles.divider} />
                    <LegalAcknowledge id="terms" title="Términos y Condiciones" />
                </div>
            </div>
        </div>
    )
}
