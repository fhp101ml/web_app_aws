import { Metadata } from "next"
import LoginForm from "@/components/LoginForm"
import Link from "next/link"
import styles from "./login.module.css"

export const metadata: Metadata = {
    title: "Login | ExoCluster",
    description: "Secure Access",
}

export default function LoginPage() {
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
                        <h1 className={styles.heroTitle}>Control total<br />de tu infraestructura.</h1>
                        <p className={styles.heroText}>
                            Gestiona AWS, GCP y Azure desde una única interfaz unificada.
                            Seguridad de grado empresarial, diseñado para desarrolladores.
                        </p>
                    </div>
                </div>

                <div className={`${styles.testimonial} ${styles.visualContent}`}>
                    <p className={styles.quote}>"La herramienta definitiva para orquestación multi-cloud. Simplemente funciona."</p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">DT</div>
                        <div>
                            <p className="text-sm font-semibold text-white">DevOps Team</p>
                            <p className="text-xs text-slate-400">Enterprise Solutions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className={styles.formPanel}>
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Bienvenido</h2>
                        <p className={styles.formSubtitle}>Ingresa tus credenciales para acceder al dashboard</p>
                    </div>

                    <LoginForm />

                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-sm mb-4">
                            ¿No tienes cuenta?{' '}
                            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Solicitar acceso
                            </Link>
                        </p>
                        <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
