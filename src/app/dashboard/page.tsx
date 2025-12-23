import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import styles from "./dashboard.module.css"
import layoutStyles from "./layout.module.css"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    const user = session?.user

    return (
        <main className={layoutStyles.mainContent}>
            <div className={styles.container}>

                {/* Premium Welcome Header */}
                <div className={styles.welcomeSection}>
                    <div className="relative z-10">
                        <h1 className={styles.welcomeTitle}>
                            Hola, <span className={styles.gradientText}>{user?.name?.split(' ')[0] || 'User'}</span>.
                        </h1>
                        <p className={styles.welcomeSubtitle}>
                            Panel de control centralizado. El sistema está funcionando correctamente.
                        </p>
                    </div>

                    <div style={{ position: 'absolute', top: 0, right: 0, width: '256px', height: '256px', background: 'rgba(168, 85, 247, 0.2)', filter: 'blur(100px)', pointerEvents: 'none', transform: 'translate(50%, -50%)' }}></div>
                </div>

                {/* Stats Overview */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.bgIconGreen}`}>
                            <svg className={styles.w24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <div className={`${styles.statValue} ${styles.textGreen}`}>99.9%</div>
                        <div className={styles.statLabel}>System Uptime</div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.bgIconPurple}`}>
                            <svg className={styles.w24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <div className={`${styles.statValue} ${styles.textWhite}`}>Seguro</div>
                        <div className={styles.statLabel}>Security Status</div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.bgIconBlue}`}>
                            <svg className={styles.w24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
                        </div>
                        <div className={`${styles.statValue} ${styles.textWhite}`}>--</div>
                        <div className={styles.statLabel}>Active Resources</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
                <div className={styles.quickActionsGrid}>

                    {(user as any)?.role === 'ADMIN' && (
                        <Link href="/dashboard/admin/users" className={styles.actionCard}>
                            <div className={`${styles.actionIcon} ${styles.bgIconPurple}`}>
                                <svg className={styles.w20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            </div>
                            <div>
                                <div className={styles.actionTitle}>Gestionar Usuarios</div>
                                <div className={styles.actionDesc}>Aprobar accesos y revisar roles.</div>
                            </div>
                        </Link>
                    )}

                    <Link href="/dashboard/aws" className={styles.actionCard}>
                        <div className={`${styles.actionIcon} ${styles.bgIconYellow}`}>
                            <svg className={styles.w20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
                        </div>
                        <div>
                            <div className={styles.actionTitle}>Monitor AWS</div>
                            <div className={styles.actionDesc}>Ver estado de recursos en la nube.</div>
                        </div>
                    </Link>

                </div>

                {/* Activity Section */}
                <div className={styles.activitySection}>
                    <h3 className={styles.sectionTitle} style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Actividad Reciente</h3>
                    <div className={styles.activityItem}>
                        <div className={styles.activityTime}>Ahora</div>
                        <div style={{ flex: 1, fontSize: '0.875rem', color: '#cbd5e1' }}>
                            Inicio de sesión detectado desde nuevo dispositivo.
                        </div>
                        <span className={`${styles.bgGreenSoft} ${styles.textGreen}`} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>Auth</span>
                    </div>
                    <div className={styles.activityItem}>
                        <div className={styles.activityTime}>2h atrás</div>
                        <div style={{ flex: 1, fontSize: '0.875rem', color: '#cbd5e1' }}>
                            Sincronización de métricas de AWS completada.
                        </div>
                        <span className={`${styles.bgBlueSoft} ${styles.textWhite}`} style={{ color: '#38bdf8', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>System</span>
                    </div>
                    <div className={styles.activityItem}>
                        <div className={styles.activityTime}>1d atrás</div>
                        <div style={{ flex: 1, fontSize: '0.875rem', color: '#cbd5e1' }}>
                            Parche de seguridad aplicado automáticamente.
                        </div>
                        <span className={`${styles.bgPurpleSoft} ${styles.textPurple}`} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>Update</span>
                    </div>
                </div>

            </div>
        </main>
    )
}
