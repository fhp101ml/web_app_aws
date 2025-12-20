export interface CloudInstance {
    id: string;
    name?: string;
    state: 'pending' | 'running' | 'stopping' | 'stopped' | 'shutting-down' | 'terminated';
    type: string;
    publicIp?: string;
    platform?: string;
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
}
