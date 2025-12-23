import { getDashboardDataAction } from "@/app/actions/aws";
import { DashboardView } from "@/components/aws/DashboardView";
// Extracting refresh button logic or using simple refresh

// Using a simple refresh button component or just a router.refresh() trigger?
// Actually, since it's a server component, we rely on revalidation.
// I'll create a simple client component for the manual refresh button or just let `InstanceTable` handle interactions.
// For the top "Refresh Data" button, I'll need a client component.
// For now, I'll inline a simple client component or just omit the top refresh button if duplicates functionality.
// Or I can make a RefreshButton component.

import { notFound } from "next/navigation";

interface PageProps {
    params: { provider: string };
}

export default async function ProviderPage({ params }: PageProps) {
    const provider = params.provider;

    if (provider !== 'aws' && provider !== 'localstack') {
        // We could support more providers later
        // For now, if it's not valid, maybe 404
        // Or if it's 'diff' we handle it elsewhere (it has its own route usually if disjoint)
        // But for this dynamic route:
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-red-500">Invalid Provider</h2>
                <p className="text-gray-400">Supported clouds: AWS, LocalStack</p>
            </div>
        );
    }

    const providerType = provider as 'aws' | 'localstack';
    const { success, data, error } = await getDashboardDataAction(providerType);

    if (!success || !data) {
        return (
            <div className="container mx-auto p-6 text-center text-red-500">
                Error loading dashboard: {error}
            </div>
        );
    }

    return <DashboardView data={data} />;
}
