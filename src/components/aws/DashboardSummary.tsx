'use client';

import { DashboardData } from '@/app/actions/aws';
import { Server, Database, Network, DollarSign } from 'lucide-react';
import styles from './aws.module.css';

interface DashboardSummaryProps {
    data: DashboardData;
}

export function DashboardSummary({ data }: DashboardSummaryProps) {
    const { instances, buckets, networks, providerType } = data;

    const runningInstances = instances.filter(i => i.state === 'running').length;
    // Mock cost logic: AWS costs money, LocalStack is free.
    const estimatedCost = providerType === 'aws'
        ? (runningInstances * 0.0416 * 24 * 30).toFixed(2)
        : "0.00";

    return (
        <div className={styles.statsRow}>
            <div className={styles.statCard}>
                <span className={styles.statLabel}>Computing</span>
                <span className={styles.statValue}>{instances.length}</span>
                <div className={`${styles.statDecor} ${styles.decorBlue}`}></div>
                <div className="absolute top-4 right-4 p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Server className="w-5 h-5" />
                </div>
            </div>

            <div className={styles.statCard}>
                <span className={styles.statLabel}>Storage</span>
                <span className={styles.statValue}>{buckets.length}</span>
                <div className={`${styles.statDecor} ${styles.decorYellow}`}></div>
                <div className="absolute top-4 right-4 p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                    <Database className="w-5 h-5" />
                </div>
            </div>

            <div className={styles.statCard}>
                <span className={styles.statLabel}>Network</span>
                <span className={styles.statValue}>{networks.length}</span>
                <div className={`${styles.statDecor} ${styles.decorPurple}`}></div>
                <div className="absolute top-4 right-4 p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Network className="w-5 h-5" />
                </div>
            </div>

            <div className={styles.statCard}>
                <span className={styles.statLabel}>Est. Cost (Mo)</span>
                <span className={styles.statValue}>${estimatedCost}</span>
                <div className={`${styles.statDecor} ${styles.decorGreen}`}></div>
                <div className="absolute top-4 right-4 p-2 rounded-lg bg-green-500/10 text-green-400">
                    <DollarSign className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
