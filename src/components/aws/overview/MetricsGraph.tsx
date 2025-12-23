import styles from './overview.module.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';

// Mock time series data
const data = [
    { time: '10:00', cpu: 20, memory: 40 },
    { time: '10:05', cpu: 35, memory: 45 },
    { time: '10:10', cpu: 25, memory: 42 },
    { time: '10:15', cpu: 55, memory: 50 },
    { time: '10:20', cpu: 45, memory: 48 },
    { time: '10:25', cpu: 30, memory: 45 },
    { time: '10:30', cpu: 25, memory: 43 },
];

export function MetricsGraph() {
    return (
        <div className={styles.graphCard}>
            <div className={styles.sectionHeader}>
                <Activity className="w-5 h-5 text-slate-400" /> Resource Utilization
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={20}>
                        <XAxis
                            dataKey="time"
                            stroke="rgba(148, 163, 184, 0.5)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <YAxis
                            stroke="rgba(148, 163, 184, 0.5)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                borderColor: 'rgba(56, 189, 248, 0.2)',
                                color: '#f1f5f9',
                                borderRadius: '8px',
                                fontSize: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                            iconType="circle"
                        />
                        <Bar
                            dataKey="cpu"
                            name="CPU Usage"
                            stackId="a"
                            fill="#8b5cf6"
                            radius={[0, 0, 4, 4]}
                            fillOpacity={0.8}
                        />
                        <Bar
                            dataKey="memory"
                            name="Memory Usage"
                            stackId="a"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            fillOpacity={0.8}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
