'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { LayoutDashboard, Server, Database, Network, Cloud, ArrowRightLeft, Settings } from 'lucide-react';
import styles from './sidebar.module.css';
import { useState, useEffect } from 'react';

// Need to share this state globally usually, but for now we'll mock or use URL params
// In v2 full implementation this would come from a Context

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedCloud, setSelectedCloud] = useState<'aws' | 'localstack' | 'diff'>('aws');

    useEffect(() => {
        // Simple heuristic to set active cloud from URL or default
        if (pathname.includes('/diff')) {
            setSelectedCloud('diff');
        } else if (pathname.includes('/localstack')) {
            setSelectedCloud('localstack');
        } else {
            setSelectedCloud('aws'); // Default or read from path
        }
    }, [pathname]);

    // Helper to build links based on current cloud
    const getLink = (service: string) => {
        if (selectedCloud === 'diff') return `/dashboard/diff?tab=${service}`;
        // Using query params for now to reuse the existing DashboardView validation
        return `/dashboard/${selectedCloud}?tab=${service}`;
    };

    const isActive = (service: string) => {
        const currentTab = searchParams.get('tab') || 'overview';
        return currentTab === service ? styles.navItemActive : '';
    };

    return (
        <aside className={styles.sidebar}>
            {/* Cloud Selector */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Cloud Provider</div>
                <div className={styles.cloudSelector}>
                    <div
                        className={`${styles.cloudOption} ${selectedCloud === 'aws' ? styles.cloudOptionActive : ''}`}
                        onClick={() => router.push('/dashboard/aws?tab=overview')}
                        role="button"
                        tabIndex={0}
                    >
                        <div>
                            <span className={styles.cloudName}>AWS Cloud</span>
                            <span className={styles.cloudStatus}>Production</span>
                        </div>
                        {selectedCloud === 'aws' && <div className={styles.indicator} />}
                    </div>

                    <div
                        className={`${styles.cloudOption} ${selectedCloud === 'localstack' ? styles.cloudOptionActive : ''}`}
                        onClick={() => router.push('/dashboard/localstack?tab=overview')}
                        role="button"
                        tabIndex={0}
                    >
                        <div>
                            <span className={styles.cloudName}>LocalStack</span>
                            <span className={styles.cloudStatus}>Development</span>
                        </div>
                        {selectedCloud === 'localstack' && <div className={styles.indicator} />}
                    </div>
                </div>

                {/* Diff Toggle Removed - Feature Cancelled */}
            </div>

            {/* Services Navigation */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Services</div>
                <nav className="flex flex-col gap-1">
                    <Link href={getLink('overview')} className={`${styles.navItem} ${isActive('overview')}`}>
                        <LayoutDashboard size={18} />
                        <span>Overview</span>
                    </Link>
                    <Link href={getLink('compute')} className={`${styles.navItem} ${isActive('compute')}`}>
                        <Server size={18} />
                        <span>Compute (EC2)</span>
                    </Link>
                    <Link href={getLink('storage')} className={`${styles.navItem} ${isActive('storage')}`}>
                        <Database size={18} />
                        <span>Storage (S3)</span>
                    </Link>
                    <Link href={getLink('network')} className={`${styles.navItem} ${isActive('network')}`}>
                        <Network size={18} />
                        <span>Network (VPC)</span>
                    </Link>
                </nav>
            </div>

            {/* Settings / Meta */}
            <div className="mt-auto px-4 pb-4">
                <Link href="/dashboard/settings" className={styles.navItem}>
                    <Settings size={18} />
                    <span>Settings</span>
                </Link>
            </div>
        </aside>
    );
}
