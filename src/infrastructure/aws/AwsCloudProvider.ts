import {
    EC2Client,
    DescribeInstancesCommand,
    StartInstancesCommand,
    StopInstancesCommand,
    RunInstancesCommand,
    DescribeVpcsCommand,
    CreateVpcCommand,
    TerminateInstancesCommand,
    DeleteVpcCommand,
    RebootInstancesCommand,
    DescribeSubnetsCommand
} from "@aws-sdk/client-ec2";
import { S3Client, ListBucketsCommand, CreateBucketCommand, DeleteBucketCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { CostExplorerClient, GetCostAndUsageCommand } from "@aws-sdk/client-cost-explorer";
import { LambdaClient, ListFunctionsCommand } from "@aws-sdk/client-lambda";
import { RDSClient, DescribeDBInstancesCommand } from "@aws-sdk/client-rds";

import { ICloudProvider, CloudInstance, CloudBucket, CloudNetwork, CloudFunction, CloudDatabase, CostMetric, CloudSubnet } from "@/core/interfaces/ICloudProvider";

interface ProviderConfig {
    type: 'aws' | 'localstack';
    region?: string;
    endpoint?: string;
}

export class AwsCloudProvider implements ICloudProvider {
    private client: EC2Client;
    private s3Client: S3Client;
    private costClient: CostExplorerClient;
    private lambdaClient: LambdaClient;
    private rdsClient: RDSClient;

    constructor(config?: ProviderConfig) {
        // Defaults from env if not provided in config
        const type = config?.type || process.env.AWS_PROVIDER_TYPE || 'aws';
        const region = config?.region || process.env.AWS_REGION || "us-east-1";

        if (type === 'localstack') {
            const endpoint = config?.endpoint || process.env.LOCALSTACK_ENDPOINT || "http://localhost:4566";
            console.log(`[AwsCloudProvider] Initializing in LocalStack mode(Endpoint: ${endpoint})`);

            const clientConfig = {
                region,
                endpoint: endpoint,
                credentials: { accessKeyId: "test", secretAccessKey: "test" }
            };

            this.client = new EC2Client(clientConfig);
            this.s3Client = new S3Client({
                ...clientConfig,
                forcePathStyle: true // Needed for LocalStack S3
            });
            this.costClient = new CostExplorerClient(clientConfig);
            this.lambdaClient = new LambdaClient(clientConfig);
            this.rdsClient = new RDSClient(clientConfig);
        } else {
            // Real AWS
            console.log(`[AwsCloudProvider] Initializing in AWS mode`);
            this.client = new EC2Client({ region });
            this.s3Client = new S3Client({ region });
            this.costClient = new CostExplorerClient({ region });
            this.lambdaClient = new LambdaClient({ region });
            this.rdsClient = new RDSClient({ region });
        }
    }

    async listInstances(): Promise<CloudInstance[]> {
        try {
            const command = new DescribeInstancesCommand({});
            const response = await this.client.send(command);

            const instances: CloudInstance[] = [];
            response.Reservations?.forEach(res => {
                res.Instances?.forEach(inst => {
                    instances.push({
                        id: inst.InstanceId || 'unknown',
                        name: inst.Tags?.find(t => t.Key === 'Name')?.Value || '-',
                        state: (inst.State?.Name as any) || 'unknown',
                        type: inst.InstanceType || 'unknown',
                        publicIp: inst.PublicIpAddress,
                        platform: inst.PlatformDetails,
                        launchTime: inst.LaunchTime
                    });
                });
            });

            return instances;
        } catch (error) {
            console.error("[AwsCloudProvider] Error listing instances:", error);
            // Re-throw to let the caller handle it or return empty array if strict strict mode
            throw error;
        }
    }

    async startInstance(instanceId: string): Promise<void> {
        try {
            const command = new StartInstancesCommand({ InstanceIds: [instanceId] });
            await this.client.send(command);
        } catch (error) {
            console.error(`[AwsCloudProvider] Error starting instance ${instanceId}: `, error);
            throw error;
        }
    }

    async stopInstance(instanceId: string): Promise<void> {
        try {
            const command = new StopInstancesCommand({ InstanceIds: [instanceId] });
            await this.client.send(command);
        } catch (error) {
            console.error(`[AwsCloudProvider] Error stopping instance ${instanceId}: `, error);
            throw error;
        }
    }

    async createInstance(amiId: string, type: string): Promise<string> {
        try {
            const command = new RunInstancesCommand({
                ImageId: amiId,
                InstanceType: type as any,
                MinCount: 1,
                MaxCount: 1,
                TagSpecifications: [{
                    ResourceType: "instance",
                    Tags: [{ Key: "Name", Value: "Test-Instance" }]
                }]
            });
            const response = await this.client.send(command);
            return response.Instances?.[0]?.InstanceId || "";
        } catch (error) {
            console.error("[AwsCloudProvider] Error creating instance:", error);
            throw error;
        }
    }

    async listBuckets(): Promise<CloudBucket[]> {
        try {
            const command = new ListBucketsCommand({});
            const response = await this.s3Client.send(command);

            return (response.Buckets || []).map(b => ({
                name: b.Name || 'unknown',
                creationDate: b.CreationDate
            }));
        } catch (error) {
            console.error("[AwsCloudProvider] Error listing buckets:", error);
            // S3 in LocalStack might behave differently if service not enabled, but usually fine.
            return []; // Return empty on error to not break dashboard
        }
    }

    async listVPCs(): Promise<CloudNetwork[]> {
        try {
            const command = new DescribeVpcsCommand({});
            const response = await this.client.send(command);

            return (response.Vpcs || []).map(v => ({
                id: v.VpcId || 'unknown',
                name: v.Tags?.find(t => t.Key === 'Name')?.Value || '-',
                cidrBlock: v.CidrBlock,
                state: v.State,
                isDefault: v.IsDefault || false
            }));
        } catch (error) {
            console.error("[AwsCloudProvider] Error listing VPCs:", error);
            return [];
        }
    }

    // --- New Phase 6 Implementations ---

    async getCostAndUsage(): Promise<{ history: CostMetric[], forecast?: number }> {
        try {
            // Check if using localstack to avoid crashing if CE not available
            if (process.env.AWS_PROVIDER_TYPE === 'localstack') {
                return { history: [] };
            }

            const today = new Date();
            const startStr = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]; // Start of month
            const endStr = today.toISOString().split('T')[0]; // Today

            const command = new GetCostAndUsageCommand({
                TimePeriod: { Start: startStr, End: endStr },
                Granularity: 'DAILY',
                Metrics: ['UnblendedCost']
            });

            const response = await this.costClient.send(command);

            const history = (response.ResultsByTime || []).map(res => ({
                date: res.TimePeriod?.Start || '',
                amount: parseFloat(res.Total?.UnblendedCost?.Amount || '0'),
                unit: res.Total?.UnblendedCost?.Unit || 'USD'
            }));

            // Simple lineal forecast
            const total = history.reduce((acc, curr) => acc + curr.amount, 0);
            const days = history.length || 1;
            const forecast = (total / days) * 30;

            return { history, forecast };
        } catch (error) {
            console.error("[AwsCloudProvider] Error getting cost:", error);
            return { history: [] };
        }
    }

    async listLambdas(): Promise<CloudFunction[]> {
        try {
            const command = new ListFunctionsCommand({});
            const response = await this.lambdaClient.send(command);

            return (response.Functions || []).map(fn => ({
                name: fn.FunctionName || 'unknown',
                runtime: fn.Runtime || 'unknown',
                lastModified: fn.LastModified ? new Date(fn.LastModified) : new Date(),
                state: fn.State
            }));
        } catch (error) {
            console.error("[AwsCloudProvider] Error listing lambdas:", error);
            return [];
        }
    }

    async listRDS(): Promise<CloudDatabase[]> {
        try {
            const command = new DescribeDBInstancesCommand({});
            const response = await this.rdsClient.send(command);

            return (response.DBInstances || []).map(db => ({
                identifier: db.DBInstanceIdentifier || 'unknown',
                engine: db.Engine || 'unknown',
                status: db.DBInstanceStatus || 'unknown',
                instanceClass: db.DBInstanceClass || 'unknown'
            }));
        } catch (error) {
            console.error("[AwsCloudProvider] Error listing RDS:", error);
            return [];
        }
    }

    async createBucket(bucketName: string): Promise<void> {
        try {
            const command = new CreateBucketCommand({
                Bucket: bucketName,
            });
            await this.s3Client.send(command);
        } catch (error) {
            console.error("[AwsCloudProvider] Error creating bucket:", error);
            throw error;
        }
    }

    async createVPC(cidrBlock: string = "10.0.0.0/16"): Promise<string> {
        try {
            const command = new CreateVpcCommand({
                CidrBlock: cidrBlock,
                TagSpecifications: [
                    {
                        ResourceType: "vpc",
                        Tags: [{ Key: "Name", Value: `VPC-${Date.now()}` }]
                    }
                ]
            });
            const response = await this.client.send(command);
            const vpcId = response.Vpc?.VpcId;
            if (!vpcId) throw new Error("No VPC ID returned");
            return vpcId;
        } catch (error) {
            console.error("[AwsCloudProvider] Error creating VPC:", error);
            throw error;
        }
    }

    async deleteInstance(instanceId: string): Promise<void> {
        try {
            const command = new TerminateInstancesCommand({ InstanceIds: [instanceId] });
            await this.client.send(command);
        } catch (error) {
            console.error("[AwsCloudProvider] Error deleting instance:", error);
            throw error;
        }
    }

    async deleteBucket(bucketName: string): Promise<void> {
        try {
            const command = new DeleteBucketCommand({ Bucket: bucketName });
            await this.s3Client.send(command);
        } catch (error) {
            console.error("[AwsCloudProvider] Error deleting bucket:", error);
            throw error;
        }
    }

    async deleteVPC(vpcId: string): Promise<void> {
        try {
            const command = new DeleteVpcCommand({ VpcId: vpcId });
            await this.client.send(command);
        } catch (error) {
            console.error("[AwsCloudProvider] Error deleting VPC:", error);
            throw error;
        }
    }

    async rebootInstance(instanceId: string): Promise<void> {
        try {
            const command = new RebootInstancesCommand({ InstanceIds: [instanceId] });
            await this.client.send(command);
        } catch (error) {
            console.error(`[AwsCloudProvider] Error rebooting instance ${instanceId}: `, error);
            throw error;
        }
    }

    async listBucketObjects(bucketName: string): Promise<string[]> {
        try {
            const command = new ListObjectsV2Command({ Bucket: bucketName, MaxKeys: 50 });
            const response = await this.s3Client.send(command);
            return (response.Contents || []).map(obj => obj.Key || 'unknown');
        } catch (error) {
            console.error(`[AwsCloudProvider] Error listing objects for bucket ${bucketName}:`, error);
            return [];
        }
    }

    async listSubnets(vpcId?: string): Promise<CloudSubnet[]> {
        try {
            // Filter by VPC ID if provided
            const filters = vpcId ? [{ Name: "vpc-id", Values: [vpcId] }] : undefined;
            const command = new DescribeSubnetsCommand({ Filters: filters });
            const response = await this.client.send(command);

            return (response.Subnets || []).map(s => ({
                id: s.SubnetId || 'unknown',
                vpcId: s.VpcId || 'unknown',
                cidrBlock: s.CidrBlock || 'unknown',
                availabilityZone: s.AvailabilityZone || 'unknown',
                availableIpAddressCount: s.AvailableIpAddressCount || 0,
                state: s.State || 'unknown'
            }));
        } catch (error) {
            console.error("[AwsCloudProvider] Error listing subnets:", error);
            return [];
        }
    }
}


