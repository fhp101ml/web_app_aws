'use client';

import { ChevronRight, RefreshCw, Settings } from 'lucide-react';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    breadcrumbs: Breadcrumb[];
    actions?: React.ReactNode;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export function PageHeader({ title, breadcrumbs, actions, onRefresh, isRefreshing }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 mb-6 border-b border-[rgba(255,255,255,0.05)] pb-6">
            {/* Context Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-medium">
                {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {index > 0 && <ChevronRight className="w-3 h-3 text-slate-600" />}
                        <span className={index === breadcrumbs.length - 1 ? 'text-blue-400' : 'text-slate-500'}>
                            {crumb.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Title & Activy */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        {title}
                    </h1>
                    <span className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        prod-us-east-1 • Account: 1234-5678-9012
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                            title="Refresh"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    )}
                    <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all">
                        <Settings className="w-5 h-5" />
                    </button>

                    {/* Primary Actions Injection */}
                    {actions && (
                        <div className="flex items-center gap-3 pl-3 border-l border-[rgba(255,255,255,0.1)] ml-1">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
