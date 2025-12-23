import { WidgetCard } from './WidgetCard';
import { Star } from 'lucide-react';

interface FavoritesWidgetProps {
    id?: string;
    onRemove?: () => void;
}

export function FavoritesWidget({ id, onRemove }: FavoritesWidgetProps) {
    // Static list for now
    const favorites = [
        { name: 'EC2', id: 'computek', href: '/dashboard/aws?tab=ec2' },
        { name: 'S3', id: 'storage', href: '/dashboard/aws?tab=s3' },
        { name: 'Lambda', id: 'serverless', href: '/dashboard/aws' },
        { name: 'RDS', id: 'database', href: '/dashboard/aws' },
        { name: 'VPC', id: 'network', href: '/dashboard/aws?tab=network' },
        { name: 'Cost Explorer', id: 'billing', href: '/dashboard/aws' },
    ];

    return (
        <WidgetCard id={id} onRemove={onRemove} title="Favorites" footerLink={{ label: 'Edit Favorites', href: '#' }}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {favorites.map((fav, i) => (
                    <a key={i} href={fav.href} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-slate-500 group-hover:text-blue-600 font-bold text-xs">
                            {fav.name.slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{fav.name}</span>
                        <Star className="w-3 h-3 text-amber-400 ml-auto fill-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                ))}
            </div>
        </WidgetCard>
    );
}
