export interface CloudInstance {
    id: string;
    name?: string;
    state: 'pending' | 'running' | 'stopping' | 'stopped' | 'shutting-down' | 'terminated';
    type: string;
    publicIp?: string;
    platform?: string;
    launchTime?: Date;
}

export interface CloudBucket {
    name: string;
    creationDate?: Date;
}

export interface CloudNetwork {
    id: string;
    name?: string;
    cidrBlock?: string;
    state?: string;
    isDefault: boolean;
}

export interface CloudFunction {
    name: string;
    runtime: string;
    lastModified: Date;
    state?: string;
}

export interface CloudDatabase {
    identifier: string;
    engine: string;
    status: string;
    instanceClass: string;
}

export interface CostMetric {
    date: string;
    amount: number;
    unit: string;
}

export interface CloudSubnet {
    id: string;
    vpcId: string;
    cidrBlock: string;
    availabilityZone: string;
    availableIpAddressCount: number;
    state: string;
}

export interface ICloudProvider {
    /**
     * List all virtual machine instances in the configured region/zone
     */
    listInstances(): Promise<CloudInstance[]>;

    /**
     * Start a specific instance
     */
    startInstance(instanceId: string): Promise<void>;

    /**
     * Stop a specific instance
     */
    stopInstance(instanceId: string): Promise<void>;

    /**
     * Create a new instance
     */
    createInstance(amiId: string, type: string): Promise<string>;

    /**
     * List all S3 buckets
     */
    listBuckets(): Promise<CloudBucket[]>;

    /**
     * List all VPCs
     */
    listVPCs(): Promise<CloudNetwork[]>;

    /**
     * Get daily cost and usage for the last 30 days
     */
    getCostAndUsage(): Promise<{ history: CostMetric[], forecast?: number }>;

    /**
     * List Lambda functions
     */
    listLambdas(): Promise<CloudFunction[]>;

    /**
     * List RDS instances
     */
    listRDS(): Promise<CloudDatabase[]>;

    // --- New Expanded Features ---

    /**
     * Reboot a specific instance
     */
    rebootInstance(instanceId: string): Promise<void>;

    /**
     * List objects in a bucket (limited to first 50 for now)
     */
    listBucketObjects(bucketName: string): Promise<string[]>;

    /**
     * List subnets in a VPC (or all if no vpcId provided)
     */
    listSubnets(vpcId?: string): Promise<CloudSubnet[]>;
}
