'use client';

import { useState, useEffect } from 'react';
import { CloudBucket } from "@/core/interfaces/ICloudProvider";
import { Database, Trash2, Loader2, AlertCircle } from "lucide-react";
import { deleteBucketAction } from '@/app/actions/aws';
import { useRouter } from 'next/navigation';
import styles from './aws.module.css';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface StorageTableProps {
    buckets: CloudBucket[];
    providerType: 'aws' | 'localstack';
}

import { listBucketObjectsAction } from '@/app/actions/aws';
import { Eye, FileText } from "lucide-react";

export function StorageTable({ buckets, providerType }: StorageTableProps) {
    const router = useRouter();
    const [loadingBucket, setLoadingBucket] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [bucketToDelete, setBucketToDelete] = useState<string | null>(null);
    const [viewingBucket, setViewingBucket] = useState<string | null>(null);
    const [bucketObjects, setBucketObjects] = useState<string[]>([]);
    const [loadingObjects, setLoadingObjects] = useState(false);

    // Live polling for updates (2 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 2000);

        return () => clearInterval(interval);
    }, [router]);

    const handleDeleteClick = (name: string) => {
        setBucketToDelete(name);
        setError(null);
    };

    const handleViewObjects = async (name: string) => {
        setViewingBucket(name);
        setLoadingObjects(true);
        setBucketObjects([]);
        try {
            const res = await listBucketObjectsAction(name, providerType);
            if (res.success && res.data) {
                setBucketObjects(res.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingObjects(false);
        }
    };

    const confirmDelete = async () => {
        if (!bucketToDelete) return;

        setLoadingBucket(bucketToDelete);
        try {
            const res = await deleteBucketAction(bucketToDelete, providerType);
            if (!res.success) throw new Error(res.error);
            router.refresh();
            setBucketToDelete(null);
        } catch (err: any) {
            setError(err.message || 'Failed to delete bucket');
            setBucketToDelete(null);
        } finally {
            setLoadingBucket(null);
        }
    };

    if (buckets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl border-dashed border-[hsl(var(--border-color))]">
                {error && (
                    <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                <Database className="w-10 h-10 text-[hsl(var(--text-muted))] mb-3" />
                <h3 className="text-[hsl(var(--text-secondary))] font-medium">No Buckets Found</h3>
                <p className="text-sm text-[hsl(var(--text-muted))] mt-1">
                    Your S3 storage is empty.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <ConfirmationModal
                isOpen={!!bucketToDelete}
                onClose={() => !loadingBucket && setBucketToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Bucket"
                message={`Are you sure you want to delete the bucket "${bucketToDelete}"? This action cannot be undone and all objects inside will be lost.`}
                confirmLabel="Delete Bucket"
                variant="danger"
                isLoading={loadingBucket === bucketToDelete}
            />

            {viewingBucket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-6 m-4 relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-400" />
                            Objects in {viewingBucket}
                        </h3>

                        <div className="min-h-[200px] max-h-[400px] overflow-y-auto bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                            {loadingObjects ? (
                                <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Loading objects...
                                </div>
                            ) : bucketObjects.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                                    <FileText className="w-8 h-8 opacity-50" />
                                    <p>No objects found</p>
                                </div>
                            ) : (
                                <ul className="space-y-2">
                                    {bucketObjects.map((obj, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300 p-2 hover:bg-slate-800 rounded transition-colors">
                                            <FileText className="w-4 h-4 text-slate-500" />
                                            <span className="truncate">{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setViewingBucket(null)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


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
                            <th className={styles.th}>Bucket Name</th>
                            <th className={styles.th}>Creation Date</th>
                            <th className={`${styles.th} text-right`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buckets.map((bucket, idx) => (
                            <tr key={idx} className={styles.tr}>
                                <td className={styles.td}>
                                    <div className={styles.cellContent}>
                                        <div className="flex items-center gap-2">
                                            <Database className="w-4 h-4 text-yellow-500" />
                                            <span className={styles.cellPrimary}>{bucket.name}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className={`${styles.td}`}>
                                    <span className={styles.cellSecondary}>
                                        {bucket.creationDate ? new Date(bucket.creationDate).toLocaleString() : '-'}
                                    </span>
                                </td>
                                <td className={`${styles.td} text-right`}>
                                    <div className={styles.actionGroup}>
                                        <button
                                            onClick={() => handleViewObjects(bucket.name)}
                                            className={styles.btnActionIcon}
                                            title="View Objects"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(bucket.name)}
                                            disabled={loadingBucket === bucket.name}
                                            className={styles.btnActionIcon}
                                            title="Delete Bucket"
                                        >
                                            {loadingBucket === bucket.name ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
