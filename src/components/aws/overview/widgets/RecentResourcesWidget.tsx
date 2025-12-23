import { WidgetCard } from './WidgetCard';
import { CloudInstance, CloudBucket, CloudFunction, CloudDatabase } from '@/core/interfaces/ICloudProvider';
import { Server, Database, Boxes, HardDrive } from 'lucide-react';
import styles from '../overview.module.css';

interface RecentResourcesWidgetProps {
    id?: string;
    onRemove?: () => void;
    instances: CloudInstance[];
    buckets: CloudBucket[];
    lambdas: CloudFunction[];
    rds: CloudDatabase[];
}

export function RecentResourcesWidget({ id, onRemove, instances, buckets, lambdas, rds }: RecentResourcesWidgetProps) {
    // Flatten and sort by date (launchTime/creationDate/lastModified/etc)
    const items = [
        ...instances.map(i => ({ type: 'Instance', name: i.name || i.id, id: i.id, date: i.launchTime, icon: Server, color: 'text-orange-500' })),
        ...buckets.map(b => ({ type: 'Bucket', name: b.name, id: b.name, date: b.creationDate, icon: HardDrive, color: 'text-green-500' })),
        ...lambdas.map(l => ({ type: 'Function', name: l.name, id: l.name, date: l.lastModified, icon: Boxes, color: 'text-purple-500' })),
        // RDS doesn't specifically expose creation time in standard summary, we use current valid ones or mock a "status check" time for sorting if needed, 
        // but for now we'll put them at the end or use mock date if missing. AWS RDS SDK 'CreateTime' exists but we need to map it.
        // Assuming we update ICloudProvider later for accurate RDS time.
    ].filter(i => i.date) // filter undefined dates
        .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
        .slice(0, 5);

    return (
        <WidgetCard id={id} onRemove={onRemove} title="Recently Visited" footerLink={{ label: 'View all resources', href: '#' }}>
            <div className="space-y-1">
                {items.length === 0 ? (
                    <div className="text-slate-400 text-sm italic text-center py-4">No recent resources found.</div>
                ) : (
                    items.map((item, idx) => (
                        <div key={idx} className={`${styles.resourceRow} group cursor-pointer`}>
                            <div className={`${styles.resourceIcon} ${item.color}`}>
                                <item.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">{item.name}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span>{item.type}</span>
                                    <span>•</span>
                                    <span>{item.id.length > 20 ? item.id.substring(0, 20) + '...' : item.id}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </WidgetCard>
    );
}
