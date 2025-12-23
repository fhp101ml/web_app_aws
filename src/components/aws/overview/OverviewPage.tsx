'use client';

import { CloudInstance, CloudBucket, CloudNetwork, CloudFunction, CloudDatabase, CostMetric } from '@/core/interfaces/ICloudProvider';
import { ConfigurableDashboard } from './ConfigurableDashboard';

interface OverviewPageProps {
    data: {
        instances: CloudInstance[];
        buckets: CloudBucket[];
        networks: CloudNetwork[];
        lambdas: CloudFunction[];
        rds: CloudDatabase[];
        cost: { history: CostMetric[], forecast?: number };
    };
}

export function OverviewPage({ data }: OverviewPageProps) {
    return (
        <div className="animate-in fade-in duration-500">
            <ConfigurableDashboard data={data} />
        </div>
    );
}
