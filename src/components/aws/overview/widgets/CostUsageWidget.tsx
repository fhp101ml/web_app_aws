'use client';

import { WidgetCard } from './WidgetCard';
import { CostMetric } from '@/core/interfaces/ICloudProvider';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface CostUsageWidgetProps {
    id?: string;
    onRemove?: () => void;
    data: { history: CostMetric[], forecast?: number };
}

export function CostUsageWidget({ id, onRemove, data }: CostUsageWidgetProps) {
    const currentMonthTotal = data.history.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <WidgetCard id={id} onRemove={onRemove} title="Cost and usage" footerLink={{ label: 'Go to Cost Explorer', href: '#' }}>
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-baseline mb-4">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Current month costs</p>
                        <p className="text-2xl font-bold text-slate-800">${currentMonthTotal.toFixed(2)}</p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <span className="text-emerald-500 font-medium">↓ 5%</span>
                            vs last month
                        </p>
                    </div>
                    {data.forecast !== undefined && (
                        <div className="text-right">
                            <p className="text-sm text-slate-500 font-medium">Forecasted month end</p>
                            <p className="text-xl font-bold text-slate-700">${data.forecast.toFixed(2)}</p>
                        </div>
                    )}
                </div>

                <div className="flex-1 w-full min-h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.history}>
                            <defs>
                                <linearGradient id="colorCostWidget" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={10} tickMargin={10} stroke="#94a3b8" tickFormatter={(val) => val.slice(8)} />
                            <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#94a3b8" tickFormatter={(val) => `$${val}`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                                labelStyle={{ color: '#64748b', marginBottom: '0.25rem' }}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCostWidget)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </WidgetCard>
    );
}
