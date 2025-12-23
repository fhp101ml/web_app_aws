import { Plus } from 'lucide-react';
import { useState } from 'react';

interface WidgetCatalogProps {
    availableWidgets: string[];
    onAddWidget: (id: string) => void;
}

export function WidgetCatalog({ availableWidgets, onAddWidget }: WidgetCatalogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const widgetLabels: { [key: string]: string } = {
        'recent-resources': 'Recent Resources',
        'cost-usage': 'Cost & Usage',
        'service-health': 'Service Health',
        'favorites': 'Favorites',
        'welcome': 'Welcome to AWS',
        'build-solution': 'Build a Solution'
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-1.5 text-xs font-bold bg-[hsl(var(--aws-orange))] hover:bg-[hsl(36,100%,45%)] text-[#1a1e26] rounded-[4px] transition-colors shadow-sm flex items-center gap-1"
            >
                <Plus className="w-3 h-3" />
                Add widgets
            </button>
        );
    }

    return (
        <div className="relative z-10">
            <div
                className="fixed inset-0 bg-black/10"
                onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-12 w-64 bg-[hsl(var(--bg-card))] rounded-[4px] shadow-xl border border-[rgba(255,255,255,0.1)] p-2 animate-in fade-in zoom-in-95 duration-200">
                <h4 className="px-2 py-1.5 text-xs font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Available Widgets</h4>
                <div className="space-y-1">
                    {availableWidgets.map(id => (
                        <button
                            key={id}
                            onClick={() => { onAddWidget(id); setIsOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--aws-blue))] hover:text-white rounded-[4px] transition-colors flex items-center justify-between group"
                        >
                            {widgetLabels[id] || id}
                            <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                        </button>
                    ))}
                    {availableWidgets.length === 0 && (
                        <p className="px-3 py-2 text-sm text-[hsl(var(--text-muted))] italic">All widgets added.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
