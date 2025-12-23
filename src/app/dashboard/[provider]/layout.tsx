import Sidebar from '@/components/layout/Sidebar';
import styles from '@/app/dashboard/layout.module.css';

export default function ProviderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Sidebar only for Provider views */}
            <Sidebar />

            <main className={styles.mainContent}>
                {children}
            </main>
        </>
    );
}
