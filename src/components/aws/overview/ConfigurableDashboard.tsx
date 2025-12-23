'use client';

import { Button } from '@/components/ui/Button';
import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    DropAnimation,
    UniqueIdentifier,
    rectIntersection,
    pointerWithin
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { WidgetCatalog } from './widgets/WidgetCatalog';
import { RowContainer, DashboardRow } from './RowContainer';
import { CloudInstance, CloudBucket, CloudNetwork, CloudFunction, CloudDatabase, CostMetric } from '@/core/interfaces/ICloudProvider';
import styles from './overview.module.css';

// Default Layout Definition
// User Request: "quiero que todas admitan 3" -> All rows are '3-equal'
const DEFAULT_LAYOUT: DashboardRow[] = [
    { id: 'row-a', type: '3-equal', widgets: ['cost', 'health'] },
    { id: 'row-b', type: '3-equal', widgets: ['recent-resources', 'favorites'] },
    { id: 'row-c', type: '3-equal', widgets: ['welcome'] }
];

interface ConfigurableDashboardProps {
    data: {
        instances: CloudInstance[];
        buckets: CloudBucket[];
        networks: CloudNetwork[];
        lambdas: CloudFunction[];
        rds: CloudDatabase[];
        cost: { history: CostMetric[], forecast?: number };
    };
}

export function ConfigurableDashboard({ data }: ConfigurableDashboardProps) {
    const [rows, setRows] = useState<DashboardRow[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [mounted, setMounted] = useState(false);

    // Initial Load
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('aws_dashboard_rows');
        if (saved) {
            try {
                setRows(JSON.parse(saved));
            } catch (e) {
                setRows(DEFAULT_LAYOUT);
            }
        } else {
            setRows(DEFAULT_LAYOUT);
        }
    }, []);

    // Persistence
    useEffect(() => {
        if (mounted && rows.length > 0) {
            localStorage.setItem('aws_dashboard_rows', JSON.stringify(rows));
        }
    }, [rows, mounted]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // --- DnD Handlers ---

    function findContainer(id: UniqueIdentifier) {
        if (rows.find(r => r.id === id)) return id;
        return rows.find(r => r.widgets.includes(id as string))?.id;
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // Moving between containers
        setRows((prev) => {
            const activeRowIndex = prev.findIndex(r => r.id === activeContainer);
            const overRowIndex = prev.findIndex(r => r.id === overContainer);

            if (activeRowIndex === -1 || overRowIndex === -1) return prev;

            const activeRow = prev[activeRowIndex];
            const overRow = prev[overRowIndex];

            // CONSTRAINT REMOVED: Max 3 widgets per row
            // User feedback: "quiero poder mover widgets entre todas las filas"
            // We interpret this as allowing temporary overflow (wrapping) rather than blocking the interaction.

            // Create new arrays
            const newActiveWidgets = activeRow.widgets.filter(w => w !== active.id);
            const newOverWidgets = [...overRow.widgets];

            // Insert at correct index if hovering over another item, else append
            const overItemIndex = overRow.widgets.indexOf(overId as string);

            if (overItemIndex >= 0) {
                newOverWidgets.splice(overItemIndex, 0, active.id as string);
            } else {
                newOverWidgets.push(active.id as string);
            }

            const newRows = [...prev];
            newRows[activeRowIndex] = { ...activeRow, widgets: newActiveWidgets };
            newRows[overRowIndex] = { ...overRow, widgets: newOverWidgets };

            return newRows;
        });
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        const activeContainer = findContainer(active.id);
        const overContainer = over ? findContainer(over.id) : null;

        if (activeContainer && overContainer && activeContainer === overContainer) {
            const rowIndex = rows.findIndex(r => r.id === activeContainer);
            const activeIndex = rows[rowIndex].widgets.indexOf(active.id as string);
            const overIndex = rows[rowIndex].widgets.indexOf(over!.id as string);

            if (activeIndex !== overIndex) {
                setRows((prev) => {
                    const newRows = [...prev];
                    newRows[rowIndex].widgets = arrayMove(prev[rowIndex].widgets, activeIndex, overIndex);
                    return newRows;
                });
            }
        }

        setActiveId(null);
    }

    // --- Widget Mgmt ---

    const allWidgetIds = ['recent-resources', 'health', 'cost', 'favorites', 'welcome', 'build-solution'];
    const activeWidgetIds = rows.flatMap(r => r.widgets);
    const availableToAdd = allWidgetIds.filter(id => !activeWidgetIds.includes(id));

    function handleAddWidget(widgetId: string) {
        // Validation: Prevent duplicates
        const alreadyExists = rows.some(r => r.widgets.includes(widgetId));
        if (alreadyExists) return;

        // Find first row with space (< 3)
        let targetRowIndex = rows.findIndex(r => r.widgets.length < 3);

        // If all rows have 3+, just add to the last row (it will wrap)
        if (targetRowIndex === -1 && rows.length > 0) {
            targetRowIndex = rows.length - 1;
        }

        if (targetRowIndex !== -1) {
            setRows(prev => {
                const newRows = [...prev];
                // Double safety check
                if (newRows.flatMap(r => r.widgets).includes(widgetId)) return prev;

                newRows[targetRowIndex] = {
                    ...newRows[targetRowIndex],
                    widgets: [...newRows[targetRowIndex].widgets, widgetId]
                };
                return newRows;
            });
        }
    }

    function handleRemoveWidget(widgetId: string) {
        setRows(prev => prev.map(row => ({
            ...row,
            widgets: row.widgets.filter(w => w !== widgetId)
        })));
    }

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: '0.5' },
            },
        }),
    };

    if (!mounted) return <div className="p-10 text-center text-slate-400">Loading dashboard...</div>;

    return (
        <div className={styles.dashboardContainer}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.1)] pb-4">
                <div>
                    <h1 className="text-xl font-bold text-[hsl(var(--text-primary))]">Console Home</h1>
                    <p className="text-sm text-[hsl(var(--text-muted))]">Manage your AWS services and resources.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => { setRows(DEFAULT_LAYOUT); localStorage.removeItem('aws_dashboard_rows'); }}
                    >
                        Reset to default
                    </Button>
                    <WidgetCatalog availableWidgets={availableToAdd} onAddWidget={handleAddWidget} />
                </div>
            </div>

            <DndContext
                sensors={sensors}
                // SWITCH: rectIntersection is better for Grids than closestCenter.
                // It triggers when the dragged item physically overlaps the target.
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }} className="pb-20">
                    {/* Inline gap: '3rem' guarantees vertical separation */}
                    {rows.map((row) => (
                        <RowContainer
                            key={row.id}
                            row={row}
                            data={data}
                            onRemoveWidget={handleRemoveWidget}
                        />
                    ))}
                </div>

                {/* Visual Drag Overlay */}
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                        <div className="w-[300px] h-[100px] bg-[hsl(var(--bg-card))] rounded-lg shadow-xl border border-[hsl(var(--aws-orange))] opacity-90 p-4 flex items-center justify-center">
                            <span className="font-bold text-[hsl(var(--text-primary))]">Moving Widget...</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
