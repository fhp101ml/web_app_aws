'use client';

import { createInstanceAction } from '@/app/actions/aws';
import { Play, Plus, Database, Network, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './aws.module.css';

export function ActionPanel() {
    const router = useRouter();
    const [isLaunching, setIsLaunching] = useState(false);

    const handleLaunchInstance = async () => {
        setIsLaunching(true);
        try {
            await createInstanceAction();
            router.refresh();
        } catch (error) {
            console.error("Failed to launch instance", error);
        } finally {
            setIsLaunching(false);
        }
    };

    return (
        <div className={styles.statCard}>
            <h3 className={styles.panelTitle}>Quick Actions</h3>

            <button
                onClick={handleLaunchInstance}
                disabled={isLaunching}
                className={styles.actionBtn}
            >
                <div className={styles.actionIcon}>
                    {isLaunching ? (
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    ) : (
                        <Play className="w-5 h-5 text-blue-400" />
                    )}
                </div>
                <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">Launch Test Instance</span>
                    <span className="text-xs text-[hsl(var(--text-muted))]">Create t2.micro</span>
                </div>
            </button>

            <button disabled className={styles.actionBtn}>
                <div className={styles.actionIcon}>
                    <Database className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">Create Bucket</span>
                    <span className="text-xs text-[hsl(var(--text-muted))]">New S3 Storage</span>
                </div>
            </button>

            <button disabled className={styles.actionBtn}>
                <div className={styles.actionIcon}>
                    <Network className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">Create Network</span>
                    <span className="text-xs text-[hsl(var(--text-muted))]">New VPC</span>
                </div>
            </button>
        </div>
    );
}
