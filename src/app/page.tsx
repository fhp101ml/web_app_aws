import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.container}>
        <h1 className={styles.title}>
          Gestión Cloud <span className="text-gradient">Inteligente</span>
        </h1>

        <p className={styles.subtitle}>
          Centraliza tu infraestructura AWS en una interfaz premium, diseñada para escalabilidad, seguridad y control total.
        </p>

        <div className={styles.grid}>
          <Link href="/dashboard" className={`${styles.card} glass-panel`}>
            <div className={`${styles.icon} ${styles.iconAws}`}>
              {/* Lucide: CloudLightning */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" /><path d="m13 12-3 5h4l-3 5" /></svg>
            </div>
            <h3 className={styles.cardTitle}>AWS Manager</h3>
            <p className={styles.cardText}>Accede al panel de control de instancias EC2, volúmenes y seguridad.</p>
          </Link>

          <div className={`${styles.card} glass-panel`} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <div className={styles.icon} style={{ background: 'rgba(255,255,255,0.05)', color: '#aaa' }}>
              {/* Lucide: Globe */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
            </div>
            <h3 className={styles.cardTitle}>Multi-Cloud</h3>
            <p className={styles.cardText}>Soporte para Azure y Google Cloud Platform en desarrollo.</p>
          </div>
        </div>

        <div className={styles.cta}>
          <Link href="/login" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
            Comenzar Ahora
          </Link>
        </div>
      </div>
    </main>
  );
}
