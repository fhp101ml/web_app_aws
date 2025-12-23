'use client';

import { useState, useEffect } from 'react';
import { CloudInstance } from '@/core/interfaces/ICloudProvider';
import { startInstanceAction, stopInstanceAction, deleteInstanceAction, rebootInstanceAction } from '@/app/actions/aws';
import { Play, Square, Loader2, Monitor, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../aws.module.css';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface InstanceTableProps {
    instances: CloudInstance[];
    providerType: 'aws' | 'localstack';
}

export default function InstanceTable({ instances, providerType }: InstanceTableProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [instanceToDelete, setInstanceToDelete] = useState<string | null>(null);

    // Live polling for updates (2 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 2000);

        return () => clearInterval(interval);
    }, [router]);

    const handleStart = async (id: string) => {
        setLoadingId(id);
        setError(null);
        try {
            const res = await startInstanceAction(id, providerType);
            if (!res.success) throw new Error(res.error);
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Failed to start instance');
        } finally {
            setLoadingId(null);
        }
    };

    const handleStop = async (id: string) => {
        setLoadingId(id);
        setError(null);
        try {
            const res = await stopInstanceAction(id, providerType);
            if (!res.success) throw new Error(res.error);
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Failed to stop instance');
        } finally {
            setLoadingId(null);
        }
    };

    const handleReboot = async (id: string) => {
        setLoadingId(id);
        setError(null);
        try {
            const res = await rebootInstanceAction(id, providerType);
            if (!res.success) throw new Error(res.error);
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Failed to reboot instance');
        } finally {
            setLoadingId(null);
        }
    };

    const handleDeleteClick = (id: string) => {
        setInstanceToDelete(id);
        setError(null);
    };

    const confirmDelete = async () => {
        if (!instanceToDelete) return;

        setLoadingId(instanceToDelete);
        try {
            const res = await deleteInstanceAction(instanceToDelete, providerType);
            if (!res.success) throw new Error(res.error);
            router.refresh();
            setInstanceToDelete(null);
        } catch (err: any) {
            setError(err.message || 'Failed to delete instance');
            setInstanceToDelete(null);
        } finally {
            setLoadingId(null);
        }
    };

    const getStatusBadgeClass = (state: string) => {
        // We'll mimic the statusBadge from css but with inline color overrides or utility classes combined
        switch (state) {
            case 'running': return 'bg-green-500/10 text-green-400';
            case 'stopped': return 'bg-red-500/10 text-red-400';
            case 'pending': return 'bg-yellow-500/10 text-yellow-400';
            case 'stopping': return 'bg-orange-500/10 text-orange-400';
            case 'terminated': return 'bg-gray-500/10 text-gray-400 line-through';
            case 'shutting-down': return 'bg-orange-500/10 text-orange-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <div className="space-y-4">
            <ConfirmationModal
                isOpen={!!instanceToDelete}
                onClose={() => !loadingId && setInstanceToDelete(null)}
                onConfirm={confirmDelete}
                title="Terminate Instance"
                message="Are you sure you want to terminate this instance? This action cannot be undone and local data on the instance will be lost."
                confirmLabel="Terminate"
                variant="danger"
                isLoading={loadingId === instanceToDelete}
            />

            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Name / ID</th>
                            <th className={styles.th}>Type</th>
                            <th className={styles.th}>Public IP</th>
                            <th className={styles.th}>Status</th>
                            <th className={`${styles.th} text-right`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instances.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>
                                    No instances found. Use the dashboard to launch one.
                                </td>
                            </tr>
                        ) : (
                            instances.map((inst) => (
                                <tr key={inst.id} className={styles.tr}>
                                    {/* Stacked Name + ID */}
                                    <td className={styles.td}>
                                        <div className={styles.cellContent}>
                                            <span className={styles.cellPrimary}>{inst.name}</span>
                                            <span className={styles.cellSecondary}>{inst.id}</span>
                                        </div>
                                    </td>

                                    {/* Type */}
                                    <td className={`${styles.td} font-mono text-xs text-[hsl(var(--text-muted))]`}>
                                        {inst.type}
                                    </td>

                                    {/* Public IP */}
                                    <td className={`${styles.td} font-mono text-xs text-[hsl(var(--text-muted))]`}>
                                        {inst.publicIp || '-'}
                                    </td>

                                    {/* Status Badge */}
                                    <td className={styles.td}>
                                        <span className={`${styles.badge} ${inst.state === 'running' ? styles.badgeRunning :
                                            inst.state === 'stopped' ? styles.badgeStopped :
                                                inst.state === 'terminated' ? styles.badgeTerminated :
                                                    styles.badgePending
                                            }`}>
                                            <span className={styles.badgeDot}></span>
                                            {inst.state}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className={`${styles.td} text-right`}>
                                        <div className={styles.actionGroup}>
                                            {/* Start - Primary Action */}
                                            <button
                                                onClick={() => handleStart(inst.id)}
                                                disabled={inst.state !== 'stopped' || loadingId === inst.id}
                                                className={styles.btnActionPrimary}
                                                style={{ opacity: inst.state !== 'stopped' ? 0.5 : 1, cursor: inst.state !== 'stopped' ? 'not-allowed' : 'pointer' }}
                                                title="Start Instance"
                                            >
                                                {loadingId === inst.id && inst.state === 'stopped' ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                                Start
                                            </button>

                                            {/* Stop - Secondary Action */}
                                            <button
                                                onClick={() => handleStop(inst.id)}
                                                disabled={inst.state !== 'running' || loadingId === inst.id}
                                                className={styles.btnActionSecondary}
                                                style={{
                                                    borderColor: inst.state === 'running' ? 'rgba(245, 158, 11, 0.4)' : 'transparent',
                                                    color: inst.state === 'running' ? '#fbbf24' : 'gray',
                                                    opacity: inst.state !== 'running' ? 0.5 : 1,
                                                    cursor: inst.state !== 'running' ? 'not-allowed' : 'pointer'
                                                }}
                                                title="Stop Instance"
                                            >
                                                {loadingId === inst.id && inst.state === 'running' ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                                Stop
                                            </button>

                                            {/* Reboot - Icon Action */}
                                            <button
                                                onClick={() => handleReboot(inst.id)}
                                                disabled={inst.state !== 'running' || loadingId === inst.id}
                                                className={styles.btnActionIcon}
                                                title="Reboot Instance"
                                            >
                                                {loadingId === inst.id && inst.state === 'running' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                            </button>

                                            {/* Delete - Icon Action */}
                                            <button
                                                onClick={() => handleDeleteClick(inst.id)}
                                                disabled={inst.state === 'terminated' || loadingId === inst.id}
                                                className={styles.btnActionIcon}
                                                title="Terminate Instance"
                                            >
                                                {loadingId === inst.id && instanceToDelete === inst.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
