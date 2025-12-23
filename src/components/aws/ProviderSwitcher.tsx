'use client';

import { setProviderAction } from '@/app/actions/aws';
import { Cloud, HardDrive, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import styles from './aws.module.css';

interface ProviderSwitcherProps {
    currentProvider: 'aws' | 'localstack';
}

export function ProviderSwitcher({ currentProvider }: ProviderSwitcherProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleToggle = (provider: 'aws' | 'localstack') => {
        if (provider === currentProvider || isPending) return;

        startTransition(async () => {
            await setProviderAction(provider);
            router.refresh();
        });
    };

    return (
        <div className="flex items-center p-1 rounded-xl bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--glass-border))] relative">
            {/* Indicator Background - Animated if possible, but simple conditional rendering for now */}

            <button
                onClick={() => handleToggle('aws')}
                disabled={isPending}
                className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 relative z-10
                    ${currentProvider === 'aws'
                        ? 'text-white bg-blue-600 shadow-sm'
                        : 'text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))]'
                    }
                    ${isPending ? 'opacity-50 cursor-wait' : ''}
                `}
            >
                {isPending && currentProvider !== 'aws' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Cloud className="w-3 h-3" />}
                AWS
            </button>

            <button
                onClick={() => handleToggle('localstack')}
                disabled={isPending}
                className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 relative z-10
                    ${currentProvider === 'localstack'
                        ? 'text-white bg-emerald-600 shadow-sm'
                        : 'text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))]'
                    }
                    ${isPending ? 'opacity-50 cursor-wait' : ''}
                `}
            >
                {isPending && currentProvider !== 'localstack' ? <Loader2 className="w-3 h-3 animate-spin" /> : <HardDrive className="w-3 h-3" />}
                LocalStack
            </button>
        </div>
    );
}
