'use server';

import { AwsCloudProvider } from "@/infrastructure/aws/AwsCloudProvider";
import { CloudInstance, CloudBucket, CloudNetwork, CloudFunction, CloudDatabase, CostMetric, CloudSubnet } from "@/core/interfaces/ICloudProvider";
import { revalidatePath } from "next/cache";
import { getProviderType, setProviderType } from "./provider_cookie";

// Helper to get provider with optional override
async function getProvider(overrideType?: 'aws' | 'localstack') {
    const type = overrideType || await getProviderType();
    return new AwsCloudProvider({ type });
}

export type DashboardData = {
    instances: CloudInstance[];
    buckets: CloudBucket[];
    networks: CloudNetwork[];
    subnets?: CloudSubnet[];
    lambdas: CloudFunction[];
    rds: CloudDatabase[];
    cost: { history: CostMetric[], forecast?: number };
    providerType: 'aws' | 'localstack';
};

export async function getDashboardDataAction(providerTypeOverride?: 'aws' | 'localstack'): Promise<{ success: boolean; data?: DashboardData; error?: string }> {
    try {
        const provider = await getProvider(providerTypeOverride);
        const providerType = providerTypeOverride || await getProviderType();

        // Parallel fetch
        const [instances, buckets, networks, lambdas, rds, cost, subnets] = await Promise.all([
            provider.listInstances(),
            provider.listBuckets(),
            provider.listVPCs(),
            provider.listLambdas(),
            provider.listRDS(),
            provider.getCostAndUsage(),
            provider.listSubnets()
        ]);

        return {
            success: true,
            data: { instances, buckets, networks, lambdas, rds, cost, providerType, subnets }
        };
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        return { success: false, error: "Failed to fetch dashboard data." };
    }
}

export async function getInstancesAction(): Promise<{ success: boolean; data?: CloudInstance[]; error?: string }> {
    try {
        const provider = await getProvider();
        const instances = await provider.listInstances();
        return { success: true, data: instances };
    } catch (error) {
        console.error("Failed to fetch instances:", error);
        return { success: false, error: "Failed to fetch instances." };
    }
}

export async function startInstanceAction(instanceId: string, providerType?: 'aws' | 'localstack'): Promise<{ success: boolean; error?: string }> {
    try {
        const provider = await getProvider(providerType);
        await provider.startInstance(instanceId);
        revalidatePath('/dashboard/aws');
        return { success: true };
    } catch (error) {
        console.error(`Failed to start instance ${instanceId}:`, error);
        return { success: false, error: error instanceof Error ? error.message : `Failed to start instance ${instanceId}` };
    }
}

export async function stopInstanceAction(instanceId: string, providerType?: 'aws' | 'localstack'): Promise<{ success: boolean; error?: string }> {
    try {
        const provider = await getProvider(providerType);
        await provider.stopInstance(instanceId);
        revalidatePath('/dashboard/aws');
        return { success: true };
    } catch (error) {
        console.error(`Failed to stop instance ${instanceId}:`, error);
        return { success: false, error: `Failed to stop instance ${instanceId}` };
    }
}

export async function createInstanceAction(
    providerType: 'aws' | 'localstack' | undefined,
    amiId: string,
    instanceType: string,
    name?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const provider = await getProvider(providerType);
        // Using dynamically passed AMI ID and Instance Type
        await provider.createInstance(amiId, instanceType);
        // Note: The AwsCloudProvider.createInstance might need updates to support 'name' tagging if not already present,
        // but for now we pass the essential launch parameters to fix the InvalidAMIID error.

        revalidatePath('/dashboard/aws');
        return { success: true };
    } catch (error) {
        console.error(`Failed to create instance:`, error);
        return { success: false, error: `Failed to create instance` };
    }
}

export async function setProviderAction(type: 'aws' | 'localstack') {
    await setProviderType(type);
    revalidatePath('/dashboard/aws');
}

export async function createBucketAction(name: string, providerType?: 'aws' | 'localstack') {
    try {
        const provider = await getProvider(providerType);
        await provider.createBucket(name);
        revalidatePath('/dashboard/aws');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createVpcAction(cidrBlock: string, providerType?: 'aws' | 'localstack') {
    try {
        const provider = await getProvider(providerType);
        await provider.createVPC(cidrBlock);
        revalidatePath('/dashboard/aws');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteInstanceAction(instanceId: string, providerType?: 'aws' | 'localstack') {
    try {
        const provider = await getProvider(providerType);
        if (provider instanceof AwsCloudProvider) {
            await provider.deleteInstance(instanceId);
            revalidatePath('/dashboard/aws');
            return { success: true };
        }
        return { success: false, error: "Not supported" };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteBucketAction(bucketName: string, providerType?: 'aws' | 'localstack') {
    try {
        const provider = await getProvider(providerType);
        if (provider instanceof AwsCloudProvider) {
            await provider.deleteBucket(bucketName);
            revalidatePath('/dashboard/aws');
            return { success: true };
        }
        return { success: false, error: "Not supported" };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteVpcAction(vpcId: string, providerType?: 'aws' | 'localstack') {
    try {
        const provider = await getProvider(providerType);
        if (provider instanceof AwsCloudProvider) {
            await provider.deleteVPC(vpcId);
            revalidatePath('/dashboard/aws');
            return { success: true };
        }
        return { success: false, error: "Not supported" };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function rebootInstanceAction(instanceId: string, providerType?: 'aws' | 'localstack'): Promise<{ success: boolean; error?: string }> {
    try {
        const provider = await getProvider(providerType);
        await provider.rebootInstance(instanceId);
        revalidatePath('/dashboard/aws');
        return { success: true };
    } catch (error) {
        console.error(`Failed to reboot instance ${instanceId}:`, error);
        return { success: false, error: `Failed to reboot instance ${instanceId}` };
    }
}

export async function listBucketObjectsAction(bucketName: string, providerType?: 'aws' | 'localstack'): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
        const provider = await getProvider(providerType);
        const objects = await provider.listBucketObjects(bucketName);
        return { success: true, data: objects };
    } catch (error) {
        return { success: false, error: "Failed to list objects" };
    }
}

export async function listSubnetsAction(vpcId?: string, providerType?: 'aws' | 'localstack'): Promise<{ success: boolean; data?: CloudSubnet[]; error?: string }> {
    try {
        const provider = await getProvider(providerType);
        const subnets = await provider.listSubnets(vpcId);
        return { success: true, data: subnets };
    } catch (error) {
        return { success: false, error: "Failed to list subnets" };
    }
}
