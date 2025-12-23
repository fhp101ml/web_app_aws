'use client';

import { DashboardData, createInstanceAction, createBucketAction, createVpcAction } from '@/app/actions/aws';
import { useState, useTransition, useEffect } from 'react';
import { DashboardSummary } from './DashboardSummary';
import { StorageTable } from './StorageTable';
import { NetworkTable } from './NetworkTable';
import { OverviewPage } from './overview/OverviewPage';
import { EC2Dashboard } from './ec2/EC2Dashboard';
import styles from './aws.module.css';
import { Play, Database, Network, LayoutDashboard } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface DashboardViewProps {
    data: DashboardData;
}

type Tab = 'overview' | 'compute' | 'storage' | 'network';

export function DashboardView({ data }: DashboardViewProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialTab = (searchParams.get('tab') as Tab) || 'overview';
    const [activeTab, setActiveTab] = useState<Tab>(initialTab);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const tab = searchParams.get('tab') as Tab;
        if (tab && ['overview', 'compute', 'storage', 'network'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleCreateBucket = () => {
        const name = prompt("Enter bucket name (globally unique):", `test-bucket-${Date.now()}`);
        if (!name) return;

        startTransition(async () => {
            await createBucketAction(name, data.providerType);
            router.refresh();
        });
    };

    const handleCreateVPC = () => {
        startTransition(async () => {
            await createVpcAction("10.0.0.0/16", data.providerType);
            router.refresh();
        });
    };

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        Cloud Console
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage your AWS and LocalStack resources
                    </p>
                </div>
                {/* Provider Switcher removed in favor of Sidebar navigation */}
            </div>

            {/* Summary Cards Removed to avoid duplication with OverviewPage */}

            {/* Main Content Area (Full Width) */}
            <div className="space-y-6">
                {/* Content determined by URL params via Sidebar */}
                <div className="min-h-[400px]">
                    {activeTab === 'overview' && <OverviewPage data={data} />}
                    {activeTab === 'compute' && <EC2Dashboard instances={data.instances} providerType={data.providerType} />}
                    {activeTab === 'storage' && <StorageTable buckets={data.buckets} providerType={data.providerType} />}
                    {activeTab === 'network' && <NetworkTable networks={data.networks} subnets={data.subnets || []} providerType={data.providerType} />}
                </div>

                {/* Actions Bar (Below Table) - Only for Storage/Network for now */}
                <div className="flex justify-end pb-4 mt-12 pt-8 border-t border-[hsl(var(--glass-border))]">
                    {/* EC2 Actions moved to EC2Dashboard Header */}
                    {activeTab === 'storage' && (
                        <button
                            onClick={handleCreateBucket}
                            disabled={isPending}
                            className={styles.btnSubmit}
                        >
                            {isPending ? 'Creating...' : (
                                <span className="flex items-center gap-2">
                                    <Database className="w-4 h-4" /> Create Bucket
                                </span>
                            )}
                        </button>
                    )}
                    {activeTab === 'network' && (
                        <button
                            onClick={handleCreateVPC}
                            disabled={isPending}
                            className={styles.btnSubmit}
                        >
                            {isPending ? 'Creating...' : (
                                <span className="flex items-center gap-2">
                                    <Network className="w-4 h-4" /> Create VPC
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
