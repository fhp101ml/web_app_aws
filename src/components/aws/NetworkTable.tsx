'use client';

import { useState, useEffect } from 'react';
import { CloudNetwork, CloudSubnet } from "@/core/interfaces/ICloudProvider";
import { Network, Trash2, Loader2, AlertCircle, ChevronDown, ChevronRight, Share2 } from "lucide-react";
import { deleteVpcAction } from '@/app/actions/aws';
import { useRouter } from 'next/navigation';
import styles from './aws.module.css';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface NetworkTableProps {
    networks: CloudNetwork[];
    subnets?: CloudSubnet[];
    providerType: 'aws' | 'localstack';
}

export function NetworkTable({ networks, subnets, providerType }: NetworkTableProps) {
    const router = useRouter();
    const [loadingVpc, setLoadingVpc] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [vpcToDelete, setVpcToDelete] = useState<string | null>(null);
    const [expandedVpc, setExpandedVpc] = useState<string | null>(null);

    // Live polling for updates (2 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 2000);

        return () => clearInterval(interval);
    }, [router]);

    const toggleExpand = (id: string) => {
        setExpandedVpc(expandedVpc === id ? null : id);
    };

    const handleDeleteClick = (id: string) => {
        setVpcToDelete(id);
        setError(null);
    };

    const confirmDelete = async () => {
        if (!vpcToDelete) return;

        setLoadingVpc(vpcToDelete);
        try {
            const res = await deleteVpcAction(vpcToDelete, providerType);
            if (!res.success) throw new Error(res.error);
            router.refresh();
            setVpcToDelete(null);
        } catch (err: any) {
            setError(err.message || 'Failed to delete VPC');
            setVpcToDelete(null);
        } finally {
            setLoadingVpc(null);
        }
    };

    if (networks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl border-dashed border-[hsl(var(--border-color))]">
                {error && (
                    <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                <Network className="w-10 h-10 text-[hsl(var(--text-muted))] mb-3" />
                <h3 className="text-[hsl(var(--text-secondary))] font-medium">No Networks Found</h3>
                <p className="text-sm text-[hsl(var(--text-muted))] mt-1">
                    Your VPC list is empty.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <ConfirmationModal
                isOpen={!!vpcToDelete}
                onClose={() => !loadingVpc && setVpcToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete VPC"
                message={`Are you sure you want to delete VPC "${vpcToDelete}"? This action cannot be undone.`}
                confirmLabel="Delete VPC"
                variant="danger"
                isLoading={loadingVpc === vpcToDelete}
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
                            <th className={styles.th}>Network</th>
                            <th className={styles.th}>CIDR Block</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Default</th>
                            <th className={`${styles.th} text-right`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {networks.map((vpc) => {
                            const vpcSubnets = subnets?.filter(s => s.vpcId === vpc.id) || [];
                            const isExpanded = expandedVpc === vpc.id;

                            return (
                                <>
                                    <tr key={vpc.id} className={`${styles.tr} cursor-pointer hover:bg-[#1e293b]/50`} onClick={() => toggleExpand(vpc.id)}>
                                        {/* Stacked Name + ID */}
                                        <td className={styles.td}>
                                            <div className={styles.cellContent}>
                                                <div className="flex items-center gap-2">
                                                    {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                                                    <div>
                                                        <span className={styles.cellPrimary}>{vpc.name}</span>
                                                        <span className={styles.cellSecondary}>{vpc.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className={`${styles.td} font-mono text-xs text-[hsl(var(--text-muted))]`}>
                                            {vpc.cidrBlock}
                                        </td>

                                        <td className={styles.td}>
                                            <span className={`${styles.badge} ${vpc.state === 'available' ? styles.badgeRunning : styles.badgeStopped}`}>
                                                <span className={styles.badgeDot}></span>
                                                {vpc.state}
                                            </span>
                                        </td>

                                        <td className={styles.td}>
                                            {vpc.isDefault ? (
                                                <span className="text-xs text-[hsl(var(--text-muted))] border border-[hsl(var(--border-color))] px-2 py-0.5 rounded">Default</span>
                                            ) : (
                                                <span className="text-xs text-[hsl(var(--text-muted))]">-</span>
                                            )}
                                        </td>

                                        <td className={`${styles.td} text-right`} onClick={(e) => e.stopPropagation()}>
                                            <div className={styles.actionGroup}>
                                                <button
                                                    onClick={() => handleDeleteClick(vpc.id)}
                                                    disabled={loadingVpc === vpc.id || vpc.isDefault}
                                                    className={styles.btnActionIcon}
                                                    title={vpc.isDefault ? "Cannot delete default VPC" : "Delete VPC"}
                                                >
                                                    {loadingVpc === vpc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-[#0f172a]/50">
                                            <td colSpan={5} className="p-4 pl-12">
                                                <div className="rounded-lg border border-slate-700/50 overflow-hidden">
                                                    <div className="bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-400 border-b border-slate-700/50 flex items-center gap-2">
                                                        <Share2 className="w-3 h-3" /> Subnets ({vpcSubnets.length})
                                                    </div>
                                                    {vpcSubnets.length > 0 ? (
                                                        <table className="w-full text-left text-xs">
                                                            <thead className="bg-slate-800/30 text-slate-500">
                                                                <tr>
                                                                    <th className="px-4 py-2 font-medium">Subnet ID</th>
                                                                    <th className="px-4 py-2 font-medium">CIDR</th>
                                                                    <th className="px-4 py-2 font-medium">AZ</th>
                                                                    <th className="px-4 py-2 font-medium">Available IPs</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-700/50">
                                                                {vpcSubnets.map(subnet => (
                                                                    <tr key={subnet.id} className="text-slate-300">
                                                                        <td className="px-4 py-2 font-mono text-slate-400">{subnet.id}</td>
                                                                        <td className="px-4 py-2 font-mono">{subnet.cidrBlock}</td>
                                                                        <td className="px-4 py-2">{subnet.availabilityZone}</td>
                                                                        <td className="px-4 py-2">{subnet.availableIpAddressCount}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <div className="p-4 text-center text-slate-500 text-sm">No subnets found in this VPC.</div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
