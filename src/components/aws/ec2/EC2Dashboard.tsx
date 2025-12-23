'use client';

import InstanceTable from './InstanceTable';
import { CloudInstance } from '@/core/interfaces/ICloudProvider';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import styles from '../aws.module.css';

interface EC2DashboardProps {
    instances: CloudInstance[];
    providerType: 'aws' | 'localstack';
}

export function EC2Dashboard({ instances, providerType }: EC2DashboardProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const runningCount = instances.filter(i => i.state === 'running').length;
    const stoppedCount = instances.filter(i => i.state === 'stopped').length;

    // Mock Volumes Count for now
    const volumeCount = instances.length * 2;

    return (
        <div className="animate-in fade-in duration-500">
            {/* Manual Header to match Users Page exactly */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Instances</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        prod-us-east-1 • Account: 1234-5678-9012
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/aws/launch-instance" target="_blank">
                        <button className={styles.btnLaunch}>
                            <Play className="w-4 h-4 fill-current" />
                            Launch Instance
                        </button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Running</span>
                    <span className={styles.statValue}>{runningCount}</span>
                    <div className={`${styles.statDecor} ${styles.decorGreen}`}></div>
                </div>

                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Stopped</span>
                    <span className={styles.statValue}>{stoppedCount}</span>
                    <div className={`${styles.statDecor} ${styles.decorOrange}`}></div>
                </div>

                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Volumes</span>
                    <span className={styles.statValue}>{volumeCount}</span>
                    <div className={`${styles.statDecor} ${styles.decorBlue}`}></div>
                </div>
            </div>

            {/* Instance Table */}
            <InstanceTable instances={instances} providerType={providerType} />
        </div>
    );
}
