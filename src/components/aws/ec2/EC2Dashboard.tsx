'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import InstanceTable from './InstanceTable';
import { CloudInstance } from '@/core/interfaces/ICloudProvider';
import { Play, Square, HardDrive } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { createInstanceAction } from '@/app/actions/aws';
import { LaunchInstanceWizard } from './LaunchInstanceWizard';

interface EC2DashboardProps {
    instances: CloudInstance[];
    providerType: 'aws' | 'localstack';
}

export function EC2Dashboard({ instances, providerType }: EC2DashboardProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    const runningCount = instances.filter(i => i.state === 'running').length;
    const stoppedCount = instances.filter(i => i.state === 'stopped').length;

    // Mock Volumes Count for now
    const volumeCount = instances.length * 2;

    // Handle Launch (Temporary logic until Wizard is ready)
    const handleLaunchInstance = () => {
        setIsWizardOpen(true);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <LaunchInstanceWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} providerType={providerType} />

            <PageHeader
                title="Instances"
                breadcrumbs={[
                    { label: 'Cloud' },
                    { label: 'Compute' },
                    { label: 'Instances' }
                ]}
                onRefresh={() => router.refresh()}
                isRefreshing={isPending}
                actions={
                    <button
                        onClick={handleLaunchInstance}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? <span className="animate-spin mr-2">⟳</span> : <Play className="w-4 h-4 fill-current" />}
                        Launch Instance
                    </button>
                }
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-lg p-4 flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-full">
                        <Play className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{runningCount}</div>
                        <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Running</div>
                    </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-lg p-4 flex items-center gap-4">
                    <div className="p-3 bg-slate-500/10 rounded-full">
                        <Square className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{stoppedCount}</div>
                        <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Stopped</div>
                    </div>
                </div>

                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-lg p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-full">
                        <HardDrive className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{volumeCount}</div>
                        <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Volumes</div>
                    </div>
                </div>
            </div>

            {/* Instance Table */}
            <InstanceTable instances={instances} providerType={providerType} />
        </div>
    );
}
