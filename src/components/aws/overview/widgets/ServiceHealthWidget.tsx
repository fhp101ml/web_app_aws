
import { WidgetCard } from './WidgetCard';
import { CloudInstance, CloudBucket, CloudFunction, CloudDatabase } from '@/core/interfaces/ICloudProvider';
import { CheckCircle2, AlertTriangle, Cloud, Database, HardDrive, Zap } from 'lucide-react';

interface ServiceHealthWidgetProps {
    id?: string;
    onRemove?: () => void;
    instances: CloudInstance[];
    buckets: CloudBucket[];
    lambdas: CloudFunction[];
    rds: CloudDatabase[];
}

export function ServiceHealthWidget({ id, onRemove, instances, buckets, lambdas, rds }: ServiceHealthWidgetProps) {

    // Simple logic to determine "issues" implies stopped instances or warning states
    const instanceIssues = instances.filter(i => i.state !== 'running').length;
    const rdsIssues = rds.filter(d => d.status !== 'available').length;

    const services = [
        { name: 'EC2 Instances', icon: Cloud, total: instances.length, issues: instanceIssues, color: 'text-orange-500' },
        { name: 'RDS Databases', icon: Database, total: rds.length, issues: rdsIssues, color: 'text-blue-500' },
        { name: 'S3 Buckets', icon: HardDrive, total: buckets.length, issues: 0, color: 'text-green-500' }, // Assume buckets always healthy for simple view
        { name: 'Lambda Functions', icon: Zap, total: lambdas.length, issues: 0, color: 'text-purple-500' },
    ];

    return (
        <WidgetCard id={id} onRemove={onRemove} title="AWS Health" footerLink={{ label: 'Open Personal Health Dashboard', href: '#' }}>
            <div className="space-y-4">
                <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-md border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">Operational</span>
                    <span className="text-xs text-emerald-600 ml-auto">All systems nominal</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {services.map((svc, idx) => (
                        <div key={idx} className="flex flex-col p-3 bg-slate-50 rounded-md border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <svc.icon className={`w-4 h-4 ${svc.color}`} />
                                <span className="text-xs font-semibold text-slate-700">{svc.name}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-bold text-slate-800">{svc.total}</span>
                                {svc.issues > 0 ? (
                                    <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                                        <AlertTriangle className="w-3 h-3" />
                                        {svc.issues} Issues
                                    </div>
                                ) : (
                                    <span className="text-xs text-emerald-600 font-medium">Healthy</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WidgetCard>
    );
}
