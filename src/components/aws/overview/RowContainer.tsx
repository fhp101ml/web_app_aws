import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { WidgetCard } from './widgets/WidgetCard';
import styles from './overview.module.css';

// Import all widgets here to render them dynamically
import { RecentResourcesWidget } from './widgets/RecentResourcesWidget';
import { CostUsageWidget } from './widgets/CostUsageWidget';
import { ServiceHealthWidget } from './widgets/ServiceHealthWidget';
import { FavoritesWidget } from './widgets/FavoritesWidget';
import { CloudInstance, CloudBucket, CloudNetwork, CloudFunction, CloudDatabase, CostMetric } from '@/core/interfaces/ICloudProvider';

export type RowType = '3-equal' | '2-asymmetric' | '1-stacked';

export interface DashboardRow {
    id: string;
    type: RowType;
    widgets: string[]; // Widget IDs
}

interface RowContainerProps {
    row: DashboardRow;
    data: {
        instances: CloudInstance[];
        buckets: CloudBucket[];
        networks: CloudNetwork[];
        lambdas: CloudFunction[];
        rds: CloudDatabase[];
        cost: { history: CostMetric[], forecast?: number };
    };
    onRemoveWidget: (id: string) => void;
}

export function RowContainer({ row, data, onRemoveWidget }: RowContainerProps) {
    const { setNodeRef } = useDroppable({
        id: row.id,
        data: { type: 'row', rowId: row.id } // Metadata for collision detection
    });

    // FORCE: Using inline styles to guarantee grid layout regardless of Tailwind JIT config.
    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gap: '2.5rem', // Increased from 2rem for even better separation
        gridTemplateColumns: 'repeat(3, 1fr)', // User Requirement: "quiero que todas admitan 3"
    };

    // We ignore specific row.type logic now as the user wants uniform 3-column behavior everywhere.
    // Future: reuse row.type if we re-introduce asymmetric layouts, but strictly max-3.

    return (
        <div className="mb-2 pl-1 pr-1">
            {/* Removed Debug Header */}

            <SortableContext
                id={row.id}
                items={row.widgets}
                strategy={rectSortingStrategy}
            >
                <div ref={setNodeRef} style={gridStyle} className="min-h-[150px]">
                    {row.widgets.map(widgetId => (
                        <div key={widgetId} className="h-full">
                            <WidgetRenderer
                                id={widgetId}
                                data={data}
                                onRemove={() => onRemoveWidget(widgetId)}
                            />
                        </div>
                    ))}
                    {/* Placeholder removed as per user request */}
                </div>
            </SortableContext>
        </div>
    );
}

// Helper component to render specific widget by ID
function WidgetRenderer({ id, data, onRemove }: { id: string, data: RowContainerProps['data'], onRemove: () => void }) {
    switch (id) {
        case 'recent-resources':
            return <RecentResourcesWidget id={id} onRemove={onRemove} instances={data.instances} buckets={data.buckets} lambdas={data.lambdas} rds={data.rds} />;
        case 'health':
            return <ServiceHealthWidget id={id} onRemove={onRemove} instances={data.instances} buckets={data.buckets} lambdas={data.lambdas} rds={data.rds} />;
        case 'cost':
            return <CostUsageWidget id={id} onRemove={onRemove} data={data.cost} />;
        case 'favorites':
            return <FavoritesWidget id={id} onRemove={onRemove} />;
        case 'welcome':
            return (
                <WidgetCard id={id} title="Welcome to AWS" onRemove={onRemove}>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1">Getting started with AWS</h4>
                            <p className="text-xs text-slate-600">Learn the fundamentals and find valuable information to get the most out of AWS.</p>
                        </div>
                    </div>
                </WidgetCard>
            );
        case 'build-solution':
            return (
                <WidgetCard id={id} title="Build a solution" onRemove={onRemove}>
                    <div className="space-y-3">
                        <div className="p-3 border border-slate-100 rounded bg-slate-50 hover:border-blue-200 transition-colors cursor-pointer">
                            <h5 className="text-sm font-semibold text-slate-700">Launch a virtual machine</h5>
                        </div>
                    </div>
                </WidgetCard>
            );
        default:
            return <WidgetCard id={id} title="Unknown Widget"><div className="p-4 text-red-500">Widget ID not found</div></WidgetCard>;
    }
}
