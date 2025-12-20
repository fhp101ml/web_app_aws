import { Metadata } from "next"
import RegisterForm from "@/components/RegisterForm"
import Link from "next/link"
import styles from "../login/login.module.css" // Reuse existing styles

export const metadata: Metadata = {
    title: "Registro | ExoCluster",
    description: "Solicitar acceso a la plataforma",
}

export default function RegisterPage() {
    return (
        <div className={styles.container}>
            {/* Left Panel - Brand & Visuals */}
            <div className={styles.visualPanel}>
                <div className={`${styles.blob} ${styles.blob1}`}></div>
                <div className={`${styles.blob} ${styles.blob2}`}></div>

                <div className={styles.visualContent}>
                    <div className={styles.brand}>
                        <div className={styles.logoIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        ExoCluster
                    </div>

                    <div>
                        <h1 className={styles.heroTitle}>Únete a la<br />revolución cloud.</h1>
                        <p className={styles.heroText}>
                            Solicita acceso a tu equipo de administradores para comenzar a gestionar recursos de forma centralizada.
                        </p>
                    </div>
                </div>

                <div className={`${styles.testimonial} ${styles.visualContent}`}>
                    <p className={styles.quote}>"Seguridad y control en cada despliegue. El estándar para equipos modernos."</p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className={styles.formPanel}>
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Solicitar Acceso</h2>
                        <p className={styles.formSubtitle}>Completa tus datos para el administrador</p>
                    </div>

                    <RegisterForm />

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            ¿Ya tienes cuenta activa?{' '}
                            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Iniciar Sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
